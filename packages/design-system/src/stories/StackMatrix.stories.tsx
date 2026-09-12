import type { Meta, StoryObj } from '@storybook/react-vite'
import { StackMatrix } from '../components/ui-parts/stack-matrix'
import { Action, Code, Small } from '../components/ui-parts/primitives'

const meta = {
  title: 'Visuals/StackMatrix',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const PreflopICM: Story = {
  render: () => (
    <StackMatrix
      colAxisLabel="Their stack"
      rowAxisLabel="Your stack"
      colLabels={['<10bb', '10-20bb', '20-40bb', '40bb+']}
      rows={[
        {
          label: '<10bb',
          cells: [
            { content: <><Action variant="allIn">All-in</Action> <Small>any two</Small></>, variant: 'allIn' },
            { content: <><Action variant="allIn">All-in</Action> <Small>wide</Small></>, variant: 'allIn' },
            { content: <><Action variant="raise">Open 2.1x</Action> <Small>or fold</Small></>, variant: 'raise' },
            { content: <Action variant="fold">Fold</Action>, variant: 'fold' },
          ],
        },
        {
          label: '10-20bb',
          cells: [
            { content: <><Action variant="allIn">All-in</Action> <Small>re-steal</Small></>, variant: 'allIn' },
            { content: <><Action variant="raise">Open 2.1x</Action> <Small>~28% VPIP</Small></>, variant: 'raise' },
            { content: <><Action variant="raise">Open 2.1x</Action> <Small>~22% VPIP</Small></>, variant: 'raise' },
            { content: <><Action variant="fold">Tight</Action> <Small>~15% VPIP</Small></>, variant: 'fold' },
          ],
        },
        {
          label: '20-40bb',
          cells: [
            { content: <><Action variant="raise">Open</Action> <Small>iso wide</Small></>, variant: 'raise' },
            { content: <><Action variant="raise">Open</Action> <Small>~20% VPIP</Small></>, variant: 'raise' },
            { content: <><Action variant="call">Call</Action> <Small>in position</Small></>, variant: 'call' },
            { content: <Action variant="fold">Fold</Action>, variant: 'fold' },
          ],
        },
        {
          label: '40bb+',
          cells: [
            { content: <><Action variant="raise">Open</Action> <Small>pressure</Small></>, variant: 'raise' },
            { content: <><Action variant="call">Call</Action> <Small>postflop edge</Small></>, variant: 'call' },
            { content: <><Action variant="check">Check</Action> <Small>keep pot small</Small></>, variant: 'check' },
            { content: <><Small>Deep stacks, postflop decisions dominate</Small></>, variant: 'default' },
          ],
        },
      ]}
    />
  ),
}

export const NoAxisLabels: Story = {
  render: () => (
    <StackMatrix
      colLabels={['Shallow', 'Medium', 'Deep']}
      rows={[
        {
          label: 'Open',
          cells: [
            { content: <Action variant="allIn">All-in</Action>, variant: 'allIn' },
            { content: <Action variant="raise">2.1x</Action>, variant: 'raise' },
            { content: <Action variant="raise">2.5x</Action>, variant: 'raise' },
          ],
        },
        {
          label: 'Defend',
          cells: [
            { content: <Action variant="fold">Fold</Action>, variant: 'fold' },
            { content: <Action variant="call">Call</Action>, variant: 'call' },
            { content: <Action variant="check">Check</Action>, variant: 'check' },
          ],
        },
      ]}
    />
  ),
}

export const PlainCells: Story = {
  render: () => (
    <StackMatrix
      colLabels={['IP', 'OOP']}
      rowAxisLabel="Position"
      colAxisLabel="Postflop"
      rows={[
        {
          label: 'In position',
          cells: [
            { content: <Code>~40% pot</Code> },
            { content: <Code>~25% pot</Code> },
          ],
        },
        {
          label: 'Out of position',
          cells: [
            { content: <Code>~33% pot</Code> },
            { content: <Code>check</Code> },
          ],
        },
      ]}
    />
  ),
}
