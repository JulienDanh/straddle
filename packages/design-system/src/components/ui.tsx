// Barrel file — re-exports all UI components from split modules.
// Import from '../components/ui' as before — no page changes needed.

export {
  Section, Callout, Tag, Action, Small, Code, Subhead, Leak,
} from './ui-parts/primitives'

export {
  H,
  HoleCards, Board, BoardType,
} from './ui-parts/cards'

export { Tabs } from './ui-parts/tabs'
export { Pyramid } from './ui-parts/pyramid'
export { StackMatrix } from './ui-parts/stack-matrix'
export { DataTable } from './ui-parts/data-table'
export { DecisionTree } from './ui-parts/decision-tree'
export { HandExample, type HandExampleProps } from './ui-parts/hand-example'
export { BoardExample, type BoardExampleProps } from './ui-parts/board-example'
export { ExampleBrowser } from './ui-parts/example-browser'
export { ActionTrail } from './ui-parts/action-trail'
