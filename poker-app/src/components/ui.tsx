import type { ReactNode } from 'react'

// ---- Section wrapper ----
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

// ---- Callout ----
export function Callout({ variant = 'default', children }: { variant?: 'default' | 'warn' | 'bad' | 'good'; children: ReactNode }) {
  return <div className={`callout ${variant !== 'default' ? variant : ''}`}>{children}</div>
}

// ---- Tag (pill) ----
export function Tag({ variant = 'default', children }: { variant?: 'default' | 'risk' | 'call' | 'fold'; children: ReactNode }) {
  return <span className={`tag ${variant}`}>{children}</span>
}

// ---- Action badge ----
// Inline colored badge for a poker action. Colors match the RangeGrid palette.
// Usage: <Action>Fold</Action>  <Action variant="call">Call</Action>
//        <Action variant="raise">Raise 6bb</Action>  <Action variant="allIn">All-in</Action>
//        <Action variant="check">Check</Action>  <Action variant="bet">Bet</Action>
export function Action({ variant = 'fold', children }: { variant?: 'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'; children: ReactNode }) {
  return <span className={`action-badge ${variant}`}>{children}</span>
}

// ---- Muted text ----
export function Muted({ children }: { children: ReactNode }) {
  return <span className="muted">{children}</span>
}

// ---- Small text ----
export function Small({ children }: { children: ReactNode }) {
  return <span className="small">{children}</span>
}

// ---- Inline code ----
export function Code({ children }: { children: ReactNode }) {
  return <code>{children}</code>
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
