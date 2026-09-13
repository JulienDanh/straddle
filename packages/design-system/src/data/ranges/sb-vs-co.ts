// SB defense vs a CO open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-co.json (SB acts after the CO
// 2bb open, history_spot 7). cEV and ICM entries share the store file;
// the loaders split them by type and SB_VS_CO combines both.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-co.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a CO open, ChipEV */
export const SB_VS_CO_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-F-R2-F', 7))

/** SB defense vs a CO open on the ICM bubble (200-man, 33 left) */
export const SB_VS_CO_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-F-R2-F', 7, ICM_GAMETYPE))

/** SB defense vs a CO open, both solution types combined */
/** SB defense vs a CO open, asymmetric bubble configs */
export const SB_VS_CO_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-F-R2-F', 7, ICM_GAMETYPE))

/** SB defense vs a CO open, all solution types combined */

/** SB defense vs a CO open, final table (200-man FT payouts) */
export const SB_VS_CO_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F-F-R2-F', 7, ICM_FT_GAMETYPE))
export const SB_VS_CO: StoredRange[] = [...SB_VS_CO_CEV, ...SB_VS_CO_ICM, ...SB_VS_CO_ASYM, ...SB_VS_CO_ICM_FT]
