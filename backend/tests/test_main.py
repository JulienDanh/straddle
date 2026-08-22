"""Smoke tests for the FastAPI app."""

from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    """The /health endpoint should return 200 with status ok."""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root() -> None:
    """The / endpoint should return 200 with a message."""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
