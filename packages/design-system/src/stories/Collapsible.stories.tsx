import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible } from '../components/ui-parts/collapsible'
import { Callout, Tag } from '../components/ui-parts/primitives'

const meta = {
  title: 'Primitives/Collapsible',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const DefaultClosed: Story = {
  args: {
    title: 'Risk factors',
    children: (
      <ul className="list-disc pl-5 text-[13px] text-muted leading-relaxed">
        <li>Monotone boards — check range grows</li>
        <li>AKx — kicker trouble for middling hands</li>
        <li>Paired low under high — opponent boats are live</li>
      </ul>
    ),
  },
}

export const DefaultOpen: Story = {
  args: {
    title: 'Sizing',
    defaultOpen: true,
    children: (
      <>
        <p className="text-[13px] text-muted leading-relaxed">
          Bet <Tag>~40% pot</Tag> across the c-betting range.
        </p>
        <Callout variant="warn">Shrink sizing as boards get more connected, not bigger.</Callout>
      </>
    ),
  },
}

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Collapsible title="Risk factors">
        <p className="text-[13px] text-muted">Detail for the first section.</p>
      </Collapsible>
      <Collapsible title="Sizing">
        <p className="text-[13px] text-muted">Detail for the second section.</p>
      </Collapsible>
      <Collapsible title="Exceptions">
        <p className="text-[13px] text-muted">Detail for the third section.</p>
      </Collapsible>
    </div>
  ),
}
