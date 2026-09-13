// UTG facing a BTN 3-bet of the 2bb open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/utg/vs-3bet-btn.json. After a
// 3-bet the seats in between act first — UTG only decides once it folds
// back around (history_spot 9). The line embeds the 3-bet size, which
// varies with depth. cEV and ICM entries share the store file.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/utg/vs-3bet-btn.json'

// the 3-bet size by depth (read from the captured defender nodes)
const THREEBET: Record<number, number> = { 50: 6.5, 40: 6.5, 30: 5.5, 25: 5, 20: 4.5 }
const line = (stack: number) => `R2-F-F-F-F-R${THREEBET[stack]}-F-F`
const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })

/** UTG facing a BTN 3-bet, ChipEV */
export const UTG_VS_3BET_BTN_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack) => preflopUrl(stack, line(stack), 9))

/** UTG facing a BTN 3-bet on the ICM bubble */
export const UTG_VS_3BET_BTN_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack) => preflopUrl(stack, line(stack), 9, ICM_GAMETYPE))

/** UTG facing a BTN 3-bet, both solution types combined */
export const UTG_VS_3BET_BTN: StoredRange[] = [...UTG_VS_3BET_BTN_CEV, ...UTG_VS_3BET_BTN_ICM]
