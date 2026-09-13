// BTN defense vs a UTG open (a separate preflop line from BTN's RFI —
// ranges/data/btn/vs-utg.json). BTN acts after the UTG 2bb open and 4
// folds, history_spot 6. cEV and ICM entries share the store file.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/btn/vs-utg.json'

const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })

/** BTN defense vs a UTG open, ChipEV */
export const BTN_VS_UTG_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack) => preflopUrl(stack, 'R2-F-F-F-F', 6))

/** BTN defense vs a UTG open on the ICM bubble */
export const BTN_VS_UTG_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack) => preflopUrl(stack, 'R2-F-F-F-F', 6, ICM_GAMETYPE))

/** BTN defense vs a UTG open, both solution types combined */
export const BTN_VS_UTG: StoredRange[] = [...BTN_VS_UTG_CEV, ...BTN_VS_UTG_ICM]
