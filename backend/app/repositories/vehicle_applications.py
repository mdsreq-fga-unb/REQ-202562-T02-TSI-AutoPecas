from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.vehicle_application import VehicleApplication, VehicleApplicationRequest


class VehicleApplicationRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, application: VehicleApplication) -> None:
        self.session.add(application)
        self.session.flush()

    def get(self, part_id: UUID, application_id: UUID) -> VehicleApplication | None:
        return self.session.scalar(
            select(VehicleApplication).where(
                VehicleApplication.id == application_id,
                VehicleApplication.part_id == part_id,
            )
        )

    def remove(self, application: VehicleApplication) -> None:
        self.session.delete(application)
        self.session.flush()

    def flush(self) -> None:
        self.session.flush()

    def get_request(self, key: UUID) -> VehicleApplicationRequest | None:
        return self.session.get(VehicleApplicationRequest, key)

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(
            VehicleApplicationRequest(id=key, fingerprint=fingerprint, response=response)
        )
        self.session.flush()

    def list(self, part_id: UUID, offset: int, limit: int) -> tuple[list[VehicleApplication], int]:
        query = select(VehicleApplication).where(VehicleApplication.part_id == part_id)
        total = self.session.scalar(select(func.count()).select_from(query.subquery()))
        items = self.session.scalars(
            query.order_by(VehicleApplication.created_at, VehicleApplication.id)
            .offset(offset)
            .limit(limit)
        ).all()
        return list(items), total

    def find_existing(
        self, part_id: UUID, brand_key: str, model_key: str, year: str
    ) -> VehicleApplication | None:
        return self.session.scalar(
            select(VehicleApplication).where(
                VehicleApplication.part_id == part_id,
                VehicleApplication.brand_key == brand_key,
                VehicleApplication.model_key == model_key,
                VehicleApplication.year == year,
            )
        )
