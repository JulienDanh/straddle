// UTG+1 RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/utg1/rfi.json — shared title/position at the
// top, one entry per stack. cEV and ICM entries share the store file; the
// loaders split them by type (UTG1_RFI_CEV / UTG1_RFI_ICM) and
// UTG1_RFI combines both — RangeBrowser shows a solution-type selector
// when a group is mixed. materializeLine injects the shared fields and the
// Wizard link (built from the stack — UTG+1 acts after "F",
// history_spot 2).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/utg1/rfi.json'

const CEV = { ...data, stacks: data.stacks.filter((e) => e.type === 'cEV') }
const ICM = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM') }
const COVERING = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covering') }
const COVERED_SIMILAR = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-similar') }
const COVERED_DEEP = { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-covered-deep') }
const url = (stack: number, e: StoredRange) =>
  e.config ? preflopUrlStacks(e.config, 'F', 2, ICM_GAMETYPE)
           : preflopUrl(stack, 'F', 2)

/** UTG+1 RFI solutions, ChipEV, grouped by stack for RangeBrowser */
export const UTG1_RFI_CEV: StoredRange[] = materializeLine(CEV, (stack) => preflopUrl(stack, 'F', 2))

/** UTG+1 RFI solutions on the ICM bubble gametype (200-man, 33 left) */
export const UTG1_RFI_ICM: StoredRange[] = materializeLine(ICM, (stack) => preflopUrl(stack, 'F', 2, ICM_GAMETYPE))

/** UTG+1 RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const UTG1_RFI_ICM_FT: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT') },
  (stack) => preflopUrl(stack, 'F', 2, ICM_FT_GAMETYPE))

/** UTG+1 opens covering the table on the bubble (BM3) */
export const UTG1_RFI_COVERING: StoredRange[] = materializeLine(COVERING, url)

/** UTG+1 opens covered by a close stack on the bubble (BM2) */
export const UTG1_RFI_COVERED_SIMILAR: StoredRange[] = materializeLine(COVERED_SIMILAR, url)

/** UTG+1 RFI solutions, all solution types combined */
/** UTG+1 opens covered by much bigger stacks on the bubble (BM2) */
export const UTG1_RFI_COVERED_DEEP: StoredRange[] = materializeLine(COVERED_DEEP, url)

/** UTG+1 RFI solutions, all solution types combined */

/** UTG+1 opens covered at the 200-man final table (ICM, FT payouts) */
export const UTG1_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  { ...data, stacks: data.stacks.filter((e) => e.type === 'ICM-FT-covered-deep') },
  (_stack, e) => preflopUrlStacks(e.config!, 'F', 2, ICM_FT_GAMETYPE))
export const UTG1_RFI: StoredRange[] = [...UTG1_RFI_CEV, ...UTG1_RFI_ICM, ...UTG1_RFI_ICM_FT, ...UTG1_RFI_COVERING, ...UTG1_RFI_COVERED_SIMILAR, ...UTG1_RFI_COVERED_DEEP, ...UTG1_RFI_ICM_FT_COVERED_DEEP]
