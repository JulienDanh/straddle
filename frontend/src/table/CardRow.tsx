// A horizontal row of cards, used for the board and for hole cards.
// Pads with empty slots up to `max` so a preflop board and a river board
// keep a stable, non-jumping layout.

import { PlayingCard } from './PlayingCard'
import type { CardCode } from './types'

interface CardRowProps {
  cards: CardCode[]
  /** Total slots to render; extras beyond this are truncated. */
  max: number
  small?: boolean
  /** Render every card face-down (villain hole cards). */
  faceDown?: boolean
}

export function CardRow({ cards, max, small, faceDown }: CardRowProps) {
  const slots: CardCode[] = []
  for (let i = 0; i < max; i++) {
    slots.push(cards[i] ?? '')
  }
  return (
    <div className="pt-card-row">
      {slots.map((c, i) => (
        <PlayingCard key={i} card={c} small={small} faceDown={faceDown} />
      ))}
    </div>
  )
}
