# Architecture — straddle coaching app

> Engineering blueprint for the modular-monolith coaching app. Pairs with
> [`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md) (what we build & why) and
> [`SPIN_TO_MTT_ROADMAP.md`](./SPIN_TO_MTT_ROADMAP.md) (what the student learns).

---

## 1. Shape: modular monolith

One FastAPI app (`straddle`). Each coaching pillar is a **self-contained Python
package** under `src/straddle/`. One agent works one package at a time without
touching the others — that gives us the agent-isolation we wanted from
"microservices" without N processes, inter-service HTTP, or duplicated
boilerplate. Any module can be lifted into its own process later; the package
boundary *is* the future service boundary.

We do **not** restructure the existing solver code (ponytail: minimal diff).
It stays flat; new pillars arrive as sibling packages.

---

## 2. Module layout

```
straddle/src/straddle/
  main.py              # app factory; mounts every pillar router
  routes.py            # /api/solvers  (existing — leave as-is)
  sessions.py          # solver session store (existing — leave as-is)

  charts/              # pillar: chart/range management        [FIRST]
    __init__.py        # exports router
    models.py          # pydantic Chart
    router.py          # APIRouter(prefix="/api/charts")
    store.py           # JSON-file CRUD
  pushfold/            # pillar: push/fold trainer (Spin endgame)
  ranges/              # pillar: range memorization drill
  guided/              # pillar: guided solver spots
  icm/                 # pillar: ICM / final-table trainer
  common/              # shared helpers — create ONLY when 2+ pillars need the same one

straddle/data/         # persisted reference data (charts.json, pushfold/*.json) — git-tracked
straddle/tests/        # test_<pillar>.py per pillar
straddle/web/src/train/  # one React component set per pillar, under /train
```

---

## 3. Module contract (the pattern every pillar follows)

Each package exposes exactly:
- `router` — an `APIRouter(prefix="/api/<pillar>", tags=["<pillar>"])`
- `models.py` — pydantic request/response models
- `store.py` — data access (if persistent). No HTTP imports here.
- `__init__.py` — `from .router import router` (and re-export public models).

`main.py` wires it:
```python
from .charts import router as charts_router
app.include_router(charts_router)
```

**Rules for delegated agents:**
1. Stay inside your package. Don't edit other pillars or the solver.
2. Follow `routes.py` / `sessions.py` conventions (pydantic models,
   `HTTPException` 404 helper, `from __future__ import annotations`).
3. Never invent shared infra preemptively. If two pillars need the same helper,
   stop and flag it — `common/` is created on demand, never speculatively.
4. One `tests/test_<pillar>.py` per pillar. `uv run pytest` must stay green.
5. `uv run ruff check . && uv run ruff format .` before PR.

---

## 4. Data strategy

| Data kind             | Storage                         | When to upgrade            |
|-----------------------|---------------------------------|----------------------------|
| Reference (charts, ranges, Nash tables) | JSON in `straddle/data/` (human-editable, git-tracked) | SQLite when query needs outgrow JSON |
| Drill scores / progress | `localStorage` (frontend)     | backend store if cross-device needed |
| Solver sessions       | in-memory dict (existing)       | unchanged                  |

JSON-first is deliberate: it's hand-editable, reviewable in PRs, and needs zero
ops. We pay the SQLite tax only when something actually needs querying.

---

## 5. Frontend

One new `/train` route in the React app. Each pillar gets a component set under
`straddle/web/src/train/<pillar>/`. Reuse the existing `HandGrid` (13×13) for
anything range-shaped. The frontend is downstream of the API contract; build
the backend module first, then its UI.

---

## 6. Delegation & model routing *(token-cost policy)*

Two execution tiers. **Default to the cheaper one; escalate only when forced.**

| Tier | Model | Subagent type | Cost | Use for |
|------|-------|---------------|------|---------|
| **Mistral** | `mistral/mistral-large-latest` (unlimited tokens) | `coder` | free | the bulk of all work |
| **GLM-5.2** | `openrouter/z-ai/glm-5.2` | primary agent / `general` | expensive | genuine reasoning only |

### Routing rules

**→ Mistral (`coder`)** — anything with a clear spec and a known expected output:
- pydantic models, JSON/file stores, CRUD endpoints
- tests written from a spec
- frontend components following existing React conventions
- drill/scoring logic once the data exists
- mechanical refactors, renames, scaffolding

**→ GLM-5.2 (primary)** — only when the task needs thought, not just typing:
- architecture / design decisions (what SHOULD be built)
- research + judgment (e.g. which Nash-data source is correct)
- novel math/algorithm correctness (ICM engine design)
- cross-module debugging
- code review of complex or risky changes

**Rule of thumb:** if you can describe the change in 1–2 sentences with a clear
expected result → Mistral. If you have to research, decide, or reason about
correctness → GLM-5.2. **When unsure, try Mistral first** — it's free; escalate
only if it stalls or the output is wrong.

Every GitHub issue carries a `Delegated to:` line and an `agent/mistral` or
`agent/glm-5.2` label so the board is filterable.

---

## 7. Issue backlog

MVP = **Phase A (learning shell)** + **Phase B (push/fold)**. Created issues
below; Phase D/E are documented for later creation.

| Issue | Pillar | Delegated to | Depends on | Status |
|-------|--------|--------------|------------|--------|
| [#25](../issues/25) CHARTS-1 model + store + package scaffold | charts | `coder` (Mistral) | — | pending |
| [#26](../issues/26) CHARTS-2 CRUD endpoints + tests | charts | `coder` (Mistral) | #25 | pending |
| [#27](../issues/27) SHELL-1 `/train` route + RoadmapShell + progress | progress | `coder` (Mistral) | — | pending |
| [#28](../issues/28) PUSHFOLD-DATA Nash push/fold tables | pushfold | **GLM-5.2** (research+decision) | — | pending |
| [#29](../issues/29) PUSHFOLD-1 push/fold trainer + drill | pushfold | `coder` (Mistral) | #28 | pending |
| GUIDED-1 guided solver spots *(doc backlog)* | guided | `coder` (Mistral) | — | later |
| ICM-DESIGN ICM engine design *(doc backlog)* | icm | **GLM-5.2** | — | later |
| ICM-1 ICM equity calc *(doc backlog)* | icm | `coder` (Mistral) | ICM-DESIGN | later |

---

## 8. Workflow (per `AGENTS.md`)

Each issue → feature branch → PR with `Closes #N`. Agents may merge after lint
(`ruff`) + tests (`pytest`) pass and no conflicts. Delete the branch after merge.
Pull latest `main` before branching.
