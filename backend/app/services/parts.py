import hashlib
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.models.part import Part, PartCode
from app.repositories.parts import PartRepository
from app.schemas.part import PartCreate, PartResponse
from app.services.photos import validate_photo


def present(part: Part) -> PartResponse:
    return PartResponse(
        id=part.id,
        manufacturer_code=part.manufacturer_code,
        name=part.name,
        category=part.category,
        equivalent_codes=sorted(
            code.code for code in part.codes if code.code != part.manufacturer_code
        ),
        technical_description=part.technical_description,
        physical_location=part.physical_location,
        photo_url=f"/parts/{part.id}/photo" if part.photo_media_type else None,
        created_at=part.created_at,
        updated_at=part.updated_at,
    )


class PartService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    def _existing_result(
        self, repo: PartRepository, key: UUID, fingerprint: str
    ) -> PartResponse | None:
        previous = repo.get_request(key)
        if not previous:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa de cadastro já foi usada com outros dados.", 409)
        return PartResponse.model_validate(previous.response)

    def _check_codes(self, repo: PartRepository, codes: list[str]) -> None:
        conflict = repo.find_conflict(codes)
        if conflict:
            code, part = conflict
            raise DomainError(
                f'O código "{code}" já pertence à peça "{part.name}" ({part.manufacturer_code}).',
                409,
                existing_part={
                    "id": str(part.id),
                    "name": part.name,
                    "manufacturer_code": part.manufacturer_code,
                },
            )

    def create(self, data: PartCreate, key: UUID) -> PartResponse:
        fingerprint = hashlib.sha256(data.model_dump_json().encode()).hexdigest()
        codes = [data.manufacturer_code, *data.equivalent_codes]
        photo, media_type = validate_photo(data.photo_data)
        with self.factory() as session:
            repo = PartRepository(session)
            try:
                with session.begin():
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    self._check_codes(repo, codes)
                    part = Part(
                        manufacturer_code=data.manufacturer_code,
                        name=data.name,
                        category=data.category,
                        technical_description=data.technical_description or None,
                        physical_location=data.physical_location or None,
                        photo=photo,
                        photo_media_type=media_type,
                        codes=[PartCode(code=code) for code in codes],
                    )
                    repo.add(part)
                    response = present(part)
                    repo.remember(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                # A restrição do banco resolve também a disputa entre requisições concorrentes.
                with session.begin():
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    self._check_codes(repo, codes)
                raise

    def get(self, part_id: UUID) -> PartResponse:
        with self.factory() as session:
            part = PartRepository(session).get(part_id)
            if not part:
                raise DomainError("Peça não encontrada.", 404)
            return present(part)

    def get_photo(self, part_id: UUID) -> tuple[bytes, str]:
        with self.factory() as session:
            part = PartRepository(session).get(part_id)
            if not part or not part.photo or not part.photo_media_type:
                raise DomainError("Foto não encontrada.", 404)
            return part.photo, part.photo_media_type
