// LJ facing a SB 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/lj/vs-3bet-sb.json. After
// a 3-bet the seats in between act first — LJ only decides once it
// folds back around (history_spot 9). Open sizes come from lj/rfi.json,
// 3-bet sizes from the SB defend entry (sb/vs-lj.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/lj/vs-3bet-sb.json'
import opener from '../../../../ranges/data/lj/rfi.json'
import defender from '../../../../ranges/data/sb/vs-lj.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `F-F-R${openSize(stack, type)}-F-F-FR${threebet(stack, type)}-F`

/** LJ facing a SB 3-bet, ChipEV */
export const LJ_VS_3BET_SB_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))

/** LJ facing a SB 3-bet on the ICM bubble (200-man) */
export const LJ_VS_3BET_SB_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 9, ICM_GAMETYPE))
export const LJ_VS_3BET_SB: StoredRange[] = [...LJ_VS_3BET_SB_CEV, ...LJ_VS_3BET_SB_ICM]
