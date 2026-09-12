// System 1 solved flop spots — postflop-solver exports (packages/gto) for the
// UTG c-bet decision after BB checks. Data lives in data/utg/cbet-vs-bb.json — the
// single machine-readable store; this file maps ids back to named exports for
// the app. Ranges come from the stored preflop solutions (UTG 40bb open, BB
// 40bb call vs the 2bb open). The doc comments carry per-board provenance.
import type { StoredRange } from './types'
import data from '../../../../ranges/data/utg/cbet-vs-bb.json'

const byId = new Map(data.map((entry) => [entry.id, entry as StoredRange]))

/** UTG c-bet strategy on Kh8h3c — 40bb SRP (UTG opens 2bb, BB calls, BB checks).
 *  Solver: postflop-solver, exploitability 2.10/450 pot, 40% pot c-bet.
 *  Clean K-high: near-100% small c-bet, only a few underpairs check. */
export const S1_FLOP_K83: StoredRange = byId.get('k83')!

/** UTG c-bet strategy on KdKh3c (high-high-low paired board) — same spot.
 *  Solver: postflop-solver, exploitability 2.20/450 pot, 40% pot c-bet.
 *  High-high-low is NOT a risk factor: near-100% small c-bet; the few checks
 *  are underpairs QQ/JJ and weak-kicker trips (K7s). */
export const S1_FLOP_KK3: StoredRange = byId.get('kk3')!

/** UTG c-bet strategy on AhJh5h (ace-high monotone risk-factor board) — same
 *  spot. Solver: postflop-solver, exploitability 2.00/450 pot. Mix as the
 *  system predicts: sets and flushes bet, no-heart overpairs check. */
export const S1_FLOP_MONOTONE: StoredRange = byId.get('monotone')!

/** UTG c-bet strategy on Jh6d6s (high-low-low paired risk-factor board) —
 *  same spot. Solver: postflop-solver, exploitability 2.02/450 pot. The
 *  heaviest mix of the solved boards, as the system predicts. */
export const S1_FLOP_J66: StoredRange = byId.get('j66')!

/** UTG c-bet strategy on AsKh2c (AKx risk-factor board) — same spot.
 *  Solver: postflop-solver, exploitability 2.13/450 pot, 40% pot c-bet.
 *  The slowdown the system prescribes: bet 83% (vs 98% on clean K-high).
 *  Checks are the middle — weak-kicker Kx (K7s-K8s) and QQ/JJ underpairs. */
export const S1_FLOP_AK2: StoredRange = byId.get('ak2')!

export const S1_FLOP_SOLUTIONS: StoredRange[] = [S1_FLOP_K83, S1_FLOP_KK3, S1_FLOP_AK2, S1_FLOP_MONOTONE, S1_FLOP_J66]
