// BB defense vs a BTN open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-btn.json — one file per preflop line: the
// shared title/position at the top, one entry per stack. cEV and ICM
// entries share the store file; the loaders split them by type and
// BB_VS_BTN combines both — RangeBrowser shows a solution-type selector
// when a group is mixed. The Wizard link is built from the BTN open size
// at that depth, read from btn/rfi.json (2.1bb at 40bb, 2bb otherwise —
// history_spot 8 after the open and SB fold).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-btn.json'
import btn from '../../../../ranges/data/btn/rfi.json'

const openSize = (stack: number): number =>
  (btn as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === 'cEV' && s.stack === stack)?.sizings?.raise ?? 2

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const ASYM = { ...data, stacks: data.stacks.filter((e) => e.config) }
const asymUrl = (_stack: number, e: StoredRange) =>
  preflopUrlStacks(e.config!, 'F-F-F-F-F-R2-F', 8, ICM_GAMETYPE)

/** BB defense vs a BTN open, ChipEV */
export const BB_VS_BTN_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}-F`, 8))

/** BB defense vs a BTN open on the ICM bubble (200-man, 33 left) */
export const BB_VS_BTN_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}-F`, 8, ICM_GAMETYPE))

/** BB defense vs a BTN open, asymmetric bubble configs (covered/covering) */
export const BB_VS_BTN_ASYM: StoredRange[] = materializeLine(ASYM, asymUrl)

/** BB defense vs a BTN open, all solution types combined */

/** BB defense vs a BTN open, final table (200-man FT payouts) */
export const BB_VS_BTN_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, `F-F-F-F-F-R${openSize(stack)}-F`, 8, ICM_FT_GAMETYPE))
export const BB_VS_BTN: StoredRange[] = [...BB_VS_BTN_CEV, ...BB_VS_BTN_ICM, ...BB_VS_BTN_ASYM, ...BB_VS_BTN_ICM_FT]
