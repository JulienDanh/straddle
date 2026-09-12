// BB defense vs a BTN open (ChipEV), grouped by stack depth for RangeBrowser.
// Data lives in packages/ranges/data/bb/vs-btn.json — the shared store read
// by both the app and the solver. New stack depths are new JSON entries.
import type { StoredRange } from './types'
import data from '../../../../ranges/data/bb/vs-btn.json'

/** BB defense vs a BTN open, ChipEV */
export const BB_VS_BTN_CEV: StoredRange[] = data as StoredRange[]
