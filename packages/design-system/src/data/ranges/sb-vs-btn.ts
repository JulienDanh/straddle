// SB defense vs a BTN open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-btn.json (SB acts right after the BTN
// open, history_spot 7; the BTN open is 2.1bb at
// 40bb, 2bb otherwise — read from btn/rfi.json).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-btn.json'
import btn from '../../../../ranges/data/btn/rfi.json'

const openSize = (stack: number): number =>
  (btn as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === 'cEV' && s.stack === stack)?.sizings?.raise ?? 2

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a BTN open, ChipEV */
export const SB_VS_BTN_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}`, 7))

/** SB defense vs a BTN open on the ICM bubble (200-man, 33 left) */
export const SB_VS_BTN_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}`, 7, ICM_GAMETYPE))

/** SB defense vs a BTN open, both solution types combined */
/** SB defense vs a BTN open, asymmetric bubble configs */
export const SB_VS_BTN_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-F-F-R2', 7, ICM_GAMETYPE))

/** SB defense vs a BTN open, all solution types combined */

/** SB defense vs a BTN open, final table (200-man FT payouts) */
export const SB_VS_BTN_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}`, 7, ICM_FT_GAMETYPE))
export const SB_VS_BTN: StoredRange[] = [...SB_VS_BTN_CEV, ...SB_VS_BTN_ICM, ...SB_VS_BTN_ASYM, ...SB_VS_BTN_ICM_FT]
