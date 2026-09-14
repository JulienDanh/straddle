// BB defense vs the SB's 3bb blind-vs-blind raise
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-sb-raise.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const ASYM = { ...data, stacks: data.stacks.filter((e) => e.config) }
const asymUrl = (_stack: number, e: StoredRange) =>
  preflopUrlStacks(e.config!, 'F-F-F-F-F-F-R3', 8, ICM_GAMETYPE)

/** BB defense vs a SB raise, ChipEV */
export const BB_VS_SB_RAISE_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-F-F-F-R3', 8))

/** BB defense vs a SB raise on the ICM bubble (200-man, 33 left) */
export const BB_VS_SB_RAISE_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-F-F-F-R3', 8, ICM_GAMETYPE))

/** BB defense vs a SB raise, asymmetric bubble configs (covered/covering) */
export const BB_VS_SB_RAISE_ASYM: StoredRange[] = materializeLine(ASYM, asymUrl)

/** BB defense vs a SB raise, all solution types combined */

/** BB defense vs a SB raise, final table (200-man FT payouts) */
export const BB_VS_SB_RAISE_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F-F-F-F-R3.5', 8, ICM_FT_GAMETYPE))
export const BB_VS_SB_RAISE: StoredRange[] = [...BB_VS_SB_RAISE_CEV, ...BB_VS_SB_RAISE_ICM, ...BB_VS_SB_RAISE_ASYM, ...BB_VS_SB_RAISE_ICM_FT]

/** Bubble solutions without the final-table gametype — BM4 blind vs blind */
export const BB_VS_SB_RAISE_BUBBLE: StoredRange[] = [...BB_VS_SB_RAISE_CEV, ...BB_VS_SB_RAISE_ICM, ...BB_VS_SB_RAISE_ASYM]
