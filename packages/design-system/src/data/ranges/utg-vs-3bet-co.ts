// UTG facing a CO 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/utg/vs-3bet-co.json. After
// a 3-bet the seats in between act first — UTG only decides once it
// folds back around (history_spot 9). Open sizes come from utg/rfi.json,
// 3-bet sizes from the CO defend entry (co/vs-utg.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/utg/vs-3bet-co.json'
import opener from '../../../../ranges/data/utg/rfi.json'
import defender from '../../../../ranges/data/co/vs-utg.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `R${openSize(stack, type)}-F-F-FR${threebet(stack, type)}-F-F-F`

/** UTG facing a CO 3-bet, ChipEV */
export const UTG_VS_3BET_CO_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))

/** UTG facing a CO 3-bet on the ICM bubble (200-man) */
export const UTG_VS_3BET_CO_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 9, ICM_GAMETYPE))
export const UTG_VS_3BET_CO: StoredRange[] = [...UTG_VS_3BET_CO_CEV, ...UTG_VS_3BET_CO_ICM]
