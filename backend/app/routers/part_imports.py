from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response

from app.core.errors import DomainError
from app.schemas.part_import import PartImportCreate, PartImportResponse
from app.services.part_imports import PartImportService, create_template

router = APIRouter(prefix="/part-imports", tags=["Importação de peças"])


@router.get("/template")
def download_template() -> Response:
    return Response(
        create_template(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="modelo-pecas.xlsx"',
            "X-Content-Type-Options": "nosniff",
        },
    )


def get_import_service(request: Request) -> PartImportService:
    factory = request.app.state.session_factory
    if factory is None:
        raise DomainError("O catálogo está indisponível. Tente novamente mais tarde.", 503)
    return PartImportService(factory)


@router.post("", response_model=PartImportResponse, status_code=201)
def import_parts(
    data: PartImportCreate,
    service: Annotated[PartImportService, Depends(get_import_service)],
    idempotency_key: Annotated[UUID, Header()],
) -> PartImportResponse:
    return service.create(data, idempotency_key)
