import type { ReactNode } from 'react'

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
    green: 'border-good bg-[rgba(95,208,168,0.1)]',
    orange: 'border-warn bg-[rgba(240,184,110,0.08)]',
    red: 'border-bad bg-[rgba(239,111,111,0.08)]',
  }
  return (
    <span className={`inline-flex items-center gap-2 border rounded-lg px-2.5 py-1.5 align-middle ${VARIANT_STYLES[variant]}`}>
      {cards && <Board cards={cards} size={size} />}
      <span className="text-[12px] font-semibold text-txt whitespace-nowrap">{label}</span>
    </span>
  )
}

// ---- RandomBoard ----
const RANKS_LIST = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
const SUITS_LIST: string[] = ['s', 'h', 'd', 'c']

function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function rankIdx(r: string): number { return RANKS_LIST.indexOf(r as (typeof RANKS_LIST)[number]) }

interface BoardConstraints {
  high?: string
  suit?: 'monotone' | 'two-tone' | 'rainbow'
  paired?: boolean
  connected?: boolean
  lowCard?: number
  akx?: boolean
}

function generateFlop(c: BoardConstraints): string {
  const usedCards = new Set<string>()

  function makeCard(rank: string, allowedSuits?: string[]): string {
    const suits = allowedSuits ?? SUITS_LIST
    let suit: string, card: string
    do {
      suit = pick(suits as string[])
      card = rank + suit
    } while (usedCards.has(card))
    usedCards.add(card)
    return card
  }

  let rank1: string, rank2: string, rank3: string

  if (c.akx) {
    rank1 = 'A'; rank2 = 'K'
    rank3 = pick(['2', '3', '4'])
  } else if (c.paired) {
    const hi = c.high ?? pick(RANKS_LIST.slice(0, 10))
    rank1 = hi
    const loIdx = Math.min(rankIdx(hi) + 1, 12)
    const loRank = RANKS_LIST[pick(range(loIdx, 12))]
    rank2 = loRank; rank3 = loRank
  } else {
    const hi = c.high ?? pick(RANKS_LIST.slice(0, 6))
    rank1 = hi
    const hiI = rankIdx(hi)
    const maxLowIdx = c.lowCard ?? 12
    let lowPool = RANKS_LIST.filter((_r, i) => i > hiI && i <= maxLowIdx)
    if (lowPool.length < 2) return generateFlop({ ...c, lowCard: undefined })

    if (c.connected) {
      const connectedPool2 = lowPool.filter(r => Math.abs(rankIdx(r) - hiI) <= 4)
      rank2 = pick(connectedPool2.length ? connectedPool2 : lowPool)
      const r2I = rankIdx(rank2)
      const connectedPool3 = lowPool.filter(r => {
        if (r === rank2) return false
        const vals = [hiI, r2I, rankIdx(r)].sort((a, b) => a - b)
        return vals[2] - vals[0] <= 4
      })
      rank3 = pick(connectedPool3.length ? connectedPool3 : lowPool.filter(r => r !== rank2))
    } else {
      rank2 = pick(lowPool)
      rank3 = pick(lowPool.filter(r => r !== rank2))
    }
  }

  let suits: string[]
  if (c.suit === 'monotone') {
    const s = pick(SUITS_LIST)
    suits = [s, s, s]
  } else if (c.suit === 'two-tone') {
    const s1 = pick(SUITS_LIST)
    let s2 = pick(SUITS_LIST)
    while (s2 === s1) s2 = pick(SUITS_LIST)
    suits = [s1, s2, s2]
  } else if (c.suit === 'rainbow') {
    const shuffled = [...SUITS_LIST].sort(() => Math.random() - 0.5)
    suits = [shuffled[0], shuffled[1], shuffled[2]]
  } else {
    suits = [pick(SUITS_LIST), pick(SUITS_LIST), pick(SUITS_LIST)]
  }

  if (c.paired) {
    const card1 = makeCard(rank1, [suits[0]])
    const card2 = makeCard(rank2, [suits[1]])
    const card3 = makeCard(rank3, [suits[2] === suits[1] ? SUITS_LIST.filter(s => s !== suits[1])[0] : suits[2]])
    return card1 + card2 + card3
  }

  return makeCard(rank1, [suits[0]]) + makeCard(rank2, [suits[1]]) + makeCard(rank3, [suits[2]])
}

function range(start: number, end: number): number[] {
  const r: number[] = []
  for (let i = start; i <= end; i++) r.push(i)
  return r
}

function describeBoard(c: BoardConstraints): string {
  const parts: string[] = []
  if (c.high) parts.push(c.high === 'A' ? 'A-high' : c.high === 'K' ? 'K-high' : c.high === 'Q' ? 'Q-high' : c.high === 'J' ? 'J-high' : c.high === 'T' ? 'T-high' : `${c.high}-high`)
  if (c.paired) parts.push('paired')
  if (c.suit === 'monotone') parts.push('monotone')
  if (c.suit === 'two-tone') parts.push('two-tone')
  if (c.suit === 'rainbow') parts.push('rainbow')
  if (c.connected) parts.push('connected')
  if (c.akx) parts.push('AKx')
  return parts.join(' · ') || 'random'
}

export interface RandomBoardProps {
  high?: 'A' | 'K' | 'Q' | 'J' | 'T' | '9'
  suit?: 'monotone' | 'two-tone' | 'rainbow'
  paired?: boolean
  connected?: boolean
  lowCard?: number
  akx?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'green' | 'orange' | 'red'
  streets?: 3 | 4 | 5
}

export function RandomBoard({
  high, suit, paired, connected, lowCard, akx,
  label, size = 'sm', variant = 'default', streets = 3,
}: RandomBoardProps) {
  const flop = generateFlop({ high, suit, paired, connected, lowCard, akx })
  let cards = flop
  const avoidSuit = suit === 'monotone' ? flop[1] : undefined
  if (streets >= 4) {
    const used = new Set(flop.match(/.{2}/g) || [])
    cards += randomExtraCard(used, avoidSuit)
  }
  if (streets >= 5) {
    const used = new Set(cards.match(/.{2}/g) || [])
    cards += randomExtraCard(used, avoidSuit)
  }
  const text = label ?? describeBoard({ high, suit, paired, connected, lowCard, akx })
  return <BoardType cards={cards} label={text} size={size === 'lg' ? 'md' : size} variant={variant} />
}

function randomExtraCard(usedCards: Set<string>, avoidSuit?: string): string {
  const validRanks = RANKS_LIST.filter(r => !Array.from(usedCards).some(c => c[0] === r))
  const rank = validRanks.length ? pick(validRanks) : pick(RANKS_LIST)
  const availableSuits = avoidSuit ? SUITS_LIST.filter(s => s !== avoidSuit) : SUITS_LIST
  let suit: string, card: string
  do {
    suit = pick(availableSuits)
    card = rank + suit
  } while (usedCards.has(card))
  usedCards.add(card)
  return card
}

// ---- BoardTable ----
export interface BoardTableRow {
  boards: ReactNode[]
  action: ReactNode
  note?: ReactNode
}

export function BoardTable({ rows }: { rows: BoardTableRow[] }) {
  return (
    <table className="w-full border-collapse my-3 text-[13px]">
      <thead>
        <tr>
          <th style={{ width: '45%' }}>Boards</th>
          <th style={{ width: '20%' }}>Action</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>
              <div className="flex flex-wrap gap-2 items-center">
                {row.boards}
              </div>
            </td>
            <td>{row.action}</td>
            <td className="text-muted">{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
