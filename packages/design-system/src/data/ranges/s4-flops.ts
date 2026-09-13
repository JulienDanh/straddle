// System 4 solved river bluff spot. It nests as a `postflop` child of the
// BB vs SB-raise entry (weighted by BB's call line) in
// ranges/data/bb/vs-sb-raise.json; `node` carries the street-split history.
// The doc comment carries the provenance and the weighted shares.
import type { StoredRange, SolvedFlop } from './types'
import { solvedFlop } from './types'
import data from '../../../../ranges/data/bb/vs-sb-raise.json'

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

/** BB's river bluff on AhKh4c + 7d + 9s (A-K-4 two-tone, blank turn and
 *  river — the runout beyond the A-K-4 flop is chosen as two blanks) — 40bb
 *  (SB opens 3bb, BB calls, BB stabs 1.4bb flop, SB calls, turn checks
 *  through, river checked to BB). Source: GTO Wizard (MTT 8-max, 40bb): BB
 *  checks 72.8%, bluffs 27.2% (9.8bb, 100% pot) — the missed-river bluff
 *  share the system lives in. */
export const S4_FLOP_AK4: SolvedFlop = flop(data, 40, 'ak4')
