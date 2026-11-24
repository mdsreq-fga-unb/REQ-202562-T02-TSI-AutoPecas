from uuid import uuid4

from sqlalchemy import create_engine, text

from tests.test_part_search import create_part


def enter(client, part_id, **changes):
    key = changes.pop("key", str(uuid4()))
    return client.post(
        f"/parts/{part_id}/stock-entries",
        json={"quantity": 3, "entry_date": "2026-01-01", "unit_cost": "12.50", **changes},
        headers={"Idempotency-Key": key},
    )


def test_valid_entry_is_persisted_without_supplier(client):
    part = create_part(client)
    result = enter(client, part["id"])
    assert result.status_code == 201
    data = result.json()
    assert data["part_id"] == part["id"]
    assert data["quantity"] == 3
    assert data["entry_date"] == "2026-01-01"
    assert data["unit_cost"] == "12.50"
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert connection.scalar(text("select count(*) from stock_movements")) == 1
    engine.dispose()


def test_entry_adds_to_current_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5)
    result = enter(client, part["id"], quantity=3)
    assert result.json()["stock_balance"] == 8
    balance = client.get(f"/parts/{part['id']}/stock-balance")
    assert balance.status_code == 200
    assert balance.json()["stock_balance"] == 8


def test_other_part_balance_is_preserved(client):
    first, other = create_part(client), create_part(client)
    enter(client, other["id"], quantity=7)
    enter(client, first["id"])
    assert client.get(f"/parts/{other['id']}/stock-balance").json()["stock_balance"] == 7


def test_inactive_part_rejects_entry(client):
    part = create_part(client)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    result = enter(client, part["id"])
    assert result.status_code == 422
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


def test_zero_quantity_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], quantity=0).status_code == 422
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


def test_negative_quantity_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], quantity=-1).status_code == 422


def test_fractional_quantity_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], quantity=1.5).status_code == 422


def test_boolean_quantity_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], quantity=True).status_code == 422


def test_negative_cost_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], unit_cost="-0.01").status_code == 422


def test_cost_with_more_than_two_decimal_places_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], unit_cost="1.234").status_code == 422


def test_future_date_is_rejected(client):
    part = create_part(client)
    assert enter(client, part["id"], entry_date="2999-01-01").status_code == 422


def test_retry_does_not_add_stock_twice(client):
    part = create_part(client)
    key = str(uuid4())
    first = enter(client, part["id"], key=key)
    second = enter(client, part["id"], key=key)
    assert second.json() == first.json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 3


def test_reused_key_with_different_data_conflicts(client):
    part = create_part(client)
    key = str(uuid4())
    enter(client, part["id"], key=key)
    assert enter(client, part["id"], key=key, quantity=4).status_code == 409


def test_failure_rolls_back_movement_balance_and_request(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.stock import StockRepository

    part = create_part(client)

    def fail(*args):
        raise OperationalError("test", {}, Exception("offline"))

    monkeypatch.setattr(StockRepository, "remember", fail)
    assert enter(client, part["id"]).status_code == 503
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0
    engine = create_engine(client.database_url)
    with engine.connect() as connection:
        assert connection.scalar(text("select count(*) from stock_movements")) == 0
        assert connection.scalar(text("select count(*) from stock_entry_requests")) == 0
    engine.dispose()


def test_equivalent_cost_representation_reuses_request(client):
    part = create_part(client)
    key = str(uuid4())
    first = enter(client, part["id"], key=key, unit_cost="12.5")
    second = enter(client, part["id"], key=key, unit_cost="12.50")
    assert second.status_code == 201
    assert second.json() == first.json()


def test_store_calendar_boundary(client, monkeypatch):
    from datetime import UTC, datetime

    from app.core import clock

    monkeypatch.setattr(clock, "utc_now", lambda: datetime(2026, 1, 2, 1, tzinfo=UTC))
    part = create_part(client)
    assert enter(client, part["id"], entry_date="2026-01-02").status_code == 422
    assert enter(client, part["id"], entry_date="2026-01-01").status_code == 201


def test_two_distinct_entries_are_serialized(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    import pytest
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    part = create_part(client)
    barrier = Barrier(2)

    def send():
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            barrier.wait(timeout=10)
            return enter(other, part["id"])

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert [r.status_code for r in results] == [201, 201]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 6


def test_same_key_concurrent_retries_add_once(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    import pytest
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    part = create_part(client)
    key = str(uuid4())
    barrier = Barrier(2)

    def send():
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            barrier.wait(timeout=10)
            return enter(other, part["id"], key=key)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert [r.status_code for r in results] == [201, 201]
    assert results[0].json() == results[1].json()
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 3


def test_same_key_different_parts_concurrently_conflicts(client, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    import pytest
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app
    from app.repositories.stock import StockRepository

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    parts = [create_part(client), create_part(client)]
    key = str(uuid4())
    barrier = Barrier(2)
    original = StockRepository.remember

    def synchronized(self, *args):
        barrier.wait(timeout=10)
        return original(self, *args)

    monkeypatch.setattr(StockRepository, "remember", synchronized)

    def send(part):
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            return enter(other, part["id"], key=key)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, parts))
    assert sorted(r.status_code for r in results) == [201, 409]
    assert (
        sum(client.get(f"/parts/{p['id']}/stock-balance").json()["stock_balance"] for p in parts)
        == 3
    )


def test_missing_fields_are_identified_without_changing_balance(client):
    part = create_part(client)
    for field in ("quantity", "entry_date", "unit_cost"):
        data = {"quantity": 1, "entry_date": "2026-01-01", "unit_cost": "1.00"}
        del data[field]
        result = client.post(
            f"/parts/{part['id']}/stock-entries",
            json=data,
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert result.status_code == 422
        assert field in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


def test_invalid_date_and_nonfinite_cost_are_rejected(client):
    part = create_part(client)
    for change in ({"entry_date": "2026-02-30"}, {"unit_cost": "NaN"}, {"unit_cost": "Infinity"}):
        assert enter(client, part["id"], **change).status_code == 422


def test_nonexistent_part_is_not_accepted(client):
    assert enter(client, str(uuid4())).status_code == 404


def test_zero_cost_is_accepted(client):
    part = create_part(client)
    assert enter(client, part["id"], unit_cost="0").json()["unit_cost"] == "0.00"


def test_past_entry_adds_to_current_balance(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5, entry_date="2026-01-02")
    result = enter(client, part["id"], entry_date="2025-12-01")
    assert result.json()["stock_balance"] == 8
    assert result.json()["entry_date"] == "2025-12-01"


def test_retry_after_inactivation_returns_original_response(client):
    part = create_part(client)
    key = str(uuid4())
    first = enter(client, part["id"], key=key)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert enter(client, part["id"], key=key).json() == first.json()


def test_retry_after_api_restart_returns_original_response(client):
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    part = create_part(client)
    key = str(uuid4())
    first = enter(client, part["id"], key=key)
    with TestClient(
        create_app(Settings(_env_file=None, database_url=client.database_url))
    ) as restarted:
        assert enter(restarted, part["id"], key=key).json() == first.json()


def test_stock_migration_preserves_existing_catalog(client, monkeypatch):
    from alembic import command
    from alembic.config import Config

    part = create_part(client)
    monkeypatch.setenv("DATABASE_URL", client.database_url)
    command.downgrade(Config("alembic.ini"), "0004_vehicle_applications")
    command.upgrade(Config("alembic.ini"), "head")
    command.check(Config("alembic.ini"))
    assert (
        client.get(f"/parts/{part['id']}").json()["manufacturer_code"] == part["manufacturer_code"]
    )
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


def test_database_rejects_nonpositive_movement_quantity(client):
    import pytest
    from sqlalchemy.exc import IntegrityError

    part = create_part(client)
    enter(client, part["id"])
    engine = create_engine(client.database_url)
    with engine.begin() as connection:
        with pytest.raises(IntegrityError):
            connection.execute(text("update stock_movements set quantity = 0"))
    engine.dispose()


def test_entry_and_inactivation_share_the_part_lock(client, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Event

    import pytest
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app
    from app.repositories.stock import StockRepository

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL.")
    part = create_part(client)
    locked, updating = Event(), Event()
    original = StockRepository.add

    def hold(self, movement):
        locked.set()
        assert updating.wait(30)
        original(self, movement)

    monkeypatch.setattr(StockRepository, "add", hold)

    def add():
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as api:
            return enter(api, part["id"])

    def deactivate():
        assert locked.wait(30)
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as api:
            updating.set()
            return api.patch(
                f"/parts/{part['id']}",
                json={"status": "inactive"},
                headers={"Idempotency-Key": str(uuid4())},
            )

    with ThreadPoolExecutor(max_workers=2) as pool:
        entry, update = pool.submit(add), pool.submit(deactivate)
        assert entry.result(timeout=60).status_code == 201
        assert update.result(timeout=60).status_code == 200
    assert enter(client, part["id"]).status_code == 422
    assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 3
