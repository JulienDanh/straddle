// SB defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-utg.json (SB acts after the UTG 2bb open
// and 5 folds, history_spot 7). cEV and ICM entries share the store file;
// the loaders split them by type and SB_VS_UTG combines both.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-utg.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a UTG open, ChipEV */
export const SB_VS_UTG_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'R2-F-F-F-F-F', 7))

/** SB defense vs a UTG open on the ICM bubble (200-man, 33 left) */
export const SB_VS_UTG_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'R2-F-F-F-F-F', 7, ICM_GAMETYPE))

/** SB defense vs a UTG open, both solution types combined */
export const SB_VS_UTG: StoredRange[] = [...SB_VS_UTG_CEV, ...SB_VS_UTG_ICM]
