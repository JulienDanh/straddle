import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionTrail } from '../components/ui-parts/action-trail'

const meta = {
  title: 'Primitives/ActionTrail',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const OpenCallLine: Story = {
  render: () => (
    <ActionTrail
      steps={[
        { pos: 'UTG', act: 'Raise 2bb', variant: 'raise' },
        { pos: 'BB', act: 'Call', variant: 'call' },
      ]}
    />
  ),
}
