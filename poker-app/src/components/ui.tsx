// Barrel file — re-exports all UI components from split modules.
// Import from '../components/ui' as before — no page changes needed.

export {
  Section, Callout, Tag, Action, Small, Code,
} from './ui-parts/primitives'

export {
  H,
  HoleCards, Board, BoardType, RandomBoard, BoardTable,
  type RandomBoardProps, type BoardTableRow,
} from './ui-parts/cards'
