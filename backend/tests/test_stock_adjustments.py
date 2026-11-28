from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text

from tests.test_part_search import create_part
from tests.test_stock_entries import enter
from tests.test_stock_exits import leave

TIMESTAMP = "2026-01-01 00:00:00+00:00"
INSERT_ADJUSTMENT = text(
    "insert into stock_movements"
    " (id, part_id, movement_type, quantity, entry_date, unit_cost, reason,"
    " created_at, updated_at)"
    " values (:id, :part_id, 'adjustment', :quantity, '2026-01-01', NULL, :reason, :now, :now)"
)
UPDATE_ADJUSTMENT_REASON = text(
    "update stock_movements set reason = :reason where movement_type = 'adjustment'"
)
UPDATE_ADJUSTMENT_QUANTITY = text(
    "update stock_movements set quantity = :quantity where movement_type = 'adjustment'"
)


def adjust(client, part_id, **changes):
    key = changes.pop("key", str(uuid4()))
    return client.post(
        f"/parts/{part_id}/stock-adjustments",
        json={"quantity_delta": 2, "justification": "Contagem física", **changes},
        headers={"Idempotency-Key": key},
    )


def count_adjustments(client):
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        total = connection.scalar(
            text("select count(*) from stock_movements where movement_type = 'adjustment'")
        )
    engine.dispose()
    return total


def test_adjustment_migration_preserves_movements_and_balances(client, monkeypatch):
    from alembic import command
    from alembic.config import Config

    part = create_part(client)
    enter(client, part["id"], quantity=10)
    leave(client, part["id"], quantity=3)
    monkeypatch.setenv("DATABASE_URL", client.database_url)
    command.downgrade(Config("alembic.ini"), "0007_stock_exits")
    command.upgrade(Config("alembic.ini"), "head")
    command.check(Config("alembic.ini"))
    assert (
        client.get(f"/parts/{part['id']}").json()["manufacturer_code"] == part["manufacturer_code"]
    )
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 7
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        connection.execute(
            INSERT_ADJUSTMENT,
            {
                "id": uuid4().hex,
                "part_id": part["id"],
                "quantity": -2,
                "reason": "Contagem física",
                "now": TIMESTAMP,
            },
        )
        assert connection.scalar(text("select count(*) from stock_adjustment_requests")) == 0
    engine.dispose()


def test_positive_adjustment_increases_balance_and_persists_justification(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    result = adjust(client, part["id"], quantity_delta=2, justification="Peças localizadas")
    assert result.status_code == 201
    data = result.json()
    assert data["part_id"] == part["id"]
    assert data["movement_type"] == "adjustment"
    assert data["quantity_delta"] == 2
    assert data["justification"] == "Peças localizadas"
    assert data["stock_balance"] == 12
    assert "adjustment_date" in data
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 12
    assert count_adjustments(client) == 1


def test_negative_adjustment_subtracts_difference_without_replacing_balance(client):
    part, other = create_part(client), create_part(client)
    enter(client, part["id"], quantity=10)
    enter(client, other["id"], quantity=6)
    result = adjust(client, part["id"], quantity_delta=-3, justification="Divergência de contagem")
    assert result.status_code == 201
    data = result.json()
    assert data["quantity_delta"] == -3
    assert data["stock_balance"] == 7
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 7
    assert client.get(f"/parts/{other['id']}/stock-balance").json()["stock_balance"] == 6
    assert count_adjustments(client) == 1


def test_adjustment_resulting_in_zero_balance_is_allowed(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5)
    result = adjust(client, part["id"], quantity_delta=-5, justification="Inventário zerado")
    assert result.status_code == 201
    assert result.json()["stock_balance"] == 0
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


def test_positive_adjustment_from_zero_balance_is_allowed(client):
    part = create_part(client)
    result = adjust(client, part["id"], quantity_delta=4, justification="Saldo inicial contado")
    assert result.status_code == 201
    assert result.json()["stock_balance"] == 4
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 4


def test_adjustment_below_zero_is_blocked_reporting_current_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5)
    result = adjust(client, part["id"], quantity_delta=-6, justification="Falta no inventário")
    assert result.status_code == 422
    detail = result.json()["detail"]
    assert "5" in detail["message"]
    assert "quantity_delta" in detail["fields"]
    assert detail["stock_balance"] == 5
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    assert count_adjustments(client) == 0


@pytest.mark.parametrize(
    ("change", "expected_field"),
    [
        ({"quantity_delta": 0}, "quantity_delta"),
        ({"quantity_delta": 1.5}, "quantity_delta"),
        ({"quantity_delta": -2.5}, "quantity_delta"),
        ({"quantity_delta": True}, "quantity_delta"),
        ({"quantity_delta": "2"}, "quantity_delta"),
        ({"justification": ""}, "justification"),
        ({"justification": "   "}, "justification"),
        ({"justification": "a" * 121}, "justification"),
    ],
)
def test_invalid_adjustment_data_is_identified_without_changing_balance(
    client, change, expected_field
):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    result = adjust(client, part["id"], **change)
    assert result.status_code == 422
    assert expected_field in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 10
    assert count_adjustments(client) == 0


def test_missing_adjustment_fields_are_identified_without_changing_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    for field in ("quantity_delta", "justification"):
        data = {"quantity_delta": 2, "justification": "Contagem física"}
        del data[field]
        result = client.post(
            f"/parts/{part['id']}/stock-adjustments",
            json=data,
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert result.status_code == 422
        assert field in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 10
    assert count_adjustments(client) == 0


def test_nonexistent_part_is_not_accepted(client):
    assert adjust(client, str(uuid4())).status_code == 404


def test_inactive_part_rejects_adjustment(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    result = adjust(client, part["id"], quantity_delta=2)
    assert result.status_code == 422
    assert "part_id" in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 10
    assert count_adjustments(client) == 0


def test_inactive_part_is_reported_before_negative_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=2)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    fields = adjust(client, part["id"], quantity_delta=-9).json()["detail"]["fields"]
    assert "part_id" in fields
    assert "quantity_delta" not in fields


def test_adjustment_requires_a_uuid_idempotency_key(client):
    part = create_part(client)
    body = {"quantity_delta": 2, "justification": "Contagem física"}
    missing = client.post(f"/parts/{part['id']}/stock-adjustments", json=body)
    assert missing.status_code == 422
    assert "idempotency-key" in str(missing.json()["detail"]["fields"]).lower()
    invalid = client.post(
        f"/parts/{part['id']}/stock-adjustments",
        json=body,
        headers={"Idempotency-Key": "nao-e-uuid"},
    )
    assert invalid.status_code == 422


def test_adjustment_appears_in_the_contract(client):
    paths = client.get("/openapi.json").json()["paths"]
    created = paths["/parts/{part_id}/stock-adjustments"]["post"]["responses"]["201"]
    assert created["content"]["application/json"]["schema"]["$ref"].endswith(
        "StockAdjustmentResponse"
    )


def test_retry_does_not_apply_adjustment_twice(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    first = adjust(client, part["id"], key=key, quantity_delta=-3)
    second = adjust(client, part["id"], key=key, quantity_delta=-3)
    assert second.json() == first.json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 7
    assert count_adjustments(client) == 1


def test_reused_adjustment_key_with_different_data_conflicts(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    adjust(client, part["id"], key=key, quantity_delta=2)
    assert adjust(client, part["id"], key=key, quantity_delta=3).status_code == 409


def test_equivalent_justification_representation_reuses_request(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    first = adjust(client, part["id"], key=key, justification="Contagem física")
    second = adjust(client, part["id"], key=key, justification=" Contagem física ")
    assert second.status_code == 201
    assert second.json() == first.json()


def test_retry_after_api_restart_returns_original_response(client):
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    first = adjust(client, part["id"], key=key, quantity_delta=2)
    with TestClient(
        create_app(Settings(_env_file=None, database_url=client.database_url))
    ) as restarted:
        assert adjust(restarted, part["id"], key=key, quantity_delta=2).json() == first.json()


def test_retry_after_inactivation_returns_original_response(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    first = adjust(client, part["id"], key=key, quantity_delta=2)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert adjust(client, part["id"], key=key, quantity_delta=2).json() == first.json()


def test_retry_after_balance_drop_returns_original_response(client):
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    first = adjust(client, part["id"], key=key, quantity_delta=-3)
    leave(client, part["id"], quantity=7)
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert adjust(client, part["id"], key=key, quantity_delta=-3).json() == first.json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert count_adjustments(client) == 1


def test_failure_rolls_back_adjustment_movement_balance_and_request(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.stock import StockRepository

    part = create_part(client)
    enter(client, part["id"], quantity=10)

    def fail(*args):
        raise OperationalError("test", {}, Exception("offline"))

    monkeypatch.setattr(StockRepository, "remember_adjustment", fail)
    assert adjust(client, part["id"], quantity_delta=-3).status_code == 503
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 10
    assert count_adjustments(client) == 0
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert connection.scalar(text("select count(*) from stock_adjustment_requests")) == 0
    engine.dispose()


def test_entry_exit_and_adjustment_keys_are_independent(client):
    part = create_part(client)
    key = str(uuid4())
    assert enter(client, part["id"], key=key, quantity=10).status_code == 201
    assert leave(client, part["id"], key=key, quantity=3).status_code == 201
    assert adjust(client, part["id"], key=key, quantity_delta=-2).status_code == 201
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5


def api(client):
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    return TestClient(create_app(Settings(_env_file=None, database_url=client.database_url)))


def requires_postgresql(client):
    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")


def test_concurrent_negative_adjustments_with_exact_balance_accept_only_one(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    requires_postgresql(client)
    part = create_part(client)
    enter(client, part["id"], quantity=3)
    barrier = Barrier(2)

    def send():
        with api(client) as other:
            barrier.wait(timeout=10)
            return adjust(other, part["id"], quantity_delta=-3)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert sorted(r.status_code for r in results) == [201, 422]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert count_adjustments(client) == 1


def test_same_key_concurrent_adjustment_retries_apply_once(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    requires_postgresql(client)
    part = create_part(client)
    enter(client, part["id"], quantity=10)
    key = str(uuid4())
    barrier = Barrier(2)

    def send():
        with api(client) as other:
            barrier.wait(timeout=10)
            return adjust(other, part["id"], key=key, quantity_delta=-3)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert [r.status_code for r in results] == [201, 201]
    assert results[0].json() == results[1].json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 7
    assert count_adjustments(client) == 1


def test_same_key_different_parts_concurrently_conflicts(client, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from app.repositories.stock import StockRepository

    requires_postgresql(client)
    parts = [create_part(client), create_part(client)]
    for part in parts:
        enter(client, part["id"], quantity=10)
    key = str(uuid4())
    barrier = Barrier(2)
    original = StockRepository.remember_adjustment

    def synchronized(self, *args):
        barrier.wait(timeout=10)
        return original(self, *args)

    monkeypatch.setattr(StockRepository, "remember_adjustment", synchronized)

    def send(part):
        with api(client) as other:
            return adjust(other, part["id"], key=key, quantity_delta=-2)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, parts))
    assert sorted(r.status_code for r in results) == [201, 409]
    assert (
        sum(client.get(f"/parts/{p['id']}/stock-balance").json()["stock_balance"] for p in parts)
        == 18
    )
    assert count_adjustments(client) == 1


def test_database_rejects_adjustment_without_justification(client):
    from sqlalchemy.exc import IntegrityError

    part = create_part(client)
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        connection.execute(
            INSERT_ADJUSTMENT,
            {
                "id": uuid4().hex,
                "part_id": part["id"],
                "quantity": 2,
                "reason": "Contagem física",
                "now": TIMESTAMP,
            },
        )
    for reason in ("   ", None):
        with engine.begin() as connection:
            with pytest.raises(IntegrityError):
                connection.execute(UPDATE_ADJUSTMENT_REASON, {"reason": reason})
    engine.dispose()


def test_database_rejects_zero_adjustment_quantity(client):
    from sqlalchemy.exc import IntegrityError

    part = create_part(client)
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        connection.execute(
            INSERT_ADJUSTMENT,
            {
                "id": uuid4().hex,
                "part_id": part["id"],
                "quantity": -2,
                "reason": "Contagem física",
                "now": TIMESTAMP,
            },
        )
    with engine.begin() as connection:
        with pytest.raises(IntegrityError):
            connection.execute(UPDATE_ADJUSTMENT_QUANTITY, {"quantity": 0})
    engine.dispose()
