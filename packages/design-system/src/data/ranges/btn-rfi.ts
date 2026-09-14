// BTN RFI solutions, grouped by stack depth for RangeBrowser.
// Data lives in ranges/data/btn/rfi.json. One file per preflop line: cEV,
// ICM (equal stacks) and the asymmetric ICM-covered configs share the store
// file and surface as separate solution types in the panel toggle. The
// config-aware Wizard links live here (seat order UTG..BB).
import type { StoredRange } from './types'
import { materializeLine, preflopUrl, preflopUrlStacks, CEV_GAMETYPE, ICM_GAMETYPE, ICM_FT_GAMETYPE } from './types'
import data from '../../../../ranges/data/btn/rfi.json'

const of = (t: string) => ({ ...data, stacks: data.stacks.filter((e) => e.type === t) })
// asymmetric entries carry their seat-ordered config in the store — the
// Wizard link is built from it (equal-stack entries have no config)
const url = (stack: number, e: StoredRange, gametype: string) =>
  e.config ? preflopUrlStacks(e.config, 'F-F-F-F-F', 6, gametype)
           : preflopUrl(stack, 'F-F-F-F-F', 6, gametype)

/** BTN RFI solutions, ChipEV */
export const BTN_RFI_CEV: StoredRange[] = materializeLine(
  of('cEV'), (stack, e) => url(stack, e, CEV_GAMETYPE))

/** BTN RFI on the ICM bubble, equal stacks (200-man, 33 left) */
export const BTN_RFI_ICM: StoredRange[] = materializeLine(
  of('ICM'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** BTN RFI at the 200-man final table, equal stacks (ICM, FT payouts) */
export const BTN_RFI_ICM_FT: StoredRange[] = materializeLine(
  of('ICM-FT'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** BTN opens covered by a much bigger stack on the bubble (BM2 "by heaps") */
export const BTN_RFI_COVERED_DEEP: StoredRange[] = materializeLine(
  of('ICM-covered-deep'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** BTN opens covered by a close stack on the bubble (BM2 "game of chicken") */
export const BTN_RFI_COVERED_SIMILAR: StoredRange[] = materializeLine(
  of('ICM-covered-similar'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** BTN opens covering the table on the bubble (BM3) */
export const BTN_RFI_COVERING: StoredRange[] = materializeLine(
  of('ICM-covering'), (stack, e) => url(stack, e, ICM_GAMETYPE))

/** BTN opens covering the table at the 200-man final table (ICM, FT payouts) */
export const BTN_RFI_ICM_FT_COVERING: StoredRange[] = materializeLine(
  of('ICM-FT-covering'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** BTN opens covered at the 200-man final table (ICM, FT payouts) */
export const BTN_RFI_ICM_FT_COVERED_DEEP: StoredRange[] = materializeLine(
  of('ICM-FT-covered-deep'), (stack, e) => url(stack, e, ICM_FT_GAMETYPE))

/** BTN opens covered on the ICM bubble, both scenarios (BM2) */
export const BTN_RFI_COVERED: StoredRange[] = [...BTN_RFI_COVERED_DEEP, ...BTN_RFI_COVERED_SIMILAR]

/** BTN RFI, all solution types combined */
export const BTN_RFI: StoredRange[] = [...BTN_RFI_CEV, ...BTN_RFI_ICM, ...BTN_RFI_ICM_FT, ...BTN_RFI_COVERED, ...BTN_RFI_COVERING, ...BTN_RFI_ICM_FT_COVERING, ...BTN_RFI_ICM_FT_COVERED_DEEP]

/** Equal stacks only (cEV + ICM bubble) — the BM1 comparison set */
export const BTN_RFI_EQUAL: StoredRange[] = [...BTN_RFI_CEV, ...BTN_RFI_ICM]
