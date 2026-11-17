"""Entradas de estoque (US08, Refs #33)."""

import sqlalchemy as sa
from alembic import op

revision = "0005_stock_entries"
down_revision = "0004_vehicle_applications"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "stock_entry_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.add_column(
        "parts", sa.Column("stock_balance", sa.Integer(), nullable=False, server_default="0")
    )
    op.create_table(
        "stock_movements",
        sa.CheckConstraint("quantity > 0", name="ck_stock_quantity"),
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("movement_type", sa.String(10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("entry_date", sa.Date(), nullable=False),
        sa.Column("unit_cost", sa.Numeric(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_stock_movements_part_id", "stock_movements", ["part_id"])


def downgrade() -> None:
    op.drop_table("stock_entry_requests")
    op.drop_column("parts", "stock_balance")
    op.drop_index("ix_stock_movements_part_id", "stock_movements")
    op.drop_table("stock_movements")
