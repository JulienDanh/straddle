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

export const PushMode: Story = {
  args: { pct: 18, mode: 'push', color: '#ef6f6f', label: '18% (push/fold)' },
}

export const OpenVsPush: Story = {
  args: { pct: 20 },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SmartRange pct={20} mode="open" label="20% · open" color="#6aa6ff" />
        <SmartRange pct={20} mode="push" label="20% · push" color="#ef6f6f" />
      </div>
      <div className="flex flex-wrap gap-2">
        <SmartRange pct={35} mode="open" label="35% · open" color="#6aa6ff" />
        <SmartRange pct={35} mode="push" label="35% · push" color="#ef6f6f" />
      </div>
      <div className="flex flex-wrap gap-2">
        <SmartRange pct={75} mode="open" label="75% · open" color="#5fd0a8" />
        <SmartRange pct={75} mode="push" label="75% · push" color="#5fd0a8" />
      </div>
    </div>
  ),
}

export const Multiple: Story = {
  args: { pct: 20 },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SmartRange pct={7} mode="push" color="#ef6f6f" />
      <SmartRange pct={9} mode="push" color="#ef6f6f" />
      <SmartRange pct={16} mode="open" color="#6aa6ff" />
      <SmartRange pct={20} mode="push" color="#ef6f6f" />
      <SmartRange pct={28} mode="push" color="#ef6f6f" />
      <SmartRange pct={35} mode="open" color="#6aa6ff" />
      <SmartRange pct={38} mode="open" color="#5fd0a8" />
      <SmartRange pct={68} mode="open" color="#5fd0a8" />
      <SmartRange pct={75} mode="open" color="#5fd0a8" />
    </div>
  ),
}
