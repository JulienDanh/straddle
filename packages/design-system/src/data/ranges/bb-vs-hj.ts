// BB defense vs a HJ open
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-hj.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** BB defense vs a HJ open, ChipEV */
export const BB_VS_HJ_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-R2-F-F-F', 8))

/** BB defense vs a HJ open on the ICM bubble (200-man, 33 left) */
export const BB_VS_HJ_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-R2-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a HJ open, both solution types combined */
/** BB defense vs a HJ open, asymmetric bubble configs */
export const BB_VS_HJ_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-R2-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a HJ open, all solution types combined */

/** BB defense vs a HJ open, final table (200-man FT payouts) */
export const BB_VS_HJ_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F-R2-F-F-F', 8, ICM_FT_GAMETYPE))
export const BB_VS_HJ: StoredRange[] = [...BB_VS_HJ_CEV, ...BB_VS_HJ_ICM, ...BB_VS_HJ_ASYM, ...BB_VS_HJ_ICM_FT]
