// UTG1 facing a LJ 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/utg1/vs-3bet-lj.json. After
// a 3-bet the seats in between act first — UTG1 only decides once it
// folds back around (history_spot 9). Open sizes come from utg1/rfi.json,
// 3-bet sizes from the LJ defend entry (lj/vs-utg1.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/utg1/vs-3bet-lj.json'
import opener from '../../../../ranges/data/utg1/rfi.json'
import defender from '../../../../ranges/data/lj/vs-utg1.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `F-R${openSize(stack, type)}R${threebet(stack, type)}-F-F-F-F-F`

/** UTG1 facing a LJ 3-bet, ChipEV */
export const UTG1_VS_3BET_LJ_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))

/** UTG1 facing a LJ 3-bet on the ICM bubble (200-man) */
export const UTG1_VS_3BET_LJ_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 9, ICM_GAMETYPE))
export const UTG1_VS_3BET_LJ: StoredRange[] = [...UTG1_VS_3BET_LJ_CEV, ...UTG1_VS_3BET_LJ_ICM]
