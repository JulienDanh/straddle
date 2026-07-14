# Roadmap

> **Status legend:** ✅ done · 🔨 in progress · ⬜ not started

## Current state at a glance

| Component | Status | Where |
|-----------|--------|-------|
| **postflop_solver** (Rust + PyO3 `Solver` class) | ✅ complete | `postflop_solver/` |
| **Backend API** (FastAPI → solver) | ✅ implemented | `straddle/src/straddle/` (`routes.py`, `sessions.py`) |
| **Frontend SPA** (React + Vite) | 🔨 built, untested vs. backend | `straddle/web/` |
| **MDA platform** | ⬜ not started | — |

The frontend is built ahead of the backend. **`straddle/web/src/api.ts` is the de facto API contract** — Phase 1 implements exactly those endpoints and response shapes. The `Solver` class maps ~1:1 onto them.

---

## Phase 1: Solver API (FastAPI → postflop_solver)

Goal: expose the solver over HTTP with session management, background solve, and SSE progress. The frontend already exists and consumes this contract.

**Architecture (as built):** in-memory `dict[str, Session]` guarded by a lock (`sessions.py`). Background solve runs in a **daemon thread** (CPU-bound) updating `session.task`; `/progress` is a hand-rolled SSE stream polling that. A per-session `threading.Lock` serializes the solve thread against query/nav threads (the Rust solver isn't concurrency-safe). Re-solve is supported via memory re-allocation. See `straddle/AGENTS.md` for the non-obvious bits (chance-node card→index, replay-from-root navigation).

### 1.1 — Session management ✅
In-memory `dict[str, Solver]`. `id` = uuid4 hex.

| Endpoint | Maps to | Response |
|----------|---------|----------|
| `POST /api/solvers` | `Solver(oop_range, ip_range, board, starting_pot, effective_stack, bet_sizes, raise_sizes)` | `{ "id": "<hex>" }` |
| `GET /api/solvers/{id}` | `current_player`, `current_board`, `is_solved`, `available_actions`, node type | see "Solver state" shape below |
| `DELETE /api/solvers/{id}` | drop from dict | `204` |

### 1.2 — Solve + progress ✅
The solver's `solve()` is a single blocking call; for live progress, loop `solve_step(chunk)` and emit `exploitability()`.

| Endpoint | Maps to | Notes |
|----------|---------|-------|
| `POST /api/solvers/{id}/solve` `{iterations}` | spawns background loop calling `solve_step` in chunks until `iterations` reached | returns `202`; tracks `task = {status, exploitability}` on the session |
| `GET /api/solvers/{id}/progress` (SSE) | poll `exploitability()` while solving | emits `progress` `{exploitability}`, terminal `done`, or `error` `{detail}` |

### 1.3 — Queries ✅
All accept optional `?player=oop|ip`. Strategy only meaningful for the acting player; equity/EV/range valid for both.

| Endpoint | Maps to |
|----------|---------|
| `GET /api/solvers/{id}/strategy` | `strategy(player)` → `{hand: {action: freq}}` |
| `GET /api/solvers/{id}/equity` | `equity(player)` → `{hand: float}` |
| `GET /api/solvers/{id}/ev` | `expected_values(player)` → `{hand: float}` |
| `GET /api/solvers/{id}/range` | `range_percentages(player)` → `{hand: float}` |

### 1.4 — Navigation ✅
⚠️ **Non-trivial:** `Solver` has `play(action_str)`, `back_to_root()`, and `history() → list[int]` (action **indices**, not strings). There is no native "back one step" or "goto arbitrary step". Implement both by **replay from root**: read `history()`, slice to the target length, `back_to_root()`, then re-`play` each step. Chance nodes expect a 2-char card string; decision nodes expect an action string. Use the `_match_action` / `_int_to_card_str` helpers in `api.py` to translate indices↔strings during replay.

| Endpoint | Maps to |
|----------|---------|
| `POST /api/solvers/{id}/play` `{action}` | `play(action)` → solver state |
| `POST /api/solvers/{id}/back-to-root` | `back_to_root()` → solver state |
| `POST /api/solvers/{id}/back` | replay history minus last step |
| `POST /api/solvers/{id}/goto?step={n}` | replay history sliced to length `n` |
| `GET /api/solvers/{id}/history` | `{ "path": ["Bet(120)", "Call", "Qc", ...] }` (strings) |
| `GET /api/solvers/{id}/possible-cards` | `possible_cards()` → `{ "cards": [...] }` (chance nodes only) |

### 1.5 — Node locking ✅
| Endpoint | Maps to |
|----------|---------|
| `POST /api/solvers/{id}/lock` `{hand: {action: freq}}` | `lock_strategy(dict)` |
| `DELETE /api/solvers/{id}/lock` | `unlock_strategy()` |

### 1.6 — Save/load ✅
| Endpoint | Maps to |
|----------|---------|
| `POST /api/solvers/{id}/save` `{path}` | `save(path)` |
| `POST /api/solvers/load` `{path}` | `Solver.load(path)` → new session |

**Solver-state response shape** (returned by `GET /solver`, `POST /play`, `/back`, `/back-to-root`, `/goto`):
```json
{
  "player": "oop",
  "node_type": "decision",        // "decision" | "chance" | "terminal"
  "board": "Td9d6hQc",
  "is_solved": true,
  "available_actions": ["Check", "Bet(120)", "AllIn"],
  "task": { "status": "running", "exploitability": 0.42 }  // or null
}
```

**Deliverable:** ✅ implemented & verified (live uvicorn smoke test + `tests/test_phase1.py`). The existing frontend's contract is met end-to-end (create → solve → query → navigate → lock → save/load).

---

## Phase 2: Frontend SPA (React) — 🔨 built, needs integration

Goal: PioSolver/GTO+-style UI in the browser. Source exists in `straddle/web/`; remaining work is **integration testing against the real backend** and polish, not building from scratch.

| Step | Status | Notes |
|------|--------|-------|
| **2.1** Project setup (Vite + React + TS) | ✅ | `vite.config.ts` proxies `/api` → `:8000` |
| **2.2** Config form (ranges, board, sizes, pot/stack) | ✅ | `ConfigForm.tsx` |
| **2.3** Strategy grid (13×13, action-frequency bars) | ✅ | `HandGrid.tsx` |
| **2.4** Tree navigation (action buttons, breadcrumb, back) | ✅ | `SolverView.tsx` |
| **2.5** Equity/EV/range overlays | ✅ | view toggle in `SolverView` |
| **2.6** Node-locking UI | ✅ | lock panel in `SolverView` |
| **2.7** Solve progress chart (SSE) | 🔨 | wired in `SolverView`; untested vs. backend |
| **2.8** End-to-end test vs. real backend | ⬜ | once Phase 1 lands |

**Deliverable:** a verified working solver UI.

---

## Phase 3: MDA Platform (later) — ⬜

Goal: ingest hand histories, analyze population tendencies, auto-build exploit strategies.

| Step | What |
|------|------|
| **3.1** Hand history parser (PokerStars, GGPoker, … .txt) |
| **3.2** Storage (SQLite/Postgres for hand data) |
| **3.3** Population analysis (tendencies by street / position / bet size) |
| **3.4** Strategy building — GTO baseline + MDA data, auto-node-lock from population tendencies |

---

## Delegation notes

- **Phase 1: ✅ DONE.** Backend API is implemented in `straddle/src/straddle/` (`routes.py`, `sessions.py`) and covered by `tests/test_phase1.py`. See `straddle/AGENTS.md` "Architecture notes" for the non-obvious solver quirks (memory allocation, chance-node cards, replay navigation, daemon-thread solve).
- **Next up — Phase 2.7/2.8:** the frontend is built but untested against the now-working backend. Run both servers (`uv run uvicorn straddle.main:app --reload` on :8000, `npm run dev` in `straddle/web/` with the `/api`→:8000 proxy) and verify the full UI: create spot → solve (watch the SSE progress chart) → navigate tree → toggle strategy/equity/EV/range → lock → save/load. Fix mismatches between the frontend's assumed response shapes (in `api.ts`/`SolverView.tsx`) and the backend.
- **Phase 3:** deferred until Phase 2 is verified end-to-end.
