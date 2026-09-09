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
import { RangeViewerPage } from './pages/RangeViewer'
import { DesignSystemPage } from './pages/DesignSystem'

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
  bmprimer: { course: 'Bubble Mastery', title: 'ICM & FGS Foundations' },
  bm1: { course: 'Bubble Mastery', title: 'ICM vs ChipEV Preflop' },
  bm2: { course: 'Bubble Mastery', title: 'Opening Into Covered Stacks' },
  bm3: { course: 'Bubble Mastery', title: 'Opening Into Covering Stacks' },
  bm4: { course: 'Bubble Mastery', title: 'Blind vs Blind' },
  bm5: { course: 'Bubble Mastery', title: 'Blinds Facing Open' },
  bm6: { course: 'Bubble Mastery', title: 'Dealing With 3-Bets' },
  bm7: { course: 'Bubble Mastery', title: 'Identifying Bubble Impact' },
  bm8: { course: 'Bubble Mastery', title: 'BTN Covers BB (Postflop)' },
  bm9: { course: 'Bubble Mastery', title: 'BB Covers BTN (Postflop)' },
  bm10: { course: 'Bubble Mastery', title: 'UTG Covers BB (Postflop)' },
  bm11: { course: 'Bubble Mastery', title: 'Polar Opens · Split Range' },
  rangeviewer: { course: '', title: 'Range Viewer' },
  sandbox: { course: '', title: 'Design System' },
}

const PAGES = {
  primer: PrimerPage, s1: S1Page, s2: S2Page, s3: S3Page, s4: S4Page,
  s5: S5Page, s6: S6Page, s7: S7Page, s8: S8Page, s9: S9Page,
  s10: S10Page, s11: S11Page, s12: S12Page, conclusion: ConclusionPage,
  bmprimer: BMPrimerPage, bm1: BM1Page, bm2: BM2Page, bm3: BM3Page, bm4: BM4Page,
  bm5: BM5Page, bm6: BM6Page, bm7: BM7Page, bm8: BM8Page, bm9: BM9Page, bm10: BM10Page, bm11: BM11Page,
  rangeviewer: RangeViewerPage,
  sandbox: DesignSystemPage,
} as const

type PageId = keyof typeof PAGES

const VALID_PAGES = new Set(Object.keys(PAGES))

function pageFromHash(): PageId {
  const hash = window.location.hash.replace(/^#/, '')
  return (VALID_PAGES.has(hash) ? hash : 's1') as PageId
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

  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed inset-0 z-20 bg-black/50 ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar activePage={page} onNavigate={navigate} open={sidebarOpen} />
      <main className="flex-1 px-8 pt-6 pb-20 min-w-0 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button
            className="hidden border border-line bg-panel text-txt px-2.5 py-1.5 rounded-lg text-lg cursor-pointer [@media(max-width:760px)]:block"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >≡</button>
          <div className="text-xs text-muted">
            {nav?.course && <>{nav.course} <span className="text-txt">&rsaquo;</span> </>}
            <b className="text-txt">{nav?.title}</b>
          </div>
          <span className="inline-block bg-panel border border-line px-3 py-1 rounded-full text-[11px] text-muted">React + Vite · 2 courses</span>
        </div>
        <PageComponent />
        <footer className="text-center text-muted text-xs mt-8">No-Limit Systems Study Guide · study aid, not a solver replacement.</footer>
      </main>
    </div>
  )
}

export default App
