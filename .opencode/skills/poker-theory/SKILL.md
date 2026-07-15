---
name: poker-theory
description: Professional poker theory and study expert. Use whenever reasoning about poker strategy, GTO/equilibrium concepts, preflop ranges, postflop board textures, bet sizing, SPR, blockers, MDF, pot odds, EV, exploit vs balanced play, interpreting solver output, mass-data analysis (MDA), or studying/analyzing hands. Also use when designing solver spots, building ranges, node-locking, or writing any poker-related logic, docs, or features in this repo. Covers No-Limit Hold'em (NLHE) cash and MTT theory.
---

# Poker Theory & Study

You are a professional poker theorist and study coach. This skill provides the
domain foundation for every piece of strategy tooling in this repo: the GTO
solver (`postflop_solver/`), the strategy API/backend (`straddle/`), and the
future MDA platform. Apply this knowledge when designing spots, interpreting
output, writing strategy logic, or explaining concepts.

Scope: **No-Limit Texas Hold'em (NLHE)**, 6-max and heads-up, cash and MTT.
Heads-up and 6-max cash is the default mental model unless stack depth or ICM
is mentioned.

---

## 1. The two paradigms: GTO vs Exploitative

- **GTO (Game Theory Optimal)** = an approximate Nash equilibrium strategy.
  Unexploitable by definition: if both players play it, neither can gain by
  deviating. The solver approximates this via CFR. "Balanced" = GTO.
- **Exploitative** = deviate from equilibrium to maximize EV against a specific
  opponent's mistakes. Higher ceiling, lower floor — it opens you to
  counter-exploitation.
- **Rule:** study GTO to build the baseline; play exploitative against real
  populations where data shows a leak. This repo's Phase 3 (MDA) exists exactly
  to feed population data onto the GTO baseline.
- **Exploitability metric:** the solver reports `exploitability()` in bb/100 or
  fraction of pot. Lower = closer to equilibrium. <1% of pot is study-grade;
  tournament prep often tolerates ~2-3%.

---

## 2. Core math every decision rests on

### Pot odds
```
pot_odds = call_amount / (pot_after_call)
```
Required equity to call = `call / (pot + call)`. Compare hand equity to this.

### Minimum Defense Frequency (MDF)
Fraction of range defender must continue (call/raise) to stop villain's
bluffs being immediately profitable with any two cards:
```
MDF = pot / (pot + bet_size)
```
Defender folds more than `(1 - MDF)` → villain auto-profits with any bluff.

### Alpha (α) — bluff break-even
The threshold at which a pure bluff (zero equity) breaks even:
```
α = bet_size / (bet_size + pot)
```
If villain defends less than `(1 - α)`, bluffing any two is +EV. α and MDF are
two views of the same equilibrium relationship.

### EV
```
EV = sum over outcomes: P(outcome) * net_result
```
Solver reports per-hand EV in `expected_values()`. The strategic question is
always: *which action maximizes EV across the whole range*, not the single
hand in front of you.

### Equity realization (EQR)
Raw equity ≠ realized equity. In-position, deep, with backdoor draws realizes
more than raw equity; out-of-position, capped, on dynamic boards realizes less.
Rule of thumb IP ~1.0–1.15, OOP ~0.85–0.95.

### SPR (Stack-to-Pot Ratio)
```
SPR = effective_stack / pot
```
Governs commitment thresholds. Low SPR (≤2): overpairs/TP commit happily. High
SPR (≥6): need nutted hands to stack off, play goes more positional and
draw-heavy.

---

## 3. Preflop theory

### Positional order (6-max)
UTG, MP (HJ/LJ), CO, BTN, SB, BB. Earlier = tighter; BTN = widest. SB is the
worst position postflop but also the cheapest blind.

### Ranges (opening)
Conceptual shape, not fixed charts — solver-derived and stack/structure
dependent:
- **RFI (open)**: UTG ~15%, CO ~28%, BTN ~45–50% (6-max cash, 100bb). Tighter
  in MTTs and from EP.
- **Sizing**: cash open ~2–2.5bb (smaller IP, larger OOP/EP). MTT: 2.2–2.5bb
  climbing with ante/blind level.
- **3-bet**: linear in-position (merged strong), polarized from the blinds
  (premium + select bluffs). Default ~8–12% total, IP heavier.
- **4-bet**: polar (value + bluffs) IP vs a polar 3-bettor; linear when deep
  or vs linear 3-bettors.
- **Defense vs 3-bet**: call with playable IP hands that realize well;
  4-bet/call the value, 4-bet/fold bluffs. MDF governs minimum defend rate,
  but position and realization dominate over strict MDF preflop.

### Stack-depth adjustments
- **Deep (150bb+)**: more calling, wider IP, implied odds favor suited/connectors,
  less all-in 4-bet shenanigans.
- **Short (20–40bb)**: ranges linearize, blockers lose value, push/fold charts
  appear <15bb (SAGE / Nash HU push-fold).
- **MTT**: add ICM pressure (see §9) — bubbles and final tables massively
  tighten call-off ranges vs chip-covering villains.

---

## 4. Postflop: board texture

Board texture drives almost every postflop decision. Classify on:

| Texture | Example | Character |
|---------|---------|-----------|
| **Dry** | K83r, Q52r | Few draws, hits one-and-done. Favor c-bet, small sizing. |
| **Wet / dynamic** | T98 two-tone, 764ss | Many turns change equity. Bigger sizing, more checks, range-based defense. |
| **Monotone** | Q75sss | Draws + made flushes; traps and blocker-heavy play. |
| **Paired** | KKT, 552 | Nut advantage matters; bluff with board pair blockers. |
| **Static** | AKQr, K82r | Equity stable; thin value, small sizing. |
| **Connected/coord.** | T98, J87 | Kickers and draws dominate; widen aggression IP. |

**Two forces that govern betting frequency and sizing:**
1. **Range advantage** — whose whole range hits the board harder. Bet more
   often, bigger.
2. **Nut advantage** — who has the strongest *specific* hands. Drives polarized
   overbets and raise frequency. Without nut advantage, stay linear / smaller.

---

## 5. Bet sizing theory

- **Small (25–33% pot)**: range-heavy, linear, IP c-bets on dry/static boards,
  high-frequency. Keeps opponent's worst hands indifferent.
- **Medium (50–75%)**: standard postflop, balanced value/bluff, dynamic boards.
- **Large / overbet (100–150%+)**: polar (nuts or air), used with strong nut
  advantage, on textures where one player is capped (e.g. AK2r as 3-bettor vs
  caller). Denies equity and builds the pot for value polarized ranges.
- **Geometric sizing**: the bet fraction `f` that gets all-in by the river in N
  equal steps, maximizing fold-equity/pressure per street. Solver uses these
  heavily; for a pot-size ratio to stack, `f` solves `(1+f)^N ≈ SPR+1`.

**One-over-one (1/3-1/3-1/3)**: the modern small-ball default on static boards;
keeps range wide and lets value realize across streets without overcommitting.

---

## 6. Ranges, blockers, combinatorics

### Combinatorics
- 1326 total starting hands (169 canonical); 6 combos of any pair, 16 of any
  unpaired (12 offsuit + 4 suited).
- Card removal / blockers reduce villain combos. Holding the As removes one
  combo of every suited ace and reduces nut flush combos.

### Blocker-driven decisions
- **Bluff river** with cards that block villain's calling range and unblock
  their folding range (e.g. holding As on a flush board to bluff — blocks the
  nuts).
- **Value** with hands whose blockers make villain's continuing range weaker.
- **Node-locking in solver:** the whole point of `lock_strategy` — pin villain
  to a population tendency (e.g. overfold river) and read off the exploit.

### Polar vs linear
- **Polar**: nuts + bluffs (3-bet bluffs, river overbets). Opponent faces a
  range of very strong and very weak hands.
- **Linear**: a merged band of strong-ish hands (4-bet value, c-bet small on
  dry boards). No air.

---

## 7. Interpreting solver output (this repo's core workflow)

The `Solver` class exposes `strategy`, `equity`, `expected_values`,
`range_percentages`. How to read them:

1. **Look at the acting player's `strategy`**: per-hand action frequencies. A
   "mixed strategy" (e.g. 60/40 check/bet) is normal — pure strategies are rare
   at equilibrium. Mixed frequencies are knife-edge EV tradeoffs.
2. **Cross-check `equity` vs `expected_values`**: high equity + low EV = a hand
   that's dominated / out of position / realizes poorly. Low equity + high EV
   = a strong blocker bluff or a trapping nut hand.
3. **Read the range, not the combo**: a single hand's frequency is noisy. Read
   range-wide shape (which *class* of hands bets, which checks).
4. **`range_percentages`** shows how each player's preflop range has been
   whittled by the action path to the current node.
5. **Node-lock** to study exploits: lock villain's strategy to a leak, re-solve,
   read the counter-strategy. This is how GTO + MDA combine (Phase 3).
6. **Exploitability on the progress stream**: watch `exploitability()` fall;
   don't over-train — diminishing returns past a point.

### Spot construction (setting up a solve)
- Board + OOP/IP ranges + pot/stack + **bet/raise size configs** define the
  game tree. The *sizing choices* are the single biggest lever on the solution.
- Start from a known-good baseline (e.g. SRP BTN vs BB on common flops) before
  exploring exotic spots.
- Keep bet/raise size lists small and purpose-built; huge trees train slowly
  and are harder to interpret.

---

## 8. Study methodology (how a pro studies)

1. **Categorize spots** by: position matchup, preflop line, board texture, SPR.
   Solve one representative, internalize the principles, transfer to neighbors.
2. **One variable at a time.** Change the board, hold ranges constant; change
   one bet size, hold the rest. Isolate cause and effect.
3. **Read ranges over combos.** Ask "what class of hands does this with X
   sizing?" not "what does it do with exactly 9h8h?"
4. **Build baseline ranges** first (RFI, 3-bet, vs 3-bet, BB defense). Everything
   postflop is downstream of these.
5. **Compare EV across actions** for the *range*, not one hand — pick the line
   that maximizes range EV.
6. **Track mistakes, not results.** Review hands against the solver output; the
   goal is fewer strategic errors, not winning the pot you happened to play.
7. **Use node-lock to model villains**, not just to drill GTO. Real money is in
   the gap between population play and equilibrium.

---

## 9. Tournament-specific (MTT / ICM)

- **ICM (Independent Chip Model)**: tournament chips have declining marginal
  value. Near bubbles / final tables, survival premium tightens call-off and
  reshove ranges, especially vs covering stacks.
- **Bubble factor**: quantify how much equity you need beyond raw pot odds to
  stack off — often 5–15% extra near the bubble.
- **Push/fold** dominates sub-15bb; Nash equilibrium shove/fold charts are the
  baseline, exploitable against overly tight or loose callers.
- **Ante structures** widen opens and defense (more dead money, better pot odds).
- **Final table dynamics**: chip leader can apply maximal ICM pressure; short
  stacks are constrained. Position + stack composition > raw card strength.

---

## 10. Mass Data Analysis (MDA) — Phase 3 alignment

- **Goal:** measure how a population actually plays (vs GTO) and build exploits.
- **Population tendencies**: fold-to-c-bet by street/position/bet-size;
  river over/under-bluff; 3-bet frequencies; cold-call ranges.
- **Node-lock from data:** take the population's average frequencies at a node,
  lock them as villain's strategy, re-solve → optimal counter-strategy.
- **Sample size caution:** niche nodes (deep river lines) may lack sample; blend
  data with GTO prior. Don't overfit exploits to noise.
- **Key output:** where the population leaks (overfolds, overcalls, under-bluffs)
  and the +EV counter for each.

---

## Applying this in the codebase

| You're working on... | Pull from |
|----------------------|-----------|
| Solver spot setup / bet-size config | §5 sizing, §7 spot construction |
| Interpreting strategy/equity/EV output | §2 math, §7 reading output |
| Node-locking feature or UI | §6 blockers, §7 node-lock, §10 MDA |
| Range builders / preflop tools | §3 preflop, §6 combinatorics |
| MDA / hand-history analysis | §10 MDA, §8 methodology |
| Docs, tutorials, user-facing explanations | §8 study methodology |

When a request is ambiguous between GTO baseline and exploitative adjustment,
**default to the GTO baseline** and note the exploit as a follow-up — that
matches how the solver is designed to be used.
