// BB defense vs a BTN open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-btn.json — one file per preflop line: the
// shared title/position at the top, one entry per stack. The Wizard link is
// built from the BTN open size at that depth, read from btn/rfi.json
// (2.1bb at 40bb, 2bb otherwise — history_spot 8 after the open and SB fold).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl } from './types'
import data from '../../../../ranges/data/bb/vs-btn.json'
import btn from '../../../../ranges/data/btn/rfi.json'

const openSize = (stack: number): number =>
  (btn as { stacks: { stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.stack === stack)?.sizings?.raise ?? 2

/** BB defense vs a BTN open */
export const BB_VS_BTN_CEV: StoredRange[] = materializeLine(
  data, (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}-F`, 8))
