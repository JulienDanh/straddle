// HJ facing a BB 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/hj/vs-3bet-bb.json. After
// a 3-bet the seats in between act first — HJ only decides once it
// folds back around (history_spot 9). Open sizes come from hj/rfi.json,
// 3-bet sizes from the BB defend entry (bb/vs-hj.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/hj/vs-3bet-bb.json'
import opener from '../../../../ranges/data/hj/rfi.json'
import defender from '../../../../ranges/data/bb/vs-hj.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `F-F-F-R${openSize(stack, type)}-F-F-FR${threebet(stack, type)}`

/** HJ facing a BB 3-bet, ChipEV */
export const HJ_VS_3BET_BB_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))

/** HJ facing a BB 3-bet on the ICM bubble (200-man) */
export const HJ_VS_3BET_BB_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 9, ICM_GAMETYPE))
export const HJ_VS_3BET_BB: StoredRange[] = [...HJ_VS_3BET_BB_CEV, ...HJ_VS_3BET_BB_ICM]
