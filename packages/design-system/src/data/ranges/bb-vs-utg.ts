// BB defense vs a UTG open (ChipEV), grouped by stack depth for RangeBrowser.
// Data lives in data/bb-vs-utg-cev.json — the single machine-readable store
// shared with the solver scripts. The BB 3-bet is 8.5bb unless overridden per
// entry (sizings are carried per entry in the data).
import type { StoredRange } from './types'
import data from './data/bb-vs-utg-cev.json'

/** BB defense vs a UTG open, ChipEV */
export const BB_VS_UTG_CEV: StoredRange[] = data
