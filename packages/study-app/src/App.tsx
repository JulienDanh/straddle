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
import { LiveEqualPage, LiveAsymPage, LivePkoPage } from './pages/LiveBbz'

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
  live: { course: '', title: 'Live' },
  liveasym: { course: '', title: 'Live · ICM asym' },
  livepko: { course: '', title: 'Live · PKO' },
}

const PAGES = {
  primer: PrimerPage, s1: S1Page, s2: S2Page, s3: S3Page, s4: S4Page,
  s5: S5Page, s6: S6Page, s7: S7Page, s8: S8Page, s9: S9Page,
  s10: S10Page, s11: S11Page, s12: S12Page, conclusion: ConclusionPage, sizing: SizingPage,
  bmprimer: BMPrimerPage, bm1: BM1Page, bm2: BM2Page, bm3: BM3Page, bm4: BM4Page,
  bm5: BM5Page, bm6: BM6Page, bm7: BM7Page, bm8: BM8Page, bm9: BM9Page, bm10: BM10Page, bm11: BM11Page,
  live: LiveEqualPage, liveasym: LiveAsymPage, livepko: LivePkoPage,
} as const

type PageId = keyof typeof PAGES

const VALID_PAGES = new Set(Object.keys(PAGES))

// reading flow for prev/next navigation and arrow keys (tools excluded)
const READING_ORDER: PageId[] = [
  'primer', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8',
  's9', 's10', 's11', 's12', 'conclusion', 'sizing',
  'bmprimer', 'bm1', 'bm2', 'bm3', 'bm4', 'bm5', 'bm6',
  'bm7', 'bm8', 'bm9', 'bm10', 'bm11',
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
