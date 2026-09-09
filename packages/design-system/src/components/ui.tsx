// Barrel file — re-exports all UI components from split modules.
// Import from '../components/ui' as before — no page changes needed.

export {
  Section, Callout, Tag, Action, Small, Code,
} from './ui-parts/primitives'

export {
  H,
  HoleCards, Board, BoardType, RandomBoard,
  type RandomBoardProps,
} from './ui-parts/cards'

export { Tabs } from './ui-parts/tabs'
export { Collapsible } from './ui-parts/collapsible'
export { Pyramid } from './ui-parts/pyramid'
export { StackMatrix } from './ui-parts/stack-matrix'
export { DataTable } from './ui-parts/data-table'
export { DecisionTree } from './ui-parts/decision-tree'
