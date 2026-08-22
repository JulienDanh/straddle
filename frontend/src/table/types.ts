// --- Poker table library: shared types -------------------------------------
//
// These mirror the backend shapes (see backend/src/app/models.py and
// poker/state.py) but are UI-local and richer for multi-seat rendering.

/** A card encoded as rank+suit, e.g. "Ah", "Kd". Empty string = no card. */
export type CardCode = string

export interface SeatData {
  /** Stable id used as React key. */
  id: string
  /** Display label, e.g. "Hero", "Villain", or a player name. */
  label: string
  /** Optional position tag, e.g. "UTG"/"BTN". Shown in the badge when present. */
  position?: string
  /** Stack size in big blinds. */
  stack: number
  /** Two hole cards; "" marks a face-down slot (see cardsVisible). */
  holeCards: [CardCode, CardCode]
  /** Whether the hole cards are shown. false -> render card backs. */
  cardsVisible: boolean
  /** Current-street bet in bb. 0 / undefined -> no bet chip shown. */
  bet?: number
  /** Hero's own seat; rendered at the bottom and styled distinctly. */
  isHero?: boolean
  /** Whose turn it is; highlights the seat. */
  isActive?: boolean
  /** Folded seats are dimmed. */
  hasFolded?: boolean
  /** Seat holding the dealer button. */
  isDealer?: boolean
  /** An empty/filler seat not participating in this hand (used to fill a ring
   *  to a fixed table size, e.g. always 8 seats). Rendered as an open chair. */
  isEmpty?: boolean
}

export interface PokerTableProps {
  /** 2–6 seats. The hero seat (isHero) is anchored at the bottom. */
  seats: SeatData[]
  /** Community cards, length 0..5. "" pads an un-dealt slot. */
  board: CardCode[]
  /** Pot size in big blinds. */
  pot: number
  /** Optional pot-type subtitle, e.g. "3-bet". */
  potType?: string
  /** Optional action overlay content placed on the felt. */
  children?: React.ReactNode
  /** Extra class on the table root. */
  className?: string
}
