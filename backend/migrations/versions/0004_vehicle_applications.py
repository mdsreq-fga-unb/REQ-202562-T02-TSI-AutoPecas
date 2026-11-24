"""Associações de veículos às peças (US03)."""

import sqlalchemy as sa
from alembic import op

revision = "0004_vehicle_applications"
down_revision = "0003_part_status"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "vehicle_applications",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("brand", sa.String(100), nullable=False),
        sa.Column("model", sa.String(200), nullable=False),
        sa.Column("year", sa.String(4), nullable=False),
        sa.Column("brand_key", sa.String(300), nullable=False),
        sa.Column("model_key", sa.String(600), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint(
            "part_id", "brand_key", "model_key", "year", name="uq_vehicle_application"
        ),
    )
    op.create_index("ix_vehicle_applications_part_id", "vehicle_applications", ["part_id"])
    op.create_table(
        "vehicle_application_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("vehicle_application_requests")
    op.drop_index("ix_vehicle_applications_part_id", "vehicle_applications")
    op.drop_table("vehicle_applications")
