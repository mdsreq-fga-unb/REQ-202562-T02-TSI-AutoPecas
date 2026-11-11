"""Cadastro de peças, códigos únicos e reenvio idempotente. Refs #27."""

import sqlalchemy as sa
from alembic import op

revision = "0001_parts"
down_revision = None
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "parts",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("manufacturer_code", sa.String(100), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("technical_description", sa.Text()),
        sa.Column("physical_location", sa.String(200)),
        sa.Column("photo", sa.LargeBinary()),
        sa.Column("photo_media_type", sa.String(30)),
        *timestamps(),
    )
    op.create_table(
        "part_codes",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("code", sa.String(100), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("code", name="uq_part_codes_code"),
    )
    op.create_index("ix_part_codes_part_id", "part_codes", ["part_id"])
    op.create_table(
        "part_creation_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        *timestamps(),
    )


def downgrade() -> None:
    op.drop_table("part_creation_requests")
    op.drop_index("ix_part_codes_part_id", "part_codes")
    op.drop_table("part_codes")
    op.drop_table("parts")
