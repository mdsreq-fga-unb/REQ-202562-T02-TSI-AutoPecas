import hashlib
import json
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.models.vehicle_application import VehicleApplication
from app.repositories.parts import PartRepository
from app.repositories.vehicle_applications import VehicleApplicationRepository
from app.schemas.vehicle_application import (
    VehicleApplicationCreate,
    VehicleApplicationListResponse,
    VehicleApplicationResponse,
)


class VehicleApplicationService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    def create(
        self, part_id: UUID, data: VehicleApplicationCreate, key: UUID
    ) -> VehicleApplicationResponse:
        brand_key, model_key = data.brand.casefold(), data.model.casefold()
        serialized = json.dumps(
            [str(part_id), data.model_dump()], sort_keys=True, ensure_ascii=False
        )
        fingerprint = hashlib.sha256(serialized.encode()).hexdigest()
        with self.factory() as session:
            repo = VehicleApplicationRepository(session)
            try:
                with session.begin():
                    if PartRepository(session).get_for_update(part_id) is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    self._check_duplicate(repo, part_id, brand_key, model_key, data.year)
                    application = VehicleApplication(
                        part_id=part_id,
                        **data.model_dump(),
                        brand_key=brand_key,
                        model_key=model_key,
                    )
                    repo.add(application)
                    response = VehicleApplicationResponse.model_validate(application)
                    repo.remember(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    self._check_duplicate(repo, part_id, brand_key, model_key, data.year)
                raise

    def update(
        self, part_id: UUID, application_id: UUID, data: VehicleApplicationCreate, key: UUID
    ) -> VehicleApplicationResponse:
        fingerprint = self._mutation_fingerprint(
            part_id, application_id, "update", data.model_dump()
        )
        with self.factory() as session:
            repo = VehicleApplicationRepository(session)
            try:
                with session.begin():
                    if PartRepository(session).get_for_update(part_id) is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    application = repo.get(part_id, application_id)
                    if application is None:
                        raise DomainError("Aplicação não encontrada para esta peça.", 404)
                    self._check_duplicate(
                        repo,
                        part_id,
                        data.brand.casefold(),
                        data.model.casefold(),
                        data.year,
                        application_id,
                    )
                    for field, value in data.model_dump().items():
                        setattr(application, field, value)
                    application.brand_key = data.brand.casefold()
                    application.model_key = data.model.casefold()
                    repo.flush()
                    response = VehicleApplicationResponse.model_validate(application)
                    repo.remember(key, fingerprint, response.model_dump(mode="json"))
                    return response

            except IntegrityError:
                with session.begin():
                    previous = self._existing_result(repo, key, fingerprint)
                    if previous:
                        return previous
                    self._check_duplicate(
                        repo,
                        part_id,
                        data.brand.casefold(),
                        data.model.casefold(),
                        data.year,
                        application_id,
                    )
                raise

    def remove(self, part_id: UUID, application_id: UUID, key: UUID) -> VehicleApplicationResponse:
        fingerprint = self._mutation_fingerprint(part_id, application_id, "remove")
        with self.factory() as session, session.begin():
            if PartRepository(session).get_for_update(part_id) is None:
                raise DomainError("Peça não encontrada.", 404)
            repo = VehicleApplicationRepository(session)
            previous = self._existing_result(repo, key, fingerprint)
            if previous:
                return previous
            application = repo.get(part_id, application_id)
            if application is None:
                raise DomainError("Aplicação não encontrada para esta peça.", 404)
            response = VehicleApplicationResponse.model_validate(application)
            repo.remove(application)
            repo.remember(key, fingerprint, response.model_dump(mode="json"))
            return response

    def _mutation_fingerprint(
        self, part_id: UUID, application_id: UUID, operation: str, data: dict | None = None
    ) -> str:
        serialized = json.dumps(
            [operation, str(part_id), str(application_id), data],
            sort_keys=True,
            ensure_ascii=False,
        )
        return hashlib.sha256(serialized.encode()).hexdigest()

    def _existing_result(
        self, repo: VehicleApplicationRepository, key: UUID, fingerprint: str
    ) -> VehicleApplicationResponse | None:
        previous = repo.get_request(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError(
                "Esta tentativa já foi usada com outros dados, aplicação, peça ou operação.", 409
            )
        return VehicleApplicationResponse.model_validate(previous.response)

    def _check_duplicate(
        self,
        repo: VehicleApplicationRepository,
        part_id: UUID,
        brand_key: str,
        model_key: str,
        year: str,
        exclude_id: UUID | None = None,
    ) -> None:
        existing = repo.find_existing(part_id, brand_key, model_key, year)
        if existing and existing.id != exclude_id:
            raise DomainError(
                f"A aplicação {existing.brand} · {existing.model} · {existing.year} "
                "já está vinculada a esta peça.",
                409,
                existing_application=VehicleApplicationResponse.model_validate(existing).model_dump(
                    mode="json"
                ),
            )

    def list(self, part_id: UUID, offset: int, limit: int) -> VehicleApplicationListResponse:
        with self.factory() as session:
            if PartRepository(session).get(part_id) is None:
                raise DomainError("Peça não encontrada.", 404)
            items, total = VehicleApplicationRepository(session).list(part_id, offset, limit)
            return VehicleApplicationListResponse(
                items=[VehicleApplicationResponse.model_validate(item) for item in items],
                total=total,
            )
