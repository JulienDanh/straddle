import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoardExample } from '../components/ui-parts/board-example'
import { HandExample } from '../components/ui-parts/hand-example'
import { ExampleBrowser } from '../components/ui-parts/example-browser'
import { S1_FLOP_K83, S1_FLOP_AK2 } from '../data/ranges'

const meta = {
  title: 'Primitives/ExampleBrowser',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const MixedSolvedAndWalkthrough: Story = {
  render: () => (
    <ExampleBrowser>
      <BoardExample
        board="Kh8h3c"
        spot="K83 two-tone (king-high, disconnected, 40bb)"
        action="C-bet 100%"
        actionVariant="bet"
        solve={S1_FLOP_K83}
      >
        Solver agrees — at 20% pot it c-bets 100% of the opening range. Player checked, costing EV.
      </BoardExample>
      <BoardExample
        board="AsKh2c"
        spot="AK2 (AKx family)"
        action="Mix"
        actionVariant="check"
        solve={S1_FLOP_AK2}
      >
        AKx is a risk factor: BB connects with every Ax/Kx too. Slow down — not 100%.
      </BoardExample>
      <HandExample spot="AJJ paired (ace-high, 50bb)" action="Mix" actionVariant="check">
        Paired board = risk factor. Check KQ, QQ, TT-77 (medium). Bet Jx + trash.
      </HandExample>
    </ExampleBrowser>
  ),
}
