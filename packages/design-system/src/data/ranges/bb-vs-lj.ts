// BB defense vs a LJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/bb/vs-lj.json (BB acts after the LJ 2bb open
// and 5 folds, history_spot 8).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-lj.json'

/** BB defense vs a LJ open, ChipEV */
export const BB_VS_LJ_CEV: StoredRange[] = materializeLine(
  data, (stack) => preflopUrl(stack, 'F-F-R2-F-F-F-F', 8))

/** BB defense vs a LJ open, asymmetric bubble configs (covered/covering) */
export const BB_VS_LJ_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-R2-F-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a LJ open, all solution types combined */

/** BB defense vs a LJ open, final table (200-man FT payouts) */
export const BB_VS_LJ_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-R2-F-F-F-F', 8, ICM_FT_GAMETYPE))
export const BB_VS_LJ: StoredRange[] = [...BB_VS_LJ_CEV, ...BB_VS_LJ_ASYM, ...BB_VS_LJ_ICM_FT]
