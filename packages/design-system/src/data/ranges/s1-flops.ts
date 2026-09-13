// System 1 solved flop spots for the
// UTG c-bet decision after BB checks. They nest as `postflop` children of the
// stack-40 UTG RFI entry in ranges/data/utg/rfi.json — the same file as the
// open range they derive from — storing the raw open-weighted GTO Wizard
// paste verbatim. This file materializes the children (materializeChild:
// injects the parent context, converts to conditional frequencies) and maps
// ids to named exports for the app.
// The doc comments carry per-board provenance and the weighted bet shares.
import type { StoredRange } from './types'
import { materializeChild, materializeLine, preflopUrl } from './types'
import rfi from '../../../../ranges/data/utg/rfi.json'

const line = materializeLine(rfi, (stack) => preflopUrl(stack, '', 1))
const utg40 = line.find((entry) => entry.stack === 40) ?? line[0]
const byId = new Map(
  (utg40.postflop ?? [])
    .filter((entry) => entry.id)
    .map((entry) => [entry.id!, materializeChild(utg40, entry as StoredRange)]),
)

/** UTG c-bet strategy on Kh8h3c — 40bb SRP (UTG opens 2bb, BB calls, BB checks).
 *  Source: GTO Wizard (MTT 8-max, 40bb), 20% pot c-bet (0.9bb), imported from a
 *  range-view paste.
 *  At this size the solver c-bets 100% of the opening range — the bet line is
 *  the full 40bb open (239 unblocked combos), no check action at all. */
export const S1_FLOP_K83: StoredRange = byId.get('k83')!

/** UTG c-bet strategy on KdKh3c (high-high-low paired board) — same spot.
 *  Source: GTO Wizard (MTT 8-max, 40bb), 20% pot c-bet (0.9bb), imported from a
 *  range-view paste.
 *  High-high-low is NOT a risk factor: ~99.9% c-bet at the smaller size —
 *  checks are noise-level and sit on the big pairs (KK 0.3%, AA 0.3%). */
export const S1_FLOP_KK3: StoredRange = byId.get('kk3')!

/** UTG c-bet strategy on AhJh5h (ace-high monotone risk-factor board) — same
 *  spot. Source: GTO Wizard (MTT 8-max, 40bb), 20% pot c-bet (0.9bb), imported
 *  from a range-view paste. 89% bet: sets and Kh draws near 100%, the checks
 *  are the no-heart overpairs — KK heaviest (35% check). */
export const S1_FLOP_MONOTONE: StoredRange = byId.get('aj5')!

/** UTG c-bet strategy on Jh6d6s (high-low-low paired risk-factor board) —
 *  same spot. Source: GTO Wizard (MTT 8-max, 40bb), 20% pot c-bet (0.9bb),
 *  imported from a range-view paste. 79% bet: trips and Ax near 100%, QJo
 *  checks most (77%), TT/99 split ~50/50. */
export const S1_FLOP_J66: StoredRange = byId.get('j66')!

/** UTG c-bet strategy on AsKh2c (AKx risk-factor board) — same spot.
 *  Source: GTO Wizard (MTT 8-max, 40bb), 73% pot c-bet (3.3bb), imported from
 *  a range-view paste. 79% bet: AK/AQ near 100%, the checks are the overpairs
 *  (AA bets 41-68%, QQ 21-35%) and weak-kicker Kx. */
export const S1_FLOP_AK2: StoredRange = byId.get('ak2')!

