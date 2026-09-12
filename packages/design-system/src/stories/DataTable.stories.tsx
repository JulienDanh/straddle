import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from '../components/ui-parts/data-table'
import { Action, Code, Tag } from '../components/ui-parts/primitives'

const meta = {
  title: 'Primitives/DataTable',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const SizingTable: Story = {
  render: () => (
    <DataTable
      columns={[
        { header: 'Board', width: '28%' },
        { header: 'Action', width: '22%' },
        { header: 'Size', width: '20%' },
        { header: 'Why', width: '30%' },
      ]}
      rows={[
        ['T-high+, disconnected', <Action variant="bet">C-bet</Action>, <Code>~40% pot</Code>, 'Range advantage, low connectivity'],
        ['Ace-high, two-tone', <Action variant="bet">C-bet</Action>, <Code>~40% pot</Code>, 'Polarized pressure on middling hands'],
        ['Low connected', <Action variant="check">Check</Action>, '—', 'Opponent range hits connectivity'],
        ['Monotone', <Action variant="check">Check</Action>, '—', 'Equity distributions too tight to bet'],
      ]}
    />
  ),
}

export const Compact: Story = {
  render: () => (
    <DataTable
      compact
      columns={[
        { header: 'Hand tier' },
        { header: 'Action' },
        { header: 'Size' },
      ]}
      rows={[
        ['Nuts', <Action variant="raise">Raise</Action>, <Code>3x</Code>],
        ['Strong', <Action variant="bet">Bet</Action>, <Code>~40% pot</Code>],
        ['Medium', <Action variant="check">Check</Action>, '—'],
        ['Trash', <Action variant="fold">Fold</Action>, '—'],
      ]}
    />
  ),
}

export const WithTags: Story = {
  render: () => (
    <DataTable
      columns={[
        { header: 'Board' },
        { header: 'Classification' },
        { header: 'Risk' },
      ]}
      rows={[
        ['Js8d4c', 'Clean', <Tag>default</Tag>],
        ['Ah9h5h', 'Monotone', <Tag variant="risk">high</Tag>],
        ['Jc6d6s', 'High-low-low', <Tag variant="risk">medium</Tag>],
      ]}
    />
  ),
}
