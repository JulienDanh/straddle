// System 12 solved flop spots for the UTG
// defend-vs-3-bet-c-bet decision OOP. They nest as `postflop` children of
// the UTG vs-3bet entries (weighted by UTG's call line) in
// ranges/data/utg/vs-3bet-*.json, 40bb cEV. The children carry the
// 3-bettor's c-bet in `node`; solvedFlop bundles them with the line context.
// The doc comments carry per-board provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import hj from '../../../../ranges/data/utg/vs-3bet-hj.json'
import btn from '../../../../ranges/data/utg/vs-3bet-btn.json'

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

/** UTG defending vs HJ's 3-bet c-bet on 8c4h2d (8-4-2) — 40bb (UTG opens 2bb,
 *  HJ 3-bets to 5.5bb, UTG calls). Source: GTO Wizard (MTT 8-max, 40bb), HJ
 *  c-bets 2.7bb (20% pot) 88.5% of the time; facing it UTG folds 13.3%,
 *  calls 61.4% and raises 25.3% (to 8.7bb) — the small c-bet gets attacked. */
export const S12_FLOP_842: SolvedFlop = flop(hj, 40, '842')

/** UTG defending vs BTN's 3-bet c-bet on Kc8h4d (K-8-4) — 40bb (BTN 3-bets
 *  to 6.5bb). Source: GTO Wizard (MTT 8-max, 40bb), BTN c-bets 3.1bb (20%
 *  pot) 99.9%; facing it UTG folds 55.8%, calls 29% and raises 15.2% (to
 *  9.2bb) — the king-high board folds the underpairs, as the system says. */
export const S12_FLOP_K84: SolvedFlop = flop(btn, 40, 'k84')

/** UTG defending vs BTN's 3-bet c-bet on 9h8d4c (9-8-4) — 40bb. Source: GTO
 *  Wizard (MTT 8-max, 40bb), BTN c-bets 3.1bb (20% pot) 79.7%; facing it
 *  UTG folds just 3.1%, calls 93.4% and jams 3.5% (33.5bb) — the connected
 *  low board is defended almost range-wide. */
export const S12_FLOP_984: SolvedFlop = flop(btn, 40, '984')
