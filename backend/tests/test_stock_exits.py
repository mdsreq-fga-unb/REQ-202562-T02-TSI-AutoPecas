from uuid import uuid4

import pytest
from sqlalchemy import create_engine, text

from tests.test_part_search import create_part
from tests.test_stock_entries import enter

TIMESTAMP = "2026-01-01 00:00:00+00:00"
INSERT_EXIT = text(
    "insert into stock_movements"
    " (id, part_id, movement_type, quantity, entry_date, unit_cost, reason,"
    " created_at, updated_at)"
    " values (:id, :part_id, 'exit', 2, '2026-01-01', NULL, :reason, :now, :now)"
)
UPDATE_EXIT_REASON = text(
    "update stock_movements set reason = :reason where movement_type = 'exit'"
)


def leave(client, part_id, **changes):
    key = changes.pop("key", str(uuid4()))
    return client.post(
        f"/parts/{part_id}/stock-exits",
        json={"quantity": 3, "exit_date": "2026-01-01", "reason": "Descarte", **changes},
        headers={"Idempotency-Key": key},
    )


def test_exit_migration_preserves_entries_and_balances(client, monkeypatch):
    from alembic import command
    from alembic.config import Config

    part = create_part(client)
    enter(client, part["id"], quantity=5)
    monkeypatch.setenv("DATABASE_URL", client.database_url)
    command.downgrade(Config("alembic.ini"), "0006_part_imports")
    command.upgrade(Config("alembic.ini"), "head")
    command.check(Config("alembic.ini"))
    assert (
        client.get(f"/parts/{part['id']}").json()["manufacturer_code"] == part["manufacturer_code"]
    )
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        connection.execute(
            INSERT_EXIT,
            {
                "id": uuid4().hex,
                "part_id": part["id"],
                "reason": "Descarte",
                "now": TIMESTAMP,
            },
        )
        assert connection.scalar(text("select count(*) from stock_exit_requests")) == 0
    engine.dispose()


def test_valid_exit_is_persisted_with_reason(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    result = leave(client, part["id"])
    assert result.status_code == 201
    data = result.json()
    assert data["part_id"] == part["id"]
    assert data["quantity"] == 3
    assert data["exit_date"] == "2026-01-01"
    assert data["reason"] == "Descarte"
    assert data["movement_type"] == "exit"
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert (
            connection.scalar(
                text("select count(*) from stock_movements where movement_type = 'exit'")
            )
            == 1
        )
    engine.dispose()


def test_exit_reduces_balance_and_preserves_other_parts(client):
    part, other = create_part(client), create_part(client)
    enter(client, part["id"], quantity=8)
    enter(client, other["id"], quantity=7)
    result = leave(client, part["id"], quantity=3)
    assert result.json()["stock_balance"] == 5
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    assert client.get(f"/parts/{other['id']}/stock-balance").json()["stock_balance"] == 7


def test_insufficient_balance_is_blocked_reporting_available(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    result = leave(client, part["id"], quantity=9)
    assert result.status_code == 422
    detail = result.json()["detail"]
    assert "8" in detail["message"]
    assert "quantity" in detail["fields"]
    assert detail["stock_balance"] == 8
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 8
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert (
            connection.scalar(
                text("select count(*) from stock_movements where movement_type = 'exit'")
            )
            == 0
        )
    engine.dispose()


def test_taking_the_whole_balance_is_allowed(client):
    part = create_part(client)
    enter(client, part["id"], quantity=3)
    result = leave(client, part["id"], quantity=3)
    assert result.status_code == 201
    assert result.json()["stock_balance"] == 0


def count_exits(client):
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        total = connection.scalar(
            text("select count(*) from stock_movements where movement_type = 'exit'")
        )
    engine.dispose()
    return total


@pytest.mark.parametrize(
    "change",
    [
        {"quantity": 0},
        {"quantity": -1},
        {"quantity": 1.5},
        {"quantity": True},
        {"reason": ""},
        {"reason": "   "},
        {"exit_date": "2026-02-30"},
        {"exit_date": "2999-01-01"},
    ],
)
def test_invalid_exit_data_is_identified_without_changing_balance(client, change):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    assert leave(client, part["id"], **change).status_code == 422
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 8
    assert count_exits(client) == 0


def test_missing_exit_fields_are_identified_without_changing_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    for field in ("quantity", "exit_date", "reason"):
        data = {"quantity": 1, "exit_date": "2026-01-01", "reason": "Descarte"}
        del data[field]
        result = client.post(
            f"/parts/{part['id']}/stock-exits",
            json=data,
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert result.status_code == 422
        assert field in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 8
    assert count_exits(client) == 0


def test_nonexistent_part_is_not_accepted(client):
    assert leave(client, str(uuid4())).status_code == 404


def test_inactive_part_rejects_exit(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    result = leave(client, part["id"])
    assert result.status_code == 422
    assert "part_id" in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 8
    assert count_exits(client) == 0


def test_inactive_part_is_reported_before_insufficient_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=2)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    fields = leave(client, part["id"], quantity=9).json()["detail"]["fields"]
    assert "part_id" in fields
    assert "quantity" not in fields


def test_store_calendar_boundary_for_exits(client, monkeypatch):
    from datetime import UTC, datetime

    from app.core import clock

    monkeypatch.setattr(clock, "utc_now", lambda: datetime(2026, 1, 2, 1, tzinfo=UTC))
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    assert leave(client, part["id"], exit_date="2026-01-02").status_code == 422
    assert leave(client, part["id"], exit_date="2026-01-01").status_code == 201


def test_retroactive_exit_uses_the_current_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5, entry_date="2026-01-02")
    enter(client, part["id"], quantity=3)
    result = leave(client, part["id"], quantity=3, exit_date="2025-12-01")
    assert result.json()["stock_balance"] == 5
    assert result.json()["exit_date"] == "2025-12-01"


def test_exit_requires_a_uuid_idempotency_key(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    body = {"quantity": 3, "exit_date": "2026-01-01", "reason": "Descarte"}
    missing = client.post(f"/parts/{part['id']}/stock-exits", json=body)
    assert missing.status_code == 422
    assert "idempotency-key" in str(missing.json()["detail"]["fields"]).lower()
    invalid = client.post(
        f"/parts/{part['id']}/stock-exits",
        json=body,
        headers={"Idempotency-Key": "nao-e-uuid"},
    )
    assert invalid.status_code == 422


def test_exit_response_does_not_create_or_expose_a_sale(client):
    import sqlalchemy

    part = create_part(client)
    enter(client, part["id"], quantity=8)
    data = leave(client, part["id"]).json()
    assert set(data) == {
        "id",
        "part_id",
        "movement_type",
        "quantity",
        "exit_date",
        "reason",
        "stock_balance",
    }
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        # Inerte até a US15 integrar; a partir daí prova que a saída não gera venda.
        if sqlalchemy.inspect(engine).has_table("sales"):
            assert connection.scalar(text("select count(*) from sales")) == 0
    engine.dispose()


def test_exit_appears_in_the_contract(client):
    paths = client.get("/openapi.json").json()["paths"]
    created = paths["/parts/{part_id}/stock-exits"]["post"]["responses"]["201"]
    assert created["content"]["application/json"]["schema"]["$ref"].endswith("StockExitResponse")


def test_retry_does_not_remove_stock_twice(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    first = leave(client, part["id"], key=key)
    second = leave(client, part["id"], key=key)
    assert second.json() == first.json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    assert count_exits(client) == 1


def test_reused_exit_key_with_different_data_conflicts(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    leave(client, part["id"], key=key)
    assert leave(client, part["id"], key=key, quantity=4).status_code == 409


def test_equivalent_reason_representation_reuses_request(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    first = leave(client, part["id"], key=key, reason="Descarte")
    second = leave(client, part["id"], key=key, reason=" Descarte ")
    assert second.status_code == 201
    assert second.json() == first.json()


def test_retry_after_api_restart_returns_original_response(client):
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    first = leave(client, part["id"], key=key)
    with TestClient(
        create_app(Settings(_env_file=None, database_url=client.database_url))
    ) as restarted:
        assert leave(restarted, part["id"], key=key).json() == first.json()


def test_retry_after_inactivation_returns_original_response(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    first = leave(client, part["id"], key=key)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert leave(client, part["id"], key=key).json() == first.json()


def test_retry_after_balance_drop_returns_original_response(client):
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    first = leave(client, part["id"], key=key, quantity=3)
    leave(client, part["id"], quantity=5)
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert leave(client, part["id"], key=key, quantity=3).json() == first.json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert count_exits(client) == 2


def test_failure_rolls_back_exit_movement_balance_and_request(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.stock import StockRepository

    part = create_part(client)
    enter(client, part["id"], quantity=8)

    def fail(*args):
        raise OperationalError("test", {}, Exception("offline"))

    monkeypatch.setattr(StockRepository, "remember_exit", fail)
    assert leave(client, part["id"]).status_code == 503
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 8
    assert count_exits(client) == 0
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert connection.scalar(text("select count(*) from stock_exit_requests")) == 0
    engine.dispose()


def test_entry_and_exit_keys_are_independent(client):
    part = create_part(client)
    key = str(uuid4())
    assert enter(client, part["id"], key=key, quantity=8).status_code == 201
    assert leave(client, part["id"], key=key).status_code == 201
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5


def api(client):
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    return TestClient(create_app(Settings(_env_file=None, database_url=client.database_url)))


def requires_postgresql(client):
    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")


def test_concurrent_exits_with_exact_balance_accept_only_one(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    requires_postgresql(client)
    part = create_part(client)
    enter(client, part["id"], quantity=3)
    barrier = Barrier(2)

    def send():
        with api(client) as other:
            barrier.wait(timeout=10)
            return leave(other, part["id"], quantity=3)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert sorted(r.status_code for r in results) == [201, 422]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    assert count_exits(client) == 1


def test_same_key_concurrent_exit_retries_remove_once(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    requires_postgresql(client)
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    key = str(uuid4())
    barrier = Barrier(2)

    def send():
        with api(client) as other:
            barrier.wait(timeout=10)
            return leave(other, part["id"], key=key)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert [r.status_code for r in results] == [201, 201]
    assert results[0].json() == results[1].json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    assert count_exits(client) == 1


def test_same_key_different_parts_concurrently_conflicts(client, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from app.repositories.stock import StockRepository

    requires_postgresql(client)
    parts = [create_part(client), create_part(client)]
    for part in parts:
        enter(client, part["id"], quantity=8)
    key = str(uuid4())
    barrier = Barrier(2)
    original = StockRepository.remember_exit

    def synchronized(self, *args):
        barrier.wait(timeout=10)
        return original(self, *args)

    monkeypatch.setattr(StockRepository, "remember_exit", synchronized)

    def send(part):
        with api(client) as other:
            return leave(other, part["id"], key=key)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, parts))
    assert sorted(r.status_code for r in results) == [201, 409]
    assert (
        sum(client.get(f"/parts/{p['id']}/stock-balance").json()["stock_balance"] for p in parts)
        == 13
    )
    assert count_exits(client) == 1


def test_exit_and_inactivation_share_the_part_lock(client, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Event

    from app.repositories.stock import StockRepository

    requires_postgresql(client)
    part = create_part(client)
    enter(client, part["id"], quantity=8)
    locked, updating = Event(), Event()
    original = StockRepository.add

    def hold(self, movement):
        locked.set()
        assert updating.wait(30)
        original(self, movement)

    monkeypatch.setattr(StockRepository, "add", hold)

    def remove():
        with api(client) as other:
            return leave(other, part["id"])

    def deactivate():
        assert locked.wait(30)
        with api(client) as other:
            updating.set()
            return other.patch(
                f"/parts/{part['id']}",
                json={"status": "inactive"},
                headers={"Idempotency-Key": str(uuid4())},
            )

    with ThreadPoolExecutor(max_workers=2) as pool:
        exit_result, update = pool.submit(remove), pool.submit(deactivate)
        assert exit_result.result(timeout=60).status_code == 201
        assert update.result(timeout=60).status_code == 200
    assert leave(client, part["id"]).status_code == 422
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5


def test_migrations_have_a_single_head():
    from alembic.config import Config
    from alembic.script import ScriptDirectory

    assert len(ScriptDirectory.from_config(Config("alembic.ini")).get_heads()) == 1


def test_database_rejects_exit_without_reason(client):
    import pytest
    from sqlalchemy.exc import IntegrityError

    part = create_part(client)
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        connection.execute(
            INSERT_EXIT,
            {"id": uuid4().hex, "part_id": part["id"], "reason": "Descarte", "now": TIMESTAMP},
        )
    for reason in ("   ", None):
        with engine.begin() as connection:
            with pytest.raises(IntegrityError):
                connection.execute(UPDATE_EXIT_REASON, {"reason": reason})
    engine.dispose()


def test_database_rejects_entry_without_unit_cost(client):
    import pytest
    from sqlalchemy.exc import IntegrityError

    part = create_part(client)
    enter(client, part["id"])
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        with pytest.raises(IntegrityError):
            connection.execute(
                text("update stock_movements set unit_cost = NULL where movement_type = 'entry'")
            )
    engine.dispose()
