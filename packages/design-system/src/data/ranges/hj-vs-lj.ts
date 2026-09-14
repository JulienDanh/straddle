// HJ defense vs a LJ open, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/hj/vs-lj.json (HJ acts after
// the LJ open, history_spot 4). The open size is read from
// lj/rfi.json per solution type — it varies with depth and ICM.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/hj/vs-lj.json'
import opener from '../../../../ranges/data/lj/rfi.json'

const openSize = (stack: number, type: string): number =>
  (opener as { stacks: { type: string; stack: number; sizings?: { raise?: number } }[] }).stacks
    .find((s) => s.type === type && s.stack === stack)?.sizings?.raise ?? 2
const line = (stack: number, type = 'cEV') =>
  `F-F-R${openSize(stack, type)}`

/** HJ defense vs a LJ open, ChipEV */
export const HJ_VS_LJ_CEV: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') },
  (stack) => preflopUrl(stack, line(stack), 4))

/** HJ defense vs a LJ open on the ICM bubble (200-man) */
export const HJ_VS_LJ_ICM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') },
  (stack) => preflopUrl(stack, line(stack, 'ICM'), 4, ICM_GAMETYPE))
export const HJ_VS_LJ: StoredRange[] = [...HJ_VS_LJ_CEV, ...HJ_VS_LJ_ICM]
