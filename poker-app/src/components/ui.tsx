import type { ReactNode } from 'react'

// ---- Section wrapper ----
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-panel border border-line rounded-[14px] p-[22px] my-4 shadow-lg">
      <h2 className="text-xl border-l-[3px] border-accent pl-2.5 mb-3.5">{title}</h2>
      {children}
    </section>
  )
}

// ---- Callout ----
export function Callout({ variant = 'default', children }: { variant?: 'default' | 'warn' | 'bad' | 'good'; children: ReactNode }) {
  const borderColors: Record<string, string> = {
    default: 'border-accent2',
    warn: 'border-warn',
    bad: 'border-bad',
    good: 'border-good',
  }
  return <div className={`bg-panel2 border-l-[3px] ${borderColors[variant]} px-4 py-3 rounded-lg my-3.5`}>{children}</div>
}

// ---- Tag (pill) ----
export function Tag({ variant = 'default', children }: { variant?: 'default' | 'risk' | 'call' | 'fold'; children: ReactNode }) {
  const styles: Record<string, string> = {
    default: 'text-good border-good',
    risk: 'text-warn border-warn',
    call: 'text-accent2 border-accent2',
    fold: 'text-bad border-bad',
  }
  return <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full border mr-1.5 ${styles[variant]}`}>{children}</span>
}

// ---- Action badge ----
export function Action({ variant = 'fold', children }: { variant?: 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'; children: ReactNode }) {
  const styles: Record<string, string> = {
    fold: 'bg-[#3a4453] text-muted',
    call: 'bg-[#6aa6ff] text-[#0c1117]',
    raise: 'bg-[#ef6f6f] text-[#0c1117]',
    allIn: 'bg-[#c83838] text-white',
    check: 'bg-[#5fd0a8] text-[#0c1117]',
    bet: 'bg-[#ef6f6f] text-[#0c1117]',
  }
  return <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap align-middle ${styles[variant]}`}>{children}</span>
}

// ---- Muted text ----
export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-muted">{children}</span>
}

// ---- Small text ----
export function Small({ children }: { children: ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>
}

// ---- Inline code ----
export function Code({ children }: { children: ReactNode }) {
  return <code className="bg-dark border border-line px-1.5 py-0.5 rounded text-[13px]">{children}</code>
}

// ---- Decision Matrix ----
export type CellColor = 'green' | 'orange' | 'red'
export type CellVariant = 'default' | 'green' | 'orange' | 'red'

export interface DmCell {
  action: string
  sub?: string
  color: CellColor
}

export interface DmRow {
  label: string
  labelSub?: string
  cells: DmCell[]
}

export function DecisionMatrix({ columns, rows, intro }: { columns: string[]; rows: DmRow[]; intro?: string }) {
  const cols = ['1.2fr', ...columns.map(() => '1fr')].join(' ')
  return (
    <>
      {intro && <p className="text-muted">{intro}</p>}
      <div className="grid gap-1.5 my-4 text-[13px]" style={{ gridTemplateColumns: cols }}>
        <div></div>
        {columns.map((c, i) => (
          <div key={i} className="text-[10px] uppercase tracking-widest text-muted px-2 py-1">{c}</div>
        ))}
        {rows.map((row, i) => (
          <DmRowView key={i} row={row} />
        ))}
      </div>
    </>
  )
}

const DM_CELL_STYLES: Record<CellColor, string> = {
  green: 'border-good bg-[rgba(95,208,168,0.1)]',
  orange: 'border-warn bg-[rgba(240,184,110,0.08)]',
  red: 'border-bad bg-[rgba(239,111,111,0.08)]',
}
const DM_ACTION_STYLES: Record<CellColor, string> = {
  green: 'text-good',
  orange: 'text-warn',
  red: 'text-bad',
}

function DmRowView({ row }: { row: DmRow }) {
  return (
    <>
      <div className="font-bold text-sm mb-0.5">
        {row.label} {row.labelSub && <small className="font-normal text-[11px] text-muted">({row.labelSub})</small>}
      </div>
      {row.cells.map((cell, i) => (
        <div key={i} className={`rounded-[10px] px-3.5 py-3 border flex flex-col gap-1.5 transition-transform min-h-16 ${DM_CELL_STYLES[cell.color]}`}>
          <div className={`font-bold text-sm ${DM_ACTION_STYLES[cell.color]}`}>{cell.action}</div>
          {cell.sub && <div className="text-[11.5px] text-muted leading-relaxed">{cell.sub}</div>}
        </div>
      ))}
    </>
  )
}

// ---- Hand Example Card ----
export interface HandExample {
  tag: string
  tagVariant: 'default' | 'risk' | 'call' | 'fold'
  board: ReactNode
  holeCards?: ReactNode
  desc: string
  verdict: 'agree' | 'mixed' | 'mistake'
  verdictText: string
  system: ReactNode
  solver: ReactNode
}

const VERDICT_STYLES: Record<string, string> = {
  agree: 'text-good bg-[rgba(95,208,168,0.12)] border-good',
  mixed: 'text-warn bg-[rgba(240,184,110,0.12)] border-warn',
  mistake: 'text-bad bg-[rgba(239,111,111,0.12)] border-bad',
}

export function HandExampleCard({ ex }: { ex: HandExample }) {
  return (
    <div className="bg-panel2 border border-line rounded-xl p-4 my-3 grid [grid-template-columns:auto_1fr] gap-3.5 items-start transition-shadow hover:shadow-lg [@media(max-width:560px)]:[grid-template-columns:1fr]">
      <div className="flex flex-col gap-2 min-w-0">
        <Tag variant={ex.tagVariant}>{ex.tag}</Tag>
        <div className="inline-flex gap-0.5 font-bold text-[15px] bg-dark border border-line px-3 py-2 rounded-[10px] self-start whitespace-nowrap">{ex.board}</div>
        {ex.holeCards && <div className="inline-flex gap-0.5 font-bold text-sm bg-dark border border-line px-2.5 py-1.5 rounded-[10px] self-start whitespace-nowrap"><span className="text-[10px] font-normal text-muted self-center">hole: </span>{ex.holeCards}</div>}
        <div className="text-[11px] text-muted leading-tight px-0.5">{ex.desc}</div>
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full self-start whitespace-nowrap border ${VERDICT_STYLES[ex.verdict]}`}>{ex.verdictText}</span>
        <p className="text-txt text-[13px]"><strong className="text-accent2">System:</strong> {ex.system}</p>
        <p className="text-muted text-[13px]"><strong className="text-accent2">Solver:</strong> {ex.solver}</p>
      </div>
    </div>
  )
}

// ---- Card suit components ----
export function S({ children }: { children: ReactNode }) { return <span className="text-spade">{children}</span> }
export function H({ children }: { children: ReactNode }) { return <span className="text-heart">{children}</span> }
export function D({ children }: { children: ReactNode }) { return <span className="text-diamond">{children}</span> }
export function C({ children }: { children: ReactNode }) { return <span className="text-club">{children}</span> }

// ---- Playing card ----
const SUIT_SYMBOL: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' }
const SUIT_TEXT: Record<string, string> = {
  s: 'text-[#1a1a1a]',
  h: 'text-[#d33b4a]',
  d: 'text-[#2a7fd4]',
  c: 'text-[#2f8f5b]',
}
const PCARD_SIZE: Record<string, string> = {
  sm: 'w-[30px] h-[42px]',
  md: 'w-[40px] h-[56px]',
  lg: 'w-[52px] h-[72px]',
}
const PCARD_R_SIZE: Record<string, string> = {
  sm: 'text-[14px]',
  md: 'text-[18px]',
  lg: 'text-[24px]',
}
const PCARD_S_SIZE: Record<string, string> = {
  sm: 'text-[13px]',
  md: 'text-[16px]',
  lg: 'text-[20px]',
}

export function PlayingCard({ card, size = 'md' }: { card: string; size?: 'sm' | 'md' | 'lg' }) {
  const r = card[0]?.toUpperCase() ?? ''
  const s = card[1]?.toLowerCase() ?? ''
  const suit = SUIT_SYMBOL[s] ?? ''
  return (
    <span className={`inline-flex flex-col items-center justify-center bg-[#f4f1ea] border border-[#888] rounded-[5px] leading-none font-bold align-middle ${PCARD_SIZE[size]} ${SUIT_TEXT[s] ?? ''}`}>
      <span className={PCARD_R_SIZE[size]}>{r}</span>
      <span className={PCARD_S_SIZE[size]}>{suit}</span>
    </span>
  )
}

// ---- Hole cards (pair of playing cards) ----
export function HoleCards({ cards, size = 'md' }: { cards: string; size?: 'sm' | 'md' | 'lg' }) {
  if (cards.length < 4) return <span className="inline-flex" />
  return (
    <span className="inline-flex gap-1 align-middle">
      <PlayingCard card={cards.slice(0, 2)} size={size} />
      <PlayingCard card={cards.slice(2, 4)} size={size} />
    </span>
  )
}

// ---- Flashcards + Quiz section wrapper ----
export function FlashcardsSection({ cards }: { cards: [string, string][] }) {
  return (
    <Section title="Flashcards">
      <FlashcardsGrid cards={cards} />
    </Section>
  )
}

export function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  return (
    <Section title="Quiz">
      <QuizComponent questions={questions} />
    </Section>
  )
}

// Inline imports to avoid circular deps — these come from Sidebar.tsx
import { Flashcards as FlashcardsGrid, Quiz as QuizComponent } from './Sidebar'

export interface QuizQuestion {
  q: string
  o: string[]
  a: number
  why: string
}
