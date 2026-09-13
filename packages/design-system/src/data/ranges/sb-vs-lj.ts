// SB defense vs a LJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-lj.json (SB acts after the LJ
// 2bb open, history_spot 7). cEV and ICM entries share the store file;
// the loaders split them by type and SB_VS_LJ combines both.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-lj.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a LJ open, ChipEV */
export const SB_VS_LJ_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-R2-F-F-F', 7))

/** SB defense vs a LJ open on the ICM bubble (200-man, 33 left) */
export const SB_VS_LJ_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-R2-F-F-F', 7, ICM_GAMETYPE))

/** SB defense vs a LJ open, both solution types combined */
export const SB_VS_LJ: StoredRange[] = [...SB_VS_LJ_CEV, ...SB_VS_LJ_ICM]
