from __future__ import annotations

import asyncio
import json
import threading

from fastapi import APIRouter, HTTPException, Request
from postflop_solver import Solver
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from . import sessions
from .sessions import NotFoundError, Session

router = APIRouter(prefix="/api/solvers", tags=["solvers"])


class CreateSolverRequest(BaseModel):
    oop_range: str
    ip_range: str
    board: str
    starting_pot: int
    effective_stack: int
    bet_sizes: str = ""
    raise_sizes: str = ""


class SolveRequest(BaseModel):
    iterations: int = 1000


class PlayRequest(BaseModel):
    action: str


class LockRequest(BaseModel):
    strategy: dict[str, dict[str, float]]


class SaveRequest(BaseModel):
    path: str


class LoadRequest(BaseModel):
    path: str


def _get(sid: str) -> Session:
    try:
        return sessions.get(sid)
    except NotFoundError:
        raise HTTPException(status_code=404, detail=f"solver {sid} not found")


@router.post("", status_code=201)
async def create_solver(req: CreateSolverRequest) -> dict:
    solver = Solver(
        oop_range=req.oop_range,
        ip_range=req.ip_range,
        board=req.board,
        starting_pot=req.starting_pot,
        effective_stack=req.effective_stack,
        bet_sizes=req.bet_sizes,
        raise_sizes=req.raise_sizes,
    )
    session = sessions.create(solver)
    sid = sessions.register(session)
    return {"id": sid}


@router.get("/{sid}")
async def get_solver(sid: str) -> dict:
    return sessions.to_state(_get(sid))


@router.delete("/{sid}", status_code=204)
async def delete_solver(sid: str) -> None:
    sessions.delete(sid)


@router.post("/{sid}/solve")
@router.app.state.limiter.limit("10/minute")
async def solve(request: Request, sid: str, req: SolveRequest) -> dict:
    session = _get(sid)
    threading.Thread(target=sessions.run_solve, args=(session, req.iterations), daemon=True).start()
    return {"status": "solving"}


@router.get("/{sid}/progress")
async def progress(sid: str) -> StreamingResponse:
    session = _get(sid)

    async def event_stream():
        while session.solving:
            if session.error:
                yield _sse("error", {"detail": session.error})
                return
            yield _sse("progress", session.task or {"exploitability": 0.0})
            await asyncio.sleep(0.3)
        task = session.task or {"status": "done", "exploitability": 0.0}
        if session.error or task.get("status") == "error":
            yield _sse("error", {"detail": session.error})
            return
        yield _sse("done", task)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/{sid}/strategy")
async def get_strategy(sid: str, player: str | None = None) -> dict:
    session = _get(sid)
    return await asyncio.to_thread(sessions.locked, session, session.solver.strategy, player)


@router.get("/{sid}/equity")
async def get_equity(sid: str, player: str | None = None) -> dict:
    session = _get(sid)
    return await asyncio.to_thread(sessions.locked, session, session.solver.equity, player)


@router.get("/{sid}/ev")
async def get_ev(sid: str, player: str | None = None) -> dict:
    session = _get(sid)
    return await asyncio.to_thread(sessions.locked, session, session.solver.expected_values, player)


@router.get("/{sid}/range")
async def get_range(sid: str, player: str | None = None) -> dict:
    session = _get(sid)
    return await asyncio.to_thread(
        sessions.locked, session, session.solver.range_percentages, player
    )


@router.post("/{sid}/play")
async def play(sid: str, req: PlayRequest) -> dict:
    session = _get(sid)
    try:
        await asyncio.to_thread(sessions.locked, session, sessions.play_action, session, req.action)
    except (ValueError, IndexError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    return sessions.to_state(session)


@router.post("/{sid}/back-to-root")
async def back_to_root(sid: str) -> dict:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, sessions.back_to_root, session)
    return sessions.to_state(session)


@router.post("/{sid}/back")
async def back(sid: str) -> dict:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, sessions.back_one_step, session)
    return sessions.to_state(session)


@router.post("/{sid}/goto")
async def goto(sid: str, step: int = 0) -> dict:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, sessions.goto_step, session, step)
    return sessions.to_state(session)


@router.get("/{sid}/history")
async def history(sid: str) -> dict:
    return {"path": list(_get(sid).path)}


@router.get("/{sid}/possible-cards")
async def possible_cards(sid: str) -> dict:
    session = _get(sid)

    def _cards():
        return session.solver.possible_cards() if session.solver.is_chance_node() else []

    cards = await asyncio.to_thread(sessions.locked, session, _cards)
    return {"cards": cards}


@router.post("/{sid}/lock")
async def lock(sid: str, req: LockRequest) -> dict:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, session.solver.lock_strategy, req.strategy)
    return {"status": "locked"}


@router.delete("/{sid}/lock", status_code=204)
async def unlock(sid: str) -> None:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, session.solver.unlock_strategy)


@router.post("/{sid}/save")
async def save(sid: str, req: SaveRequest) -> dict:
    session = _get(sid)
    await asyncio.to_thread(sessions.locked, session, session.solver.save, req.path)
    return {"status": "saved", "path": req.path}


@router.post("/load", status_code=201)
async def load(req: LoadRequest) -> dict:
    solver = Solver.load(req.path)
    session = sessions.create(solver)
    session.solved = True
    sid = sessions.register(session)
    return {"id": sid}


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"
