// System 3 solved flop spots for the BB
// defend-vs-stab decision in the limped blind-vs-blind pot. They nest as
// `postflop` children of the stack-70 cEV entry in ranges/data/bb/vs-sb-limp.json
// — weighted by BB's preflop check line (the flop reach). The children carry
// the SB stab in `node` (the flop history); this file materializes them
// (materializeChild: line context, conditional frequencies, Wizard link) and
// maps ids to named exports for the app.
// The doc comments carry per-board provenance and the weighted action shares.
import type { StoredRange, SolvedFlop } from './types'
import { materializeLine, preflopUrl, solvedFlop } from './types'
import data from '../../../../ranges/data/bb/vs-sb-limp.json'

const line = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, 'F-F-F-F-F-F-C', 8),
)
const bb70 = line.find((entry) => entry.stack === 70) ?? line[0]
const flop = (id: string): SolvedFlop => {
  const child = (bb70.postflop ?? []).find((entry) => entry.id === id)
  return solvedFlop(bb70, child as StoredRange)
}

/** BB defending vs the SB stab on Ks7s2h (K72 two-tone) — 70bb limped pot
 *  (SB limps, BB checks). Source: GTO Wizard (MTT 8-max, 70bb), SB stabs
 *  1.5bb (50% pot) 25.4% of the time; facing the stab BB folds 29.5%, calls
 *  68% and raises 2.5% (to 7.1bb). */
export const S3_FLOP_K72: SolvedFlop = flop('k72')

/** BB defending vs the SB stab on Ah4h2s (A42 two-tone) — same spot.
 *  Source: GTO Wizard (MTT 8-max, 70bb), 1.5bb stab. BB folds 29.7%, calls
 *  55.9% and raises 14.4% (to 4.5bb) — the gut shots get aggressive. The SB
 *  stabs 26.7% of the time. */
export const S3_FLOP_A42: SolvedFlop = flop('a42')

/** BB defending vs the SB stab on KcQh8d (KQ8 rainbow) — same spot, but the
 *  SB stabs BIG here: 3.9bb (130% pot), though only 16% of the time.
 *  Source: GTO Wizard (MTT 8-max, 70bb). BB folds 60.5% and calls 39.5% —
 *  never raises. */
export const S3_FLOP_KQ8: SolvedFlop = flop('kq8')

/** BB defending vs the SB stab on JsJh3c (JJ3 two-tone) — same spot.
 *  Source: GTO Wizard (MTT 8-max, 70bb), 1.5bb stab. BB folds 26.7%, calls
 *  70.3% and raises 3% (to 7.1bb). The SB stabs 65.7% of the time — the
 *  paired board is the stabber's favorite. */
export const S3_FLOP_JJ3: SolvedFlop = flop('jj3')
