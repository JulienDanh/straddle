// HJ facing a CO 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/hj/vs-3bet-co.json. After
// a 3-bet the seats in between act first — HJ only decides once it
// folds back around (history_spot 9). Open sizes come from hj/rfi.json,
// 3-bet sizes from the CO defend entry (co/vs-hj.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/hj/vs-3bet-co.json'
import opener from '../../../../ranges/data/hj/rfi.json'
import defender from '../../../../ranges/data/co/vs-hj.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `F-F-F-R${openSize(stack, type)}R${threebet(stack, type)}-F-F-F`

/** HJ facing a CO 3-bet, ChipEV */
export const HJ_VS_3BET_CO_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))

/** HJ facing a CO 3-bet on the ICM bubble (200-man) */
export const HJ_VS_3BET_CO_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 9, ICM_GAMETYPE))
export const HJ_VS_3BET_CO: StoredRange[] = [...HJ_VS_3BET_CO_CEV, ...HJ_VS_3BET_CO_ICM]
