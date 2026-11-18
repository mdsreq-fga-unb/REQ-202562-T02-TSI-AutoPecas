from uuid import uuid4

from sqlalchemy.exc import OperationalError

from app.repositories.parts import PartRepository
from tests.test_part_search import create_part
from tests.test_stock_entries import enter


def test_balance_is_zero_for_new_part_and_reflects_completed_entries(client):
    part = create_part(client)
    path = f"/parts/{part['id']}/stock-balance"
    assert client.get(path).json() == {"part_id": part["id"], "stock_balance": 0}
    assert enter(client, part["id"], quantity=5).status_code == 201
    assert client.get(path).json()["stock_balance"] == 5
    assert enter(client, part["id"], quantity=3).status_code == 201
    assert client.get(path).json()["stock_balance"] == 8


def test_reading_inactive_part_balance_preserves_status_and_stock(client):
    part = create_part(client)
    enter(client, part["id"], quantity=5)
    client.patch(
        f"/parts/{part['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    for _ in range(2):
        assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 5
    assert client.get(f"/parts/{part['id']}").json()["status"] == "inactive"
    assert enter(client, part["id"]).status_code == 422


def test_balance_failure_and_missing_part_do_not_return_zero(client, monkeypatch):
    assert client.get(f"/parts/{uuid4()}/stock-balance").status_code == 404
    part = create_part(client)

    def fail(*args):
        raise OperationalError("SELECT", {}, Exception("internal database detail"))

    monkeypatch.setattr(PartRepository, "get", fail)
    result = client.get(f"/parts/{part['id']}/stock-balance")
    assert result.status_code == 503
    assert "stock_balance" not in result.json()
    assert "internal database detail" not in result.text


def test_balance_response_prevents_reuse_of_cached_stock(client):
    part = create_part(client)
    result = client.get(f"/parts/{part['id']}/stock-balance")
    assert result.headers.get("cache-control") == "no-store"
