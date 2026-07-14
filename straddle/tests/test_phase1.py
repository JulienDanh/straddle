import time

from fastapi.testclient import TestClient

from straddle.main import app

CONFIG = {
    "oop_range": "66+,A8s+",
    "ip_range": "QQ-22,ATo+",
    "board": "Td9d6h",
    "starting_pot": 200,
    "effective_stack": 900,
    "bet_sizes": "60%, e, a",
    "raise_sizes": "2.5x",
}


def _make(client: TestClient) -> str:
    r = client.post("/api/solvers", json=CONFIG)
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _wait_solved(client: TestClient, sid: str, timeout: float = 60.0) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        task = client.get(f"/api/solvers/{sid}").json().get("task")
        if task and task["status"] in ("done", "error"):
            assert task["status"] != "error", task
            return task
        time.sleep(0.2)
    raise AssertionError(f"solve did not finish in {timeout}s")


def test_create_returns_id():
    client = TestClient(app)
    sid = _make(client)
    assert isinstance(sid, str) and len(sid) > 0
    client.delete(f"/api/solvers/{sid}")


def test_solver_state_shape():
    client = TestClient(app)
    sid = _make(client)
    r = client.get(f"/api/solvers/{sid}")
    assert r.status_code == 200
    state = r.json()
    assert state["node_type"] == "decision"
    assert state["player"] in ("oop", "ip")
    # solver returns board in canonical order; compare card sets, not string equality
    assert set(state["board"][i : i + 2] for i in range(0, len(state["board"]), 2)) == {
        "Td",
        "9d",
        "6h",
    }
    assert state["is_solved"] is False
    assert len(state["available_actions"]) > 0
    assert state["task"] is None


def test_solve_then_queries():
    client = TestClient(app)
    sid = _make(client)
    r = client.post(f"/api/solvers/{sid}/solve", json={"iterations": 100})
    assert r.status_code == 200
    task = _wait_solved(client, sid)
    assert task["exploitability"] >= 0

    state = client.get(f"/api/solvers/{sid}").json()
    assert state["is_solved"] is True

    strat = client.get(f"/api/solvers/{sid}/strategy").json()
    assert isinstance(strat, dict) and len(strat) > 0
    hand, freqs = next(iter(strat.items()))
    assert len(hand) == 4
    assert isinstance(freqs, dict) and len(freqs) > 0

    for ep in ("equity", "ev", "range"):
        data = client.get(f"/api/solvers/{sid}/{ep}").json()
        assert isinstance(data, dict) and len(data) > 0, ep


def test_navigation_play_back_root():
    client = TestClient(app)
    sid = _make(client)
    actions = client.get(f"/api/solvers/{sid}").json()["available_actions"]

    r = client.post(f"/api/solvers/{sid}/play", json={"action": actions[0]})
    assert r.status_code == 200, r.text
    assert client.get(f"/api/solvers/{sid}/history").json()["path"] == [actions[0]]

    r = client.post(f"/api/solvers/{sid}/back")
    assert r.status_code == 200
    assert client.get(f"/api/solvers/{sid}/history").json()["path"] == []

    r = client.post(f"/api/solvers/{sid}/back-to-root")
    assert r.status_code == 200


def test_navigation_goto_and_chance():
    client = TestClient(app)
    sid = _make(client)
    # play Check, Check -> chance node (turn deal)
    for _ in range(2):
        a = client.get(f"/api/solvers/{sid}").json()["available_actions"]
        if not a:
            break
        client.post(f"/api/solvers/{sid}/play", json={"action": a[0]})

    state = client.get(f"/api/solvers/{sid}").json()
    if state["node_type"] == "chance":
        cards = client.get(f"/api/solvers/{sid}/possible-cards").json()["cards"]
        assert len(cards) > 0
        r = client.post(f"/api/solvers/{sid}/play", json={"action": cards[0]})
        assert r.status_code == 200, r.text
        new_state = client.get(f"/api/solvers/{sid}").json()
        assert new_state["node_type"] != "chance" or len(new_state["board"]) >= 4

    # goto step 1, then back to step 0
    client.post(f"/api/solvers/{sid}/goto?step=1")
    assert len(client.get(f"/api/solvers/{sid}/history").json()["path"]) == 1
    client.post(f"/api/solvers/{sid}/goto?step=0")
    assert client.get(f"/api/solvers/{sid}/history").json()["path"] == []


def test_progress_emits_done_after_solve():
    client = TestClient(app)
    sid = _make(client)
    client.post(f"/api/solvers/{sid}/solve", json={"iterations": 100})
    _wait_solved(client, sid)
    with client.stream("GET", f"/api/solvers/{sid}/progress") as resp:
        assert resp.status_code == 200
        text = b"".join(resp.iter_bytes()).decode()
    assert "event: done" in text


def test_unknown_solver_404():
    client = TestClient(app)
    assert client.get("/api/solvers/nonexistent").status_code == 404
