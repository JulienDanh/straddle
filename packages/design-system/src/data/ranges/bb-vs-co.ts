// BB defense vs a CO open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-co.json (BB acts after the CO 2bb open
// and 3 folds, history_spot 8).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-co.json'

/** BB defense vs a CO open, ChipEV */
export const BB_VS_CO_CEV: StoredRange[] = materializeLine(
  data, (stack) => preflopUrl(stack, 'F-F-F-F-R2-F-F', 8))

/** BB defense vs a CO open, asymmetric bubble configs (covered/covering) */
export const BB_VS_CO_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-F-R2-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a CO open, all solution types combined */

/** BB defense vs a CO open, final table (200-man FT payouts) */
export const BB_VS_CO_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F-F-R2-F-F', 8, ICM_FT_GAMETYPE))
export const BB_VS_CO: StoredRange[] = [...BB_VS_CO_CEV, ...BB_VS_CO_ASYM, ...BB_VS_CO_ICM_FT]
