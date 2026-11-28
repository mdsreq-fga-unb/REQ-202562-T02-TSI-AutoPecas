"""Ajustes de inventário (US10, Refs #35)."""

import sqlalchemy as sa
from alembic import op

revision = "0008_stock_adjustments"
down_revision = "0007_stock_exits"
branch_labels = None
depends_on = None

OLD_QUANTITY = "quantity > 0"
NEW_QUANTITY = (
    "(movement_type = 'adjustment' AND quantity <> 0)"
    " OR (movement_type <> 'adjustment' AND quantity > 0)"
)
ENTRY_COST = "movement_type <> 'entry' OR unit_cost IS NOT NULL"
EXIT_REASON = "movement_type <> 'exit' OR (reason IS NOT NULL AND length(trim(reason)) > 0)"
ADJUSTMENT_REASON = (
    "movement_type <> 'adjustment' OR (reason IS NOT NULL AND length(trim(reason)) > 0)"
)


def movements(*, with_adjustment: bool) -> sa.Table:
    """Declara stock_movements explicitamente para o modo batch do Alembic."""
    columns = [
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("part_id", sa.Uuid(), sa.ForeignKey("parts.id"), nullable=False),
        sa.Column("movement_type", sa.String(10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("entry_date", sa.Date(), nullable=False),
        sa.Column("unit_cost", sa.Numeric(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reason", sa.String(120), nullable=True),
    ]
    constraints = [
        sa.CheckConstraint(
            NEW_QUANTITY if with_adjustment else OLD_QUANTITY,
            name="ck_stock_quantity",
        ),
        sa.CheckConstraint(ENTRY_COST, name="ck_stock_entry_cost"),
        sa.CheckConstraint(EXIT_REASON, name="ck_stock_exit_reason"),
    ]
    if with_adjustment:
        constraints.append(sa.CheckConstraint(ADJUSTMENT_REASON, name="ck_stock_adjustment_reason"))
    return sa.Table(
        "stock_movements",
        sa.MetaData(),
        *columns,
        *constraints,
        sa.Index("ix_stock_movements_part_id", "part_id"),
    )


def upgrade() -> None:
    op.create_table(
        "stock_adjustment_requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    with op.batch_alter_table(
        "stock_movements", copy_from=movements(with_adjustment=False)
    ) as batch:
        batch.drop_constraint("ck_stock_quantity", type_="check")
        batch.create_check_constraint("ck_stock_quantity", NEW_QUANTITY)
        batch.create_check_constraint("ck_stock_adjustment_reason", ADJUSTMENT_REASON)


def downgrade() -> None:
    # Ajustes negativos são irrepresentáveis em 0007, onde quantity > 0 é obrigatório;
    # o downgrade descarta os ajustes sem recalcular saldos e serve só para desenvolvimento.
    op.execute("DELETE FROM stock_movements WHERE movement_type = 'adjustment'")
    with op.batch_alter_table(
        "stock_movements", copy_from=movements(with_adjustment=True)
    ) as batch:
        batch.drop_constraint("ck_stock_adjustment_reason", type_="check")
        batch.drop_constraint("ck_stock_quantity", type_="check")
        batch.create_check_constraint("ck_stock_quantity", OLD_QUANTITY)
    op.drop_table("stock_adjustment_requests")
