from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError


def test_status_migration_preserves_existing_parts_and_enforces_valid_values(tmp_path, monkeypatch):
    url = f"sqlite+pysqlite:///{tmp_path / 'legacy.db'}"
    monkeypatch.setenv("DATABASE_URL", url)
    config = Config("alembic.ini")
    command.upgrade(config, "0002_part_updates")
    engine = create_engine(url)
    part_id = uuid4().hex
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "INSERT INTO parts "
                    "(id, manufacturer_code, name, category, created_at, updated_at) "
                    "VALUES (:id, 'OLD-1', 'Peça existente', 'Filtros', :date, :date)"
                ),
                {"id": part_id, "date": "2026-11-12 12:00:00"},
            )
            connection.execute(
                text(
                    "INSERT INTO part_codes (id, part_id, code, created_at, updated_at) "
                    "VALUES (:id, :part_id, 'OLD-1', :date, :date)"
                ),
                {"id": uuid4().hex, "part_id": part_id, "date": "2026-11-12 12:00:00"},
            )
        command.upgrade(config, "head")
        with engine.connect() as connection:
            part = connection.execute(text("SELECT * FROM parts")).mappings().one()
            assert part["status"] == "active"
            assert part["id"] == part_id
            assert part["name"] == "Peça existente"
            assert part["updated_at"] == "2026-11-12 12:00:00"
            code = connection.execute(text("SELECT part_id, code FROM part_codes")).one()
            assert tuple(code) == (part_id, "OLD-1")
        with pytest.raises(IntegrityError), engine.begin() as connection:
            connection.execute(text("UPDATE parts SET status = 'deleted'"))
        command.check(config)
        command.downgrade(config, "0002_part_updates")
        with engine.connect() as connection:
            assert (
                connection.execute(text("SELECT name FROM parts")).scalar_one() == "Peça existente"
            )
    finally:
        engine.dispose()
