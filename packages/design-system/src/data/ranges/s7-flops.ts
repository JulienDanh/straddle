// System 7 solved flop spots for the BTN
// facing-BB-check-raise decision after a c-bet. They nest as `postflop`
// children of the BTN RFI entries in ranges/data/btn/rfi.json (weighted by
// the open line). The children carry the c-bet and the check-raise in
// `node` (e.g. "X-R1.1-R5.3"); solvedFlop bundles them with the line context.
// The doc comments carry per-board provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { materializeLine, preflopUrl, solvedFlop } from './types'
import data from '../../../../ranges/data/btn/rfi.json'

const line = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, '', 6),
)
const entryAt = (stack: number): StoredRange =>
  line.find((entry) => entry.stack === stack) ?? line[0]
const flop = (stack: number, id: string): SolvedFlop => {
  const parent = entryAt(stack)
  const child = (parent.postflop ?? []).find((c) => c.id === id)
  return solvedFlop(parent, child as StoredRange)
}

/** BTN facing the BB check-raise on JsJh3c (J-J-3) — 50bb SRP (BTN opens
 *  2.1bb, BB calls, BB checks, BTN c-bets 1.9bb, BB check-raises to 7.6bb).
 *  Source: GTO Wizard (MTT 8-max, 50bb): BTN folds 40.8%, calls 58.1% and
 *  3-bets 1.1% (to 14.8bb). */
export const S7_FLOP_JJ3: SolvedFlop = flop(50, 'jj3')

/** BTN facing the BB check-raise on TsTh4c (T-3-3) — 35bb SRP (BTN opens 2bb,
 *  c-bets 1.1bb, BB raises to 5.3bb). Source: GTO Wizard (MTT 8-max, 35bb):
 *  BTN folds 35.3%, calls 58.1% and 3-bets 6.6% (to 10.5bb). */
export const S7_FLOP_T33: SolvedFlop = flop(35, 't33')

/** BTN facing the BB check-raise on 5c3h3d (5-3-3 rainbow) — 35bb SRP.
 *  Source: GTO Wizard (MTT 8-max, 35bb), same 1.1bb c-bet / 5.3bb raise:
 *  BTN folds 38.6%, calls 45.9% and 3-bets 15.5% (to 10.5bb) — the low
 *  paired board gets fought back at the most. */
export const S7_FLOP_533: SolvedFlop = flop(35, '533')

/** BTN facing the BB check-raise on 6s6h2c (6-6-2) — 25bb SRP (BTN opens 2bb,
 *  c-bets 1.1bb, BB raises to 4.5bb). Source: GTO Wizard (MTT 8-max, 25bb):
 *  BTN folds 31.9%, calls 50% and 3-bets 18.1% (to 8.3bb). */
export const S7_FLOP_662: SolvedFlop = flop(25, '662')
