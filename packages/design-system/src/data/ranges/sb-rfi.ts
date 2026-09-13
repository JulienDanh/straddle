// SB first-in solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/sb/rfi.json — the SB node's `call` action is a
// LIMP, so groups carry call/raise/allIn. cEV and ICM entries share the
// store file; the loaders split them by type and SB_RFI combines both.
// The ICM gametype is preflop-only, so no blind-vs-blind continuations
// exist — only SB's own decision.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/sb/rfi.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const COVERING = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covering') }
const COVERED_DEEP = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-deep') }
const COVERED_SIMILAR = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-similar') }
const url = (stack: number, e: StoredRange) =>
  e.config ? preflopUrlStacks(e.config, 'F-F-F-F-F-F', 7, ICM_GAMETYPE)
           : preflopUrl(stack, 'F-F-F-F-F-F', 7)

/** SB first-in (limp/raise), ChipEV */
export const SB_RFI_CEV: StoredRange[] = materializeLine(
  CEV, (stack) => preflopUrl(stack, 'F-F-F-F-F-F', 7))

/** SB first-in (limp/raise) on the ICM bubble (200-man, 33 left) */
export const SB_RFI_ICM: StoredRange[] = materializeLine(
  ICM, (stack) => preflopUrl(stack, 'F-F-F-F-F-F', 7, ICM_GAMETYPE))

/** SB first-in (limp/raise) at the 200-man final table (ICM, FT payouts) */
export const SB_RFI_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F-F-F-F', 7, ICM_FT_GAMETYPE))

/** SB first-in covering the table on the bubble (BM3) */
export const SB_RFI_COVERING: StoredRange[] = materializeLine(COVERING, url)

/** SB first-in covered by much bigger stacks on the bubble (BM2) */
export const SB_RFI_COVERED_DEEP: StoredRange[] = materializeLine(COVERED_DEEP, url)

/** SB first-in covered by a close stack on the bubble (BM2) */
export const SB_RFI_COVERED_SIMILAR: StoredRange[] = materializeLine(COVERED_SIMILAR, url)

/** SB first-in (limp/raise), all solution types combined */

/** SB first-in opens covered at the 200-man final table (ICM, FT payouts) */
export const SB_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covered-deep') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-F-F-F', 7, ICM_FT_GAMETYPE))

/** SB first-in opens covering the table at the 200-man final table (ICM, FT payouts) */
export const SB_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covering') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F-F-F-F', 7, ICM_FT_GAMETYPE))
export const SB_RFI: StoredRange[] = [...SB_RFI_CEV, ...SB_RFI_ICM, ...SB_RFI_ICM_FT, ...SB_RFI_COVERING, ...SB_RFI_COVERED_DEEP, ...SB_RFI_COVERED_SIMILAR, ...SB_RFI_ICM_FT_COVERED_DEEP, ...SB_RFI_ICM_FT_COVERING]
