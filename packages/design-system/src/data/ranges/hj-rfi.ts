// HJ RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/hj/rfi.json — shared title/position at the
// top, one entry per stack. cEV and ICM entries share the store file; the
// loaders split them by type (HJ_RFI_CEV / HJ_RFI_ICM) and
// HJ_RFI combines both — RangeBrowser shows a solution-type selector
// when a group is mixed. materializeLine injects the shared fields and the
// Wizard link (built from the stack — HJ acts after "F-F-F",
// history_spot 4).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/hj/rfi.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const COVERING = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covering') }
const COVERED_DEEP = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-deep') }
const url = (stack: number, e: StoredRange) =>
  e.config ? preflopUrlStacks(e.config, 'F-F-F', 4, ICM_GAMETYPE)
           : preflopUrl(stack, 'F-F-F', 4)

/** HJ RFI solutions, ChipEV, grouped by stack for RangeBrowser */
export const HJ_RFI_CEV: StoredRange[] = materializeLine(CEV, (stack) => preflopUrl(stack, 'F-F-F', 4))

/** HJ RFI solutions on the ICM bubble gametype (200-man, 33 left) */
export const HJ_RFI_ICM: StoredRange[] = materializeLine(ICM, (stack) => preflopUrl(stack, 'F-F-F', 4, ICM_GAMETYPE))

/** HJ RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const HJ_RFI_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F-F-F', 4, ICM_FT_GAMETYPE))

/** HJ opens covering the table on the bubble (BM3) */
export const HJ_RFI_COVERING: StoredRange[] = materializeLine(COVERING, url)

/** HJ opens covered by much bigger stacks on the bubble (BM2) */
export const HJ_RFI_COVERED_DEEP: StoredRange[] = materializeLine(COVERED_DEEP, url)

/** HJ RFI solutions, all solution types combined */

/** HJ opens covered at the 200-man final table (ICM, FT payouts) */
export const HJ_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covered-deep') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F', 4, ICM_FT_GAMETYPE))

/** HJ opens covering the table at the 200-man final table (ICM, FT payouts) */
export const HJ_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covering') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F-F-F', 4, ICM_FT_GAMETYPE))
export const HJ_RFI: StoredRange[] = [...HJ_RFI_CEV, ...HJ_RFI_ICM, ...HJ_RFI_ICM_FT, ...HJ_RFI_COVERING, ...HJ_RFI_COVERED_DEEP, ...HJ_RFI_ICM_FT_COVERED_DEEP, ...HJ_RFI_ICM_FT_COVERING]
