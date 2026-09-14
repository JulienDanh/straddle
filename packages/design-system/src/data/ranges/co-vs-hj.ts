// CO defense vs a HJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/co/vs-hj.json (CO acts after
// the HJ open, history_spot 5). The open size is read from
// hj/rfi.json per solution type — it varies with depth and ICM.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/co/vs-hj.json'
import opener from '../../../../ranges/data/hj/rfi.json'

const openSize = (stack: number, type: string): number =>
  (opener as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const line = (stack: number, type = 'cEV') =>
  `F-F-F-R${openSize(stack, type)}`

/** CO defense vs a HJ open, ChipEV */
export const CO_VS_HJ_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 5))

/** CO defense vs a HJ open on the ICM bubble (200-man) */
export const CO_VS_HJ_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 5, ICM_GAMETYPE))
export const CO_VS_HJ: StoredRange[] = [...CO_VS_HJ_CEV, ...CO_VS_HJ_ICM]
