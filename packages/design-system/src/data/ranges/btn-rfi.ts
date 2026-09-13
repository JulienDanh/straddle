// BTN RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/btn/rfi.json — one file per preflop line: the
// shared title/position at the top, one entry per stack. materializeLine
// injects the shared fields and the Wizard link (BTN acts after 5 folds,
// history_spot 6).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl } from './types'
import data from '../../../../ranges/data/btn/rfi.json'

/** BTN RFI solutions, grouped by stack for RangeBrowser */
export const BTN_RFI_CEV: StoredRange[] = materializeLine(data, (stack) => preflopUrl(stack, 'F-F-F-F-F', 6))
