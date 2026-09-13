import { useEffect, useState } from 'react'
import { Section, Callout } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import type { StoredRange } from '@poker/design-system/src/data/ranges'
import {
  UTG_RFI, UTG1_RFI, LJ_RFI, HJ_RFI, CO_RFI, BTN_RFI,
  SB_RFI, SB_VS_UTG, SB_VS_UTG1, SB_VS_LJ, SB_VS_HJ, SB_VS_CO, SB_VS_BTN,
  HJ_VS_UTG, BTN_VS_UTG, UTG_VS_3BET_HJ, UTG_VS_3BET_BTN, UTG_VS_3BET_BB,
  BB_VS_UTG, BB_VS_UTG1, BB_VS_LJ, BB_VS_HJ, BB_VS_CO, BB_VS_BTN,
  BB_VS_SB_LIMP, BB_VS_SB_RAISE,
} from '@poker/design-system/src/data/ranges'

interface NavItem {
  id: string
  label: string
  ranges: StoredRange[]
}

const OPENS: NavItem[] = [
  { id: 'utg', label: 'UTG', ranges: UTG_RFI },
  { id: 'utg1', label: 'UTG+1', ranges: UTG1_RFI },
  { id: 'lj', label: 'LJ', ranges: LJ_RFI },
  { id: 'hj', label: 'HJ', ranges: HJ_RFI },
  { id: 'co', label: 'CO', ranges: CO_RFI },
  { id: 'btn', label: 'BTN', ranges: BTN_RFI },
  { id: 'sb-rfi', label: 'SB first in', ranges: SB_RFI },
]

// defense rows: one row per defender; BvB gets its own BB row
const DEFENSE: { defender: string; items: NavItem[] }[] = [
  {
    defender: 'SB',
    items: [
      { id: 'sb-vs-utg', label: 'UTG', ranges: SB_VS_UTG },
      { id: 'sb-vs-utg1', label: 'UTG+1', ranges: SB_VS_UTG1 },
      { id: 'sb-vs-lj', label: 'LJ', ranges: SB_VS_LJ },
      { id: 'sb-vs-hj', label: 'HJ', ranges: SB_VS_HJ },
      { id: 'sb-vs-co', label: 'CO', ranges: SB_VS_CO },
      { id: 'sb-vs-btn', label: 'BTN', ranges: SB_VS_BTN },
    ],
  },
  {
    defender: 'HJ',
    items: [
      { id: 'hj-vs-utg', label: 'UTG', ranges: HJ_VS_UTG },
    ],
  },
  {
    defender: 'BTN',
    items: [
      { id: 'btn-vs-utg', label: 'UTG', ranges: BTN_VS_UTG },
    ],
  },
  {
    defender: 'BB',
    items: [
      { id: 'bb-vs-utg', label: 'UTG', ranges: BB_VS_UTG },
      { id: 'bb-vs-utg1', label: 'UTG+1', ranges: BB_VS_UTG1 },
      { id: 'bb-vs-lj', label: 'LJ', ranges: BB_VS_LJ },
      { id: 'bb-vs-hj', label: 'HJ', ranges: BB_VS_HJ },
      { id: 'bb-vs-co', label: 'CO', ranges: BB_VS_CO },
      { id: 'bb-vs-btn', label: 'BTN', ranges: BB_VS_BTN },
    ],
  },
]

const BLIND_VS_BLIND: NavItem[] = [
  { id: 'bb-vs-sb-limp', label: 'SB limp', ranges: BB_VS_SB_LIMP },
  { id: 'bb-vs-sb-raise', label: 'SB raise', ranges: BB_VS_SB_RAISE },
]

const VS_3BET: NavItem[] = [
  { id: 'utg-vs-3bet-hj', label: 'HJ', ranges: UTG_VS_3BET_HJ },
  { id: 'utg-vs-3bet-btn', label: 'BTN', ranges: UTG_VS_3BET_BTN },
  { id: 'utg-vs-3bet-bb', label: 'BB', ranges: UTG_VS_3BET_BB },
]

const ALL_ITEMS = [...OPENS, ...DEFENSE.flatMap(r => r.items), ...BLIND_VS_BLIND, ...VS_3BET]



const SectionLabel = ({ children }: { children: string }) => (
  <div className="text-[10px] font-bold uppercase tracking-widest text-muted px-2.5 pt-3.5 pb-1">
    {children}
  </div>
)

const pill = (active: boolean) =>
  `px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-colors ${
    active ? 'bg-accent text-dark' : 'text-txt/80 bg-panel2/60 hover:bg-panel2 hover:text-txt'
  }`

const DefenderBadge = ({ children }: { children: string }) => (
  <span className="shrink-0 w-7 text-center text-[10px] font-bold text-muted bg-dark rounded-md py-1.5">
    {children}
  </span>
)


export function RangesPage() {
  // spot selection persists in the hash (#ranges/<spot>) — restored on mount,
  // kept in sync on hash changes (back/forward), and the RangeBrowser
  // appends its own stack/type/board segments
  const [selected, setSelected] = useState(() => {
    const seg = window.location.hash.split('/')[1]
    return ALL_ITEMS.find(i => i.id === seg)?.id ?? ALL_ITEMS[0].id
  })
  useEffect(() => {
    const onHash = () => {
      const seg = window.location.hash.split('/')[1]
      if (ALL_ITEMS.some(i => i.id === seg)) setSelected(seg)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const item = ALL_ITEMS.find(i => i.id === selected) ?? ALL_ITEMS[0]
  const selectItem = (id: string) => {
    setSelected(id)
    window.history.replaceState(null, '',
      `${window.location.pathname}${window.location.search}#ranges/${id}`)
  }

  return (
    <Section title="Range Library">
      <p>
        Every solved preflop range in the course, straight from GTO Wizard
        (MTT 8-max). Each panel carries both solution types: ChipEV is the
        pure chip ladder, ICM is the 200-man bubble (33 players left) —
        switch between them to see how the bubble tightens ranges.
      </p>

      <Callout>
        Ranges are strategy references, not memorization targets. Use the
        stack selector to see how the shape changes with depth, and the
        GTO Wizard link to inspect any spot in full.
      </Callout>

      <div className="flex gap-6 items-start mt-2">
        <nav className="w-72 shrink-0 rounded-xl border border-line bg-panel sticky top-16 pb-3 overflow-hidden">
          <SectionLabel>Opens</SectionLabel>
          <div className="flex flex-wrap gap-1.5 px-2.5">
            {OPENS.map(it => (
              <button key={it.id} onClick={() => selectItem(it.id)} className={pill(selected === it.id)}>
                {it.label}
              </button>
            ))}
          </div>

          <SectionLabel>Defense vs opens</SectionLabel>
          <div className="px-2.5 flex flex-col gap-1.5">
            {DEFENSE.map(row => (
              <div key={row.defender} className="flex items-start gap-1.5">
                <DefenderBadge>{row.defender}</DefenderBadge>
                <div className="flex flex-wrap gap-1.5">
                  {row.items.map(it => (
                    <button key={it.id} onClick={() => selectItem(it.id)} className={pill(selected === it.id)}>
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-1.5">
              <DefenderBadge>BB</DefenderBadge>
              <div className="flex flex-wrap gap-1.5">
                {BLIND_VS_BLIND.map(it => (
                  <button key={it.id} onClick={() => selectItem(it.id)} className={pill(selected === it.id)}>
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SectionLabel>UTG vs 3-bets</SectionLabel>
          <div className="flex flex-wrap gap-1.5 px-2.5">
            {VS_3BET.map(it => (
              <button key={it.id} onClick={() => selectItem(it.id)} className={pill(selected === it.id)}>
                vs {it.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="min-w-0 flex-1">
          {/* key remounts the browser per spot: fresh stack/type selection,
              and the fixed-width panel centers in the remaining space */}
          <RangeBrowser key={item.id} ranges={item.ranges} hashPrefix={`#ranges/${item.id}`} />
        </div>
      </div>
    </Section>
  )
}
