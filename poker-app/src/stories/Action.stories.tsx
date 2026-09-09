import type { Meta, StoryObj } from '@storybook/react-vite'
import { Action, Tag, Small, Code } from '../components/ui-parts/primitives'

const meta = {
  title: 'Primitives/Action & Tag',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj

export const AllActions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Action variant="fold">Fold</Action>
        <Action variant="call">Call</Action>
        <Action variant="check">Check</Action>
        <Action variant="bet">Bet</Action>
        <Action variant="raise">Raise 6bb</Action>
        <Action variant="allIn">All-in</Action>
      </div>
      <div className="text-sm text-muted">
        Inline: <Action variant="raise">Raise</Action> the <Action variant="call">Call</Action> and <Action variant="fold">Fold</Action> the rest.
      </div>
    </div>
  ),
}

export const AllTags: Story = {
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <Tag variant="default">default</Tag>
      <Tag variant="risk">secondary</Tag>
      <Tag variant="call">call</Tag>
      <Tag variant="fold">fold</Tag>
    </div>
  ),
}

export const SmallAndCode: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div>Normal text with <Small>small muted text</Small> inline.</div>
      <div>Use <Code>2.1x</Code> for sizing values and <Code>~40% pot</Code> for bet sizes.</div>
    </div>
  ),
}
