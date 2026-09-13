// System 5 solved turn spots for the CO
// barrel-vs-checked-turn decision after the flop c-bet was called. They
// nest as `postflop` children of the CO RFI entries (weighted by the open)
// in ranges/data/co/rfi.json; `node` carries the street-split history
// (flop "X-R{cbet}-C", turn "X"). The doc comments carry per-board
// provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import data from '../../../../ranges/data/co/rfi.json'

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

/** CO's turn barrel on Qs7c3d + Jh (Q-7-3, J turn) — 80bb SRP (CO opens 2.2bb,
 *  BB calls, CO c-bets 1.9bb, BB calls, BB checks the Jh turn). Source: GTO
 *  Wizard (MTT 8-max, 80bb): CO checks 55.1%, bets 44.9% (to 14.9bb, 154%
 *  pot). The J turn improves the Jx — the check-back is the story. */
export const S5_FLOP_Q73J: SolvedFlop = flop(data, 80, 'q73j')

/** CO's turn barrel on Ks7h2c + Qd (K-7-2, Q turn) — 50bb SRP (CO opens
 *  2.1bb, c-bet 1.9bb called). Source: GTO Wizard (MTT 8-max, 50bb): CO
 *  checks 59.7%, bets 40.3% (to 10.8bb, 114% pot) — the overpair-killing
 *  queen sends most of the range to the check line. */
export const S5_FLOP_K72Q: SolvedFlop = flop(data, 50, 'k72q')

/** CO's turn barrel on Qs7c5d + 8h (Q-7-5, 8 turn) — 50bb SRP (c-bet 4.6bb
 *  — 81% pot — called). Source: GTO Wizard (MTT 8-max, 50bb): CO checks
 *  63.9%, bets 36.1% (to 12bb). The connected turn favors the caller. */
export const S5_FLOP_Q758: SolvedFlop = flop(data, 50, 'q758')

/** CO's turn barrel on Qs7c3d + Jh at 50bb — same board as the 80bb spot,
 *  shallower. Source: GTO Wizard (MTT 8-max, 50bb): CO checks 43.9%, bets
 *  56.1% (to 10.8bb) — shallow barrels MORE, the overpair asymmetry again. */
export const S5_FLOP_Q73J50: SolvedFlop = flop(data, 50, 'q73j50')
