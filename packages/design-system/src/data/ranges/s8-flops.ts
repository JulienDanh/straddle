// System 8 solved turn/river sizing spots. They nest as `postflop`
// children of the UTG/BTN RFI entries (weighted by the open) in
// ranges/data/{utg,btn}/rfi.json; `node` carries the street-split history.
// The doc comments carry per-board provenance and the weighted shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import utg from '../../../../ranges/data/utg/rfi.json'
import btn from '../../../../ranges/data/btn/rfi.json'

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

/** UTG's turn decision on Td9d2c + 2d (T-9-2 two diamonds, 2d turn
 *  completes the flush) — 100bb vs the SB caller (UTG opens 2.1bb, SB
 *  calls, UTG c-bets 2bb, SB calls, SB checks). Source: GTO Wizard (MTT
 *  8-max, 100bb): UTG checks 36.4%, bets 63.6% (to 6.8bb, 67% pot) — with
 *  the made flush the barrel is standard. */
export const S8_FLOP_T922D: SolvedFlop = flop(utg, 100, 't922d')

/** BTN's turn decision on Qh7c2d + Qd (Q-7-2, Q turn) — 50bb vs BB (BTN
 *  opens 2.1bb, c-bet 1.9bb called). Source: GTO Wizard (MTT 8-max, 50bb):
 *  BTN checks 63%, bets 37% (to 10.8bb, 114% pot) — the trips turn gets the
 *  overbet sizing the system teaches. */
export const S8_FLOP_Q72Q: SolvedFlop = flop(btn, 50, 'q72q')

/** UTG's river decision on Ah7c2d + 2h + 8d (A-7-2, 2 turn, 8 river) — 50bb
 *  vs BB (c-bet 1.8bb, turn barrel 10.6bb both called, river checked).
 *  Source: GTO Wizard (MTT 8-max, 50bb): UTG checks 65.2%, jams 34.8%
 *  (35.6bb) — the near-nuts takes the big size on the capped caller. */
export const S8_FLOP_A72: SolvedFlop = flop(utg, 50, 'a72')

/** UTG's river decision on KhKdTh + 8c + Qs (K-K-T, 8 turn, Q river) — 50bb
 *  vs BB. Source: GTO Wizard (MTT 8-max, 50bb): UTG checks 32.3%, jams
 *  64.7% (35.6bb) — the polarized QQ+ jam. */
export const S8_FLOP_KKT: SolvedFlop = flop(utg, 50, 'kkt')
