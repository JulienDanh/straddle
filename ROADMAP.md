# Roadmap

## Phase 1: Solver API (FastAPI → postflop_solver)

Goal: Expose the solver through HTTP so a frontend can use it.

The core challenge: the solver is **stateful** (you create it, solve it, navigate it, query it). We need session management.

| Step | What | Key endpoints |
|------|------|---------------|
| **1.1** | Session management — in-memory dict of `solver_id → Solver` instance. Start simple; add Redis/DB persistence later. | `POST /api/solvers` (create), `DELETE /api/solvers/{id}` |
| **1.2** | Solve + progress — run solve as a background task; WebSocket or SSE for live exploitability. | `POST /api/solvers/{id}/solve`, `WS /api/solvers/{id}/progress` |
| **1.3** | Queries — strategy, equity, EV, range at the current node. | `GET /api/solvers/{id}/strategy`, `/equity`, `/ev`, `/range` |
| **1.4** | Navigation — play actions, back to root, history. | `POST /api/solvers/{id}/play`, `POST /api/solvers/{id}/back-to-root` |
| **1.5** | Node locking — lock/unlock strategy at current node. | `POST /api/solvers/{id}/lock`, `DELETE /api/solvers/{id}/lock` |
| **1.6** | Save/load — persist solved trees to disk. | `POST /api/solvers/{id}/save`, `POST /api/solvers/load` |

Deliverable: A working API where you can create a spot, solve it, and query the strategy at any node.

## Phase 2: Frontend SPA (React or Svelte)

Goal: A web UI like PioSolver/GTO+ but in the browser.

| Step | What | Why |
|------|------|-----|
| **2.1** | Project setup — Vite + framework, API client, routing. | Foundation. |
| **2.2** | Solver config form — range selector (13x13 grid), board card picker, bet size input, pot/stack. | How users set up a spot. |
| **2.3** | Strategy grid — 13x13 hand matrix, color-coded by action frequency. | The core visualization every solver UI needs. |
| **2.4** | Tree navigation — action buttons, breadcrumb path, back to root. | Navigate the game tree. |
| **2.5** | Equity/EV overlay — toggle between strategy/equity/EV views in the grid. | See hand values at a glance. |
| **2.6** | Node locking UI — select hands in the grid, set frequencies, re-solve. | The exploit workflow. |
| **2.7** | Solve progress — live exploitability chart via WebSocket. | Feedback during long solves. |

Deliverable: A functional solver UI in the browser.

## Phase 3: MDA Platform (later)

Goal: Ingest hand histories, analyze population tendencies, build exploit strategies.

| Step | What |
|------|------|
| **3.1** | Hand history parser — import .txt HH files (PokerStars, GGPoker, etc.). |
| **3.2** | Storage — SQLite/Postgres for hand data. |
| **3.3** | Population analysis — aggregate tendencies by street, position, bet size. |
| **3.4** | Strategy building — combine GTO baseline with MDA data, auto-node-lock based on population tendencies. |
