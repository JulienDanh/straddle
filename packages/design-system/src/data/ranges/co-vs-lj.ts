// CO defense vs a LJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/co/vs-lj.json (CO acts after
// the LJ open, history_spot 5). The open size is read from
// lj/rfi.json per solution type — it varies with depth and ICM.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/co/vs-lj.json'
import opener from '../../../../ranges/data/lj/rfi.json'

const openSize = (stack: number, type: string): number =>
  (opener as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const line = (stack: number, type = 'cEV') =>
  `F-F-R${openSize(stack, type)}-F`

/** CO defense vs a LJ open, ChipEV */
export const CO_VS_LJ_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 5))

/** CO defense vs a LJ open on the ICM bubble (200-man) */
export const CO_VS_LJ_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 5, ICM_GAMETYPE))
export const CO_VS_LJ: StoredRange[] = [...CO_VS_LJ_CEV, ...CO_VS_LJ_ICM]
