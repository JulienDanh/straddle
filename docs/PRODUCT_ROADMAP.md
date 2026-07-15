# Product Roadmap — The Coaching App

> A personal, guided poker coach inside the **straddle** web app: interactive
> drills + the GTO solver + progress tracking, sequenced to take a player from
> rusty returner → Spin & Go crusher → MTT regular.
>
- Student curriculum: [`SPIN_TO_MTT_ROADMAP.md`](./SPIN_TO_MTT_ROADMAP.md)
- Engineering status of the solver/app: [`../ROADMAP.md`](../ROADMAP.md)

---

## 1. Product vision

**One sentence:** a local-first coaching app that turns the study curriculum
into *interactive drills*, so practice isn't reading charts — it's reps with
instant feedback and tracked mastery.

**For:** one user (personal tool). No auth, no billing, no multi-tenant.
Progress lives locally first; we harden to SQLite only if it earns it.

**Why it exists:** the curriculum doc says *what* to study; this product makes
you actually *do* the reps and shows you where you're weak. The solver already
exists for postflop study — we wrap the *whole* journey (preflop → endgame →
postflop → ICM) into one coached experience.

---

## 2. Product principles

1. **Teaching-first.** Every feature ties to a curriculum phase. No feature
   ships without a line saying *which study goal it serves*.
2. **Reuse before build.** The solver API, the 13×13 `HandGrid`, the
   FastAPI/React stack already exist. Build on them, don't fork.
3. **Lazy then deep.** Ship the smallest useful version of each pillar; deepen
   only after using it.
4. **Local-first, no auth.** `localStorage` now. A single-user SQLite file if
   we outgrow it. Never build login for one user.
5. **Data is a first-class dependency.** Several pillars (Nash push/fold
   tables, preflop ranges) need *sourced or generated* data before any UI
   helps. Plan the data, not just the screens.

---

## 3. The five pillars

| # | Pillar | Serves curriculum | Core build lever | New scope? |
|---|--------|-------------------|------------------|------------|
| 1 | **Progress tracking** | whole journey | roadmap UI + local progress | small |
| 2 | **Push/fold trainer** | Spin endgame (Phase 2) | Nash shove/call data + drill UI | needs data |
| 3 | **Range memorization** | preflop (Phase 1–2) | spaced-repetition + 13×13 grid | needs data |
| 4 | **Guided solver spots** | postflop (Phase 4+) | solver API + curated scenes | reuses solver |
| 5 | **ICM / FT trainer** | MTT late game (Phase 4–5) | ICM equity engine | **new engine** |

---

## 4. Architecture fit (builds on what exists)

```
straddle/web/   (React + Vite)
  └─ new: /train section
       ├─ RoadmapShell      (pillar 1 — progress, checkmarks, streaks)
       ├─ PushFoldTrainer   (pillar 2)
       ├─ RangeDrill        (pillar 3 — reuses HandGrid)
       ├─ GuidedSpots       (pillar 4 — reuses solver views)
       └─ IcmTrainer        (pillar 5)

straddle/src/straddle/  (FastAPI)
  └─ new: routes/train.py
       ├─ /train/progress        (GET/POST local progress)
       ├─ /train/push-fold       (serve Nash tables, score a rep)
       ├─ /train/ranges          (serve preflop range data)
       ├─ /train/guided-spot     (curated solver scene metadata)
       └─ /train/icm             (ICM equity — Phase E)

postflop_solver/   (unchanged — pillar 4 calls existing API)
```

**Progress storage:** `localStorage` keyed by feature. One JSON blob per user.
Promote to SQLite (`straddle.db`) only when a pillar needs query/history.

**Spaced repetition:** SM-2 algorithm. ~30 lines. No library.

---

## 5. Phased delivery

### Phase A — Learning shell + progress tracking
*The backbone. Ships the "teaching roadmap" feel before any drill exists.*
- Add `/train` route + `RoadmapShell` mirroring the curriculum phases.
- Checkable milestones, per-skill mastery level (0–5), daily streak counter.
- `localStorage` persistence; a simple dashboard ("you're here, do this next").
- **Exit:** open the app, see your journey, check a thing off.

### Phase B — Push/fold trainer *(first real tool)*
*Spin endgame. Highest ROI and matches study Phase 2.*
- **Data first:** generate/source Nash push/fold tables (3-max + HU) by
  position × effective stack (8–25bb). Options: (a) run a preflop solver, (b)
  curate published charts, (c) compute via a small equity+ICCM model. Decide in
  the phase-A issue.
- Drill loop: show position + stack + hand → user picks shove/call/fold →
  instant correctness vs Nash + explanation.
- Mistake log, accuracy %, "weakest stack" report feeding back to progress.
- **Exit:** grindable daily drill with scored reps.

### Phase C — Range memorization drills
*Preflop baseline ranges, spaced-repetition.*
- **Data:** RFI, 3-bet, vs-3-bet, BB-defense ranges per position/stack-depth.
- SM-2 scheduling: ranges you miss come back sooner.
- Reuse `HandGrid` (13×13) for visual answer input — drag/click to build range.
- **Exit:** memorize one full range set to mastery.

### Phase D — Guided solver spots
*Postflop study, leverages the solver you already have.*
- Curated scenes: `{name, phase, board, oop/ip ranges, bet sizes, explanation}`
  tied to curriculum (e.g. "BTN vs BB, T98ss — c-bet sizing").
- "Reveal" button loads the spot into the existing solver flow and shows
  strategy/equity/EV with coaching notes.
- No new solver work — this is *content + wiring*.
- **Exit:** walk through 5 curated postflop spots end to end.

### Phase E — ICM / final-table trainer
*MTT late game. Biggest new scope — engine decision required.*
- **Build/buy fork:** ICM equity isn't in `postflop_solver`. Either (a) add an
  ICM module (ICM model + FT hand-range solver), or (b) integrate an external
  tool. Recommend starting with the pure ICM equity calc (chip stacks → $EV),
  which is small; full FT range-solving is a later sub-phase.
- Trainer: present a FT spot (stacks + hand) → decide call/fold/shove vs ICM
  $EV, not raw equity.
- **Exit:** run 10 FT spots through an ICM lens.

---

## 6. MVP (the lazy first slice)

**Phase A + Phase B**, end to end:
- The roadmap shell with progress tracking (the *teaching roadmap*).
- One working drill — push/fold — wired into progress.

This alone delivers the promise ("a teaching roadmap with a tool"), proves the
architecture, and is immediately useful for study. Everything else deepens it.

---

## 7. Risks & open decisions

| Risk / decision | Status | Default |
|-----------------|--------|---------|
| **Preflop data sourcing** (Nash tables, ranges) — blocks B & C | open | generate via a preflop solver; fall back to curated charts |
| **ICM engine** — new scope, blocks E | open | start with pure ICM equity calc; defer full FT solving |
| **Progress persistence** — localStorage vs SQLite | deferred | localStorage until a pillar needs history |
| **Content volume** (guided spots, ranges) — who curates? | open | you do, as you study; the tool is the container |
| **Push/fold scope** — 3-max only, or HU too? | open | both — HU is half of every Spin |

---

## 8. How this maps to the workflow

Per `AGENTS.md`: each phase beyond MVP becomes a **GitHub issue** (problem,
files touched, acceptance criteria) → **feature branch** → **PR** with
`Closes #N`. The issues get written when we start building, not now — this doc
is the definition they'll reference.

---

*Pair with the `poker-theory` skill for the theory behind each pillar, and
[`SPIN_TO_MTT_ROADMAP.md`](./SPIN_TO_MTT_ROADMAP.md) for what the student must
learn at each step.*
