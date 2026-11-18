import base64
from io import BytesIO
from uuid import uuid4

import pytest
from openpyxl import Workbook

HEADERS = ["Código do fabricante", "Nome", "Categoria", "Descrição técnica", "Localização física"]


def workbook_data(rows, headers=HEADERS, customize=None):
    book = Workbook()
    sheet = book.active
    sheet.append(headers)
    for row in rows:
        sheet.append(row)
    if customize:
        customize(book)
    stream = BytesIO()
    book.save(stream)
    return {"filename": "pecas.xlsx", "content": base64.b64encode(stream.getvalue()).decode()}


def submit(client, data, key=None):
    return client.post("/part-imports", json=data, headers={"Idempotency-Key": key or str(uuid4())})


def test_imports_catalog_fields_preserving_text_and_initial_zero(client):
    response = submit(
        client,
        workbook_data(
            [
                [" 001-02/AB ", " Filtro ", "Filtros", "Descrição", "A-01"],
                ["002", "Pastilha", "Freios"],
            ]
        ),
    )
    assert response.status_code == 201, response.text
    assert response.json()["imported_count"] == 2
    parts = client.get("/parts").json()["items"]
    assert {part["manufacturer_code"] for part in parts} == {"001-02/AB", "002"}
    first = next(part for part in parts if part["manufacturer_code"] == "001-02/AB")
    assert first["name"] == "Filtro"
    assert first["technical_description"] == "Descrição"
    assert first["physical_location"] == "A-01"
    for part in parts:
        assert part["equivalent_codes"] == []
        assert part["photo_url"] is None
        assert part["status"] == "active"
        assert client.get(f"/parts/{part['id']}/stock-balance").json()["stock_balance"] == 0


@pytest.mark.parametrize(
    "invalid",
    [
        ["BAD", "", "Categoria"],
        ["BAD", "N" * 201, "Categoria"],
        ["BAD", "Nome", "C" * 101],
        ["C" * 101, "Nome", "Categoria"],
        ["BAD", "Nome", "Categoria", "D" * 5001],
        ["BAD", "Nome", "Categoria", None, "L" * 201],
        ["BAD", "Nome", None],
        [None, "Nome", "Categoria"],
    ],
)
def test_rejects_entire_batch_with_us01_field_errors(client, invalid):
    response = submit(client, workbook_data([["OK", "Filtro", "Filtros"], invalid]))
    assert response.status_code == 422
    issues = response.json()["detail"]["issues"]
    assert any(issue["row"] == 3 and issue["message"] for issue in issues)
    assert client.get("/parts").json()["total"] == 0


@pytest.mark.parametrize(
    "headers,rows,expected",
    [
        (["Nome", "Categoria"], [["Filtro", "Filtros"]], "Código do fabricante"),
        (HEADERS + ["Saldo"], [["A", "Filtro", "Filtros", None, None, 5]], "Saldo"),
        (HEADERS + [None], [["A", "Filtro", "Filtros", None, None, 0]], "F"),
        (HEADERS + ["Nome"], [["A", "Filtro", "Filtros", None, None, "Outro"]], "Nome"),
    ],
)
def test_reports_invalid_columns_without_importing(client, headers, rows, expected):
    response = submit(client, workbook_data(rows, headers))
    assert response.status_code == 422
    assert expected in str(response.json()["detail"]["issues"])
    assert client.get("/parts").json()["total"] == 0


def test_ignores_empty_sheets_rows_and_unknown_columns_without_data(client):
    def customize(book):
        book.create_sheet("Vazia", 0)["Z80"].number_format = "@"

    data = workbook_data(
        [["A", "Filtro", "Filtros"], [], ["B", "Pastilha", "Freios"]],
        HEADERS + ["Sem dados"],
        customize,
    )
    assert submit(client, data).json()["imported_count"] == 2


@pytest.mark.parametrize("coordinate", ["XFD20", "A200001", "XFD1048576"])
def test_ignores_empty_formatted_sheets_beyond_dimension_limits(client, coordinate):
    def customize(book):
        for index in range(2):
            book.create_sheet(f"Vazia {index}", 0)[coordinate].number_format = "@"

    data = workbook_data([["0001-AB", "Filtro", "Filtros"]], customize=customize)
    response = submit(client, data)
    assert response.status_code == 201, response.text
    assert response.json()["imported_count"] == 1
    parts = client.get("/parts").json()
    assert parts["total"] == 1
    assert parts["items"][0]["manufacturer_code"] == "0001-AB"


@pytest.mark.parametrize("value", [0, False, "=0", " "])
def test_does_not_ignore_second_sheet_with_cell_content(client, value):
    def customize(book):
        book.create_sheet("Preenchida")["A1"] = value

    response = submit(
        client, workbook_data([["0001-AB", "Filtro", "Filtros"]], customize=customize)
    )
    assert response.status_code == 422
    assert "única aba preenchida" in response.json()["detail"]["message"]
    assert client.get("/parts").json()["total"] == 0


@pytest.mark.parametrize("mode", ["empty", "two_sheets", "header_only"])
def test_requires_one_populated_sheet_with_records(client, mode):
    def customize(book):
        if mode == "empty":
            book.active.delete_rows(1, 2)
        if mode == "two_sheets":
            book.create_sheet("Outra").append(["dado"])

    rows = [] if mode == "header_only" else [["A", "Filtro", "Filtros"]]
    response = submit(client, workbook_data(rows, customize=customize))
    assert response.status_code == 422
    assert response.json()["detail"]["message"]


def test_reports_all_duplicates_and_catalog_conflicts_even_with_other_invalid_fields(client):
    existing = client.post(
        "/parts",
        json={
            "manufacturer_code": "MAIN",
            "name": "Existente",
            "category": "Categoria",
            "equivalent_codes": ["EQ"],
        },
        headers={"Idempotency-Key": str(uuid4())},
    ).json()
    response = submit(
        client,
        workbook_data(
            [
                ["OK", "Filtro", "Categoria"],
                ["MAIN", "Outra", "Categoria"],
                ["EQ", "Outra", "Categoria"],
                [" DUP ", "Primeira", "Categoria"],
                ["DUP", None, "Categoria"],
            ]
        ),
    )
    assert response.status_code == 422
    issues = response.json()["detail"]["issues"]
    assert {issue["row"] for issue in issues} == {3, 4, 5, 6}
    assert any(issue["row"] == 6 and "repetido" in issue["message"] for issue in issues)
    assert client.get("/parts").json()["total"] == 1
    assert client.get(f"/parts/{existing['id']}").json() == existing


def test_template_has_required_headers_and_text_code_column(client):
    from openpyxl import load_workbook

    response = client.get("/part-imports/template")
    assert response.status_code == 200
    assert "attachment" in response.headers["content-disposition"]
    book = load_workbook(BytesIO(response.content))
    assert list(next(book.active.values)) == HEADERS
    assert book.active.column_dimensions["A"].number_format == "@"
    assert book.active["A2"].number_format == "@"
    book.active.append(["00001", "Filtro", "Cat"])
    # Usa a primeira linha de dados, mesmo que o modelo tenha células formatadas.
    book.active["A2"] = "00001"
    book.active["B2"] = "Filtro"
    book.active["C2"] = "Cat"
    book.active.delete_rows(3, book.active.max_row)
    stream = BytesIO()
    book.save(stream)
    data = {"filename": "modelo.xlsx", "content": base64.b64encode(stream.getvalue()).decode()}
    assert submit(client, data).status_code == 201


@pytest.mark.parametrize("mode", ["retry", "different_key", "different_payload"])
def test_concurrent_imports_preserve_atomicity(client, mode):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    if not client.database_url.startswith("postgresql"):
        pytest.skip("Concorrência exige PostgreSQL local descartável.")
    barrier = Barrier(2)
    key = str(uuid4())
    data = workbook_data([["A", "Peça A", "Cat"], ["B", "Peça B", "Cat"]])

    def send(index):
        payload = (
            workbook_data([["C", "Peça C", "Cat"]])
            if mode == "different_payload" and index
            else data
        )
        attempt_key = str(uuid4()) if mode == "different_key" else key
        with TestClient(
            create_app(Settings(_env_file=None, database_url=client.database_url))
        ) as other:
            barrier.wait(timeout=10)
            return submit(other, payload, attempt_key)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, range(2)))
    expected = {"retry": [201, 201], "different_key": [201, 422], "different_payload": [201, 409]}
    assert sorted(result.status_code for result in results) == expected[mode]
    successful = next(
        result.json()["imported_count"] for result in results if result.status_code == 201
    )
    assert client.get("/parts").json()["total"] == successful


@pytest.mark.parametrize("code", [123, 1.5, True, '=TEXT(123,"00000")'])
def test_requires_text_code_cells(client, code):
    response = submit(client, workbook_data([[code, "Filtro", "Categoria"]]))
    assert response.status_code == 422
    assert any(
        issue["row"] == 2 and "texto" in issue["message"]
        for issue in response.json()["detail"]["issues"]
    )
    assert client.get("/parts").json()["total"] == 0


@pytest.mark.parametrize(
    "filename,content",
    [
        ("pecas.csv", None),
        ("pecas.xlsm", None),
        ("pecas.xlsx", "invalid base64!"),
        ("pecas.xlsx", base64.b64encode(b"not a workbook").decode()),
    ],
)
def test_rejects_incompatible_or_corrupt_file(client, filename, content):
    data = workbook_data([["A", "Filtro", "Categoria"]])
    data["filename"] = filename
    if content is not None:
        data["content"] = content
    response = submit(client, data)
    assert response.status_code == 422
    assert ".xlsx" in response.json()["detail"]["message"]


def test_retries_same_batch_without_duplicates_and_rejects_key_reuse(client):
    key = str(uuid4())
    data = workbook_data([["A", "Filtro", "Categoria"]])
    first = submit(client, data, key)
    assert first.status_code == 201
    # Nova instância da aplicação: a confirmação não depende da memória do processo.
    from fastapi.testclient import TestClient

    from app.core.config import Settings
    from app.main import create_app

    with TestClient(
        create_app(Settings(_env_file=None, database_url=client.database_url))
    ) as restarted:
        retry = submit(restarted, data, key)
        assert retry.status_code == 201
        assert retry.json() == first.json()
        other = submit(restarted, workbook_data([["B", "Outra", "Categoria"]]), key)
        assert other.status_code == 409
        assert restarted.get("/parts").json()["total"] == 1


def test_rolls_back_partial_write_and_allows_safe_retry(client, monkeypatch):
    from sqlalchemy.exc import OperationalError

    from app.repositories.parts import PartRepository

    original = PartRepository.add
    count = 0

    def fail_second(self, part):
        nonlocal count
        count += 1
        original(self, part)
        if count == 2:
            raise OperationalError("write", {}, Exception("private detail"))

    data = workbook_data([["A", "Primeira", "Cat"], ["B", "Segunda", "Cat"]])
    key = str(uuid4())
    with monkeypatch.context() as patch:
        patch.setattr(PartRepository, "add", fail_second)
        response = submit(client, data, key)
    assert response.status_code == 503
    assert "private detail" not in response.text
    assert client.get("/parts").json()["total"] == 0
    assert submit(client, data, key).status_code == 201
    assert client.get("/parts").json()["total"] == 2


def test_conflict_after_validation_rejects_batch_and_identifies_row(client, monkeypatch):
    from app.repositories.part_imports import PartImportRepository

    client.post(
        "/parts",
        json={"manufacturer_code": "B", "name": "Existente", "category": "Cat"},
        headers={"Idempotency-Key": str(uuid4())},
    )
    original = PartImportRepository.conflicts
    calls = 0

    def validation_before_competing_commit(self, codes):
        nonlocal calls
        calls += 1
        return {} if calls == 1 else original(self, codes)

    monkeypatch.setattr(PartImportRepository, "conflicts", validation_before_competing_commit)
    response = submit(client, workbook_data([["A", "Nova", "Cat"], ["B", "Outra", "Cat"]]))
    assert response.status_code == 422
    assert any(
        issue["row"] == 3 and "B" in issue["message"]
        for issue in response.json()["detail"]["issues"]
    )
    assert client.get("/parts").json()["total"] == 1


def test_rejects_excessive_expanded_workbook_before_reading_cells(client):
    from zipfile import ZIP_DEFLATED, ZipFile

    stream = BytesIO()
    with ZipFile(stream, "w", ZIP_DEFLATED) as archive:
        archive.writestr("xl/worksheets/sheet1.xml", b" " * (32 * 1024 * 1024 + 1))
    response = submit(
        client, {"filename": "grande.xlsx", "content": base64.b64encode(stream.getvalue()).decode()}
    )
    assert response.status_code == 422
    assert "limite" in response.json()["detail"]["message"]


def test_rejects_excessive_sheet_dimensions(client):
    def customize(book):
        book.active["XFD1048576"] = "longe"

    response = submit(client, workbook_data([["A", "Filtro", "Cat"]], customize=customize))
    assert response.status_code == 422
    assert "limite" in response.json()["detail"]["message"]


def test_does_not_silently_truncate_rows_when_sheet_dimensions_are_incorrect(client):
    import re
    from zipfile import ZipFile

    data = workbook_data([["A", "Primeira", "Cat"], ["B", "Segunda", "Cat"]])
    stream = BytesIO()
    with (
        ZipFile(BytesIO(base64.b64decode(data["content"]))) as source,
        ZipFile(stream, "w") as target,
    ):
        for item in source.infolist():
            content = source.read(item.filename)
            if item.filename == "xl/worksheets/sheet1.xml":
                content = re.sub(rb'<dimension ref="[^"]+"', b'<dimension ref="A1:C2"', content)
            target.writestr(item, content)
    data["content"] = base64.b64encode(stream.getvalue()).decode()
    response = submit(client, data)
    assert response.status_code == 201
    assert response.json()["imported_count"] == 2
