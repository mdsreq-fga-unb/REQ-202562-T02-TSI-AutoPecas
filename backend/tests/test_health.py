from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


def client() -> TestClient:
    return TestClient(create_app(Settings(_env_file=None, cors_origins=["https://loja.example"])))


def test_health_returns_application_status():
    response = client().get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_documents_health_response():
    schema = client().get("/openapi.json").json()
    assert "200" in schema["paths"]["/health"]["get"]["responses"]


def test_cors_accepts_configured_frontend_origin():
    response = client().options(
        "/health",
        headers={
            "Origin": "https://loja.example",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "https://loja.example"


def test_cors_does_not_authorize_unconfigured_origin():
    response = client().options(
        "/health",
        headers={
            "Origin": "https://outro.example",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
