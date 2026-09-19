import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { PrimerPage } from './pages/Primer'
import { S1Page } from './pages/S1'
import { S2Page } from './pages/S2'
import { S3Page } from './pages/S3'
import { S4Page } from './pages/S4'
import { S5Page } from './pages/S5'
import { S6Page } from './pages/S6'
import { S7Page } from './pages/S7'
import { S8Page } from './pages/S8'
import { S9Page } from './pages/S9'
import { S10Page } from './pages/S10'
import { S11Page } from './pages/S11'
import { S12Page } from './pages/S12'
import { ConclusionPage } from './pages/Conclusion'
import { SizingPage } from './pages/Sizing'
import { BMPrimerPage } from './pages/BMPrimer'
import { BM1Page } from './pages/BM1'
import { BM2Page } from './pages/BM2'
import { BM3Page } from './pages/BM3'
import { BM4Page } from './pages/BM4'
import { BM5Page } from './pages/BM5'
import { BM6Page } from './pages/BM6'
import { BM7Page } from './pages/BM7'
import { BM8Page } from './pages/BM8'
import { BM9Page } from './pages/BM9'
import { BM10Page } from './pages/BM10'
import { BM11Page } from './pages/BM11'
import { P1Page } from './pages/P1'
import { P2Page } from './pages/P2'
import { P3Page } from './pages/P3'
import { P4Page } from './pages/P4'
import { PS1Page } from './pages/PS1'
import { PS2Page } from './pages/PS2'
import { PS3Page } from './pages/PS3'
import { PS4Page } from './pages/PS4'
import { PS5Page } from './pages/PS5'
import { PS6Page } from './pages/PS6'
import { PS7Page } from './pages/PS7'
import { PS8Page } from './pages/PS8'
import { B1Page } from './pages/B1'
import { B2Page } from './pages/B2'
import { B3Page } from './pages/B3'
import { B4Page } from './pages/B4'
import { MW1Page } from './pages/MW1'
import { MW2Page } from './pages/MW2'
import { MW3Page } from './pages/MW3'
import { MW4Page } from './pages/MW4'
import { MW5Page } from './pages/MW5'
import { MW6Page } from './pages/MW6'
import { MW7Page } from './pages/MW7'
import { MW8Page } from './pages/MW8'
import { MW9Page } from './pages/MW9'
import { MW10Page } from './pages/MW10'
import { MW11Page } from './pages/MW11'
import { LP1Page } from './pages/LP1'
import { LP2Page } from './pages/LP2'
import { LP3Page } from './pages/LP3'
import { LP4Page } from './pages/LP4'
import { LP5Page } from './pages/LP5'
import { LP6Page } from './pages/LP6'
import { LP7Page } from './pages/LP7'
import { LP8Page } from './pages/LP8'
import { RS1Page } from './pages/RS1'
import { RS2Page } from './pages/RS2'
import { RS3Page } from './pages/RS3'
import { RS4Page } from './pages/RS4'
import { RS5Page } from './pages/RS5'
import { RS6Page } from './pages/RS6'
import { RS7Page } from './pages/RS7'
import { LiveEqualPage, LiveAsymPage, LivePkoPage } from './pages/LiveBbz'
import { SolverTreesPage } from './pages/SolverTrees'
import { ExamplesPage } from './pages/Examples'
import { NotesPage } from './pages/Notes'

const navTitles: Record<string, { course: string; title: string }> = {
  primer: { course: 'No-Limit Systems', title: 'Preflop Primer' },
  s1: { course: 'No-Limit Systems', title: 'System 1 · UTG vs BB C-bet' },
  s2: { course: 'No-Limit Systems', title: 'System 2 · BTN vs BB C-bet' },
  s3: { course: 'No-Limit Systems', title: 'System 3 · BB vs SB Limp Stab' },
  s4: { course: 'No-Limit Systems', title: 'System 4 · River Bluffing' },
  s5: { course: 'No-Limit Systems', title: 'System 5 · Barreling Med Hands' },
  s6: { course: 'No-Limit Systems', title: 'System 6 · Check-Raising Top Pair' },
  s7: { course: 'No-Limit Systems', title: 'System 7 · C-bet Folding Flops' },
  s8: { course: 'No-Limit Systems', title: 'System 8 · Bet Sizing IP' },
  s9: { course: 'No-Limit Systems', title: 'System 9 · Defending Flops' },
  s10: { course: 'No-Limit Systems', title: 'System 10 · River Value Betting' },
  s11: { course: 'No-Limit Systems', title: 'System 11 · Hero Calling' },
  s12: { course: 'No-Limit Systems', title: 'System 12 · Defending 3-Bets OOP' },
  conclusion: { course: 'No-Limit Systems', title: 'Cross-System Principles' },
  sizing: { course: 'No-Limit Systems', title: 'Sizing — The Bet-Size Tree' },
  examples: { course: 'No-Limit Systems', title: 'Examples — Every System' },
  bmprimer: { course: 'Bubble Mastery', title: 'ICM & FGS Foundations' },
  bm1: { course: 'Bubble Mastery', title: 'ICM vs ChipEV Preflop' },
  bm2: { course: 'Bubble Mastery', title: 'BM2 · Open vs Bigger Stacks (Covered)' },
  bm3: { course: 'Bubble Mastery', title: 'BM3 · Open vs Smaller Stacks (Covering)' },
  bm4: { course: 'Bubble Mastery', title: 'Blind vs Blind' },
  bm5: { course: 'Bubble Mastery', title: 'Blinds Facing Open' },
  bm6: { course: 'Bubble Mastery', title: 'Dealing With 3-Bets' },
  bm7: { course: 'Bubble Mastery', title: 'Identifying Bubble Impact' },
  bm8: { course: 'Bubble Mastery', title: 'BTN Covers BB (Postflop)' },
  bm9: { course: 'Bubble Mastery', title: 'BB Covers BTN (Postflop)' },
  bm10: { course: 'Bubble Mastery', title: 'UTG Covers BB (Postflop)' },
  bm11: { course: 'Bubble Mastery', title: 'Polar Opens · Split Range' },
  p1: { course: 'Pressure Systems', title: 'P1 · Preflop Squeezing' },
  p2: { course: 'Pressure Systems', title: 'P2 · Facing Squeezes' },
  p3: { course: 'Pressure Systems', title: 'P3 · Flop Big-Betting vs BB' },
  p4: { course: 'Pressure Systems', title: 'P4 · Flop Check-Raising from BB' },
  ps1: { course: 'Passive Poker Systems', title: 'PS1 · BB Turn Probe Betting' },
  ps2: { course: 'Passive Poker Systems', title: 'PS2 · Defending vs BB Probes' },
  ps3: { course: 'Passive Poker Systems', title: 'PS3 · River OOP after XC-X' },
  ps4: { course: 'Passive Poker Systems', title: 'PS4 · River after Cbet-X' },
  ps5: { course: 'Passive Poker Systems', title: 'PS5 · River after XR-X' },
  ps6: { course: 'Passive Poker Systems', title: 'PS6 · River OOP after XX-XX' },
  ps7: { course: 'Passive Poker Systems', title: 'PS7 · River IP after XX-XX' },
  ps8: { course: 'Passive Poker Systems', title: 'PS8 · Versatility' },
  b1: { course: 'Bounty MTT', title: 'B1 · Bounty Math & Risk Premiums' },
  b2: { course: 'Bounty MTT', title: 'B2 · PKO Preflop Adjustments' },
  b3: { course: 'Bounty MTT', title: 'B3 · PKO Phase Strategy' },
  b4: { course: 'Bounty MTT', title: 'B4 · Mystery Bounty System' },
  mw1: { course: 'Multiway Systems', title: 'MW1 · Missed BB Donk Bets' },
  mw2: { course: 'Multiway Systems', title: 'MW2 · Missed Flop Bets' },
  mw3: { course: 'Multiway Systems', title: 'MW3 · Poor Flop Raises' },
  mw4: { course: 'Multiway Systems', title: 'MW4 · Missed Flop Squeezes' },
  mw5: { course: 'Multiway Systems', title: 'MW5 · Missed Flop Calls from BB' },
  mw6: { course: 'Multiway Systems', title: 'MW6 · Missed Flop Folds from BB' },
  mw7: { course: 'Multiway Systems', title: 'MW7 · Missed Turn Probe Bets' },
  mw8: { course: 'Multiway Systems', title: 'MW8 · Missed Turn Cbets' },
  mw9: { course: 'Multiway Systems', title: 'MW9 · Missed River Bets as OOP' },
  mw10: { course: 'Multiway Systems', title: 'MW10 · Missed River Bets as IP' },
  mw11: { course: 'Multiway Systems', title: 'MW11 · Missed River Calls' },
  lp1: { course: 'SB Mastery · Limped Pots', title: 'LP1 · SB Limp Raise or Fold' },
  lp2: { course: 'SB Mastery · Limped Pots', title: 'LP2 · SB Flop Betting After a Limp' },
  lp3: { course: 'SB Mastery · Limped Pots', title: 'LP3 · SB Flop Checks & Hand Valuation' },
  lp4: { course: 'SB Mastery · Limped Pots', title: 'LP4 · BB Limped Pot Defense' },
  lp5: { course: 'SB Mastery · Limped Pots', title: 'LP5 · Playing vs the BB Isolation' },
  lp6: { course: 'SB Mastery · Limped Pots', title: 'LP6 · Turn Barrels & Geometric Sizing' },
  lp7: { course: 'SB Mastery · Limped Pots', title: 'LP7 · River Value and Bluffing' },
  lp8: { course: 'SB Mastery · Limped Pots', title: 'LP8 · Exploiting Limped Pot Errors' },
  rs1: { course: 'River Simplifications', title: 'RS1 · Symmetric Ranges by SPR' },
  rs2: { course: 'River Simplifications', title: 'RS2 · Condensed In Position' },
  rs3: { course: 'River Simplifications', title: 'RS3 · Condensed Out of Position' },
  rs4: { course: 'River Simplifications', title: 'RS4 · Condensed IP with Traps' },
  rs5: { course: 'River Simplifications', title: 'RS5 · Condensed OOP with Traps' },
  rs6: { course: 'River Simplifications', title: 'RS6 · Small Bets In Position' },
  rs7: { course: 'River Simplifications', title: 'RS7 · Polar OOP vs Condensed IP' },
  live: { course: '', title: 'Live' },
  liveasym: { course: '', title: 'Live · ICM asym' },
  livepko: { course: '', title: 'Live · PKO' },
  solvertrees: { course: '', title: 'Solver Trees' },
  notes: { course: '', title: 'Daily Notes' },
}

const PAGES = {
  primer: PrimerPage, s1: S1Page, s2: S2Page, s3: S3Page, s4: S4Page,
  s5: S5Page, s6: S6Page, s7: S7Page, s8: S8Page, s9: S9Page,
  s10: S10Page, s11: S11Page, s12: S12Page, conclusion: ConclusionPage, sizing: SizingPage,
  examples: ExamplesPage,
  bmprimer: BMPrimerPage, bm1: BM1Page, bm2: BM2Page, bm3: BM3Page, bm4: BM4Page,
  bm5: BM5Page, bm6: BM6Page, bm7: BM7Page, bm8: BM8Page, bm9: BM9Page, bm10: BM10Page, bm11: BM11Page,
  p1: P1Page, p2: P2Page, p3: P3Page, p4: P4Page,
  ps1: PS1Page, ps2: PS2Page, ps3: PS3Page, ps4: PS4Page,
  ps5: PS5Page, ps6: PS6Page, ps7: PS7Page, ps8: PS8Page,
  b1: B1Page, b2: B2Page, b3: B3Page, b4: B4Page,
  mw1: MW1Page, mw2: MW2Page, mw3: MW3Page, mw4: MW4Page,
  mw5: MW5Page, mw6: MW6Page, mw7: MW7Page, mw8: MW8Page,
  mw9: MW9Page, mw10: MW10Page, mw11: MW11Page,
  lp1: LP1Page, lp2: LP2Page, lp3: LP3Page, lp4: LP4Page,
  lp5: LP5Page, lp6: LP6Page, lp7: LP7Page, lp8: LP8Page,
  rs1: RS1Page, rs2: RS2Page, rs3: RS3Page, rs4: RS4Page,
  rs5: RS5Page, rs6: RS6Page, rs7: RS7Page,
  live: LiveEqualPage, liveasym: LiveAsymPage, livepko: LivePkoPage, solvertrees: SolverTreesPage,
  notes: NotesPage,
} as const

type PageId = keyof typeof PAGES

const VALID_PAGES = new Set(Object.keys(PAGES))

// reading flow for prev/next navigation and arrow keys (tools excluded)
const READING_ORDER: PageId[] = [
  'primer', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8',
  's9', 's10', 's11', 's12', 'conclusion', 'sizing', 'examples',
  'bmprimer', 'bm1', 'bm2', 'bm3', 'bm4', 'bm5', 'bm6',
  'bm7', 'bm8', 'bm9', 'bm10', 'bm11',
  'p1', 'p2', 'p3', 'p4',
  'ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'ps6', 'ps7', 'ps8',
  'b1', 'b2', 'b3', 'b4',
  'mw1', 'mw2', 'mw3', 'mw4', 'mw5', 'mw6',
  'mw7', 'mw8', 'mw9', 'mw10', 'mw11',
  'lp1', 'lp2', 'lp3', 'lp4', 'lp5', 'lp6', 'lp7', 'lp8',
  'rs1', 'rs2', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7',
]

function pageFromHash(): PageId {
  // hash can carry a tab suffix (#s1/practice) — the page is the first segment
  const hash = window.location.hash.replace(/^#/, '').split('/')[0]
  return (VALID_PAGES.has(hash) ? hash : 's1') as PageId
}

const LIVE_LABEL: Partial<Record<PageId, string>> = {
  live: 'BBZ · Pio solutions',
  liveasym: 'BBZ · asymmetric ICM',
  livepko: 'BBZ · PKO',
}

function App() {
  const [page, setPage] = useState<PageId>(pageFromHash)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sync hash → state on back/forward
  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (p: string) => {
    window.location.hash = p
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const PageComponent = PAGES[page]
  const nav = navTitles[page]
  const isLive = page === 'live' || page === 'liveasym' || page === 'livepko'

  // prev/next along the reading order
  const idx = READING_ORDER.indexOf(page)
  const prev = idx > 0 ? READING_ORDER[idx - 1] : null
  const next = idx >= 0 && idx < READING_ORDER.length - 1 ? READING_ORDER[idx + 1] : null

  // arrow keys page through the reading order
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const i = READING_ORDER.indexOf(page)
      if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); navigate(READING_ORDER[i - 1]) }
      if (e.key === 'ArrowRight' && i >= 0 && i < READING_ORDER.length - 1) { e.preventDefault(); navigate(READING_ORDER[i + 1]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page])

  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed inset-0 z-20 bg-black/50 ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar activePage={page} onNavigate={navigate} open={sidebarOpen} />
      <main
        className={
          isLive
            ? 'flex-1 px-8 pt-4 pb-4 min-w-0 mx-auto h-screen overflow-hidden flex flex-col [@media(max-width:760px)]:h-auto [@media(max-width:760px)]:min-h-screen [@media(max-width:760px)]:overflow-y-auto [@media(max-width:760px)]:px-4'
            : 'flex-1 px-8 pt-6 pb-20 min-w-0 max-w-[1000px] mx-auto'
        }
      >
        <div className={`flex items-center justify-between flex-wrap gap-2 ${isLive ? '[@media(max-width:760px)]:mb-4' : 'mb-4'}`}>
          <button
            className="hidden border border-line bg-panel text-txt px-2.5 py-1.5 rounded-lg text-lg cursor-pointer [@media(max-width:760px)]:block"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >≡</button>
          {!isLive && <div className="text-xs text-muted tracking-wide">{nav?.course}</div>}
          {isLive && <span className="inline-block bg-panel border border-line px-3 py-1 rounded-full text-[11px] text-muted">{LIVE_LABEL[page]}</span>}
        </div>
        <div className={isLive ? 'flex-1 min-h-0' : undefined}>
          <PageComponent />
        </div>
        {(prev || next) && (
          <div className="mt-8">
            <div className="flex items-stretch justify-between gap-3">
              {prev ? (
                <button
                  onClick={() => navigate(prev)}
                  className="group flex-1 flex items-center gap-3 text-left bg-panel border border-line rounded-lg px-4 py-3 cursor-pointer transition-colors hover:border-accent/50"
                >
                  <span className="text-muted text-sm group-hover:text-accent transition-colors">&larr;</span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">Previous</span>
                    <span className="block text-[13px] font-semibold text-txt truncate">{navTitles[prev].title}</span>
                  </span>
                </button>
              ) : <div className="flex-1" />}
              {next ? (
                <button
                  onClick={() => navigate(next)}
                  className="group flex-1 flex items-center justify-end gap-3 text-right bg-panel border border-line rounded-lg px-4 py-3 cursor-pointer transition-colors hover:border-accent/50"
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-muted">Next</span>
                    <span className="block text-[13px] font-semibold text-txt truncate">{navTitles[next].title}</span>
                  </span>
                  <span className="text-muted text-sm group-hover:text-accent transition-colors">&rarr;</span>
                </button>
              ) : <div className="flex-1" />}
            </div>
            <div className="text-center text-[10px] text-muted mt-2.5">or page through with the &larr; &rarr; arrow keys</div>
          </div>
        )}
        {!isLive && (
          <footer className="text-center text-muted text-xs mt-8">No-Limit Systems Study Guide · study aid, not a solver replacement.</footer>
        )}
      </main>
    </div>
  )
}

export default App
