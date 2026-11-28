"""Registro de vendas (US15, Refs #38)."""

import sqlalchemy as sa
from alembic import op

revision = "0007_sales"
down_revision = "0007_stock_exits"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "sales",
        sa.CheckConstraint(
            "channel IN ('counter', 'mercado_livre', 'direct_contact')",
            name="ck_sales_channel",
        ),
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("channel", sa.String(20), nullable=False),
        sa.Column("status", sa.String(10), nullable=False, server_default="registered"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "sale_items",
        sa.CheckConstraint("quantity > 0", name="ck_sale_items_quantity"),
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("sale_id", sa.Uuid(), sa.ForeignKey("sales.id"), nullable=False),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_sale_items_sale_id", "sale_items", ["sale_id"])
    op.create_index("ix_sale_items_part_id", "sale_items", ["part_id"])
    op.create_table(
        "sale_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("sale_requests")
    op.drop_index("ix_sale_items_part_id", "sale_items")
    op.drop_index("ix_sale_items_sale_id", "sale_items")
    op.drop_table("sale_items")
    op.drop_table("sales")
