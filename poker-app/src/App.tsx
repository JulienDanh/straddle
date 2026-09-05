import { useState } from 'react'
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

const navTitles: Record<string, string> = {
  primer: 'No-Limit Systems &rsaquo; <b>Preflop Primer</b>',
  s1: 'No-Limit Systems &rsaquo; <b>System 1 &middot; UTG vs BB C-bet</b>',
  s2: 'No-Limit Systems &rsaquo; <b>System 2 &middot; BTN vs BB C-bet</b>',
  s3: 'No-Limit Systems &rsaquo; <b>System 3 &middot; BB vs SB Limp Stab</b>',
  s4: 'No-Limit Systems &rsaquo; <b>System 4 &middot; River Bluffing</b>',
  s5: 'No-Limit Systems &rsaquo; <b>System 5 &middot; Barreling Med Hands</b>',
  s6: 'No-Limit Systems &rsaquo; <b>System 6 &middot; Check-Raising Top Pair</b>',
  s7: 'No-Limit Systems &rsaquo; <b>System 7 &middot; C-bet Folding Flops</b>',
  s8: 'No-Limit Systems &rsaquo; <b>System 8 &middot; Bet Sizing IP</b>',
  s9: 'No-Limit Systems &rsaquo; <b>System 9 &middot; Defending Flops</b>',
  s10: 'No-Limit Systems &rsaquo; <b>System 10 &middot; River Value Betting</b>',
  s11: 'No-Limit Systems &rsaquo; <b>System 11 &middot; Hero Calling</b>',
  s12: 'No-Limit Systems &rsaquo; <b>System 12 &middot; Defending 3-Bets OOP</b>',
  conclusion: 'No-Limit Systems &rsaquo; <b>Cross-System Principles</b>',
  bmprimer: 'Bubble Mastery &rsaquo; <b>ICM & FGS Foundations</b>',
  bm1: 'Bubble Mastery &rsaquo; <b>ICM vs ChipEV Preflop</b>',
  bm2: 'Bubble Mastery &rsaquo; <b>Opening Into Covered Stacks</b>',
  bm3: 'Bubble Mastery &rsaquo; <b>Opening Into Covering Stacks</b>',
  bm4: 'Bubble Mastery &rsaquo; <b>Blind vs Blind</b>',
  bm5: 'Bubble Mastery &rsaquo; <b>Blinds Facing Open</b>',
  bm6: 'Bubble Mastery &rsaquo; <b>Dealing With 3-Bets</b>',
  bm7: 'Bubble Mastery &rsaquo; <b>Identifying Bubble Impact</b>',
  bm8: 'Bubble Mastery &rsaquo; <b>BTN Covers BB (Postflop)</b>',
  bm9: 'Bubble Mastery &rsaquo; <b>BB Covers BTN (Postflop)</b>',
  bm10: 'Bubble Mastery &rsaquo; <b>UTG Covers BB (Postflop)</b>',
  bm11: 'Bubble Mastery &rsaquo; <b>Polar Opens &middot; Split Range</b>',
}

type PageId = 'primer' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 's10' | 's11' | 's12' | 'conclusion'
  | 'bmprimer' | 'bm1' | 'bm2' | 'bm3' | 'bm4' | 'bm5' | 'bm6' | 'bm7' | 'bm8' | 'bm9' | 'bm10' | 'bm11'

const PAGES: Record<PageId, React.FC> = {
  primer: PrimerPage, s1: S1Page, s2: S2Page, s3: S3Page, s4: S4Page,
  s5: S5Page, s6: S6Page, s7: S7Page, s8: S8Page, s9: S9Page,
  s10: S10Page, s11: S11Page, s12: S12Page, conclusion: ConclusionPage,
  bmprimer: BMPrimerPage, bm1: BM1Page, bm2: BM2Page, bm3: BM3Page, bm4: BM4Page,
  bm5: BM5Page, bm6: BM6Page, bm7: BM7Page, bm8: BM8Page, bm9: BM9Page, bm10: BM10Page, bm11: BM11Page,
}

function App() {
  const [page, setPage] = useState<PageId>('s1')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (p: string) => {
    setPage(p as PageId)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const PageComponent = PAGES[page]

  return (
    <div className="layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <Sidebar activePage={page} onNavigate={navigate} open={sidebarOpen} />
      <main className="main">
        <div className="header-bar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>≡</button>
          <div className="crumbs" dangerouslySetInnerHTML={{ __html: navTitles[page] || '' }} />
          <span className="pill">React + Vite · 2 courses</span>
        </div>
        <PageComponent />
        <footer>No-Limit Systems Study Guide · study aid, not a solver replacement.</footer>
      </main>
    </div>
  )
}

export default App
