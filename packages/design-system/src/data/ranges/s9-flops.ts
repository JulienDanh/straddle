// System 9 solved flop spots for the BB
// defend-vs-c-bet decision after calling an open. They nest as `postflop`
// children of the BB defend entries (weighted by BB's call line — the flop
// reach) in ranges/data/bb/vs-*.json. The children carry the opener's c-bet
// in `node` (the flop history); this file bundles them via solvedFlop
// (line context, conditional frequencies, Wizard link).
// The doc comments carry per-board provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import hj from '../../../../ranges/data/bb/vs-hj.json'
import btn from '../../../../ranges/data/bb/vs-btn.json'
import co from '../../../../ranges/data/bb/vs-co.json'

type Store = { title: string; position: string; stacks: unknown[] }

/** A raw cEV stack entry with the file's shared title/position applied —
 *  solvedFlop only needs the reach line, stack and position. */
const parentOf = (store: Store, stack: number): StoredRange => ({
  ...(store.stacks.find((e) => (e as StoredRange).type === 'cEV' && (e as StoredRange).stack === stack) as StoredRange),
  title: store.title,
  position: store.position,
})

const flop = (store: Store, stack: number, id: string): SolvedFlop => {
  const parent = parentOf(store, stack)
  const child = (parent.postflop ?? []).find((c) => c.id === id)
  return solvedFlop(parent, child as StoredRange)
}

/** BB defending vs HJ's c-bet on JdTc5h (J-T-5, one diamond) — 60bb SRP
 *  (HJ opens 2.1bb, BB calls, BB checks). Source: GTO Wizard (MTT 8-max,
 *  60bb), HJ stabs 5.1bb (89% pot) — a big bet: BB folds 66.9%, calls 25.1%
 *  and check-raises 8% (to 12.8bb). The super gut shots (97dd) sit in the
 *  call line. */
export const S9_FLOP_J105: SolvedFlop = flop(hj, 60, 'j105')

/** BB defending vs BTN's c-bet on Td7c2s (T-7-2, one diamond) — 80bb SRP
 *  (BTN opens 2.3bb). Source: GTO Wizard (MTT 8-max, 80bb), 2bb c-bet (33%
 *  pot): BB folds 35.9%, calls 51.3% and check-raises 12.8% (to 9.7bb). */
export const S9_FLOP_T72: SolvedFlop = flop(btn, 80, 't72')

/** BB defending vs CO's c-bet on Tc5s2d (T-5-2, one spade) — 60bb SRP (CO
 *  opens 2.1bb). Source: GTO Wizard (MTT 8-max, 60bb), 1.9bb c-bet (33%
 *  pot): BB folds 39.4%, calls 49.7% and check-raises 11% (to 8.3bb). */
export const S9_FLOP_T52: SolvedFlop = flop(co, 60, 't52')

/** BB defending vs BTN's c-bet on Qc6h2d (Q-6-2 rainbow) — 80bb SRP (BTN
 *  opens 2.3bb). Source: GTO Wizard (MTT 8-max, 80bb), 2bb c-bet (33% pot):
 *  BB folds 30.7%, calls 49.8% and check-raises 19.4% (to 5.3bb). */
export const S9_FLOP_Q62: SolvedFlop = flop(btn, 80, 'q62')
