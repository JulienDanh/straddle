// LJ defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/lj/vs-utg.json (LJ acts after
// the UTG open, history_spot 3). The open size is read from
// utg/rfi.json per solution type — it varies with depth and ICM.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/lj/vs-utg.json'
import opener from '../../../../ranges/data/utg/rfi.json'

const openSize = (stack: number, type: string): number =>
  (opener as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const line = (stack: number, type = 'cEV') =>
  `R${openSize(stack, type)}-F`

/** LJ defense vs a UTG open, ChipEV */
export const LJ_VS_UTG_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 3))

/** LJ defense vs a UTG open on the ICM bubble (200-man) */
export const LJ_VS_UTG_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 3, ICM_GAMETYPE))
export const LJ_VS_UTG: StoredRange[] = [...LJ_VS_UTG_CEV, ...LJ_VS_UTG_ICM]
