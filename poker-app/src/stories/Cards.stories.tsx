import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoleCards, Board, BoardType, RandomBoard, BoardTable } from '../components/ui-parts/cards'
import { Action } from '../components/ui-parts/primitives'

const meta = {
  title: 'Cards/Playing Cards',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const HoleCardsSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-end flex-wrap">
      <div><HoleCards cards="AsKd" size="sm" /><div className="mt-1.5 text-xs text-muted">sm</div></div>
      <div><HoleCards cards="AhKh" size="md" /><div className="mt-1.5 text-xs text-muted">md</div></div>
      <div><HoleCards cards="7c2d" size="lg" /><div className="mt-1.5 text-xs text-muted">lg</div></div>
    </div>
  ),
}

export const BoardSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end flex-wrap">
      <div><Board cards="AsKd5c" size="sm" /><div className="mt-1.5 text-xs text-muted">sm · flop</div></div>
      <div><Board cards="AhKh2d" size="md" /><div className="mt-1.5 text-xs text-muted">md · flop</div></div>
      <div><Board cards="AsKd5cTd" size="md" /><div className="mt-1.5 text-xs text-muted">md · turn</div></div>
      <div><Board cards="AhKd5cTh2s" size="lg" /><div className="mt-1.5 text-xs text-muted">lg · river</div></div>
    </div>
  ),
}

export const BoardTypeVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      <BoardType cards="Js8d4c" label="J-high · clean" variant="green" />
      <BoardType cards="Ah9h5h" label="Ace-monotone" variant="red" />
      <BoardType cards="Jc6d6s" label="High-low-low" variant="orange" />
      <BoardType label="T-high+" variant="green" />
      <BoardType label="9-high & below" variant="orange" />
    </div>
  ),
}

export const RandomBoards: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap items-center">
        <RandomBoard high="A" variant="green" />
        <RandomBoard high="K" variant="green" />
        <RandomBoard high="A" suit="monotone" variant="red" />
        <RandomBoard high="J" paired lowCard={6} variant="orange" label="High-low-low" />
        <RandomBoard akx variant="orange" />
        <RandomBoard high="Q" connected variant="green" />
      </div>
      <div className="text-xs text-muted">Re-rolls on each render</div>
    </div>
  ),
}

export const BoardTableExample: Story = {
  render: () => (
    <BoardTable rows={[
      { boards: [<RandomBoard high="A" variant="green" />, <RandomBoard high="K" variant="green" />], action: <Action variant="bet">C-bet 100%</Action>, note: 'T-high+ clean. Small size.' },
      { boards: [<RandomBoard high="A" suit="monotone" variant="orange" />, <RandomBoard high="J" paired lowCard={6} variant="orange" />], action: <Action variant="check">Mix</Action>, note: 'Bet strong + weak, check medium.' },
      { boards: [<RandomBoard high="9" variant="orange" />], action: <Action variant="check">Mix ~70/30</Action>, note: 'No 100% exists.' },
    ]} />
  ),
}
