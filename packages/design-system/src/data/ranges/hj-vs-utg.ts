// HJ defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/hj/vs-utg.json (HJ acts after the UTG 2bb open
// and 2 folds, history_spot 4). cEV and ICM entries share the store file.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/hj/vs-utg.json'

const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })

/** HJ defense vs a UTG open, ChipEV */
export const HJ_VS_UTG_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack) => preflopUrl(stack, 'R2-F-F', 4))

/** HJ defense vs a UTG open on the ICM bubble */
export const HJ_VS_UTG_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack) => preflopUrl(stack, 'R2-F-F', 4, ICM_GAMETYPE))

/** HJ defense vs a UTG open, both solution types combined */
export const HJ_VS_UTG: StoredRange[] = [...HJ_VS_UTG_CEV, ...HJ_VS_UTG_ICM]
