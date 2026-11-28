from datetime import date
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import JSON, CheckConstraint, Date, ForeignKey, Numeric, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.models.part import Base, Timestamps


class StockMovement(Timestamps, Base):
    __tablename__ = "stock_movements"
    # As checagens condicionais preservam, por tipo de movimento, as invariantes
    # de quantidade, custo de entrada e justificativa/motivo.
    __table_args__ = (
        CheckConstraint(
            "(movement_type = 'adjustment' AND quantity <> 0)"
            " OR (movement_type <> 'adjustment' AND quantity > 0)",
            name="ck_stock_quantity",
        ),
        CheckConstraint(
            "movement_type <> 'entry' OR unit_cost IS NOT NULL",
            name="ck_stock_entry_cost",
        ),
        CheckConstraint(
            "movement_type <> 'exit' OR (reason IS NOT NULL AND length(trim(reason)) > 0)",
            name="ck_stock_exit_reason",
        ),
        CheckConstraint(
            "movement_type <> 'adjustment' OR (reason IS NOT NULL AND length(trim(reason)) > 0)",
            name="ck_stock_adjustment_reason",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    part_id: Mapped[UUID] = mapped_column(ForeignKey("parts.id"), index=True)
    movement_type: Mapped[str] = mapped_column(String(10), default="entry")
    quantity: Mapped[int]
    # Mantida como entry_date por compatibilidade com a US08; saídas e ajustes
    # expõem exit_date e adjustment_date, e o serviço faz o mapeamento.
    entry_date: Mapped[date] = mapped_column(Date)
    unit_cost: Mapped[Decimal | None] = mapped_column(Numeric, nullable=True)
    reason: Mapped[str | None] = mapped_column(String(120), nullable=True)


class StockEntryRequest(Timestamps, Base):
    __tablename__ = "stock_entry_requests"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)


class StockExitRequest(Timestamps, Base):
    __tablename__ = "stock_exit_requests"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)


class StockAdjustmentRequest(Timestamps, Base):
    __tablename__ = "stock_adjustment_requests"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)
