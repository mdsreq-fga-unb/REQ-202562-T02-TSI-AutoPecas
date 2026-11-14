"""Status ativo/inativo no cadastro de peças. Refs #32."""

import sqlalchemy as sa
from alembic import op

revision = "0003_part_status"
down_revision = "0002_part_updates"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("parts") as batch:
        batch.add_column(sa.Column("status", sa.String(8), nullable=False, server_default="active"))
        batch.create_check_constraint("ck_parts_status", "status IN ('active', 'inactive')")


def downgrade() -> None:
    with op.batch_alter_table("parts") as batch:
        batch.drop_constraint("ck_parts_status", type_="check")
        batch.drop_column("status")
