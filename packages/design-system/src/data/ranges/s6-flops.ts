// System 6 solved flop spots for the BB
// check-raise decision facing a c-bet after calling an open — short stacks.
// They nest as `postflop` children of the BB defend entries (weighted by
// BB's call line) in ranges/data/bb/vs-*.json. The children carry the
// opener's c-bet in `node`; solvedFlop bundles them with the line context.
// The doc comments carry per-board provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import hj from '../../../../ranges/data/bb/vs-hj.json'
import utg from '../../../../ranges/data/bb/vs-utg.json'
import co from '../../../../ranges/data/bb/vs-co.json'

type Store = { title: string; position: string; stacks: unknown[] }

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

/** BB check-raising vs HJ's c-bet on Qh7c5d (Q-7-5) — 25bb SRP (HJ opens
 *  2bb). Source: GTO Wizard (MTT 8-max, 25bb), 3bb c-bet (55% pot): BB folds
 *  44.8%, calls 41.7% and check-raises 13.6% (to 6.7bb) — the top-pair
 *  check-raise system in action. */
export const S6_FLOP_Q75: SolvedFlop = flop(hj, 25, 'q75')

/** BB check-raising vs UTG's c-bet on Kc8h4d (K-8-4) — 13bb SRP (UTG opens
 *  2bb). Source: GTO Wizard (MTT 8-max, 13bb), 1.1bb c-bet (20% pot): BB
 *  folds 42.7%, calls 36.7% and check-raises 20.6% (to 3.1bb) — at 13bb the
 *  king-high boards get the heaviest raise share of the four. */
export const S6_FLOP_K84: SolvedFlop = flop(utg, 13, 'k84')

/** BB check-raising vs HJ's c-bet on Kc9c4h (K-9-4, two clubs) — 15bb SRP
 *  (HJ opens 2bb). Source: GTO Wizard (MTT 8-max, 15bb), 1.1bb c-bet (20%
 *  pot): BB folds 45.4%, calls 30.6% and check-raises 24% (to 3.4bb). */
export const S6_FLOP_K94: SolvedFlop = flop(hj, 15, 'k94')

/** BB check-raising vs CO's c-bet on 8c6h4d (8-6-4 rainbow) — 25bb SRP (CO
 *  opens 2bb). Source: GTO Wizard (MTT 8-max, 25bb), 3bb c-bet (55% pot):
 *  BB folds 28.5%, calls 56.5% and jams 15% (23bb) — the connected board
 *  gets the all-in instead of a small raise. */
export const S6_FLOP_864: SolvedFlop = flop(co, 25, '864')
