import hashlib
import json
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.models.part import Part, PartCode, utc_now
from app.repositories.parts import PartRepository
from app.schemas.part import PartCreate, PartListResponse, PartResponse, PartUpdate
from app.services.photos import validate_photo


def present(part: Part) -> PartResponse:
    return PartResponse(
        id=part.id,
        manufacturer_code=part.manufacturer_code,
        name=part.name,
        category=part.category,
        status=part.status,
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

    def _check_codes(
        self, repo: PartRepository, codes: list[str], exclude_id: UUID | None = None
    ) -> None:
        conflict = (
            repo.find_conflict(codes, exclude_id) if exclude_id else repo.find_conflict(codes)
        )
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

    def list(self, offset: int, limit: int) -> PartListResponse:
        with self.factory() as session:
            parts, total = PartRepository(session).list(offset, limit)
            return PartListResponse(items=[present(part) for part in parts], total=total)

    def _existing_update(
        self, repo: PartRepository, key: UUID, fingerprint: str
    ) -> PartResponse | None:
        previous = repo.get_update_request(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa de edição já foi usada com outros dados.", 409)
        return PartResponse.model_validate(previous.response)

    def update(self, part_id: UUID, data: PartUpdate, key: UUID) -> PartResponse:
        changes = data.model_dump(exclude_unset=True)
        serialized = json.dumps([str(part_id), changes], sort_keys=True, ensure_ascii=False)
        fingerprint = hashlib.sha256(serialized.encode()).hexdigest()
        with self.factory() as session:
            repo = PartRepository(session)
            try:
                with session.begin():
                    part = repo.get_for_update(part_id)
                    if part is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing_update(repo, key, fingerprint)
                    if previous is not None:
                        return previous
                    self._apply_update(repo, part, changes)
                    repo.flush()
                    response = present(part)
                    repo.remember_update(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing_update(repo, key, fingerprint)
                    if previous is not None:
                        return previous
                    if "equivalent_codes" in changes:
                        self._check_codes(repo, changes["equivalent_codes"], part_id)
                raise

    def _apply_update(self, repo: PartRepository, part: Part, changes: dict) -> None:
        part.updated_at = utc_now()
        if "equivalent_codes" in changes:
            codes = changes["equivalent_codes"]
            if part.manufacturer_code in codes:
                raise DomainError(
                    "Não repita o código principal nos equivalentes.",
                    fields={"equivalent_codes": "Não repita o código principal nos equivalentes."},
                )
            self._check_codes(repo, codes, part.id)
            desired = {part.manufacturer_code, *codes}
            current = {code.code for code in part.codes}
            part.codes[:] = [code for code in part.codes if code.code in desired]
            part.codes.extend(PartCode(code=code) for code in sorted(desired - current))
        if "photo_data" in changes:
            part.photo, part.photo_media_type = validate_photo(changes["photo_data"])
        for field in ("name", "category", "physical_location", "technical_description", "status"):
            if field in changes:
                setattr(part, field, changes[field] or None)
