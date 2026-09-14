// UTG RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/utg/rfi.json. cEV, ICM (equal stacks) and the
// asymmetric ICM-covering configs share the store file and surface as
// separate solution types in the panel toggle. The 40bb cEV entry carries
// the S1 postflop c-bet spots as `postflop` children (raw Wizard pastes).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, CEV_GAMETYPE, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/utg/rfi.json'

const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })
const url = (stack: number, e: StoredRange, gametype: string) =>
  e.config ? preflopUrlStacks(e.config, '', 1, gametype)
           : preflopUrl(stack, '', 1, gametype)

/** UTG RFI solutions, ChipEV */
export const UTG_RFI_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack, e) => url(stack, e, CEV_GAMETYPE))

/** UTG RFI on the ICM bubble, equal stacks */
export const UTG_RFI_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** UTG RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const UTG_RFI_ICM_FT: StoredRange[] = materializeLine(
  of('ICM-FT'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** UTG opens covering on the ICM bubble (BM3) */
export const UTG_RFI_COVERING: StoredRange[] = materializeLine(
  of('ICM-covering'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** UTG opens covered by much bigger stacks on the bubble (BM2) */
export const UTG_RFI_COVERED_DEEP: StoredRange[] = materializeLine(
  of('ICM-covered-deep'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** UTG opens covered at the 200-man final table (ICM, FT payouts) */
export const UTG_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  of('ICM-FT-covered-deep'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** UTG opens covering the table at the 200-man final table (ICM, FT payouts) */
export const UTG_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  of('ICM-FT-covering'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** UTG opens covered by a close stack on the bubble (BM2 "game of chicken") */
export const UTG_RFI_COVERED_SIMILAR: StoredRange[] = materializeLine(
  of('ICM-covered-similar'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** UTG RFI, all solution types combined */
export const UTG_RFI: StoredRange[] = [...UTG_RFI_CEV, ...UTG_RFI_ICM, ...UTG_RFI_ICM_FT, ...UTG_RFI_COVERING, ...UTG_RFI_COVERED_DEEP, ...UTG_RFI_COVERED_SIMILAR, ...UTG_RFI_ICM_FT_COVERED_DEEP, ...UTG_RFI_ICM_FT_COVERING]

/** Equal stacks only (cEV + ICM bubble) — the BM1/BM7 comparison set */
export const UTG_RFI_EQUAL: StoredRange[] = [...UTG_RFI_CEV, ...UTG_RFI_ICM]
