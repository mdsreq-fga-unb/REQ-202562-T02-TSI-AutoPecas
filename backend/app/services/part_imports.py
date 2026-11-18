import base64
import binascii
import hashlib
from collections import defaultdict
from io import BytesIO
from uuid import UUID
from xml.etree.ElementTree import ParseError
from zipfile import BadZipFile, ZipFile

from defusedxml.common import DefusedXmlException
from defusedxml.ElementTree import iterparse
from openpyxl import Workbook, load_workbook
from openpyxl.cell.read_only import EMPTY_CELL
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter
from openpyxl.utils.exceptions import InvalidFileException
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.models.part import Part, PartCode
from app.repositories.part_imports import PartImportRepository
from app.repositories.parts import PartRepository
from app.schemas.part import PartCreate
from app.schemas.part_import import PartImportCreate, PartImportResponse

IMPORT_COLUMNS = {
    "Código do fabricante": "manufacturer_code",
    "Nome": "name",
    "Categoria": "category",
    "Descrição técnica": "technical_description",
    "Localização física": "physical_location",
}


def create_template() -> bytes:
    book = Workbook()
    sheet = book.active
    sheet.title = "Peças"
    sheet.append(list(IMPORT_COLUMNS))
    sheet.freeze_panes = "A2"
    sheet.column_dimensions["A"].number_format = "@"
    for column in range(1, 6):
        sheet.column_dimensions[get_column_letter(column)].width = 28
        sheet.cell(1, column).font = Font(bold=True)
    for row in range(2, 1002):
        sheet.cell(row, 1).number_format = "@"
    stream = BytesIO()
    book.save(stream)
    book.close()
    return stream.getvalue()


def _worksheet_has_content(sheet) -> bool:
    namespace = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    # A fonte XML do leitor openpyxl evita expandir milhões de células apenas formatadas.
    # O acesso interno fica isolado aqui e coberto pelos testes de importação.
    with sheet._get_source() as source:
        for _, element in iterparse(source, forbid_dtd=True):
            if element.tag in {f"{namespace}is", f"{namespace}f"} or (
                element.tag == f"{namespace}v" and element.text is not None
            ):
                return True
            element.clear()
    return False


def parse_workbook(data: PartImportCreate) -> tuple:
    if not data.filename.lower().endswith(".xlsx"):
        raise DomainError("Formato incompatível. Selecione uma planilha .xlsx.")
    book = None
    try:
        content = base64.b64decode(data.content, validate=True)
        if len(content) > 2 * 1024 * 1024:
            raise DomainError("O arquivo excede o limite de 2 MiB por importação.")
        with ZipFile(BytesIO(content)) as archive:
            if sum(item.file_size for item in archive.infolist()) > 32 * 1024 * 1024:
                raise DomainError("A planilha excede o limite de 32 MiB após descompactação.")
            if any(name.endswith("vbaProject.bin") for name in archive.namelist()):
                raise DomainError("Formato incompatível. Use uma planilha .xlsx sem macros.")
        book = load_workbook(BytesIO(content), read_only=True, keep_links=False)
        if (
            book.mime_type
            != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"
        ):
            raise DomainError("Formato incompatível. Use uma planilha .xlsx sem macros.")
        sheets = []
        cell_count = 0
        for sheet in book.worksheets:
            if not _worksheet_has_content(sheet):
                continue
            if (sheet.max_row or 0) * (sheet.max_column or 0) > 200_000:
                raise DomainError(
                    "A planilha excede o limite de 200.000 células. "
                    "Remova linhas e colunas excedentes."
                )
            rows = []
            sheet.reset_dimensions()
            for row in sheet.iter_rows():
                cell_count += max(1, len(row))
                if cell_count > 200_000:
                    raise DomainError("A planilha excede o limite de 200.000 células.")
                rows.append(row)
            if any(any(cell.value is not None for cell in row) for row in rows):
                sheets.append(rows)
        if len(sheets) != 1:
            raise DomainError("Use uma única aba preenchida; abas totalmente vazias são ignoradas.")
        rows = sheets[0]
        width = max(len(row) for row in rows)
        if width * len(rows) > 200_000:
            raise DomainError("A planilha excede o limite de 200.000 células.")
        rows = [(*row, *((EMPTY_CELL,) * (width - len(row)))) for row in rows]
        headers = [
            cell.value.strip() if isinstance(cell.value, str) else cell.value for cell in rows[0]
        ]
        records, issues = [], []
        codes = defaultdict(list)
        for label in list(IMPORT_COLUMNS)[:3]:
            if label not in headers:
                issues.append({"row": 1, "message": f"Cabeçalho obrigatório ausente: {label}."})
        for index, header in enumerate(headers):
            if header in IMPORT_COLUMNS and headers.count(header) > 1:
                issues.append({"row": 1, "message": f"Cabeçalho repetido: {header}."})
            if header not in IMPORT_COLUMNS:
                for number, row in enumerate(rows[1:], 2):
                    if row[index].value is not None:
                        label = header or get_column_letter(index + 1)
                        issues.append(
                            {"row": number, "message": f"Coluna não prevista com dados: {label}."}
                        )
        labels = {field: label for label, field in IMPORT_COLUMNS.items()}
        for number, row in enumerate(rows[1:], 2):
            if all(cell.value is None for cell in row):
                continue
            values = {
                IMPORT_COLUMNS[header]: cell.value
                for header, cell in zip(headers, row, strict=True)
                if header in IMPORT_COLUMNS
            }
            code = values.get("manufacturer_code")
            for header, cell in zip(headers, row, strict=True):
                if header in IMPORT_COLUMNS and cell.data_type == "f":
                    issues.append({"row": number, "message": f"{header}: use texto, sem fórmulas."})
                elif (
                    header == "Código do fabricante"
                    and cell.value is not None
                    and cell.data_type not in {"s", "inlineStr"}
                ):
                    issues.append(
                        {
                            "row": number,
                            "message": "Código do fabricante: use texto; não use números.",
                        }
                    )
            if isinstance(code, str) and code.strip():
                codes[code.strip()].append(number)
            try:
                record = PartCreate.model_validate(values)
                records.append((number, record))
            except ValidationError as error:
                for failure in error.errors():
                    label = labels[failure["loc"][0]]
                    issues.append(
                        {
                            "row": number,
                            "message": f"{label}: confira o preenchimento e o limite do campo.",
                        }
                    )
        for code, numbers in codes.items():
            if len(numbers) > 1:
                issues.extend(
                    {"row": number, "message": f'Código repetido no arquivo: "{code}".'}
                    for number in numbers
                )
        if not records and not issues:
            raise DomainError("A planilha não contém registros para importar.")
        return records, codes, issues
    except (
        binascii.Error,
        BadZipFile,
        InvalidFileException,
        ParseError,
        DefusedXmlException,
        KeyError,
        ValueError,
        TypeError,
        OSError,
    ) as error:
        raise DomainError(
            "Arquivo inválido ou incompatível. Use uma planilha .xlsx válida."
        ) from error
    finally:
        if book is not None:
            book.close()


class PartImportService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    def create(self, data: PartImportCreate, key: UUID) -> PartImportResponse:
        fingerprint = hashlib.sha256(data.model_dump_json().encode()).hexdigest()
        with self.factory() as session, session.begin():
            previous = self._existing_result(PartImportRepository(session), key, fingerprint)
            if previous:
                return previous
        rows, codes, issues = parse_workbook(data)
        with self.factory() as session:
            imports = PartImportRepository(session)
            try:
                with session.begin():
                    previous = self._existing_result(imports, key, fingerprint)
                    if previous:
                        return previous
                    response = PartImportResponse(imported_count=len(rows))
                    # A chave única serializa reenvios; confirmação e peças têm o mesmo commit.
                    imports.remember(key, fingerprint, response.model_dump())
                    self._check_conflicts(imports, codes, issues)
                    repo = PartRepository(session)
                    for _, record in rows:
                        repo.add(
                            Part(
                                manufacturer_code=record.manufacturer_code,
                                name=record.name,
                                category=record.category,
                                technical_description=record.technical_description or None,
                                physical_location=record.physical_location or None,
                                codes=[PartCode(code=record.manufacturer_code)],
                            )
                        )
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing_result(imports, key, fingerprint)
                    if previous:
                        return previous
                    self._check_conflicts(imports, codes, issues)
                raise

    def _check_conflicts(self, repo: PartImportRepository, codes: dict, issues: list) -> None:
        errors = list(issues)
        for code, name in repo.conflicts(list(codes)).items():
            errors.extend(
                {"row": number, "message": f'O código "{code}" já pertence à peça "{name}".'}
                for number in codes[code]
            )
        if errors:
            raise DomainError(
                "Lote rejeitado. Nenhuma peça foi cadastrada.",
                issues=sorted(errors, key=lambda issue: issue["row"]),
            )

    def _existing_result(
        self, repo: PartImportRepository, key: UUID, fingerprint: str
    ) -> PartImportResponse | None:
        previous = repo.get_request(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa de importação já foi usada com outros dados.", 409)
        return PartImportResponse.model_validate(previous.response)
