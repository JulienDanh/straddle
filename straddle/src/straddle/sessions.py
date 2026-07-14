from __future__ import annotations

import threading
from dataclasses import dataclass, field
from typing import Callable

from postflop_solver import Solver

_RANKS = "23456789TJQKA"
_SUITS = "cdhs"

# ponytail: in-memory store; a dict guarded by one lock. Fine for a single-process
# dev server. Add Redis/DB if we ever need persistence or horizontal scaling.
_sessions: dict[str, Session] = {}
_lock = threading.Lock()


@dataclass
class Session:
    solver: Solver
    path: list[str] = field(default_factory=list)  # action/card strings played from root
    task: dict | None = None  # {status, exploitability}
    solved: bool = False
    error: str | None = None
    solving: bool = False
    # serializes the background solve thread against query/navigation threads;
    # the underlying Rust solver is not concurrency-safe.
    lock: threading.Lock = field(default_factory=threading.Lock)


class NotFoundError(Exception):
    pass


def create(solver: Solver) -> Session:
    # ponytail: allocate memory up front so navigation works before solving.
    # allocate_memory was removed from the public Python API; reach into the binding.
    solver._g.allocate_memory(compress=False)
    return Session(solver=solver)


def register(session: Session) -> str:
    import uuid

    sid = uuid.uuid4().hex
    with _lock:
        _sessions[sid] = session
    return sid


def get(sid: str) -> Session:
    with _lock:
        session = _sessions.get(sid)
    if session is None:
        raise NotFoundError(sid)
    return session


def delete(sid: str) -> None:
    with _lock:
        _sessions.pop(sid, None)


def locked(session: Session, fn: Callable, *args):
    """Run a solver call under the session lock (call from a worker thread)."""
    with session.lock:
        return fn(*args)


def _card_to_int(card: str) -> int:
    return _RANKS.index(card[0].upper()) * 4 + _SUITS.index(card[1].lower())


def play_action(session: Session, action: str) -> None:
    """Play an action string, handling chance nodes (2-char card -> bit index)."""
    solver = session.solver
    # Chance nodes: available_actions() returns ['Chance(N)'], and play(card_str)
    # can't match; convert the card to its bit index and play that directly.
    if solver.is_chance_node():
        solver.play(_card_to_int(action))
    else:
        solver.play(action)
    session.path.append(action)


def back_to_root(session: Session) -> None:
    session.solver.back_to_root()
    session.path = []


def _replay(session: Session, path: list[str]) -> None:
    session.solver.back_to_root()
    session.path = []
    for action in path:
        play_action(session, action)


def back_one_step(session: Session) -> None:
    _replay(session, session.path[:-1])


def goto_step(session: Session, step: int) -> None:
    _replay(session, session.path[:step])


def node_type(solver: Solver) -> str:
    if solver.is_terminal_node():
        return "terminal"
    if solver.is_chance_node():
        return "chance"
    return "decision"


def to_state(session: Session) -> dict:
    solver = session.solver
    ntype = node_type(solver)
    return {
        "player": solver.current_player(),
        "node_type": ntype,
        "board": solver.current_board(),
        "is_solved": session.solved,
        "available_actions": [] if ntype != "decision" else solver.available_actions(),
        "task": session.task,
    }


def _run_chunk(solver: Solver, start: int, count: int) -> None:
    for i in range(start, start + count):
        solver.solve_step(i)


def run_solve(session: Session, iterations: int) -> None:
    """Solve in the calling (background) thread, updating session.task for SSE."""
    solver = session.solver
    session.solving = True
    session.error = None
    session.task = {"status": "running", "exploitability": 0.0}
    chunk = max(1, iterations // 20)
    try:
        with session.lock:
            # re-allocate so re-solving an already-solved game is supported
            # (solve_step panics with "Game is already solved" otherwise)
            solver._g.allocate_memory(compress=False)
            for start in range(0, iterations, chunk):
                count = min(chunk, iterations - start)
                _run_chunk(solver, start, count)
                session.task = {
                    "status": "running",
                    "exploitability": solver.exploitability(),
                }
            solver.finalize()
            session.task = {"status": "done", "exploitability": solver.exploitability()}
            session.solved = True
    # pyo3 panics (PanicException) are BaseException, not Exception
    except BaseException as e:  # noqa: BLE001 - background thread must always reset
        session.error = f"{type(e).__name__}: {e}"
        session.task = {"status": "error", "exploitability": 0.0}
    finally:
        session.solving = False
