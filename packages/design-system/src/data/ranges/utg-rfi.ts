// UTG RFI ChipEV solutions, grouped by stack depth for RangeBrowser.
// Data lives in data/utg-rfi.json — the single machine-readable store,
// shared with the solver (s1-cbet embeds it via include_str!).
// The UTG open is 2bb at every depth unless overridden per entry.
import type { StoredRange } from './types'
import data from '../../../../ranges/data/utg/rfi.json'

/** UTG RFI ChipEV solutions, grouped by stack for RangeBrowser */
export const UTG_RFI_CEV: StoredRange[] = data as StoredRange[]
