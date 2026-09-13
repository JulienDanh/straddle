// System 10 solved river value spots. They nest as `postflop` children of
// the UTG RFI entries (weighted by the open) in ranges/data/utg/rfi.json;
// `node` carries the street-split history. The doc comments carry per-board
// provenance and the weighted shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import utg from '../../../../ranges/data/utg/rfi.json'

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

/** UTG's river decision on Jh9c7d + Th + 9d (J-9-7, T turn, 9 river) — 80bb
 *  vs the SB caller (UTG opens 2bb, c-bet 2bb, turn barrel 15.1bb — 151%
 *  pot — both called, river checked). Source: GTO Wizard (MTT 8-max, 80bb):
 *  UTG checks 42.5%, bets 57.5% (to 30.2bb, 75% pot) — the near-relative-nuts
 *  takes the big size. */
export const S10_FLOP_J97T9: SolvedFlop = flop(utg, 80, 'j97t9')

/** UTG's river decision on Kh7c2d + 2h + 2s (K-7-2, 2 turn, 2 river) — 50bb
 *  vs BB (c-bet 1.8bb, turn 10.6bb both called, river checked). Source: GTO
 *  Wizard (MTT 8-max, 50bb): UTG checks 71.5%, jams 28.5% (35.6bb) — the
 *  AK-type near-nuts in the jam line. */
export const S10_FLOP_K7222: SolvedFlop = flop(utg, 50, 'k7222')

/** UTG's river decision on Ah7c2d + 2h + 8d — 50bb vs BB, the same solved
 *  spot as System 8's 88 river (shared by both pages). */
export const S10_FLOP_A72: SolvedFlop = flop(utg, 50, 'a72')
