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
      {intro && <p className="muted">{intro}</p>}
      <div className="dmatrix" style={{ gridTemplateColumns: cols }}>
        <div></div>
        {columns.map((c, i) => (
          <div key={i} className="dmatrix-head">{c}</div>
        ))}
        {rows.map((row, i) => (
          <Row key={i} row={row} />
        ))}
      </div>
    </>
  )
}

function Row({ row }: { row: DmRow }) {
  return (
    <>
      <div className="dm-label">
        {row.label} {row.labelSub && <small>({row.labelSub})</small>}
      </div>
      {row.cells.map((cell, i) => (
        <div key={i} className={`dm-cell ${cell.color}`}>
          <div className={`dm-action ${cell.color}`}>{cell.action}</div>
          {cell.sub && <div className="dm-sub">{cell.sub}</div>}
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

export function HandExampleCard({ ex }: { ex: HandExample }) {
  return (
    <div className="ex-card">
      <div className="ex-left">
        <Tag variant={ex.tagVariant}>{ex.tag}</Tag>
        <div className="ex-board">{ex.board}</div>
        {ex.holeCards && <div className="ex-hole">{ex.holeCards}</div>}
        <div className="ex-desc">{ex.desc}</div>
      </div>
      <div className="ex-right">
        <span className={`ex-verdict ${ex.verdict}`}>{ex.verdictText}</span>
        <p className="ex-sys"><strong>System:</strong> {ex.system}</p>
        <p className="ex-solver"><strong>Solver:</strong> {ex.solver}</p>
      </div>
    </div>
  )
}

// ---- Card suit components ----
export function S({ children }: { children: ReactNode }) { return <span className="s">{children}</span> }
export function H({ children }: { children: ReactNode }) { return <span className="h">{children}</span> }
export function D({ children }: { children: ReactNode }) { return <span className="d">{children}</span> }
export function C({ children }: { children: ReactNode }) { return <span className="c">{children}</span> }

// ---- Playing card ----
// Displays a single playing card as a rounded card face with rank + suit.
// Input: "As", "Kd", "Th", "2c", etc. Case-insensitive.
const SUIT_SYMBOL: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' }
const SUIT_CLASS: Record<string, string> = { s: 's', h: 'h', d: 'd', c: 'c' }

export function PlayingCard({ card, size = 'md' }: { card: string; size?: 'sm' | 'md' | 'lg' }) {
  const r = card[0]?.toUpperCase() ?? ''
  const s = card[1]?.toLowerCase() ?? ''
  const suit = SUIT_SYMBOL[s] ?? ''
  const cls = SUIT_CLASS[s] ?? ''
  return (
    <span className={`pcard ${size} ${cls}`}>
      <span className="pcard-r">{r}</span>
      <span className="pcard-s">{suit}</span>
    </span>
  )
}

// ---- Hole cards (pair of playing cards) ----
// Displays two cards side by side. Input: "AsKd", "AhKh", "7c2d", etc.
export function HoleCards({ cards, size = 'md' }: { cards: string; size?: 'sm' | 'md' | 'lg' }) {
  if (cards.length < 4) return <span className="holecards" />
  return (
    <span className="holecards">
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
