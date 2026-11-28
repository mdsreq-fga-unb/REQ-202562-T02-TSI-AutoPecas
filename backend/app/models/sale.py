from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import JSON, CheckConstraint, ForeignKey, Numeric, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.part import Base, Timestamps


class Sale(Timestamps, Base):
    __tablename__ = "sales"
    __table_args__ = (
        CheckConstraint(
            "channel IN ('counter', 'mercado_livre', 'direct_contact')",
            name="ck_sales_channel",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    channel: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(
        String(10), default="registered", server_default="registered"
    )
    items: Mapped[list["SaleItem"]] = relationship(
        order_by="SaleItem.position", cascade="all, delete-orphan", lazy="selectin"
    )


class SaleItem(Timestamps, Base):
    __tablename__ = "sale_items"
    __table_args__ = (CheckConstraint("quantity > 0", name="ck_sale_items_quantity"),)

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    sale_id: Mapped[UUID] = mapped_column(ForeignKey("sales.id"), index=True)
    part_id: Mapped[UUID] = mapped_column(ForeignKey("parts.id"), index=True)
    position: Mapped[int]
    quantity: Mapped[int]
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))


class SaleRequest(Timestamps, Base):
    __tablename__ = "sale_requests"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)


class SaleCancellationRequest(Timestamps, Base):
    __tablename__ = "sale_cancellation_requests"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict] = mapped_column(JSON)
