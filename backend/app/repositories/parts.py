from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.part import Part, PartCode, PartCreationRequest, PartUpdateRequest


class PartRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, part_id: UUID) -> Part | None:
        return self.session.get(Part, part_id)

    def find_conflict(
        self, codes: list[str], exclude_id: UUID | None = None
    ) -> tuple[str, Part] | None:
        row = self.session.execute(
            select(PartCode.code, Part)
            .join(Part, Part.id == PartCode.part_id)
            .where(PartCode.code.in_(codes), Part.id != exclude_id)
            .order_by(PartCode.code)
            .limit(1)
        ).first()
        return (row[0], row[1]) if row else None

    def get_request(self, key: UUID) -> PartCreationRequest | None:
        return self.session.get(PartCreationRequest, key)

    def add(self, part: Part) -> None:
        self.session.add(part)
        self.session.flush()

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(PartCreationRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()

    def get_for_update(self, part_id: UUID) -> Part | None:
        return self.session.scalar(select(Part).where(Part.id == part_id).with_for_update())

    def list(self, offset: int, limit: int) -> tuple[list[Part], int]:
        total = self.session.scalar(select(func.count()).select_from(Part))
        parts = self.session.scalars(
            select(Part).order_by(Part.created_at, Part.id).offset(offset).limit(limit)
        ).all()
        return list(parts), total

    def get_update_request(self, key: UUID) -> PartUpdateRequest | None:
        return self.session.get(PartUpdateRequest, key)

    def remember_update(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(PartUpdateRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()

    def flush(self) -> None:
        self.session.flush()
