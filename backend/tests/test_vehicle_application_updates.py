"""Correção e remoção de aplicações por veículo: US05, CA05.5 e CA05.7."""

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from tests.test_vehicle_applications import associate, create_part


def update_application(client, part_id, application_id, data, key=None):
    return client.patch(
        f"/parts/{part_id}/vehicle-applications/{application_id}",
        json=data,
        headers={"Idempotency-Key": key or str(uuid4())},
    )


def test_ca055_updates_only_selected_application_preserving_part_and_other_links(client):
    part_id = create_part(client)
    first = associate(client, part_id).json()
    other = associate(client, part_id, {"brand": "Fiat", "model": "Palio", "year": "2011"}).json()
    other = next(
        a
        for a in client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
        if a["id"] == other["id"]
    )
    before = client.get(f"/parts/{part_id}").json()
    data = {"brand": "Ford", "model": "Ka", "year": "2015"}
    result = update_application(client, part_id, first["id"], data)
    assert result.status_code == 200
    assert result.json().items() >= {**data, "id": first["id"], "part_id": part_id}.items()
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert len(items) == 2
    assert next(a for a in items if a["id"] == other["id"]) == other
    assert client.get(f"/parts/{part_id}").json() == before


def test_ca055_rejects_duplicate_but_allows_own_application(client):
    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Ford", "model": "Ka", "year": "2015"}).json()
    same = {"brand": " FIAT ", "model": " uno ", "year": "2010"}
    assert update_application(client, part_id, first["id"], same).status_code == 200
    result = update_application(client, part_id, second["id"], same)
    assert result.status_code == 409
    assert result.json()["detail"]["existing_application"]["id"] == first["id"]
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert next(a for a in items if a["id"] == second["id"])["brand"] == "Ford"


def remove_application(client, part_id, application_id, key=None):
    return client.delete(
        f"/parts/{part_id}/vehicle-applications/{application_id}",
        headers={"Idempotency-Key": key or str(uuid4())},
    )


def test_ca057_removes_only_selected_link_preserving_part_and_other_links(client):
    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Fiat", "model": "Palio", "year": "2011"}).json()
    other_part = create_part(client)
    associate(client, other_part)
    before = client.get(f"/parts/{part_id}").json()
    assert remove_application(client, part_id, first["id"]).status_code == 200
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert [a["id"] for a in items] == [second["id"]]
    assert client.get(f"/parts/{other_part}/vehicle-applications").json()["total"] == 1
    assert client.get(f"/parts/{part_id}").json() == before


@pytest.mark.parametrize("action", ["update", "remove"])
def test_mutation_retry_after_restart_returns_original_result_without_reapplying(client, action):
    part_id = create_part(client)
    application = associate(client, part_id).json()
    key = str(uuid4())
    data = {"brand": "Ford", "model": "Ka", "year": "2015"}
    if action == "update":
        original = update_application(client, part_id, application["id"], data, key)
        update_application(client, part_id, application["id"], {**data, "year": "2016"})
    else:
        original = remove_application(client, part_id, application["id"], key)
    assert original.status_code == 200
    with TestClient(create_app(Settings(_env_file=None, database_url=client.database_url))) as api:
        repeated = (
            update_application(api, part_id, application["id"], data, key)
            if action == "update"
            else remove_application(api, part_id, application["id"], key)
        )
    assert repeated.status_code == 200
    assert repeated.json() == original.json()
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert (items[0]["year"] == "2016") if action == "update" else not items


@pytest.mark.parametrize("action", ["update", "remove"])
def test_mutation_cannot_change_link_belonging_to_another_part(client, action):
    part_id, other_part = create_part(client), create_part(client)
    application = associate(client, part_id).json()
    data = {"brand": "Ford", "model": "Ka", "year": "2015"}
    result = (
        update_application(client, other_part, application["id"], data)
        if action == "update"
        else remove_application(client, other_part, application["id"])
    )
    assert result.status_code == 404
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 1
    assert client.get(f"/parts/{other_part}/vehicle-applications").json()["total"] == 0


@pytest.mark.parametrize("action", ["update", "remove"])
def test_failure_recording_mutation_rolls_back_and_allows_retry(client, monkeypatch, action):
    from sqlalchemy.exc import OperationalError

    from app.repositories.vehicle_applications import VehicleApplicationRepository

    part_id = create_part(client)
    application = associate(client, part_id).json()
    before = client.get(f"/parts/{part_id}/vehicle-applications").json()
    key = str(uuid4())
    data = {"brand": "Ford", "model": "Ka", "year": "2015"}

    def send():
        return (
            update_application(client, part_id, application["id"], data, key)
            if action == "update"
            else remove_application(client, part_id, application["id"], key)
        )

    def fail(*args):
        raise OperationalError("INSERT", {}, Exception("private database detail"))

    with monkeypatch.context() as patch:
        patch.setattr(VehicleApplicationRepository, "remember", fail)
        result = send()
    assert result.status_code == 503
    assert "private database detail" not in result.text
    assert client.get(f"/parts/{part_id}/vehicle-applications").json() == before
    assert send().status_code == 200


@pytest.mark.parametrize(
    "field,value", [("brand", " "), ("model", ""), ("year", "2010-2012"), ("year", 2010)]
)
def test_invalid_update_is_rejected_without_changing_application(client, field, value):
    part_id = create_part(client)
    application = associate(client, part_id).json()
    result = update_application(
        client,
        part_id,
        application["id"],
        {"brand": "Fiat", "model": "Uno", "year": "2010", field: value},
    )
    assert result.status_code == 422
    assert field in result.json()["detail"]["fields"]
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["items"][0]["year"] == "2010"


def test_mutation_key_cannot_be_reused_for_other_data_target_or_operation(client):
    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Fiat", "model": "Palio", "year": "2011"}).json()
    data = {"brand": "Ford", "model": "Ka", "year": "2015"}
    key = str(uuid4())
    assert update_application(client, part_id, first["id"], data, key).status_code == 200
    assert (
        update_application(client, part_id, first["id"], {**data, "year": "2016"}, key).status_code
        == 409
    )
    assert update_application(client, part_id, second["id"], data, key).status_code == 409
    assert remove_application(client, part_id, first["id"], key).status_code == 409


def test_database_duplicate_is_reported_as_conflict_when_precheck_misses_it(client, monkeypatch):
    from app.repositories.vehicle_applications import VehicleApplicationRepository

    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Ford", "model": "Ka", "year": "2015"}).json()
    original = VehicleApplicationRepository.find_existing
    calls = 0

    def miss_once(self, *args):
        nonlocal calls
        calls += 1
        return None if calls == 1 else original(self, *args)

    monkeypatch.setattr(VehicleApplicationRepository, "find_existing", miss_once)
    result = update_application(
        client, part_id, second["id"], {"brand": "Fiat", "model": "Uno", "year": "2010"}
    )
    assert result.status_code == 409
    assert result.json()["detail"]["existing_application"]["id"] == first["id"]


@pytest.mark.parametrize("action", ["update", "remove"])
def test_mutation_requires_key_and_rejects_missing_target(client, action):
    part_id = create_part(client)
    application = associate(client, part_id).json()
    path = f"/parts/{part_id}/vehicle-applications/{application['id']}"
    if action == "update":
        result = client.patch(path, json={"brand": "Fiat", "model": "Uno", "year": "2010"})
        missing = update_application(
            client, part_id, str(uuid4()), {"brand": "Fiat", "model": "Uno", "year": "2010"}
        )
    else:
        result = client.delete(path)
        missing = remove_application(client, part_id, str(uuid4()))
    assert result.status_code == 422
    assert missing.status_code == 404


@pytest.mark.parametrize("action", ["update", "remove"])
def test_mutations_preserve_stock_and_status_even_for_inactive_part(client, action):
    from tests.test_stock_entries import enter

    part_id = create_part(client)
    application = associate(client, part_id).json()
    assert enter(client, part_id, quantity=5).status_code == 201
    client.patch(
        f"/parts/{part_id}", json={"status": "inactive"}, headers={"Idempotency-Key": str(uuid4())}
    )
    before = client.get(f"/parts/{part_id}").json()
    result = (
        update_application(
            client, part_id, application["id"], {"brand": "Ford", "model": "Ka", "year": "2015"}
        )
        if action == "update"
        else remove_application(client, part_id, application["id"])
    )
    assert result.status_code == 200
    assert client.get(f"/parts/{part_id}").json() == before
    assert client.get(f"/parts/{part_id}/stock-balance").json()["stock_balance"] == 5


@pytest.mark.parametrize("action", ["update", "remove"])
def test_concurrent_retries_share_one_mutation_result(client, action):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL descartável.")
    part_id = create_part(client)
    application = associate(client, part_id).json()
    key = str(uuid4())
    barrier = Barrier(2)

    def send():
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as api:
            barrier.wait(timeout=10)
            return (
                update_application(
                    api,
                    part_id,
                    application["id"],
                    {"brand": "Ford", "model": "Ka", "year": "2015"},
                    key,
                )
                if action == "update"
                else remove_application(api, part_id, application["id"], key)
            )

    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(send) for _ in range(2)]
        results = [f.result(timeout=30) for f in futures]
    assert [r.status_code for r in results] == [200, 200]
    assert results[0].json() == results[1].json()
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert len(items) == (1 if action == "update" else 0)


def test_concurrent_updates_cannot_create_duplicate_applications(client):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL descartável.")
    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Ford", "model": "Ka", "year": "2015"}).json()
    barrier = Barrier(2)

    def send(application):
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as api:
            barrier.wait(timeout=10)
            return update_application(
                api, part_id, application["id"], {"brand": "VW", "model": "Gol", "year": "2018"}
            )

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, [first, second]))
    assert sorted(r.status_code for r in results) == [200, 409]
    items = client.get(f"/parts/{part_id}/vehicle-applications").json()["items"]
    assert sum(a["model"] == "Gol" for a in items) == 1
