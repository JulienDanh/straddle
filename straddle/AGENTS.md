# straddle — agent guide

## Build & run

```sh
cd straddle
uv sync
uv run uvicorn straddle.main:app --reload
```

## Test

```sh
uv run pytest
```

## Lint / format

```sh
uv run ruff check .
uv run ruff format .
```

## Layout

- `src/straddle/main.py` — FastAPI app entry point (mounts the solver router).
- `src/straddle/routes.py` — `/api/solvers` APIRouter; all HTTP endpoints.
- `src/straddle/sessions.py` — in-memory solver session store, navigation replay, background solve.
- `tests/` — pytest (`test_main.py` health, `test_phase1.py` API suite).

## Architecture notes

- `postflop-solver` is a path dependency (`../postflop_solver`, maturin-built). `uv sync` compiles the Rust `.so` into this venv (~30s on first sync).
- Solver memory is allocated at session creation (via `solver._g.allocate_memory`) so navigation works before solving. The public Python API dropped `allocate_memory`, hence reaching into the binding.
- Chance nodes: `available_actions()` returns `['Chance(N)']`; `play(cardString)` can't match, so `sessions.play_action` converts 2-char cards to bit indices.
- Back/goto are implemented by **replay from root** (`back_to_root` then re-play the stored string path) — the solver has no native step-back.
- Solving runs in a **daemon thread** (CPU-bound) and updates `session.task`; `/progress` is a hand-rolled SSE stream polling that. A per-session `threading.Lock` serializes the solve thread against query/nav threads (the Rust solver is not concurrency-safe).
- Re-solving is supported: `run_solve` re-allocates memory first (avoids the "Game is already solved" panic).
