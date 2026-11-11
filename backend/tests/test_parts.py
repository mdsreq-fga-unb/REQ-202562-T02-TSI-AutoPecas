import base64
from io import BytesIO
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import func, select
from sqlalchemy.exc import OperationalError

from app.core.config import Settings
from app.core.database import create_session_factory
from app.main import create_app
from app.models.part import Part, PartCode, PartCreationRequest
from app.repositories.parts import PartRepository


@pytest.fixture
def client(tmp_path, monkeypatch):
    url = f"sqlite+pysqlite:///{tmp_path / 'parts.db'}"
    monkeypatch.setenv("DATABASE_URL", url)
    command.upgrade(Config("alembic.ini"), "head")
    factory = create_session_factory(url)
    with TestClient(create_app(Settings(_env_file=None, database_url=url))) as client:
        client.test_factory = factory
        yield client
    factory.kw["bind"].dispose()


def payload(**changes):
    return {
        "manufacturer_code": "FLT-100",
        "name": "Filtro de óleo",
        "category": "Filtros",
        **changes,
    }


def register(client, data=None, key=None):
    return client.post(
        "/parts", json=data or payload(), headers={"Idempotency-Key": key or str(uuid4())}
    )


def test_create_part_with_required_fields(client):
    response = client.post(
        "/parts",
        json={"manufacturer_code": "FLT-100", "name": "Filtro de óleo", "category": "Filtros"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 201
    assert response.json()["manufacturer_code"] == "FLT-100"
    assert response.json()["name"] == "Filtro de óleo"


def test_optional_fields_and_photo_are_persisted(client):
    photo = BytesIO()
    Image.new("RGB", (5, 5), "red").save(photo, format="PNG")
    response = register(
        client,
        payload(
            equivalent_codes=["ABC-123", "XYZ-456"],
            technical_description="Filtro para motor a gasolina",
            physical_location="Prateleira A2",
            photo_data="data:image/png;base64," + base64.b64encode(photo.getvalue()).decode(),
        ),
    )
    assert response.status_code == 201
    saved = client.get("/parts/" + response.json()["id"])
    assert saved.status_code == 200
    assert saved.json()["equivalent_codes"] == ["ABC-123", "XYZ-456"]
    assert saved.json()["physical_location"] == "Prateleira A2"
    photo_response = client.get(saved.json()["photo_url"])
    assert photo_response.headers["content-type"] == "image/png"
    assert Image.open(BytesIO(photo_response.content)).size == (5, 5)


@pytest.mark.parametrize("field", ["manufacturer_code", "name", "category"])
@pytest.mark.parametrize("value", ["", "   ", None])
def test_required_fields_cannot_be_empty(client, field, value):
    assert register(client, payload(**{field: value})).status_code == 422
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 0


@pytest.mark.parametrize(
    "incoming",
    [
        {"manufacturer_code": "FLT-100"},
        {"manufacturer_code": "ABC-123"},
        {"manufacturer_code": "NEW", "equivalent_codes": ["FLT-100"]},
        {"manufacturer_code": "NEW", "equivalent_codes": ["ABC-123"]},
    ],
)
def test_duplicates_identify_existing_part_without_overwriting(client, incoming):
    first = register(client, payload(equivalent_codes=["ABC-123"]))
    response = register(client, payload(**incoming))
    assert response.status_code == 409
    assert response.json()["detail"]["existing_part"]["id"] == first.json()["id"]
    assert response.json()["detail"]["existing_part"]["name"] == "Filtro de óleo"
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 1


def test_duplicate_codes_in_same_form_are_rejected(client):
    assert register(client, payload(equivalent_codes=["FLT-100"])).status_code == 422
    assert register(client, payload(equivalent_codes=["ABC", "ABC"])).status_code == 422


def test_retry_returns_original_result_even_with_new_application_instance(client):
    key = str(uuid4())
    first = register(client, key=key)
    url = str(client.test_factory.kw["bind"].url)
    with TestClient(create_app(Settings(_env_file=None, database_url=url))) as restarted:
        repeated = register(restarted, key=key)
    assert first.status_code == repeated.status_code == 201
    assert first.json() == repeated.json()
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 1


def test_idempotency_key_cannot_be_reused_with_different_data(client):
    key = str(uuid4())
    register(client, key=key)
    assert register(client, payload(name="Outra peça"), key).status_code == 409


@pytest.mark.parametrize(
    "photo_data", ["data:image/png;base64,aGVsbG8=", "data:image/svg+xml;base64,PHN2Zy8+"]
)
def test_invalid_photo_does_not_create_part(client, photo_data):
    assert register(client, payload(photo_data=photo_data)).status_code == 422
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 0


def test_request_requires_idempotency_key(client):
    assert client.post("/parts", json=payload()).status_code == 422


def test_missing_part_returns_portuguese_error(client):
    response = client.get("/parts/" + str(uuid4()))
    assert response.status_code == 404
    assert response.json()["detail"]["message"] == "Peça não encontrada."


def test_failure_before_commit_rolls_back_everything_and_allows_retry(client, monkeypatch):
    key = str(uuid4())

    def fail_to_remember(*args):
        raise OperationalError("simulated", {}, Exception("private database detail"))

    with monkeypatch.context() as patch:
        patch.setattr(PartRepository, "remember", fail_to_remember)
        response = register(client, payload(equivalent_codes=["EQ-100"]), key)
    assert response.status_code == 503
    assert "private database detail" not in response.text
    with client.test_factory() as session:
        for model in (Part, PartCode, PartCreationRequest):
            assert session.scalar(select(func.count()).select_from(model)) == 0
    assert register(client, payload(equivalent_codes=["EQ-100"]), key).status_code == 201


def test_database_constraint_rejects_conflict_after_precheck(client, monkeypatch):
    original = register(client)
    find_conflict = PartRepository.find_conflict
    calls = 0

    def miss_first_conflict(repo, codes):
        nonlocal calls
        calls += 1
        return None if calls == 1 else find_conflict(repo, codes)

    monkeypatch.setattr(PartRepository, "find_conflict", miss_first_conflict)
    response = register(client)
    assert response.status_code == 409
    assert response.json()["detail"]["existing_part"]["id"] == original.json()["id"]
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 1


def test_oversized_photo_is_rejected_without_persistence(client):
    photo = "data:image/png;base64," + base64.b64encode(b"x" * (2 * 1024 * 1024 + 1)).decode()
    assert register(client, payload(photo_data=photo)).status_code == 422
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 0
