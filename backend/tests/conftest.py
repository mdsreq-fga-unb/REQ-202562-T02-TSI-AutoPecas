import os
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.schema import CreateSchema, DropSchema

from app.core.config import Settings
from app.main import create_app


@pytest.fixture
def client(tmp_path, monkeypatch, request):
    database_url = os.environ.get("US03_TEST_DATABASE_URL")
    admin = None
    schema = f"us03_{uuid4().hex}"
    if database_url:
        url = make_url(database_url)
        if url.database != "tsi_us03_test" or url.host not in {"localhost", "127.0.0.1"}:
            pytest.fail("Use somente o PostgreSQL local descartável tsi_us03_test.")
        admin = create_engine(url)
        with admin.begin() as connection:
            connection.execute(CreateSchema(schema))
        url = url.update_query_dict({"options": f"-csearch_path={schema}"})
        database_url = url.render_as_string(hide_password=False)
    else:
        database_url = f"sqlite+pysqlite:///{tmp_path / 'applications.db'}"
    monkeypatch.setenv("DATABASE_URL", database_url)
    try:
        command.upgrade(Config("alembic.ini"), getattr(request, "param", "head"))
        with TestClient(create_app(Settings(_env_file=None, database_url=database_url))) as client:
            client.database_url = database_url
            yield client
    finally:
        if admin:
            with admin.begin() as connection:
                connection.execute(DropSchema(schema, cascade=True))
            admin.dispose()
