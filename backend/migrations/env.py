from alembic import context
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.pool import NullPool

from app.core.config import Settings
from app.models.part import Base

settings = Settings()
if not settings.database_url:
    raise RuntimeError("Configure DATABASE_URL antes de executar as migrações.")
url = make_url(settings.database_url.get_secret_value())
if url.drivername in {"postgres", "postgresql"}:
    url = url.set(drivername="postgresql+psycopg")

if context.is_offline_mode():
    context.configure(url=url, target_metadata=Base.metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()
else:
    with create_engine(url, poolclass=NullPool).connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata)
        with context.begin_transaction():
            context.run_migrations()
