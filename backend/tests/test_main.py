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


def test_list_systems() -> None:
    """The /systems endpoint lists all loaded systems with a rule count."""
    client = TestClient(app)
    response = client.get("/systems")
    assert response.status_code == 200
    systems = response.json()
    assert len(systems) >= 2
    assert all("name" in s and "rule_count" in s for s in systems)


def test_get_system_returns_rules() -> None:
    """The /systems/{name} endpoint returns the full rule list for a system."""
    client = TestClient(app)
    systems = client.get("/systems").json()
    target = systems[0]["name"]
    response = client.get(f"/systems/{target}")
    assert response.status_code == 200
    detail = response.json()
    assert detail["name"] == target
    assert "description" in detail
    assert isinstance(detail["rules"], list)
    assert len(detail["rules"]) == systems[0]["rule_count"]
    rule = detail["rules"][0]
    assert "name" in rule and "conditions" in rule and "action" in rule


def test_get_system_unknown_returns_404() -> None:
    """An unknown system name returns 404."""
    client = TestClient(app)
    response = client.get("/systems/Does Not Exist")
    assert response.status_code == 404
