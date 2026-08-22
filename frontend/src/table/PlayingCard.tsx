// A single realistic playing card rendered in pure CSS.
//
// Layout: two corners (rank + small suit pip), a large center suit glyph.
// The card reads correctly from either side because the bottom-right
// corner is rotated 180°. Empty cards show a dashed outline; face-down
// cards show a card-back pattern.

import type { CardCode } from './types'

const RED_SUITS = new Set(['h', 'd'])

const SUIT_GLYPH: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
}

const RANK_LABEL: Record<string, string> = {
  T: '10',
}

interface PlayingCardProps {
  card: CardCode
  /** Smaller variant for villain seats / compact layouts. */
  small?: boolean
  /** Force a face-down card back regardless of the card code. */
  faceDown?: boolean
}

export function PlayingCard({ card, small, faceDown }: PlayingCardProps) {
  const classes = ['pt-card']
  if (small) classes.push('pt-card--small')
  if (faceDown || !card) {
    classes.push(faceDown ? 'pt-card--back' : 'pt-card--empty')
    return <span className={classes.join(' ')} aria-hidden={!card} />
  }

  const rank = card[0]
  const suit = card[1].toLowerCase()
  const isRed = RED_SUITS.has(suit)
  if (isRed) classes.push('pt-card--red')
  else classes.push('pt-card--black')

  const rankLabel = RANK_LABEL[rank] ?? rank
  const glyph = SUIT_GLYPH[suit] ?? ''

  return (
    <span className={classes.join(' ')} aria-label={card}>
      <span className="pt-card__corner pt-card__corner--tl">
        <span className="pt-card__rank">{rankLabel}</span>
        <span className="pt-card__pip">{glyph}</span>
      </span>
      <span className="pt-card__center">{glyph}</span>
      <span className="pt-card__corner pt-card__corner--br">
        <span className="pt-card__rank">{rankLabel}</span>
        <span className="pt-card__pip">{glyph}</span>
      </span>
    </span>
  )
}
