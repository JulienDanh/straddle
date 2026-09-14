// BTN facing a SB 3-bet of the open, grouped by stack depth for
// RangeBrowser. Data lives in ranges/data/btn/vs-3bet-sb.json. After
// a 3-bet the seats in between act first — BTN only decides once it
// folds back around (history_spot 9). Open sizes come from btn/rfi.json,
// 3-bet sizes from the SB defend entry (sb/vs-btn.json) — both vary
// with depth and solution type.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl,  } from './types'
import data from '../../../../ranges/data/btn/vs-3bet-sb.json'
import opener from '../../../../ranges/data/btn/rfi.json'
import defender from '../../../../ranges/data/sb/vs-btn.json'

type Entry = { type: string; stack: number; sizings?: { raise?: number } }
const openSize = (stack: number, type: string): number =>
  (opener as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const threebet = (stack: number, type: string): number =>
  (defender as { stacks: Entry[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 6
const line = (stack: number, type = 'cEV') =>
  `F-F-F-F-F-R${openSize(stack, type)}R${threebet(stack, type)}-F`

/** BTN facing a SB 3-bet, ChipEV */
export const BTN_VS_3BET_SB_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 9))
export const BTN_VS_3BET_SB: StoredRange[] = [...BTN_VS_3BET_SB_CEV]
