from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.part import Part, PartCode, PartCreationRequest


class PartRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, part_id: UUID) -> Part | None:
        return self.session.get(Part, part_id)

    def find_conflict(self, codes: list[str]) -> tuple[str, Part] | None:
        row = self.session.execute(
            select(PartCode.code, Part)
            .join(Part, Part.id == PartCode.part_id)
            .where(PartCode.code.in_(codes))
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
