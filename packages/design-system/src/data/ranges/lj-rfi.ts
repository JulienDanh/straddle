// LJ RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/lj/rfi.json — shared title/position at the
// top, one entry per stack. cEV and ICM entries share the store file; the
// loaders split them by type (LJ_RFI_CEV / LJ_RFI_ICM) and
// LJ_RFI combines both — RangeBrowser shows a solution-type selector
// when a group is mixed. materializeLine injects the shared fields and the
// Wizard link (built from the stack — LJ acts after "F-F",
// history_spot 3).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/lj/rfi.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const COVERING = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covering') }
const COVERED_SIMILAR = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-similar') }
const COVERED_DEEP = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-deep') }
const url = (stack: number, e: StoredRange) =>
  e.config ? preflopUrlStacks(e.config, 'F-F', 3, ICM_GAMETYPE)
           : preflopUrl(stack, 'F-F', 3)

/** LJ RFI solutions, ChipEV, grouped by stack for RangeBrowser */
export const LJ_RFI_CEV: StoredRange[] = materializeLine(CEV, (stack) => preflopUrl(stack, 'F-F', 3))

/** LJ RFI solutions on the ICM bubble gametype (200-man, 33 left) */
export const LJ_RFI_ICM: StoredRange[] = materializeLine(ICM, (stack) => preflopUrl(stack, 'F-F', 3, ICM_GAMETYPE))

/** LJ RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const LJ_RFI_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F', 3, ICM_FT_GAMETYPE))

/** LJ opens covering the table on the bubble (BM3) */
export const LJ_RFI_COVERING: StoredRange[] = materializeLine(COVERING, url)

/** LJ opens covered by a close stack on the bubble (BM2) */
export const LJ_RFI_COVERED_SIMILAR: StoredRange[] = materializeLine(COVERED_SIMILAR, url)

/** LJ RFI solutions, all solution types combined */
/** LJ opens covered by much bigger stacks on the bubble (BM2) */
export const LJ_RFI_COVERED_DEEP: StoredRange[] = materializeLine(COVERED_DEEP, url)

/** LJ RFI solutions, all solution types combined */

/** LJ opens covered at the 200-man final table (ICM, FT payouts) */
export const LJ_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covered-deep') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F', 3, ICM_FT_GAMETYPE))

/** LJ opens covering the table at the 200-man final table (ICM, FT payouts) */
export const LJ_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covering') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F', 3, ICM_FT_GAMETYPE))
export const LJ_RFI: StoredRange[] = [...LJ_RFI_CEV, ...LJ_RFI_ICM, ...LJ_RFI_ICM_FT, ...LJ_RFI_COVERING, ...LJ_RFI_COVERED_SIMILAR, ...LJ_RFI_COVERED_DEEP, ...LJ_RFI_ICM_FT_COVERED_DEEP, ...LJ_RFI_ICM_FT_COVERING]
