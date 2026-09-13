// System 2 solved flop spots for the
// BTN c-bet decision after BB checks. They nest as `postflop` children of the
// stack-40 BTN RFI entry in ranges/data/btn/rfi.json — the same file as the
// open range they derive from — storing the raw open-weighted GTO Wizard
// paste verbatim. This file materializes the children (materializeChild:
// injects the parent context, converts to conditional frequencies) and
// bundles each with the parent open (solvedFlop) for the example cards.
// The doc comments carry per-board provenance and the weighted bet shares.
import type { StoredRange, SolvedFlop } from './types'
import { materializeLine, preflopUrl, solvedFlop } from './types'
import rfi from '../../../../ranges/data/btn/rfi.json'

const line = materializeLine(rfi, (stack) => preflopUrl(stack, '', 6))
const btn40 = line.find((entry) => entry.stack === 40) ?? line[0]
const flop = (id: string): SolvedFlop => {
  const child = (btn40.postflop ?? []).find((entry) => entry.id === id)
  return solvedFlop(btn40, child as StoredRange)
}

/** BTN c-bet strategy on Ac9h5d (clean ace-high board) — 40bb SRP (BTN opens
 *  2.1bb, BB calls, BB checks). Source: GTO Wizard (MTT 8-max, 40bb), 72% pot
 *  c-bet (4.1bb), imported from a range-view paste.
 *  97.5% bet: BTN has the most aces, so the solver front-loads a big stab —
 *  every Ax is a pure bet; the checks are slivers of the non-ace broadways
 *  and low pairs (65s 17%, KQs 17%, 44 16%). */
export const S2_FLOP_A95: SolvedFlop = flop('a95')

/** BTN c-bet strategy on Kh9d3c (king-high with a 3 — disconnected) — same
 *  spot. Source: GTO Wizard (MTT 8-max, 40bb), 19% pot c-bet (1.1bb),
 *  imported from a range-view paste.
 *  99.9% bet: the 3 keeps the board disconnected, so the deuce-or-3 rule
 *  holds at range — AA, KK, KQ/KJ/KT, 99 and 33 all bet pure. */
export const S2_FLOP_K93: SolvedFlop = flop('k93')

/** BTN c-bet strategy on Ah7h2h (ace-high monotone risk-factor board) — same
 *  spot. Source: GTO Wizard (MTT 8-max, 40bb), 19% pot c-bet (1.1bb),
 *  imported from a range-view paste.
 *  99.1% bet: at the small size the monotone risk factor shows up in the
 *  size, not the frequency — the solver still c-bets nearly the whole open;
 *  checks are sub-1% slivers on the no-heart broadways. */
export const S2_FLOP_A72: SolvedFlop = flop('a72')

/** BTN c-bet strategy on Kc8c4c (king-high monotone risk-factor board) — same
 *  spot. Source: GTO Wizard (MTT 8-max, 40bb), 19% pot c-bet (1.1bb),
 *  imported from a range-view paste.
 *  95.2% bet: bet top + bottom, check middle — the checks are the no-club
 *  overpairs (QQ 15%, JJ 11%) and the weak suited kings (K3s 12%, K5s 10%). */
export const S2_FLOP_K84: SolvedFlop = flop('k84')

/** BTN c-bet strategy on 9h6d3c (9-high low board — BTN misses) — same spot.
 *  Source: GTO Wizard (MTT 8-max, 40bb), 72% pot c-bet (4.1bb), imported from
 *  a range-view paste.
 *  57.2% bet, polarized BIG: with no 8+ on board BTN's wide range barely
 *  connects, so the solver stabs 72% pot with strong + weak — AA/KK/QQ/JJ/TT,
 *  A9 and 96s bet pure, while the middle checks (22/44/55/88 and 86s near
 *  100% check). */
export const S2_FLOP_963: SolvedFlop = flop('963')
