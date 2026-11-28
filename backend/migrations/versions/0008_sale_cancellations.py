"""Cancelamento de vendas (US16, Refs #39)."""

import sqlalchemy as sa
from alembic import op

revision = "0008_sale_cancellations"
down_revision = "0007_sales"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "sale_cancellation_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("sale_cancellation_requests")
