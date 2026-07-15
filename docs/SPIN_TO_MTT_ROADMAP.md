# Spin & Go → MTT: The Returning Grinder's Roadmap

> For a player coming back in 2026, starting from a small bankroll through Spin
> & Go and graduating into MTTs. Built around this repo's solver for study.

---

## 0. Reality check (read this first)

The games you left are not the games you're returning to.

- **GTO literacy is table stakes.** The field has solved preflop and common
  postflop spots. "Feel" players bleed slowly; the edge now lives in range
  reading, ICM, and the spots the field *still* gets wrong (late-tournament,
  short, heads-up).
- **Solvers are everywhere** (PioSolver, GTOWizard, HRC) — and this repo ships
  its own. You will use one daily. That is the study method now.
- **Spin & Go is a volume + rakeback game.** 3-max, hyper-turbo, random prize
  multiplier. A strong low-stakes reg wins ~3–6% ROI pre-rakeback, and most of
  the actual profit is rakeback + volume, not per-game edge. The skill ceiling
  is low; the **variance is extreme** (200+ buy-in downswings are normal).
- **Why it's still the right on-ramp:** the *one* skill Spins demand — short
  stack / push-fold / heads-up hyper — is the exact skill late MTTs are won
  with. You're not wasting time in Spins; you're building the MTT endgame first.

The plan: **refresher → master the Spin endgame → grind Spins to roll → layer
deep-stack + ICM → move to MTTs.**

### Assumptions (adjust to your situation)
- Starting bankroll: **$200–$500** (micro Spins).
- Time: **15–25 hrs/week**.
- Site: PokerStars or GGPoker (Spin traffic + MTT ladder + rakeback programs).
- You'll use this repo's solver (`postflop_solver/`) and the strategy API for
  spot study. See [`STUDY_WITH_SOLVER.md`](./STUDY_WITH_SOLVER.md) *(create as
  needed)* or the `poker-theory` skill §7.

---

## 1. Bankroll management (non-negotiable)

Spin & Go variance comes from the **multiplier lottery**: ~75% of games pay only
2×, so most of your sessions you're fighting for your buy-in back. You need a
thicker roll than your gut says.

### Spin & Go — 250 buy-ins to play a stake

| Stake | Buy-in | Roll to start | Shot-up trigger | Drop-down trigger |
|-------|-------:|--------------:|-----------------|-------------------|
| $1    | $1     | $250          | $1,000 (40@$2)  | — (floor)         |
| $2    | $2     | $500          | $2,000 (40@$5)  | < $400            |
| $5    | $5     | $1,250        | $4,000 (40@$10) | < $1,000          |
| $10   | $10    | $2,500        | $7,500 (40@$25) | < $2,000          |
| $25   | $25    | $6,250        | —               | < $5,000          |

- **Shot up** = keep 40 buy-ins at the next level; if you drop below, fall back.
- **Drop down** is mandatory, not optional. Ego costs bankrolls.

### MTT — 150 buy-ins (200+ for big fields)

| Level       | ABI     | Roll to play  | Notes                          |
|-------------|---------|---------------|--------------------------------|
| Micro       | $1–$5   | $750–$1,500   | big fields, high variance      |
| Low         | $5–$22  | $1,500–$3,500 | the real MTT learning ground   |
| Mid         | $22–$55 | $3,500–$8,000 | only after proven ROI at low   |

### Risk of ruin, stated plainly
A winning Spin reg can run 200 buy-ins below EV. A winning MTT reg can go
months without a meaningful score. **This is the job.** If the numbers above
feel uncomfortable, your bankroll is too small or your stake too high — fix
that before fixing your play.

---

## Phase 1 — Refresher & Setup (Weeks 1–2)

Goal: update rusty fundamentals to the 2026 baseline, get tools running.

- [ ] **Self-assessment.** What did you play before? What stakes? Be honest
      about leaks (tilt, bankroll discipline, live habits vs online speed).
- [ ] **Math refresh** — pot odds, MDF, alpha, EV, equity realization. Drill
      until instant. *(poker-theory skill §2.)*
- [ ] **Software stack:**
  - Tracker (Holdem Manager / PokerTracker / Hand2Note) + HUD.
  - A push/fold calculator (HRC or ICMIZER) — your most-used tool in Spins.
  - This repo's solver running locally (`cd postflop_solver && maturin develop
    --release`).
- [ ] **Site + rakeback.** Pick one with Spin traffic *and* a real MTT ladder
      and a rewards program you understand. Rakeback is a chunk of Spin EV.
- [ ] **GTO mindset:** stop thinking "what do I have." Start thinking
      "what does my *range* do here, and what does villain's range look like."

**Exit criteria:** you can state MDF/alpha for any sizing in 3 seconds, your
tracker imports, and the solver creates + solves a simple SRP spot.

---

## Phase 2 — Spin & Go Specialization (Weeks 3–8)

Goal: own the short-stack/push-fold endgame. This is where Spin edge lives.

### What a Spin & Go is
- **3 players**, 500 starting chips, **25bb effective** at 10/20.
- **Hyper-turbo** blinds (every 3 min). You are push/fold by ~12–15bb.
- **Winner-take-all** (mostly) with a **random multiplier** (2× ~75% of the
  time, up to rare big prizes). Translation: most games, you're fighting for
  ~1 buy-in of profit. Volume is the only answer.

### The three skills, in order

1. **Nash push/fold (10–25bb, 3-handed & HU).** This is the entire game.
   - Memorize shove ranges by position × stack for 3-max.
   - Memorize call ranges vs shoves (tighter than you think).
   - Build the table with a solver, then drill to automatic.
   - *(poker-theory §3 stack-depth, §9 push/fold.)*
2. **Heads-up hyper.** Once it's 2-handed, the game is pure push/fold HU with
   a Nash baseline. Population under-defends → exploit by shoving wider than
   Nash vs passive villains.
3. **3-handed opening & short postflop.** Early at 25bb there's a little
   postflop. Keep it tight: small opens, IP pressure, no fancy play.

### Study loop (daily)
- **10 min:** review yesterday's biggest mistakes vs push/fold solver.
- **20 min:** drill a new stack/position combo until automatic.
- **Play session:** 1–2 hr, 4-tile, focus on correct push/fold decisions,
  *not* results.
- **Log every shove/call you were unsure about** → solve offline later.

### Bankroll target for this phase
Protect the $200–$500 roll at $1 Spins. **Do not move up until Phase 3 volume
proves the edge.** The temptation to chase is the #1 roll killer.

**Exit criteria:** shove/call decisions correct ≥90% vs Nash across all common
stacks; ROI sample trending positive over 1,000+ games.

---

## Phase 3 — Spin Grind (Months 2–4)

Goal: convert skill into bankroll growth via volume + rakeback.

- **Volume target:** 1,000–2,000 games/month (Spins are fast; 4-tile, ~60–80
  games/hr). Volume is how thin edges realize.
- **Game selection:** avoid tough regs HU — if a known strong reg sits, the
  table isn't worth it at low stakes; you're fighting for rakeback.
- **Review process:**
  - Mark spots in-session, batch-solve weekly.
  - Track your actual frequencies vs Nash: are you under-shoving? over-calling?
  - Watch for tilt patterns after bad multiplier luck — that's where edge leaks.
- **Rakeback:** know your program cold. Reload bonuses, leaderboards, mission
  rewards — at Spin ROI, these are a real fraction of profit.
- **Move-up discipline:** follow the §1 table. Shots, not ego.

### Bankroll target
Grow $250 → $1,000–$1,500 through $1→$2→$5 Spins. When you cross ~$2,000–$3,000
with a proven 3-month sample, you have the roll *and* the endgame skill to
start MTT foundations.

**Exit criteria:** 3-month sample, positive ROI, roll ≥ $2,000, push/fold
endgame fully internalized.

---

## Phase 4 — MTT Foundations (Months 4–6)

Goal: layer the skills Spins *didn't* teach you. The endgame you already own;
now build the early/middle game + tournament-specific theory.

### What MTTs add that Spins didn't
1. **Deep-stack postflop (50–100bb+).** This is the biggest gap. Use the solver
   hard here: c-bet strategy, board textures, barreling, value/bluff rivers.
   *(poker-theory §4, §5, §7.)*
2. **Stack-size play across the tournament.** 100bb deepstack → 40bb middle →
   15–25bb rejam → <10bb push. Each band has its own ranges.
3. **ICM.** The concept that changes everything late: chips lose value as you
   gain them, so call-off ranges tighten near bubbles/final tables. You must
   run ICMizer on final-table spots — card-strength alone loses money.
   *(poker-theory §9.)*
4. **Final-table dynamics.** Stack composition (who covers whom, who's short)
   dictates ranges more than cards. The chip leader applies max ICM pressure.
5. **Large-field navigation.** Field size drives variance; survive-then-thrive
   early, accumulate mid, play for the win at FT.

### Study plan
- **Preflop:** build deep-stack open/3-bet/4-bet ranges (cash-style early game).
- **Rejam (15–25bb):** solver-driven reshove ranges by position + stacks. This
  is the MTT money skill and Spins gave you the foundation.
- **ICM spots:** review every FT you make in an ICM calculator.
- **Postflop:** solve 2–3 SRP/3-bet-pot flops per week in the repo solver.

### Game selection for transition
Start at **micro/low ABI ($1–$11)** freezeouts + turbos. Big fields = brutal
variance but cheap tuition. Mix some **hyper-turbos** (your Spin edge transfers
directly) to keep volume and roll stable.

### Bankroll target
Keep Spins funding the roll; MTT is a side game until you have **150 buy-ins at
your target ABI** and a positive sample. Don't quit Spins cold — taper as MTT
ROI proves.

**Exit criteria:** deep-stack postflop no longer feels foreign; you run ICM on
every FT; proven non-negative sample over 500+ low-stakes MTTs.

---

## Phase 5 — MTT Grind (Month 6+)

Goal: become a profitable MTT regular.

- **Schedule:** build a daily session of 6–12 tables across a stake tier.
  Game-select for soft fields (rec-rich sites/times).
- **Review cadence:** weekly batch — biggest preflop mistakes (ICM), biggest
  postflop mistakes (solver), tilt/mental leaks.
- **Study rotation:** one focus per week (e.g. "BTN vs BB SRP dry boards",
  "15bb reshoves vs early opens", "FT short-stack play").
- **Move up** only with a 300+ game positive sample at current ABI and the roll
  for the next tier.
- **Keep one Spin session/week** if profitable — it's the best push/fold
  maintenance drill there is.

---

## 2. How this repo's tools fit the plan

| Goal | Tool in this repo |
|------|-------------------|
| Drill postflop spots (deep-stack MTT work) | `postflop_solver/` Solver — set ranges/board/sizes, solve, read `strategy`/`equity`/`ev` |
| Model population leaks / exploits | node-lock feature (`POST /lock`) — pin villain to a tendency, re-solve |
| Build + share study spots | save/load solver sessions |
| Future: hand-history review & population tendencies | Phase 3 MDA platform (roadmap §Phase 3) |

The solver is your **postflop study tool** (MTT deep-stack work, Phase 4+). For
**preflop push/fold and ICM**, use a dedicated preflop/ICM solver (HRC,
ICMIZER) — those aren't this repo's scope (yet).

---

## 3. Milestone checklist at a glance

- [ ] **Phase 1:** tools running, math instant, solver solves a spot.
- [ ] **Phase 2:** push/fold ≥90% vs Nash, 1k-game sample positive.
- [ ] **Phase 3:** roll $250 → $2,000+, 3-month positive ROI.
- [ ] **Phase 4:** deep-stack postflop competent, ICM on every FT, MTT sample
      positive.
- [ ] **Phase 5:** profitable MTT reg at target ABI, moving up on sample.

## 4. The three rules that protect the whole plan

1. **Bankroll before ego.** Follow the drop-down trigger every time. A smaller
   game you're rolled for beats a bigger game you're not.
2. **Process over results.** Review decisions vs solver, not whether you won.
   Spins will swing wildly regardless of how well you play.
3. **Volume realizes thin edges.** In Spins especially, a correct decision made
   2,000 times is how the money appears. Show up.

---

*This roadmap pairs with the `poker-theory` skill (`.opencode/skills/poker-theory/`).
Section references like "§2", "§7" point to that skill's sections.*
