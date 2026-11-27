"""Saídas manuais de estoque (US09, Refs #34)."""

import sqlalchemy as sa
from alembic import op

revision = "0007_stock_exits"
down_revision = "0006_part_imports"
branch_labels = None
depends_on = None

ENTRY_COST = "movement_type <> 'entry' OR unit_cost IS NOT NULL"
EXIT_REASON = "movement_type <> 'exit' OR (reason IS NOT NULL AND length(trim(reason)) > 0)"


def movements(*, reason: bool, optional_cost: bool) -> sa.Table:
    """Declara stock_movements para o modo batch.

    O SQLAlchemy não reflete constraints CHECK do SQLite, então o modo batch
    derrubaria `ck_stock_quantity` ao recriar a tabela. Reafirmar colunas,
    índice e constraints aqui preserva a invariante da US08.
    """
    columns = [
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("movement_type", sa.String(10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("entry_date", sa.Date(), nullable=False),
        sa.Column("unit_cost", sa.Numeric(), nullable=optional_cost),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    ]
    constraints = [sa.CheckConstraint("quantity > 0", name="ck_stock_quantity")]
    if reason:
        columns.append(sa.Column("reason", sa.String(120), nullable=True))
        constraints.append(sa.CheckConstraint(ENTRY_COST, name="ck_stock_entry_cost"))
        constraints.append(sa.CheckConstraint(EXIT_REASON, name="ck_stock_exit_reason"))
    return sa.Table(
        "stock_movements",
        sa.MetaData(),
        *columns,
        *constraints,
        sa.Index("ix_stock_movements_part_id", "part_id"),
    )


def upgrade() -> None:
    op.create_table(
        "stock_exit_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    with op.batch_alter_table(
        "stock_movements", copy_from=movements(reason=False, optional_cost=False)
    ) as batch:
        batch.add_column(sa.Column("reason", sa.String(120), nullable=True))
        batch.alter_column("unit_cost", existing_type=sa.Numeric(), nullable=True)
        batch.create_check_constraint("ck_stock_entry_cost", ENTRY_COST)
        batch.create_check_constraint("ck_stock_exit_reason", EXIT_REASON)


def downgrade() -> None:
    # Saídas são irrepresentáveis em 0006, onde unit_cost volta a ser obrigatório;
    # o downgrade as descarta sem recalcular saldos e serve só para desenvolvimento.
    op.execute("DELETE FROM stock_movements WHERE movement_type = 'exit'")
    with op.batch_alter_table(
        "stock_movements", copy_from=movements(reason=True, optional_cost=True)
    ) as batch:
        batch.drop_constraint("ck_stock_exit_reason", type_="check")
        batch.drop_constraint("ck_stock_entry_cost", type_="check")
        batch.alter_column("unit_cost", existing_type=sa.Numeric(), nullable=False)
        batch.drop_column("reason")
    op.drop_table("stock_exit_requests")
