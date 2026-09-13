// BB defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-utg.json — one file per preflop line: the
// shared title/position at the top, one entry per stack. The BB 3-bet is
// 8.5bb unless overridden per entry (sizings are carried per entry).
// materializeLine injects the shared fields and the Wizard link (BB acts
// after the UTG 2bb open and 6 folds, history_spot 8).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl } from './types'
import data from '../../../../ranges/data/bb/vs-utg.json'

/** BB defense vs a UTG open */
export const BB_VS_UTG_CEV: StoredRange[] = materializeLine(
  data, (stack) => preflopUrl(stack, 'R2-F-F-F-F-F-F', 8))
