// UTG RFI ChipEV solutions, grouped by stack depth for RangeBrowser.
// Data lives in data/utg-rfi.json — the single machine-readable store.
// The UTG open is 2bb at every depth unless overridden per entry.
// The 40bb entry carries the S1 postflop c-bet spots as its `postflop` children.
import type { StoredRange } from './types'
import data from '../../../../ranges/data/utg/rfi.json'

/** UTG RFI ChipEV solutions, grouped by stack for RangeBrowser */
export const UTG_RFI_CEV: StoredRange[] = data as StoredRange[]
