// BB's iso-or-check decision vs a SB limp (blind vs blind)
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, ICM_GAMETYPE } from './types'
import data from '../../../../ranges/data/bb/vs-sb-limp.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }

/** BB vs a SB limp, ChipEV */
export const BB_VS_SB_LIMP_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-F-F-F-C', 8))

/** BB vs a SB limp on the ICM bubble (200-man, 33 left) */
export const BB_VS_SB_LIMP_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-F-F-F-C', 8, ICM_GAMETYPE))

/** BB vs a SB limp, both solution types combined */
export const BB_VS_SB_LIMP: StoredRange[] = [...BB_VS_SB_LIMP_CEV, ...BB_VS_SB_LIMP_ICM]
