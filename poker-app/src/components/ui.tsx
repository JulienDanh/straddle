// Barrel file — re-exports all UI components from split modules.
// Import from '../components/ui' as before — no page changes needed.

export {
  Section, Callout, Tag, Action, Muted, Small, Code,
} from './ui-parts/primitives'

export {
  HandExampleCard,
  type HandExample,
} from './ui-parts/HandExampleCard'

export {
  S, H, D, C,
  PlayingCard, HoleCards, Board, BoardType, RandomBoard, BoardTable,
  type RandomBoardProps, type BoardTableRow,
} from './ui-parts/cards'
