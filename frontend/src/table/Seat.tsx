// A single seat around the table: badge (label/position/stack), hole cards,
// an optional bet chip, and the dealer button when this seat has it.
//
// Positioning (the `top`/`left` %) is computed by the parent PokerTable and
// passed in; this component only owns the seat's inner content + state styles.

import { CardRow } from './CardRow'
import { DealerButton } from './DealerButton'
import type { SeatData } from './types'

interface SeatProps {
  seat: SeatData
  /** Inline style from the layout engine: { top, left, transform }. */
  style: React.CSSProperties
}

export function Seat({ seat, style }: SeatProps) {
  const classes = ['pt-seat']
  if (seat.isHero) classes.push('pt-seat--hero')
  if (seat.isActive) classes.push('pt-seat--active')
  if (seat.hasFolded) classes.push('pt-seat--folded')
  if (seat.isEmpty) classes.push('pt-seat--empty')

  // Empty filler seats (not in this hand) render as a dimmed open chair with
  // no cards and no stack — they exist only to fill the ring to table size.
  if (seat.isEmpty) {
    return (
      <div className={classes.join(' ')} style={style}>
        <div className="pt-seat__inner">
          <div className="pt-seat__chair" aria-hidden>🪑</div>
          <div className="pt-seat__badge">
            <span className="pt-seat__label">{seat.label}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.join(' ')} style={style}>
      <div className="pt-seat__inner">
        <CardRow cards={seat.holeCards} max={2} faceDown={!seat.cardsVisible} />

        <div className="pt-seat__badge">
          {seat.isDealer && <DealerButton />}
          <span className="pt-seat__label">{seat.label}</span>
          {seat.position && <span className="pt-seat__position">{seat.position}</span>}
          <span className="pt-seat__stack">{seat.stack}bb</span>
        </div>

        {seat.bet ? (
          <div className="pt-bet">
            <span className="pt-bet__chip">🪙</span>
            <span className="pt-bet__amount">{seat.bet}bb</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
