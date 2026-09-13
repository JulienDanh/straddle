// UTG RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/utg/rfi.json — one file per preflop line: the
// shared title/position at the top, one entry per stack (the UTG open is 2bb
// at every depth unless overridden per entry). The 40bb entry carries the S1
// postflop c-bet spots as its `postflop` children (raw Wizard pastes).
// materializeLine injects the shared fields and the Wizard link (built from
// the stack — UTG acts first, so its node is history_spot 1).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl } from './types'
import data from '../../../../ranges/data/utg/rfi.json'

/** UTG RFI solutions, grouped by stack for RangeBrowser */
export const UTG_RFI_CEV: StoredRange[] = materializeLine(data, (stack) => preflopUrl(stack, '', 1))
