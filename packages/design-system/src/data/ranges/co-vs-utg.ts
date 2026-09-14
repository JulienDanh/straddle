// CO defense vs a UTG open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/co/vs-utg.json (CO acts after
// the UTG open, history_spot 5). The open size is read from
// utg/rfi.json per solution type — it varies with depth and ICM.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/co/vs-utg.json'
import opener from '../../../../ranges/data/utg/rfi.json'

const openSize = (stack: number, type: string): number =>
  (opener as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const line = (stack: number, type = 'cEV') =>
  `R${openSize(stack, type)}-F-F-F`

/** CO defense vs a UTG open, ChipEV */
export const CO_VS_UTG_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 5))

/** CO defense vs a UTG open on the ICM bubble (200-man) */
export const CO_VS_UTG_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 5, ICM_GAMETYPE))
export const CO_VS_UTG: StoredRange[] = [...CO_VS_UTG_CEV, ...CO_VS_UTG_ICM]
