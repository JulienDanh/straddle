// UTG RFI ChipEV solutions, grouped by stack depth for RangeBrowser.
// Data lives in data/utg-rfi-cev.json — the single machine-readable store
// shared with the solver scripts (packages/gto/scripts/extract_ranges.py).
// The UTG open is 2bb at every depth unless overridden per entry.
import type { StoredRange } from './types'
import data from './data/utg-rfi-cev.json'

/** UTG RFI ChipEV solutions, grouped by stack for RangeBrowser */
export const UTG_RFI_CEV: StoredRange[] = data
