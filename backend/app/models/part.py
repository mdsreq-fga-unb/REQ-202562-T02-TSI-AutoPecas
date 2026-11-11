from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import JSON, DateTime, ForeignKey, LargeBinary, String, Text, Uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def utc_now() -> datetime:
    return datetime.now(UTC)


class Timestamps:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )


class Part(Timestamps, Base):
    __tablename__ = "parts"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    manufacturer_code: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    technical_description: Mapped[str | None] = mapped_column(Text)
    physical_location: Mapped[str | None] = mapped_column(String(200))
    photo: Mapped[bytes | None] = mapped_column(LargeBinary, deferred=True)
    photo_media_type: Mapped[str | None] = mapped_column(String(30))
    codes: Mapped[list["PartCode"]] = relationship(cascade="all, delete-orphan", lazy="selectin")


class PartCode(Timestamps, Base):
    __tablename__ = "part_codes"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    part_id: Mapped[UUID] = mapped_column(ForeignKey("parts.id"), index=True)
    code: Mapped[str] = mapped_column(String(100), unique=True)


class PartCreationRequest(Timestamps, Base):
    __tablename__ = "part_creation_requests"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)
