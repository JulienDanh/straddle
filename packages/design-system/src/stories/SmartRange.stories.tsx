import type { Meta, StoryObj } from '@storybook/react-vite'
import { SmartRange } from '../components/SmartRange'

const meta = {
  title: 'Range/SmartRange',
  component: SmartRange,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SmartRange>

export default meta
type Story = StoryObj<typeof meta>

export const Eighteen: Story = {
  args: { pct: 18, color: '#ef6f6f' },
}

export const Seven: Story = {
  args: { pct: 7, color: '#ef6f6f' },
}

export const ThirtyFive: Story = {
  args: { pct: 35, color: '#6aa6ff' },
}

export const SeventyFive: Story = {
  args: { pct: 75, color: '#5fd0a8' },
}

export const Multiple: Story = {
  args: { pct: 20 },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SmartRange pct={7} color="#ef6f6f" />
      <SmartRange pct={9} color="#ef6f6f" />
      <SmartRange pct={16} color="#6aa6ff" />
      <SmartRange pct={20} color="#ef6f6f" />
      <SmartRange pct={28} color="#ef6f6f" />
      <SmartRange pct={35} color="#6aa6ff" />
      <SmartRange pct={38} color="#5fd0a8" />
      <SmartRange pct={68} color="#5fd0a8" />
      <SmartRange pct={75} color="#5fd0a8" />
    </div>
  ),
}
