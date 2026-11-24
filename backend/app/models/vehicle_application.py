from uuid import UUID, uuid4

from sqlalchemy import JSON, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.models.part import Base, Timestamps


class VehicleApplication(Timestamps, Base):
    __tablename__ = "vehicle_applications"
    __table_args__ = (
        UniqueConstraint(
            "part_id", "brand_key", "model_key", "year", name="uq_vehicle_application"
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    part_id: Mapped[UUID] = mapped_column(ForeignKey("parts.id"), index=True)
    brand: Mapped[str] = mapped_column(String(100))
    model: Mapped[str] = mapped_column(String(200))
    year: Mapped[str] = mapped_column(String(4))
    brand_key: Mapped[str] = mapped_column(String(300))
    model_key: Mapped[str] = mapped_column(String(600))


class VehicleApplicationRequest(Timestamps, Base):
    __tablename__ = "vehicle_application_requests"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)
