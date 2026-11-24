from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.part import Part, PartCode
from app.models.part_import import PartImportRequest


class PartImportRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def conflicts(self, codes: list[str]) -> dict[str, str]:
        result = {}
        for start in range(0, len(codes), 500):
            result.update(
                self.session.execute(
                    select(PartCode.code, Part.name)
                    .join(Part, Part.id == PartCode.part_id)
                    .where(PartCode.code.in_(codes[start : start + 500]))
                ).all()
            )
        return result

    def get_request(self, key: UUID) -> PartImportRequest | None:
        return self.session.get(PartImportRequest, key)

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(PartImportRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()
