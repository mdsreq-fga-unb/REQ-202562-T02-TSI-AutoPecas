"""Reenvio idempotente da edição de peças. Refs #31."""

import sqlalchemy as sa
from alembic import op

revision = "0002_part_updates"
down_revision = "0001_parts"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "part_update_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("part_update_requests")
