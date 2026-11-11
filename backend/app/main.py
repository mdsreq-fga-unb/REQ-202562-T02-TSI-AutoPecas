from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import Settings
from app.core.database import create_session_factory
from app.core.errors import DomainError
from app.routers.health import router as health_router
from app.routers.parts import router as parts_router


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        try:
            yield
        finally:
            if application.state.session_factory:
                application.state.session_factory.kw["bind"].dispose()

    app = FastAPI(title="TSI Peças API", version="0.1.0", lifespan=lifespan)
    app.state.session_factory = (
        create_session_factory(settings.database_url.get_secret_value())
        if settings.database_url
        else None
    )

    @app.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        fields = {}
        for error in exc.errors():
            name = str(error["loc"][1]) if len(error["loc"]) > 1 else "form"
            fields[name] = "Confira o preenchimento e o limite deste campo."
        return JSONResponse(
            status_code=422,
            content={
                "detail": {
                    "message": "Confira os campos obrigatórios, os limites e os códigos repetidos.",
                    "fields": fields,
                }
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_error_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={
                "detail": {
                    "message": (
                        "Não foi possível confirmar o cadastro. "
                        "Tente novamente com os mesmos dados."
                    )
                }
            },
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Idempotency-Key"],
    )
    app.include_router(health_router)
    app.include_router(parts_router)
    return app


app = create_app()
