import os
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError
from sqlalchemy.schema import CreateSchema, DropSchema

from app.core.config import Settings
from app.main import create_app
from app.repositories.vehicle_applications import VehicleApplicationRepository


@pytest.fixture
def client(tmp_path, monkeypatch, request):
    database_url = os.environ.get("US03_TEST_DATABASE_URL")
    admin = None
    schema = f"us03_{uuid4().hex}"
    if database_url:
        url = make_url(database_url)
        if url.database != "tsi_us03_test" or url.host not in {"localhost", "127.0.0.1"}:
            pytest.fail("Use somente o PostgreSQL local descartável tsi_us03_test.")
        admin = create_engine(url)
        with admin.begin() as connection:
            connection.execute(CreateSchema(schema))
        url = url.update_query_dict({"options": f"-csearch_path={schema}"})
        database_url = url.render_as_string(hide_password=False)
    else:
        database_url = f"sqlite+pysqlite:///{tmp_path / 'applications.db'}"
    monkeypatch.setenv("DATABASE_URL", database_url)
    try:
        command.upgrade(Config("alembic.ini"), getattr(request, "param", "head"))
        with TestClient(create_app(Settings(_env_file=None, database_url=database_url))) as client:
            client.database_url = database_url
            yield client
    finally:
        if admin:
            with admin.begin() as connection:
                connection.execute(DropSchema(schema, cascade=True))
            admin.dispose()


def create_part(client):
    response = client.post(
        "/parts",
        json={"manufacturer_code": str(uuid4()), "name": "Filtro", "category": "Filtros"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 201
    return response.json()["id"]


def associate(client, part_id, data=None, key=None):
    return client.post(
        f"/parts/{part_id}/vehicle-applications",
        json=data if data is not None else {"brand": "Fiat", "model": "Uno", "year": "2010"},
        headers={"Idempotency-Key": key or str(uuid4())},
    )


def test_ca031_associates_vehicle_with_selected_part(client):
    part_id = create_part(client)
    response = associate(client, part_id)
    assert response.status_code == 201
    assert (
        response.json().items()
        >= {"part_id": part_id, "brand": "Fiat", "model": "Uno", "year": "2010"}.items()
    )
    assert response.json()["id"]


def test_ca032_lists_multiple_applications_without_replacing_previous(client):
    part_id = create_part(client)
    first = associate(client, part_id).json()
    second = associate(client, part_id, {"brand": "Fiat", "model": "Uno", "year": "2011"}).json()
    other = create_part(client)
    associate(client, other)
    page = client.get(f"/parts/{part_id}/vehicle-applications?offset=0&limit=1")
    assert page.status_code == 200
    assert page.json()["total"] == 2
    assert [item["id"] for item in page.json()["items"]] == [first["id"]]
    following = client.get(f"/parts/{part_id}/vehicle-applications?offset=1&limit=1").json()
    assert [item["id"] for item in following["items"]] == [second["id"]]


@pytest.mark.parametrize("field", ["brand", "model", "year"])
@pytest.mark.parametrize("value", [None, "", "   "])
def test_ca033_identifies_invalid_required_field(client, field, value):
    part_id = create_part(client)
    data = {"brand": "Fiat", "model": "Uno", "year": "2010", field: value}
    response = associate(client, part_id, data)
    assert response.status_code == 422
    assert field in response.json()["detail"]["fields"]
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 0


@pytest.mark.parametrize(
    "year", ["2010-2012", "201", "20100", "2010.0", "20a0", "２010", 2010, True]
)
def test_ca034_rejects_anything_other_than_four_ascii_digits(client, year):
    response = associate(
        client, create_part(client), {"brand": "Fiat", "model": "Uno", "year": year}
    )
    assert response.status_code == 422
    assert "year" in response.json()["detail"]["fields"]


def test_missing_part_cannot_receive_or_list_applications(client):
    missing = str(uuid4())
    assert associate(client, missing).status_code == 404
    response = client.get(f"/parts/{missing}/vehicle-applications")
    assert response.status_code == 404
    assert response.json()["detail"]["message"] == "Peça não encontrada."


@pytest.mark.parametrize("brand,model", [("Fiat", "Uno"), (" FIAT ", " uno "), ("fiat", "UNO")])
def test_ca035_duplicate_is_normalized_and_scoped_to_part(client, brand, model):
    part_id = create_part(client)
    original = associate(client, part_id).json()
    repeated = associate(client, part_id, {"brand": brand, "model": model, "year": "2010"})
    assert repeated.status_code == 409
    assert repeated.json()["detail"]["existing_application"]["id"] == original["id"]
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 1
    assert associate(client, create_part(client)).status_code == 201


def test_retry_after_restart_returns_original_result(client):
    part_id = create_part(client)
    key = str(uuid4())
    original = associate(client, part_id, key=key)
    with TestClient(
        create_app(Settings(_env_file=None, database_url=client.database_url))
    ) as restarted:
        repeated = associate(restarted, part_id, key=key)
    assert original.status_code == repeated.status_code == 201
    assert repeated.json() == original.json()
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 1


def test_idempotency_key_cannot_change_part_or_data(client):
    part_id = create_part(client)
    key = str(uuid4())
    associate(client, part_id, key=key)
    assert associate(client, create_part(client), key=key).status_code == 409
    assert (
        associate(
            client, part_id, {"brand": "Fiat", "model": "Uno", "year": "2011"}, key
        ).status_code
        == 409
    )


def test_idempotency_key_is_required(client):
    part_id = create_part(client)
    response = client.post(
        f"/parts/{part_id}/vehicle-applications",
        json={"brand": "Fiat", "model": "Uno", "year": "2010"},
    )
    assert response.status_code == 422


def test_failure_recording_attempt_rolls_back_application_and_allows_retry(client, monkeypatch):
    part_id = create_part(client)
    key = str(uuid4())

    def fail(*args):
        raise OperationalError("simulated", {}, Exception("private detail"))

    with monkeypatch.context() as patch:
        patch.setattr(VehicleApplicationRepository, "remember", fail, raising=False)
        response = associate(client, part_id, key=key)
    assert response.status_code == 503
    assert "private detail" not in response.text
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 0
    assert associate(client, part_id, key=key).status_code == 201


def test_concurrent_duplicate_creates_exactly_one_application(client):
    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência deve ser exercitada no PostgreSQL descartável.")
    part_id = create_part(client)
    barrier = Barrier(2)

    def send():
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as worker:
            barrier.wait(timeout=10)
            return associate(worker, part_id).status_code

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: send(), range(2)))
    assert sorted(results) == [201, 409]
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 1


@pytest.mark.parametrize("same_key", [True, False])
def test_concurrent_retries_or_distinct_years_are_preserved(client, same_key):
    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência deve ser exercitada no PostgreSQL descartável.")
    part_id = create_part(client)
    key = str(uuid4())
    barrier = Barrier(2)

    def send(index):
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as worker:
            barrier.wait(timeout=10)
            return associate(
                worker,
                part_id,
                {
                    "brand": "Fiat",
                    "model": "Uno",
                    "year": "2010" if same_key else str(2010 + index),
                },
                key if same_key else str(uuid4()),
            )

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, range(2)))
    assert [result.status_code for result in results] == [201, 201]
    if same_key:
        assert results[0].json() == results[1].json()
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == (
        1 if same_key else 2
    )


def test_database_constraint_protects_against_conflict_missed_by_precheck(client, monkeypatch):
    part_id = create_part(client)
    original = associate(client, part_id).json()
    find = VehicleApplicationRepository.find_existing
    calls = 0

    def miss_once(repo, *args):
        nonlocal calls
        calls += 1
        return None if calls == 1 else find(repo, *args)

    monkeypatch.setattr(VehicleApplicationRepository, "find_existing", miss_once)
    response = associate(client, part_id)
    assert response.status_code == 409
    assert response.json()["detail"]["existing_application"]["id"] == original["id"]
    assert client.get(f"/parts/{part_id}/vehicle-applications").json()["total"] == 1


@pytest.mark.parametrize("client", ["0003_part_status"], indirect=True)
def test_migration_preserves_existing_part_and_allows_new_applications(client):
    part_id = create_part(client)
    client.patch(
        f"/parts/{part_id}",
        json={"status": "inactive", "equivalent_codes": ["EQ-LEGACY"]},
        headers={"Idempotency-Key": str(uuid4())},
    )
    before = client.get(f"/parts/{part_id}").json()
    command.upgrade(Config("alembic.ini"), "head")
    command.check(Config("alembic.ini"))
    assert client.get(f"/parts/{part_id}").json() == before
    assert associate(client, part_id).status_code == 201
    command.downgrade(Config("alembic.ini"), "0003_part_status")
    assert client.get(f"/parts/{part_id}").json() == before


def test_normalization_preserves_accents_punctuation_and_internal_spaces(client):
    part_id = create_part(client)
    for model in ("São  João", "Sao  Joao", "São João", "São-João"):
        assert (
            associate(
                client, part_id, {"brand": "Marca", "model": model, "year": "2010"}
            ).status_code
            == 201
        )


@pytest.mark.parametrize("field", ["brand", "model", "year"])
def test_missing_field_is_identified(client, field):
    data = {"brand": "Fiat", "model": "Uno", "year": "2010"}
    del data[field]
    response = associate(client, create_part(client), data)
    assert response.status_code == 422
    assert field in response.json()["detail"]["fields"]
