from unittest.mock import Mock
from uuid import uuid4

import pytest

from app.repositories.parts import PartRepository
from tests.test_vehicle_applications import associate


def create_part(client, **changes):
    response = client.post(
        "/parts",
        json={
            "manufacturer_code": str(uuid4()),
            "name": "Filtro",
            "category": "Filtros",
            **changes,
        },
        headers={"Idempotency-Key": str(uuid4())},
    )
    assert response.status_code == 201
    return response.json()


def search(client, **filters):
    return client.get("/parts/search", params=filters)


@pytest.mark.parametrize(
    "filters",
    [
        {"code": "001-A/2"},
        {"code": "EQ-01"},
        {"name": "Filtro de óleo"},
        {"category": "Lubrificação"},
    ],
)
def test_ca041_each_identification_filter_works_alone(client, filters):
    target = create_part(
        client,
        manufacturer_code="001-A/2",
        equivalent_codes=["EQ-01"],
        name="Filtro de óleo",
        category="Lubrificação",
    )
    create_part(client, name="Pastilha", category="Freios")
    result = search(client, **filters)
    assert result.status_code == 200
    assert result.json()["total"] == 1
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]


def test_ca043_unmatched_search_is_empty(client):
    create_part(client)
    result = search(client, code="INEXISTENTE")
    assert result.status_code == 200
    assert result.json() == {"items": [], "total": 0}


@pytest.mark.parametrize(
    "filters",
    [
        {"code": " 001-a/2 "},
        {"code": " eq-01 "},
        {"name": " FILTRO "},
        {"category": " filtros "},
    ],
)
def test_ca044_normalizes_case_and_edges_and_matches_name_substring(client, filters):
    target = create_part(
        client, manufacturer_code="001-A/2", equivalent_codes=["EQ-01"], name="Filtro de ar"
    )
    result = search(client, **filters)
    assert result.status_code == 200
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]


@pytest.mark.parametrize("filters", [{"code": "1-A/2"}, {"code": "001A2"}, {"category": "Filtro"}])
def test_ca044_exact_fields_preserve_zeros_and_separators(client, filters):
    create_part(client, manufacturer_code="001-A/2")
    assert search(client, **filters).json() == {"items": [], "total": 0}


@pytest.mark.parametrize("text", ["%", "_", "\\", "' OR 1=1 --"])
def test_name_substring_is_literal_and_parameterized(client, text):
    target = create_part(client, name=f"Prefixo {text} sufixo")
    create_part(client, name="Outro nome")
    assert [item["id"] for item in search(client, name=text).json()["items"]] == [target["id"]]


@pytest.mark.parametrize("filters", [{}, {"name": ""}, {"code": "  ", "category": "\t"}])
def test_ca046_empty_search_does_not_query_repository(client, monkeypatch, filters):
    unexpected = Mock(return_value=([], 0))
    monkeypatch.setattr(PartRepository, "search", unexpected)
    result = search(client, **filters)
    assert result.status_code == 422
    assert "ao menos um filtro" in result.json()["detail"]["message"]
    unexpected.assert_not_called()


@pytest.mark.parametrize(
    "filters,field",
    [
        ({"name": "a" * 201}, "name"),
        ({"code": "a" * 101}, "code"),
        ({"category": "a" * 101}, "category"),
        ({"name": "a", "offset": -1}, "offset"),
        ({"name": "a", "limit": 0}, "limit"),
        ({"name": "a", "limit": 101}, "limit"),
    ],
)
def test_search_validates_limits(client, filters, field):
    result = search(client, **filters)
    assert result.status_code == 422
    assert field in result.json()["detail"]["fields"]


@pytest.mark.parametrize("filters", [{"brand": " fIa "}, {"model": " nO "}, {"year": "2010"}])
def test_ca042_vehicle_filters_work_individually(client, filters):
    target = create_part(client)
    other = create_part(client)
    associate(client, target["id"])
    associate(client, other["id"], {"brand": "Volkswagen", "model": "Gol", "year": "2015"})
    result = search(client, **filters)
    assert result.status_code == 200
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]


def test_ca045_combines_vehicle_filters_in_the_same_application(client):
    mixed = create_part(client)
    target = create_part(client)
    associate(client, mixed["id"])
    associate(client, mixed["id"], {"brand": "Volkswagen", "model": "Gol", "year": "2015"})
    associate(client, target["id"], {"brand": "Fiat", "model": "Gol", "year": "2015"})
    result = search(client, brand="Fiat", model="Gol", year="2015")
    assert result.status_code == 200
    assert result.json()["total"] == 1
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]


def test_ca045_combines_identification_and_vehicle_without_duplicate_parts(client):
    target = create_part(client, manufacturer_code="P-01", equivalent_codes=["EQ-01"])
    associate(client, target["id"])
    associate(client, target["id"], {"brand": "Fiat", "model": "Uno", "year": "2011"})
    create_part(client)
    result = search(client, name="filtro", category="Filtros", brand="Fiat")
    assert result.status_code == 200
    assert result.json()["total"] == 1
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]
    for filters in [
        {"code": "EQ-01", "name": "Pastilha"},
        {"code": "EQ-01", "category": "Freios"},
        {"code": "EQ-01", "brand": "Fiat", "model": "Gol"},
        {"code": "EQ-01", "year": "2012"},
    ]:
        assert search(client, **filters).json() == {"items": [], "total": 0}


@pytest.mark.parametrize("year", ["20", "20100", "2010-2012", "abcd", "２０１０"])
def test_year_filter_rejects_non_four_digit_values(client, year):
    result = search(client, code="A", year=year)
    assert result.status_code == 422
    assert "year" in result.json()["detail"]["fields"]


@pytest.mark.parametrize("field,limit", [("brand", 100), ("model", 200)])
def test_vehicle_filters_validate_length(client, field, limit):
    assert search(client, code="A", **{field: "x" * (limit + 1)}).status_code == 422


def test_ca047_inactive_parts_remain_searchable_and_pagination_is_filtered(client):
    parts = [create_part(client, name=f"Filtro {i}") for i in range(3)]
    client.patch(
        f"/parts/{parts[1]['id']}",
        json={"status": "inactive"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    create_part(client, name="Pastilha")
    result = search(client, name="Filtro", offset=1, limit=1).json()
    assert result["total"] == 3
    assert [item["id"] for item in result["items"]] == [parts[1]["id"]]
    assert result["items"][0]["status"] == "inactive"
    assert search(client, name="Filtro", offset=3, limit=1).json() == {"items": [], "total": 3}


def test_case_insensitive_code_search_does_not_change_registration_uniqueness(client):
    first = create_part(client, manufacturer_code="Ab-001")
    second = create_part(client, manufacturer_code="aB-001")
    assert search(client, code="AB-001").json()["total"] == 2
    assert client.get(f"/parts/{first['id']}").json()["manufacturer_code"] == "Ab-001"
    assert client.get(f"/parts/{second['id']}").json()["manufacturer_code"] == "aB-001"


def test_postgresql_unicode_case_and_literal_vehicle_substrings(client):
    if not client.database_url.startswith("postgresql"):
        pytest.skip("Case de Unicode deve ser validado no PostgreSQL de destino.")
    target = create_part(client, name="ÓLEO", category="LUBRIFICAÇÃO")
    associate(client, target["id"], {"brand": "CITROËN", "model": "C4_%/\\", "year": "2010"})
    result = search(
        client, name=" óleo ", category=" lubrificação ", brand="troën", model="_%/\\", year="2010"
    )
    assert result.status_code == 200
    assert [item["id"] for item in result.json()["items"]] == [target["id"]]
    assert search(client, brand="citroen").json()["total"] == 0
