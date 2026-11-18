"""Idempotência da importação cadastral (US02, Refs #28)."""

import sqlalchemy as sa
from alembic import op

revision = "0006_part_imports"
down_revision = "0005_stock_entries"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "part_import_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("part_import_requests")
