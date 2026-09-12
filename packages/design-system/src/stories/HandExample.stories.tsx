import type { Meta, StoryObj } from '@storybook/react-vite'
import { HandExample } from '../components/ui-parts/hand-example'

const meta = {
  title: 'Primitives/HandExample',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const BetExample: Story = {
  args: {
    spot: 'K83 two-tone (king-high, disconnected, 40bb)',
    action: 'C-bet ~40% pot',
    actionVariant: 'bet',
    children: 'Solver bets the king-high bucket at high frequency. Checking here lets the caller realize equity for free.',
  },
}

export const CheckExample: Story = {
  args: {
    spot: '764r out of position vs a call (low, connected)',
    action: 'Check',
    actionVariant: 'check',
    children: 'Low connected boards hit the caller range far harder than the raiser range — betting is burning money.',
  },
}

export const AllInExample: Story = {
  args: {
    spot: '12bb on the button, folded to us',
    action: 'All-in',
    actionVariant: 'allIn',
    children: 'Shallow stacks make fold equity the dominant factor — jam wide.',
  },
}

export const SeveralTogether: Story = {
  render: () => (
    <div>
      <HandExample
        spot="A72 rainbow, in position (ace-high, dry)"
        action="C-bet ~40% pot"
        actionVariant="bet"
      >
        Dry ace boards are the cleanest c-bet bucket — the raiser holds most of the aces.
      </HandExample>
      <HandExample
        spot="T97 two-tone, out of position"
        action="Check"
        actionVariant="check"
      >
        Connected middling boards favor the caller — no reason to bet into that.
      </HandExample>
      <HandExample
        spot="QQ2 with a flush draw possible"
        action="Check"
        actionVariant="check"
      >
        Paired high boards shrink the calling range — bet small or check, never size up.
      </HandExample>
    </div>
  ),
}
