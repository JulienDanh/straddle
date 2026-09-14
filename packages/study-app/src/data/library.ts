// The spot map for the Live page: every line, its label, and its ranges —
// one source of truth for the app's range navigation.
import type { StoredRange } from '@poker/design-system/src/data/ranges'
import {
  UTG_RFI, UTG1_RFI, LJ_RFI, HJ_RFI, CO_RFI, BTN_RFI,
  SB_RFI, SB_VS_UTG, SB_VS_UTG1, SB_VS_LJ, SB_VS_HJ, SB_VS_CO, SB_VS_BTN,
  UTG1_VS_UTG, LJ_VS_UTG, LJ_VS_UTG1, HJ_VS_UTG, HJ_VS_UTG1, HJ_VS_LJ,
  CO_VS_UTG, CO_VS_UTG1, CO_VS_LJ, CO_VS_HJ,
  BTN_VS_UTG, BTN_VS_UTG1, BTN_VS_LJ, BTN_VS_HJ, BTN_VS_CO,
  UTG_VS_3BET_HJ, UTG_VS_3BET_BTN, UTG_VS_3BET_BB, UTG_VS_3BET_CO,
  UTG_VS_3BET_LJ, UTG_VS_3BET_SB, UTG_VS_3BET_UTG1,
  UTG1_VS_3BET_BB, UTG1_VS_3BET_BTN, UTG1_VS_3BET_CO, UTG1_VS_3BET_HJ,
  UTG1_VS_3BET_LJ, UTG1_VS_3BET_SB,
  LJ_VS_3BET_BB, LJ_VS_3BET_BTN, LJ_VS_3BET_CO, LJ_VS_3BET_HJ, LJ_VS_3BET_SB,
  HJ_VS_3BET_BB, HJ_VS_3BET_BTN, HJ_VS_3BET_CO, HJ_VS_3BET_SB,
  CO_VS_3BET_BB, CO_VS_3BET_BTN, CO_VS_3BET_SB,
  BTN_VS_3BET_BB, BTN_VS_3BET_SB,
  BB_VS_UTG, BB_VS_UTG1, BB_VS_LJ, BB_VS_HJ, BB_VS_CO, BB_VS_BTN,
  BB_VS_SB_LIMP, BB_VS_SB_RAISE,
} from '@poker/design-system/src/data/ranges'

export interface NavItem {
  id: string
  label: string
  ranges: StoredRange[]
}

export const OPENS: NavItem[] = [
  { id: 'utg', label: 'UTG', ranges: UTG_RFI },
  { id: 'utg1', label: 'UTG+1', ranges: UTG1_RFI },
  { id: 'lj', label: 'LJ', ranges: LJ_RFI },
  { id: 'hj', label: 'HJ', ranges: HJ_RFI },
  { id: 'co', label: 'CO', ranges: CO_RFI },
  { id: 'btn', label: 'BTN', ranges: BTN_RFI },
  { id: 'sb-rfi', label: 'SB first in', ranges: SB_RFI },
]

export const DEFENSE: { defender: string; items: NavItem[] }[] = [
  { defender: 'SB', items: [
    { id: 'sb-vs-utg', label: 'UTG', ranges: SB_VS_UTG },
    { id: 'sb-vs-utg1', label: 'UTG+1', ranges: SB_VS_UTG1 },
    { id: 'sb-vs-lj', label: 'LJ', ranges: SB_VS_LJ },
    { id: 'sb-vs-hj', label: 'HJ', ranges: SB_VS_HJ },
    { id: 'sb-vs-co', label: 'CO', ranges: SB_VS_CO },
    { id: 'sb-vs-btn', label: 'BTN', ranges: SB_VS_BTN },
  ] },
  { defender: 'UTG+1', items: [
    { id: 'utg1-vs-utg', label: 'UTG', ranges: UTG1_VS_UTG },
  ] },
  { defender: 'LJ', items: [
    { id: 'lj-vs-utg', label: 'UTG', ranges: LJ_VS_UTG },
    { id: 'lj-vs-utg1', label: 'UTG+1', ranges: LJ_VS_UTG1 },
  ] },
  { defender: 'HJ', items: [
    { id: 'hj-vs-utg', label: 'UTG', ranges: HJ_VS_UTG },
    { id: 'hj-vs-utg1', label: 'UTG+1', ranges: HJ_VS_UTG1 },
    { id: 'hj-vs-lj', label: 'LJ', ranges: HJ_VS_LJ },
  ] },
  { defender: 'CO', items: [
    { id: 'co-vs-utg', label: 'UTG', ranges: CO_VS_UTG },
    { id: 'co-vs-utg1', label: 'UTG+1', ranges: CO_VS_UTG1 },
    { id: 'co-vs-lj', label: 'LJ', ranges: CO_VS_LJ },
    { id: 'co-vs-hj', label: 'HJ', ranges: CO_VS_HJ },
  ] },
  { defender: 'BTN', items: [
    { id: 'btn-vs-utg', label: 'UTG', ranges: BTN_VS_UTG },
    { id: 'btn-vs-utg1', label: 'UTG+1', ranges: BTN_VS_UTG1 },
    { id: 'btn-vs-lj', label: 'LJ', ranges: BTN_VS_LJ },
    { id: 'btn-vs-hj', label: 'HJ', ranges: BTN_VS_HJ },
    { id: 'btn-vs-co', label: 'CO', ranges: BTN_VS_CO },
  ] },
  { defender: 'BB', items: [
    { id: 'bb-vs-utg', label: 'UTG', ranges: BB_VS_UTG },
    { id: 'bb-vs-utg1', label: 'UTG+1', ranges: BB_VS_UTG1 },
    { id: 'bb-vs-lj', label: 'LJ', ranges: BB_VS_LJ },
    { id: 'bb-vs-hj', label: 'HJ', ranges: BB_VS_HJ },
    { id: 'bb-vs-co', label: 'CO', ranges: BB_VS_CO },
    { id: 'bb-vs-btn', label: 'BTN', ranges: BB_VS_BTN },
  ] },
]

export const BLIND_VS_BLIND: NavItem[] = [
  { id: 'bb-vs-sb-limp', label: 'SB limp', ranges: BB_VS_SB_LIMP },
  { id: 'bb-vs-sb-raise', label: 'SB raise', ranges: BB_VS_SB_RAISE },
]

export const VS_3BET: { opener: string; items: NavItem[] }[] = [
  { opener: 'UTG', items: [
    { id: 'utg-vs-3bet-utg1', label: 'UTG+1', ranges: UTG_VS_3BET_UTG1 },
    { id: 'utg-vs-3bet-lj', label: 'LJ', ranges: UTG_VS_3BET_LJ },
    { id: 'utg-vs-3bet-hj', label: 'HJ', ranges: UTG_VS_3BET_HJ },
    { id: 'utg-vs-3bet-co', label: 'CO', ranges: UTG_VS_3BET_CO },
    { id: 'utg-vs-3bet-btn', label: 'BTN', ranges: UTG_VS_3BET_BTN },
    { id: 'utg-vs-3bet-sb', label: 'SB', ranges: UTG_VS_3BET_SB },
    { id: 'utg-vs-3bet-bb', label: 'BB', ranges: UTG_VS_3BET_BB },
  ] },
  { opener: 'UTG+1', items: [
    { id: 'utg1-vs-3bet-lj', label: 'LJ', ranges: UTG1_VS_3BET_LJ },
    { id: 'utg1-vs-3bet-hj', label: 'HJ', ranges: UTG1_VS_3BET_HJ },
    { id: 'utg1-vs-3bet-co', label: 'CO', ranges: UTG1_VS_3BET_CO },
    { id: 'utg1-vs-3bet-btn', label: 'BTN', ranges: UTG1_VS_3BET_BTN },
    { id: 'utg1-vs-3bet-sb', label: 'SB', ranges: UTG1_VS_3BET_SB },
    { id: 'utg1-vs-3bet-bb', label: 'BB', ranges: UTG1_VS_3BET_BB },
  ] },
  { opener: 'LJ', items: [
    { id: 'lj-vs-3bet-hj', label: 'HJ', ranges: LJ_VS_3BET_HJ },
    { id: 'lj-vs-3bet-co', label: 'CO', ranges: LJ_VS_3BET_CO },
    { id: 'lj-vs-3bet-btn', label: 'BTN', ranges: LJ_VS_3BET_BTN },
    { id: 'lj-vs-3bet-sb', label: 'SB', ranges: LJ_VS_3BET_SB },
    { id: 'lj-vs-3bet-bb', label: 'BB', ranges: LJ_VS_3BET_BB },
  ] },
  { opener: 'HJ', items: [
    { id: 'hj-vs-3bet-co', label: 'CO', ranges: HJ_VS_3BET_CO },
    { id: 'hj-vs-3bet-btn', label: 'BTN', ranges: HJ_VS_3BET_BTN },
    { id: 'hj-vs-3bet-sb', label: 'SB', ranges: HJ_VS_3BET_SB },
    { id: 'hj-vs-3bet-bb', label: 'BB', ranges: HJ_VS_3BET_BB },
  ] },
  { opener: 'CO', items: [
    { id: 'co-vs-3bet-btn', label: 'BTN', ranges: CO_VS_3BET_BTN },
    { id: 'co-vs-3bet-sb', label: 'SB', ranges: CO_VS_3BET_SB },
    { id: 'co-vs-3bet-bb', label: 'BB', ranges: CO_VS_3BET_BB },
  ] },
  { opener: 'BTN', items: [
    { id: 'btn-vs-3bet-sb', label: 'SB', ranges: BTN_VS_3BET_SB },
    { id: 'btn-vs-3bet-bb', label: 'BB', ranges: BTN_VS_3BET_BB },
  ] },
]

export interface NavGroup { label?: string; items: NavItem[] }
export interface NavSection { id: string; label: string; groups: NavGroup[] }

export const SECTIONS: NavSection[] = [
  { id: 'sec-opens', label: 'Opens', groups: [{ items: OPENS }] },
  { id: 'sec-defense', label: 'Defends vs opens', groups: DEFENSE.map(d => ({ label: d.defender, items: d.items })) },
  { id: 'sec-bvb', label: 'Blind vs blind', groups: [{ items: BLIND_VS_BLIND }] },
  { id: 'sec-3bet', label: 'Facing 3-bets', groups: VS_3BET.map(v => ({ label: v.opener, items: v.items })) },
]

export const ALL_ITEMS: NavItem[] = SECTIONS.flatMap(s => s.groups.flatMap(g => g.items))
