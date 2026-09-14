// BB defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-utg.json — one file per preflop line: the
// shared title/position at the top, one entry per stack (the BB 3-bet size
// is carried per entry). cEV and ICM entries share the store file; the
// loaders split them by type and BB_VS_UTG combines both — RangeBrowser
// shows a solution-type selector when a group is mixed. materializeLine
// injects the shared fields and the Wizard link (BB acts after the UTG
// 2bb open and 6 folds, history_spot 8).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-utg.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const ASYM = { ...data, stacks: data.stacks.filter((e) => e.config) }
const asymUrl = (_stack: number, e: StoredRange) =>
  preflopUrlStacks(e.config!, 'R2-F-F-F-F-F-F', 8, ICM_GAMETYPE)

/** BB defense vs a UTG open, ChipEV */
export const BB_VS_UTG_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'R2-F-F-F-F-F-F', 8))

/** BB defense vs a UTG open on the ICM bubble (200-man, 33 left) */
export const BB_VS_UTG_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'R2-F-F-F-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a UTG open, asymmetric bubble configs (covered/covering) */
export const BB_VS_UTG_ASYM: StoredRange[] = materializeLine(ASYM, asymUrl)

/** BB defense vs a UTG open, all solution types combined */

/** BB defense vs a UTG open, final table (200-man FT payouts) */
export const BB_VS_UTG_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'R2-F-F-F-F-F-F', 8, ICM_FT_GAMETYPE))
export const BB_VS_UTG: StoredRange[] = [...BB_VS_UTG_CEV, ...BB_VS_UTG_ICM, ...BB_VS_UTG_ASYM, ...BB_VS_UTG_ICM_FT]

/** Bubble solutions without the final-table gametype — BM5 blinds vs opens */
export const BB_VS_UTG_BUBBLE: StoredRange[] = [...BB_VS_UTG_CEV, ...BB_VS_UTG_ICM, ...BB_VS_UTG_ASYM]
