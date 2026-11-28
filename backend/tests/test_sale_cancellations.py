from uuid import uuid4

import pytest

from tests.test_sales import balance, count, item, sell, stocked_part
from tests.test_stock_exits import leave


def cancel(client, sale_id, key=None):
    return client.post(
        f"/sales/{sale_id}/cancellation",
        headers={"Idempotency-Key": key or str(uuid4())},
    )


def test_cancellation_restores_each_item_and_marks_sale_cancelled(client):
    first = stocked_part(client, 10)
    second = stocked_part(client, 5)
    untouched = stocked_part(client, 4)
    sale = sell(client, [item(first, 3), item(second, 2)]).json()
    result = cancel(client, sale["id"])
    assert result.status_code == 200
    data = result.json()
    assert data["id"] == sale["id"]
    assert data["status"] == "cancelled"
    assert [entry["stock_balance"] for entry in data["items"]] == [10, 5]
    assert balance(client, first) == 10
    assert balance(client, second) == 5
    assert balance(client, untouched) == 4


def test_cancellation_restores_only_the_sale_quantities(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    assert leave(client, part["id"], quantity=3).status_code == 201
    assert balance(client, part) == 4
    assert cancel(client, sale["id"]).status_code == 200
    assert balance(client, part) == 7


def test_repeated_cancellation_is_rejected_without_new_reversal(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    assert cancel(client, sale["id"]).status_code == 200
    result = cancel(client, sale["id"])
    assert result.status_code == 409
    assert "já está cancelada" in result.json()["detail"]["message"]
    assert balance(client, part) == 10


def test_unknown_sale_cannot_be_cancelled(client):
    part = stocked_part(client, 10)
    result = cancel(client, uuid4())
    assert result.status_code == 404
    assert "não encontrada" in result.json()["detail"]["message"]
    assert balance(client, part) == 10
    assert count(client, "sales") == 0


def set_status(client, part, status):
    result = client.patch(
        f"/parts/{part['id']}",
        json={"status": status},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert result.status_code == 200


def test_inactive_part_blocks_the_whole_cancellation_and_is_identified(client):
    active = stocked_part(client, 10)
    inactive = stocked_part(client, 5)
    sale = sell(client, [item(active, 3), item(inactive, 2)]).json()
    set_status(client, inactive, "inactive")
    result = cancel(client, sale["id"])
    assert result.status_code == 422
    detail = result.json()["detail"]
    assert "reative" in detail["message"].lower()
    assert detail["items"] == [
        {
            "part_id": inactive["id"],
            "name": inactive["name"],
            "manufacturer_code": inactive["manufacturer_code"],
        }
    ]
    assert client.get(f"/sales/{sale['id']}").json()["status"] == "registered"
    assert balance(client, active) == 7
    assert balance(client, inactive) == 3


def test_reactivation_allows_a_new_attempt_without_cancelling_automatically(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    set_status(client, part, "inactive")
    assert cancel(client, sale["id"]).status_code == 422
    set_status(client, part, "active")
    assert client.get(f"/sales/{sale['id']}").json()["status"] == "registered"
    assert balance(client, part) == 7
    assert cancel(client, sale["id"]).status_code == 200
    assert balance(client, part) == 10


def test_cancelled_sale_is_preserved_with_its_original_items(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3, "12.50")], channel="mercado_livre").json()
    cancel(client, sale["id"])
    stored = client.get(f"/sales/{sale['id']}").json()
    assert stored["status"] == "cancelled"
    assert stored["channel"] == "mercado_livre"
    assert stored["total"] == "37.50"
    assert stored["items"][0]["quantity"] == 3
    assert stored["items"][0]["unit_price"] == "12.50"
    assert count(client, "sales") == 1
    assert count(client, "sale_items") == 1


def test_retry_with_same_key_returns_first_result_and_reverts_once(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    key = str(uuid4())
    first = cancel(client, sale["id"], key=key)
    second = cancel(client, sale["id"], key=key)
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json() == first.json()
    assert balance(client, part) == 10
    assert count(client, "sale_cancellation_requests") == 1


def test_key_reused_for_another_sale_conflicts(client):
    part = stocked_part(client, 10)
    first = sell(client, [item(part, 3)]).json()
    second = sell(client, [item(part, 2)]).json()
    key = str(uuid4())
    assert cancel(client, first["id"], key=key).status_code == 200
    result = cancel(client, second["id"], key=key)
    assert result.status_code == 409
    assert client.get(f"/sales/{second['id']}").json()["status"] == "registered"
    assert balance(client, part) == 8


def test_cancellation_requires_idempotency_key(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    assert client.post(f"/sales/{sale['id']}/cancellation").status_code == 422
    assert balance(client, part) == 7


def test_failure_rolls_back_status_balances_and_request(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.sales import SaleRepository

    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()

    def fail(*args):
        raise OperationalError("insert", {}, Exception("falha simulada"))

    monkeypatch.setattr(SaleRepository, "remember_cancellation", fail)
    assert cancel(client, sale["id"]).status_code == 503
    assert client.get(f"/sales/{sale['id']}").json()["status"] == "registered"
    assert balance(client, part) == 7
    assert count(client, "sale_cancellation_requests") == 0


def concurrent_cancellations(client, sale_id, keys):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    barrier = Barrier(len(keys))

    def send(key):
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            barrier.wait(timeout=10)
            return cancel(other, sale_id, key=key)

    with ThreadPoolExecutor(max_workers=len(keys)) as pool:
        return list(pool.map(send, keys))


def test_concurrent_cancellations_revert_once(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    results = concurrent_cancellations(client, sale["id"], [str(uuid4()), str(uuid4())])
    assert sorted(r.status_code for r in results) == [200, 409]
    assert balance(client, part) == 10


def test_same_key_concurrent_retries_revert_once(client):
    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    key = str(uuid4())
    results = concurrent_cancellations(client, sale["id"], [key, key])
    assert [r.status_code for r in results] == [200, 200]
    assert results[0].json() == results[1].json()
    assert balance(client, part) == 10
    assert count(client, "sale_cancellation_requests") == 1


def test_sales_are_listed_most_recent_first_with_part_identification(client):
    part = stocked_part(client, 10)
    older = sell(client, [item(part, 1, "5.00")]).json()
    newer = sell(client, [item(part, 2, "4.00")], channel="mercado_livre").json()
    cancel(client, older["id"])
    result = client.get("/sales")
    assert result.status_code == 200
    data = result.json()
    assert data["total"] == 2
    assert [sale["id"] for sale in data["items"]] == [newer["id"], older["id"]]
    assert [sale["status"] for sale in data["items"]] == ["registered", "cancelled"]
    first = data["items"][0]
    assert first["channel"] == "mercado_livre"
    assert first["total"] == "8.00"
    assert first["created_at"]
    assert first["items"] == [
        {
            "part_id": part["id"],
            "name": part["name"],
            "manufacturer_code": part["manufacturer_code"],
            "quantity": 2,
            "unit_price": "4.00",
        }
    ]


def test_sales_list_is_paginated(client):
    part = stocked_part(client, 10)
    ids = [sell(client, [item(part, 1)]).json()["id"] for _ in range(3)]
    result = client.get("/sales", params={"offset": 1, "limit": 1}).json()
    assert result["total"] == 3
    assert [sale["id"] for sale in result["items"]] == [ids[1]]
    assert client.get("/sales", params={"limit": 0}).status_code == 422


def test_cancellation_migration_preserves_sales_and_matches_models(client, monkeypatch):
    from alembic import command
    from alembic.config import Config

    part = stocked_part(client, 10)
    sale = sell(client, [item(part, 3)]).json()
    monkeypatch.setenv("DATABASE_URL", client.database_url)
    command.downgrade(Config("alembic.ini"), "0007_sales")
    command.upgrade(Config("alembic.ini"), "head")
    command.check(Config("alembic.ini"))
    assert client.get(f"/sales/{sale['id']}").json()["status"] == "registered"
    assert cancel(client, sale["id"]).status_code == 200
    assert balance(client, part) == 10
