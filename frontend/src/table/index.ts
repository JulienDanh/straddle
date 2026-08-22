// Public API for the poker table library.
// Importing from '@/table' (or './table') pulls the components and the
// single CSS bundle. CSS is imported here so consumers don't have to.

import './table.css'

export { PokerTable } from './PokerTable'
export { Seat } from './Seat'
export { PlayingCard } from './PlayingCard'
export { CardRow } from './CardRow'
export { PotDisplay } from './PotDisplay'
export { DealerButton } from './DealerButton'
export { ringLabels, dealerIndex, activePositions, RING_SIZE, SIX_MAX_POSITIONS } from './layout'
export type { CardCode, SeatData, PokerTableProps } from './types'
