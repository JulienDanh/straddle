// CO RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/co/rfi.json. cEV, ICM (equal stacks) and the
// asymmetric ICM-covered config share the store file and surface as
// separate solution types in the panel toggle.
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, CEV_GAMETYPE, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/co/rfi.json'

const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })
const url = (stack: number, e: StoredRange, gametype: string) =>
  e.config ? preflopUrlStacks(e.config, 'F-F-F-F', 5, gametype)
           : preflopUrl(stack, 'F-F-F-F', 5, gametype)

/** CO RFI solutions, ChipEV */
export const CO_RFI_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack, e) => url(stack, e, CEV_GAMETYPE))

/** CO RFI on the ICM bubble, equal stacks */
export const CO_RFI_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** CO RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const CO_RFI_ICM_FT: StoredRange[] = materializeLine(
  of('ICM-FT'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** CO opens covered by much bigger stacks on the bubble (BM2) */
export const CO_RFI_COVERED: StoredRange[] = materializeLine(
  of('ICM-covered-deep'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** CO opens covering the table on the bubble (BM3) */
export const CO_RFI_COVERING: StoredRange[] = materializeLine(
  of('ICM-covering'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** CO opens covering the table at the 200-man final table (ICM, FT payouts) */
export const CO_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  of('ICM-FT-covering'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** CO opens covered at the 200-man final table (ICM, FT payouts) */
export const CO_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  of('ICM-FT-covered-deep'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** CO RFI, all solution types combined */
export const CO_RFI: StoredRange[] = [...CO_RFI_CEV, ...CO_RFI_ICM, ...CO_RFI_ICM_FT, ...CO_RFI_COVERED, ...CO_RFI_COVERING, ...CO_RFI_ICM_FT_COVERING, ...CO_RFI_ICM_FT_COVERED_DEEP]
