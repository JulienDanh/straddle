// System 11 solved river hero-call spot. It nests as a `postflop` child of
// the BTN RFI entry (weighted by the open) in ranges/data/btn/rfi.json;
// `node` carries the street-split history. The doc comment carries the
// provenance and the weighted shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
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

/** BTN's river decision on Ah7c3d + 2h + Ks (A-7-3, 2 turn, K river) — 50bb
 *  vs BB (BTN opens 2.1bb, c-bet 1.9bb called, turn checks through, BB
 *  leads 9.5bb — 100% pot — on the river). Source: GTO Wizard (MTT 8-max,
 *  50bb): BTN folds 52.3%, calls 38.3% and jams 9.4% (46bb) — the K7-type
 *  hero calls sit in the call line; the lead's fold share is high. */
export const S11_FLOP_A732K: SolvedFlop = flop(btn, 50, 'a732k')
