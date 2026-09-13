// BB defense vs a UTG+1 open
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-utg1.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** BB defense vs a UTG+1 open, ChipEV */
export const BB_VS_UTG1_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-R2-F-F-F-F-F', 8))

/** BB defense vs a UTG+1 open on the ICM bubble (200-man, 33 left) */
export const BB_VS_UTG1_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-R2-F-F-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a UTG+1 open, both solution types combined */
/** BB defense vs a UTG+1 open, asymmetric bubble configs */
export const BB_VS_UTG1_ASYM: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.config) },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-R2-F-F-F-F-F', 8, ICM_GAMETYPE))

/** BB defense vs a UTG+1 open, all solution types combined */
export const BB_VS_UTG1: StoredRange[] = [...BB_VS_UTG1_CEV, ...BB_VS_UTG1_ICM, ...BB_VS_UTG1_ASYM]
