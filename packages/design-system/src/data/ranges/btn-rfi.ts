// BTN RFI ChipEV solutions, grouped by stack depth for RangeBrowser.
// Data lives in packages/ranges/data/btn/rfi.json — the shared store read
// by both the app and the solver. New stack depths are new JSON entries.
import type { StoredRange } from './types'
import data from '../../../../ranges/data/btn/rfi.json'

/** BTN RFI ChipEV solutions, grouped by stack for RangeBrowser */
export const BTN_RFI_CEV: StoredRange[] = data as StoredRange[]
