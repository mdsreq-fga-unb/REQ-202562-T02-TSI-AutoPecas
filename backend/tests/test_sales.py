from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text

from tests.test_part_search import create_part
from tests.test_stock_entries import enter


def stocked_part(client, quantity=10):
    part = create_part(client)
    if quantity:
        assert enter(client, part["id"], quantity=quantity).status_code == 201
    return part


def sell(client, items, channel="counter", key=None):
    return client.post(
        "/sales",
        json={"channel": channel, "items": items},
        headers={"Idempotency-Key": key or str(uuid4())},
    )


def item(part, quantity=3, unit_price="25.00"):
    return {"part_id": part["id"], "quantity": quantity, "unit_price": unit_price}


def balance(client, part):
    return client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"]


def count(client, table):
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        total = connection.scalar(text(f"select count(*) from {table}"))
    engine.dispose()
    return total


def test_single_item_sale_is_registered_and_reduces_balance(client):
    part = stocked_part(client)
    result = sell(client, [item(part)])
    assert result.status_code == 201
    data = result.json()
    assert data["channel"] == "counter"
    assert data["status"] == "registered"
    assert data["total"] == "75.00"
    assert data["items"] == [
        {
            "part_id": part["id"],
            "quantity": 3,
            "unit_price": "25.00",
            "stock_balance": 7,
        }
    ]
    assert balance(client, part) == 7


def test_multi_item_sale_reduces_each_balance_and_preserves_other_parts(client):
    first = stocked_part(client, 10)
    second = stocked_part(client, 5)
    untouched = stocked_part(client, 4)
    result = sell(client, [item(first, 3, "10.00"), item(second, 2, "7.50")])
    assert result.status_code == 201
    assert result.json()["total"] == "45.00"
    assert balance(client, first) == 7
    assert balance(client, second) == 3
    assert balance(client, untouched) == 4


@pytest.mark.parametrize("channel", ["counter", "mercado_livre", "direct_contact"])
def test_accepts_the_three_sales_channels(client, channel):
    part = stocked_part(client)
    result = sell(client, [item(part, 1)], channel=channel)
    assert result.status_code == 201
    assert result.json()["channel"] == channel


def test_sale_above_balance_is_blocked_and_reports_current_balance(client):
    part = stocked_part(client, 2)
    result = sell(client, [item(part, 3)])
    assert result.status_code == 422
    detail = result.json()["detail"]
    assert "saldo" in detail["message"].lower()
    assert detail["items"] == [{"part_id": part["id"], "requested": 3, "stock_balance": 2}]
    assert balance(client, part) == 2
    assert count(client, "sales") == 0


def test_sale_equal_to_balance_is_allowed(client):
    part = stocked_part(client, 3)
    assert sell(client, [item(part, 3)]).status_code == 201
    assert balance(client, part) == 0


def test_part_without_stock_cannot_be_sold(client):
    part = stocked_part(client, 0)
    result = sell(client, [item(part, 1)])
    assert result.status_code == 422
    assert result.json()["detail"]["items"][0]["stock_balance"] == 0


def test_one_insufficient_item_blocks_the_whole_sale(client):
    enough = stocked_part(client, 10)
    short = stocked_part(client, 1)
    result = sell(client, [item(enough, 2), item(short, 5)])
    assert result.status_code == 422
    assert result.json()["detail"]["items"] == [
        {"part_id": short["id"], "requested": 5, "stock_balance": 1}
    ]
    assert balance(client, enough) == 10
    assert balance(client, short) == 1
    assert count(client, "sales") == 0
    assert count(client, "sale_items") == 0


def test_repeated_part_lines_are_added_before_checking_balance(client):
    part = stocked_part(client, 5)
    result = sell(client, [item(part, 3), item(part, 3)])
    assert result.status_code == 422
    assert result.json()["detail"]["items"] == [
        {"part_id": part["id"], "requested": 6, "stock_balance": 5}
    ]
    assert balance(client, part) == 5


def test_repeated_part_lines_within_balance_reduce_it_once_per_unit(client):
    part = stocked_part(client, 5)
    assert sell(client, [item(part, 2), item(part, 3)]).status_code == 201
    assert balance(client, part) == 0


def test_inactive_part_cannot_be_sold(client):
    part = stocked_part(client)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    result = sell(client, [item(part, 1)])
    assert result.status_code == 422
    assert balance(client, part) == 10
    assert count(client, "sales") == 0


def test_unknown_part_is_rejected(client):
    result = sell(client, [{"part_id": str(uuid4()), "quantity": 1, "unit_price": "1.00"}])
    assert result.status_code == 422
    assert count(client, "sales") == 0


@pytest.mark.parametrize("channel", ["site", "", None])
def test_invalid_channel_is_rejected(client, channel):
    part = stocked_part(client)
    assert sell(client, [item(part, 1)], channel=channel).status_code == 422
    assert balance(client, part) == 10


def test_missing_channel_is_rejected(client):
    part = stocked_part(client)
    result = client.post(
        "/sales",
        json={"items": [item(part, 1)]},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert result.status_code == 422
    assert balance(client, part) == 10


def test_sale_without_items_is_rejected(client):
    assert sell(client, []).status_code == 422
    assert count(client, "sales") == 0


@pytest.mark.parametrize("quantity", [0, -1, 1.5, True, "3"])
def test_invalid_quantity_is_rejected(client, quantity):
    part = stocked_part(client)
    assert sell(client, [item(part, quantity)]).status_code == 422
    assert balance(client, part) == 10


@pytest.mark.parametrize("price", ["-0.01", "1.234", "abc"])
def test_invalid_unit_price_is_rejected(client, price):
    part = stocked_part(client)
    assert sell(client, [item(part, 1, price)]).status_code == 422
    assert balance(client, part) == 10


def test_missing_unit_price_is_rejected(client):
    part = stocked_part(client)
    result = sell(client, [{"part_id": part["id"], "quantity": 1}])
    assert result.status_code == 422


def test_sale_can_be_consulted_after_registration(client):
    part = stocked_part(client)
    created = sell(client, [item(part, 2, "9.90")]).json()
    result = client.get(f"/sales/{created['id']}")
    assert result.status_code == 200
    assert result.json()["id"] == created["id"]
    assert result.json()["total"] == "19.80"
    assert result.json()["items"][0]["quantity"] == 2


def test_unknown_sale_returns_404(client):
    assert client.get(f"/sales/{uuid4()}").status_code == 404


def test_retry_does_not_reduce_stock_twice(client):
    part = stocked_part(client)
    key = str(uuid4())
    first = sell(client, [item(part)], key=key)
    second = sell(client, [item(part)], key=key)
    assert second.status_code == 201
    assert second.json() == first.json()
    assert balance(client, part) == 7
    assert count(client, "sales") == 1


def test_reused_key_with_different_data_conflicts(client):
    part = stocked_part(client)
    key = str(uuid4())
    sell(client, [item(part, 2)], key=key)
    result = sell(client, [item(part, 3)], key=key)
    assert result.status_code == 409
    assert balance(client, part) == 8


def test_missing_idempotency_key_is_rejected(client):
    part = stocked_part(client)
    result = client.post("/sales", json={"channel": "counter", "items": [item(part, 1)]})
    assert result.status_code == 422
    assert balance(client, part) == 10


def test_failure_rolls_back_sale_items_balance_and_request(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.sales import SaleRepository

    part = stocked_part(client)

    def fail(*args):
        raise OperationalError("insert", {}, Exception("falha simulada"))

    monkeypatch.setattr(SaleRepository, "remember", fail)
    assert sell(client, [item(part)]).status_code == 503
    assert balance(client, part) == 10
    assert count(client, "sales") == 0
    assert count(client, "sale_items") == 0
    assert count(client, "sale_requests") == 0


def concurrent_sales(client, payloads):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    barrier = Barrier(len(payloads))

    def send(payload):
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            barrier.wait(timeout=10)
            return sell(other, payload["items"], key=payload.get("key"))

    with ThreadPoolExecutor(max_workers=len(payloads)) as pool:
        return list(pool.map(send, payloads))


def test_concurrent_sales_cannot_sell_more_than_the_balance(client):
    part = stocked_part(client, 5)
    payload = {"items": [item(part, 3)]}
    results = concurrent_sales(client, [payload, payload])
    assert sorted(r.status_code for r in results) == [201, 422]
    assert balance(client, part) == 2
    assert count(client, "sales") == 1


def test_concurrent_sales_within_balance_are_both_registered(client):
    part = stocked_part(client, 6)
    payload = {"items": [item(part, 3)]}
    results = concurrent_sales(client, [payload, payload])
    assert [r.status_code for r in results] == [201, 201]
    assert balance(client, part) == 0


def test_same_key_concurrent_retries_sell_once(client):
    part = stocked_part(client, 10)
    payload = {"items": [item(part, 3)], "key": str(uuid4())}
    results = concurrent_sales(client, [payload, payload])
    assert [r.status_code for r in results] == [201, 201]
    assert results[0].json() == results[1].json()
    assert balance(client, part) == 7
    assert count(client, "sales") == 1
