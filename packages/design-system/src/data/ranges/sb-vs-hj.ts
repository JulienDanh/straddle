// SB defense vs a HJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-hj.json (SB acts after the HJ
// 2bb open, history_spot 7). cEV and ICM entries share the store file;
// the loaders split them by type and SB_VS_HJ combines both.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-hj.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a HJ open, ChipEV */
export const SB_VS_HJ_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-R2-F-F', 7))

/** SB defense vs a HJ open on the ICM bubble (200-man, 33 left) */
export const SB_VS_HJ_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-R2-F-F', 7, ICM_GAMETYPE))

/** SB defense vs a HJ open, both solution types combined */
export const SB_VS_HJ: StoredRange[] = [...SB_VS_HJ_CEV, ...SB_VS_HJ_ICM]
