from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response

from app.core.errors import DomainError
from app.schemas.part import PartCreate, PartResponse
from app.services.parts import PartService

router = APIRouter(prefix="/parts", tags=["Peças"])


def get_part_service(request: Request) -> PartService:
    factory = request.app.state.session_factory
    if factory is None:
        raise DomainError("O cadastro está indisponível. Tente novamente mais tarde.", 503)
    return PartService(factory)


Service = Annotated[PartService, Depends(get_part_service)]


@router.post("", response_model=PartResponse, status_code=201)
def create_part(
    data: PartCreate, service: Service, idempotency_key: Annotated[UUID, Header()]
) -> PartResponse:
    return service.create(data, idempotency_key)


@router.get("/{part_id}", response_model=PartResponse)
def get_part(part_id: UUID, service: Service) -> PartResponse:
    return service.get(part_id)


@router.get("/{part_id}/photo", response_class=Response)
def get_photo(part_id: UUID, service: Service) -> Response:
    photo, media_type = service.get_photo(part_id)
    return Response(
        photo,
        media_type=media_type,
        headers={"X-Content-Type-Options": "nosniff", "Cache-Control": "private, max-age=3600"},
    )
