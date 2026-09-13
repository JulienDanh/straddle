// SB defense vs a UTG+1 open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/vs-utg1.json (SB acts after the UTG+1
// 2bb open, history_spot 7). cEV and ICM entries share the store file;
// the loaders split them by type and SB_VS_UTG1 combines both.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/vs-utg1.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** SB defense vs a UTG+1 open, ChipEV */
export const SB_VS_UTG1_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-R2-F-F-F-F', 7))

/** SB defense vs a UTG+1 open on the ICM bubble (200-man, 33 left) */
export const SB_VS_UTG1_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-R2-F-F-F-F', 7, ICM_GAMETYPE))

/** SB defense vs a UTG+1 open, both solution types combined */
export const SB_VS_UTG1: StoredRange[] = [...SB_VS_UTG1_CEV, ...SB_VS_UTG1_ICM]
