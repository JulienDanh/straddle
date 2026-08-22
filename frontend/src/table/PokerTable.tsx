// The poker table: an oval felt with 8 fixed seats arranged around it and a
// center pot + board.
//
// Seats are at fixed physical angles — index 0 is the hero's seat at the
// bottom-center; indices 1..7 run clockwise. The caller assigns position
// labels and the dealer button to those seats (see layout.ts); this
// component only places each seat at its fixed angle and renders it.

import { CardRow } from './CardRow'
import { PotDisplay } from './PotDisplay'
import { Seat } from './Seat'
import { RING_SIZE } from './layout'
import type { PokerTableProps } from './types'

// Half-axes of the seat ellipse, in % of the table box. Seats sit just
// inside the wooden rail.
const RX = 46
const RY = 40

/**
 * Fixed angle for seat `index` (0 = hero, then clockwise). Hero is at the
 * bottom (π/2); the others are evenly spaced clockwise around the oval.
 */
function seatAngle(index: number): number {
  if (index === 0) return Math.PI / 2 // straight down
  // Spread the remaining 7 seats clockwise around the rest of the circle.
  const start = Math.PI / 2 + (2 * Math.PI) / RING_SIZE // one step clockwise from hero
  const step = (2 * Math.PI) / RING_SIZE
  return start + (index - 1) * step
}

/** Inline style placing seat `index` at its fixed position on the oval. */
function seatStyle(index: number): React.CSSProperties {
  const angle = seatAngle(index)
  const x = 50 + RX * Math.cos(angle)
  const y = 50 + RY * Math.sin(angle)
  return { top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }
}

export function PokerTable({ seats, board, pot, potType, children, className }: PokerTableProps) {
  const rootClass = ['pt-table', className].filter(Boolean).join(' ')

  return (
    <div className="pt-table__wrap">
      <div className={rootClass}>
        <div className="pt-table__felt-label">STRADDLE</div>

        {seats.map((seat, index) => (
          <Seat key={seat.id} seat={seat} style={seatStyle(index)} />
        ))}

        <div className="pt-table__center">
          <PotDisplay pot={pot} potType={potType} />
          <CardRow cards={board} max={5} />
        </div>

        {children && <div className="pt-table__overlay">{children}</div>}
      </div>
    </div>
  )
}
