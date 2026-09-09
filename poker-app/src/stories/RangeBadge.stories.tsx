import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeBadge } from '../components/RangePreview'

const meta = {
  title: 'Range/RangeBadge',
  component: RangeBadge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RangeBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Covered: Story = {
  args: {
    label: 'BTN 12bb · 20%',
    range: '55+, A2s+, A9o+, ATo+, K9s+, KTo+, Q9s+, QTo+, J9s+, T9s',
    color: '#ef6f6f',
  },
}

export const Covering: Story = {
  args: {
    label: 'BTN 125bb · 75%',
    range: '22+, A2s+, A2o+, K2s+, K5o+, Q2s+, Q7o+, J2s+, J7o+, T2s+, T7o+, 92s+, 97o+, 82s+, 87o, 72s+, 76o, 62s+, 65o, 52s+, 54o, 42s+, 43o, 32s',
    color: '#5fd0a8',
  },
}

export const ICMBaseline: Story = {
  args: {
    label: 'UTG 30bb · 16%',
    range: '55+, A8s+, AJo+, ATo+, KQs, KJs, KJo, QJs, QJo, JTs',
    color: '#6aa6ff',
  },
}

export const Multiple: Story = {
  args: { label: 'Multiple', range: '55+', color: '#6aa6ff' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <RangeBadge label="BTN 12bb · 20%" range="55+, A2s+, A9o+, ATo+, K9s+, KTo+, Q9s+, QTo+, J9s+, T9s" color="#ef6f6f" />
      <RangeBadge label="BTN 12bb · 28%" range="44+, A2s+, A8o+, ATo+, K8s+, KTo+, Q8s+, QTo+, J8s+, JTo, T8s+, 98s, 87s, 76s, 65s" color="#ef6f6f" />
      <RangeBadge label="UTG 16bb · 7%" range="77+, AJs+, AQo+, AKs, KQs" color="#ef6f6f" />
      <RangeBadge label="BTN 125bb · 75%" range="22+, A2s+, A2o+, K2s+, K5o+" color="#5fd0a8" />
      <RangeBadge label="UTG 30bb · 16%" range="55+, A8s+, AJo+" color="#6aa6ff" />
    </div>
  ),
}
