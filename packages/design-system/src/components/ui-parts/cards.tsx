import type { ReactNode } from 'react'

// ---- Suit component (only H is used externally) ----
export function H({ children }: { children: ReactNode }) { return <span className="text-heart">{children}</span> }

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
    <span className={`inline-flex flex-col items-center justify-center bg-[#f4f1ea] border border-[#7a7163] rounded-[5px] leading-none font-bold align-middle shadow-[0_2px_5px_rgba(0,0,0,0.45)] ${PCARD_SIZE[size]} ${SUIT_TEXT[s] ?? ''}`}>
      <span className={PCARD_R_SIZE[size]}>{r}</span>
      <span className={PCARD_S_SIZE[size]}>{suit}</span>
    </span>
  )
}

export function HoleCards({ cards, size = 'md' }: { cards: string; size?: 'sm' | 'md' | 'lg' }) {
  if (cards.length < 4) return <span className="inline-flex" />
  return (
    <span className="inline-flex gap-1 align-middle">
      <PlayingCard card={cards.slice(0, 2)} size={size} />
      <PlayingCard card={cards.slice(2, 4)} size={size} />
    </span>
  )
}

export function Board({ cards, size = 'md' }: { cards: string; size?: 'sm' | 'md' | 'lg' }) {
  const all: string[] = []
  for (let i = 0; i + 1 < cards.length; i += 2) all.push(cards.slice(i, i + 2))
  if (all.length === 0) return null
  return (
    <span className="inline-flex items-center align-middle">
      {all.map((c, i) => (
        <span key={i} className={i >= 3 ? 'ml-1.5' : i > 0 ? 'ml-0.5' : ''}>
          <PlayingCard card={c} size={size} />
        </span>
      ))}
    </span>
  )
}

export function BoardType({
  cards,
  label,
  variant = 'default',
  size = 'sm',
}: {
  cards?: string
  label: string
  variant?: 'default' | 'green' | 'orange' | 'red'
  size?: 'sm' | 'md'
}) {
  const VARIANT_STYLES: Record<string, string> = {
    default: 'border-line bg-panel2',
    green: 'border-good bg-[rgba(57,255,136,0.1)]',
    orange: 'border-warn bg-[rgba(240,192,74,0.08)]',
    red: 'border-bad bg-[rgba(255,84,112,0.08)]',
  }
  return (
    <span className={`inline-flex items-center gap-2 border rounded-lg px-2.5 py-1.5 align-middle ${VARIANT_STYLES[variant]}`}>
      {cards && <Board cards={cards} size={size} />}
      <span className="text-[12px] font-semibold text-txt whitespace-nowrap">{label}</span>
    </span>
  )
}
