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
from app.models.part import Part, PartCode, PartCreationRequest, PartUpdateRequest
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


def test_edit_part_persists_changes_without_creating_another_part(client):
    original = register(client).json()
    response = client.patch(
        f"/parts/{original['id']}",
        json={"name": "Filtro atualizado", "category": "Filtros de motor"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 200
    assert response.json()["id"] == original["id"]
    assert response.json()["manufacturer_code"] == original["manufacturer_code"]
    saved = client.get(f"/parts/{original['id']}").json()
    assert saved["name"] == "Filtro atualizado"
    assert saved["category"] == "Filtros de motor"
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(Part)) == 1


def test_edit_part_cannot_change_manufacturer_code(client):
    original = register(client).json()
    response = client.patch(
        f"/parts/{original['id']}",
        json={"manufacturer_code": "OTHER", "name": "Nome alterado"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 422
    assert client.get(f"/parts/{original['id']}").json() == original


@pytest.mark.parametrize("field", ["name", "category"])
@pytest.mark.parametrize("value", ["", "   ", None])
def test_edit_part_rejects_empty_required_fields_without_changing_data(client, field, value):
    original = register(client).json()
    response = client.patch(
        f"/parts/{original['id']}",
        json={field: value},
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 422
    assert client.get(f"/parts/{original['id']}").json() == original


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


def edit(client, part_id, data, key=None):
    return client.patch(
        f"/parts/{part_id}", json=data, headers={"Idempotency-Key": key or str(uuid4())}
    )


def test_edit_part_replaces_equivalents_and_releases_removed_codes(client):
    original = register(client, payload(equivalent_codes=["OLD", "KEEP"])).json()
    response = edit(
        client,
        original["id"],
        {
            "equivalent_codes": ["KEEP", "NEW"],
            "physical_location": " A2 ",
            "technical_description": " Nova descrição ",
        },
    )
    assert response.status_code == 200
    assert response.json()["equivalent_codes"] == ["KEEP", "NEW"]
    assert response.json()["physical_location"] == "A2"
    assert response.json()["technical_description"] == "Nova descrição"
    assert register(client, payload(manufacturer_code="OLD")).status_code == 201
    assert register(client, payload(manufacturer_code="NEW")).status_code == 409


@pytest.mark.parametrize("codes", [["FLT-100"], ["SAME", "SAME"], None])
def test_edit_part_rejects_repeated_or_null_equivalents(client, codes):
    original = register(client).json()
    assert edit(client, original["id"], {"equivalent_codes": codes}).status_code == 422
    assert client.get(f"/parts/{original['id']}").json() == original


def test_edit_part_conflict_preserves_all_original_data(client):
    original = register(client, payload(equivalent_codes=["OLD"])).json()
    other = register(client, payload(manufacturer_code="OTHER", equivalent_codes=["TAKEN"])).json()
    response = edit(client, original["id"], {"name": "Changed", "equivalent_codes": ["TAKEN"]})
    assert response.status_code == 409
    assert response.json()["detail"]["existing_part"]["id"] == other["id"]
    assert client.get(f"/parts/{original['id']}").json() == original


def photo_data(color):
    photo = BytesIO()
    Image.new("RGB", (5, 5), color).save(photo, format="PNG")
    return "data:image/png;base64," + base64.b64encode(photo.getvalue()).decode()


def test_edit_part_preserves_replaces_and_removes_photo(client):
    original = register(client, payload(photo_data=photo_data("red"))).json()
    photo_url = original["photo_url"]
    original_photo = client.get(photo_url).content
    assert edit(client, original["id"], {"name": "Atualizado"}).status_code == 200
    assert client.get(photo_url).content == original_photo
    assert edit(client, original["id"], {"photo_data": photo_data("blue")}).status_code == 200
    assert Image.open(BytesIO(client.get(photo_url).content)).getpixel((0, 0)) == (0, 0, 255)
    removed = edit(client, original["id"], {"photo_data": None})
    assert removed.status_code == 200
    assert removed.json()["photo_url"] is None
    assert client.get(photo_url).status_code == 404


def test_edit_part_invalid_photo_preserves_previous_data(client):
    original = register(client, payload(photo_data=photo_data("red"))).json()
    response = edit(client, original["id"], {"name": "Changed", "photo_data": "invalid"})
    assert response.status_code == 422
    assert client.get(f"/parts/{original['id']}").json() == original


def test_edit_part_retry_after_later_edit_does_not_overwrite_latest_data(client):
    original = register(client).json()
    key = str(uuid4())
    first = edit(client, original["id"], {"name": "Primeira alteração"}, key)
    assert first.status_code == 200
    latest = edit(client, original["id"], {"name": "Segunda alteração"})
    url = str(client.test_factory.kw["bind"].url)
    with TestClient(create_app(Settings(_env_file=None, database_url=url))) as restarted:
        repeated = edit(restarted, original["id"], {"name": "Primeira alteração"}, key)
    assert repeated.json() == first.json()
    assert client.get(f"/parts/{original['id']}").json() == latest.json()
    assert edit(client, original["id"], {"name": "Outro conteúdo"}, key).status_code == 409


def test_edit_part_key_cannot_be_reused_on_another_part(client):
    original = register(client).json()
    other = register(client, payload(manufacturer_code="OTHER")).json()
    key = str(uuid4())
    assert edit(client, original["id"], {"name": "Alterado"}, key).status_code == 200
    assert edit(client, other["id"], {"name": "Alterado"}, key).status_code == 409


def test_edit_part_missing_part_and_missing_key(client):
    assert edit(client, str(uuid4()), {"name": "Alterado"}).status_code == 404
    original = register(client).json()
    assert client.patch(f"/parts/{original['id']}", json={"name": "Alterado"}).status_code == 422


def test_catalog_lists_saved_parts_with_pagination(client):
    first = register(client).json()
    second = register(client, payload(manufacturer_code="SECOND")).json()
    response = client.get("/parts?offset=0&limit=1")
    assert response.status_code == 200
    assert response.json()["total"] == 2
    assert response.json()["items"][0]["id"] == first["id"]
    assert client.get("/parts?offset=1&limit=1").json()["items"][0]["id"] == second["id"]
    assert client.get("/parts?offset=-1").status_code == 422
    assert client.get("/parts?limit=101").status_code == 422


def test_edit_failure_before_commit_rolls_back_fields_codes_photo_and_key(client, monkeypatch):
    original = register(
        client, payload(equivalent_codes=["OLD"], photo_data=photo_data("red"))
    ).json()
    original_photo = client.get(original["photo_url"]).content
    key = str(uuid4())
    changes = {"name": "Alterado", "equivalent_codes": ["NEW"], "photo_data": photo_data("blue")}

    def fail_to_remember(*args):
        raise OperationalError("simulated", {}, Exception("private database detail"))

    with monkeypatch.context() as patch:
        patch.setattr(PartRepository, "remember_update", fail_to_remember)
        response = edit(client, original["id"], changes, key)
    assert response.status_code == 503
    assert "private database detail" not in response.text
    assert client.get(f"/parts/{original['id']}").json() == original
    assert client.get(original["photo_url"]).content == original_photo
    with client.test_factory() as session:
        assert session.scalar(select(func.count()).select_from(PartUpdateRequest)) == 0
    assert edit(client, original["id"], changes, key).status_code == 200


def test_edit_database_constraint_handles_conflict_after_precheck(client, monkeypatch):
    original = register(client, payload(equivalent_codes=["OLD"])).json()
    other = register(client, payload(manufacturer_code="OTHER")).json()
    find_conflict = PartRepository.find_conflict
    calls = 0

    def miss_first_conflict(repo, codes, exclude_id=None):
        nonlocal calls
        calls += 1
        return None if calls == 1 else find_conflict(repo, codes, exclude_id)

    monkeypatch.setattr(PartRepository, "find_conflict", miss_first_conflict)
    response = edit(client, original["id"], {"name": "Alterado", "equivalent_codes": ["OTHER"]})
    assert response.status_code == 409
    assert response.json()["detail"]["existing_part"]["id"] == other["id"]
    assert client.get(f"/parts/{original['id']}").json() == original


def test_edit_equivalents_alone_updates_timestamp_and_optional_fields_can_be_cleared(client):
    original = register(
        client, payload(physical_location="A2", technical_description="Original")
    ).json()
    updated = edit(client, original["id"], {"equivalent_codes": ["NEW"]}).json()
    assert updated["updated_at"] > original["updated_at"]
    assert updated["created_at"] == original["created_at"]
    cleared = edit(client, original["id"], {"physical_location": "", "technical_description": None})
    assert cleared.status_code == 200
    assert cleared.json()["physical_location"] is None
    assert cleared.json()["technical_description"] is None


def test_partial_edits_preserve_other_changes_and_equivalents_with_separators(client):
    original = register(client, payload(equivalent_codes=["ACME;01", "ACME,02"])).json()
    assert edit(client, original["id"], {"physical_location": "B3"}).status_code == 200
    updated = edit(client, original["id"], {"name": "Atualizado"})
    assert updated.status_code == 200
    assert updated.json()["physical_location"] == "B3"
    assert updated.json()["equivalent_codes"] == original["equivalent_codes"]
    assert updated.json()["id"] == original["id"]
