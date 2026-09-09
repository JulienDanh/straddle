import type { Meta, StoryObj } from '@storybook/react-vite'
import { StrategyQuiz } from '../components/StrategyQuiz'

const meta = {
  title: 'Quiz/StrategyQuiz',
  component: StrategyQuiz,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StrategyQuiz>

export default meta
type Story = StoryObj<typeof meta>

export const CbetOrMix: Story = {
  args: {
    title: 'System 1 — C-bet or Mix?',
    options: [
      { label: 'C-bet 100%', variant: 'bet' as const },
      { label: 'Mix', variant: 'check' as const },
    ],
    scenarios: [
      { board: { high: 'T', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'T-high+ clean → c-bet 100%.' },
      { board: { high: 'A', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'A-high clean → c-bet 100%.' },
      { board: { high: 'A', suit: 'monotone', variant: 'red' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Ace-monotone is a risk factor.' },
      { board: { high: '9', variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: '9-high & below → always mix.' },
    ],
  },
}

export const ThreeOptions: Story = {
  args: {
    title: 'System 4 — Which bluff?',
    options: [
      { label: 'Bluff (System 1)', variant: 'bet' as const },
      { label: 'Bluff (System 2)', variant: 'raise' as const },
      { label: "Don't bluff", variant: 'fold' as const },
    ],
    scenarios: [
      { board: { high: 'K', suit: 'monotone', variant: 'green', streets: 5 }, correct: { label: 'Bluff (System 2)', variant: 'raise' }, explanation: '3-flush on river → use System 2 (blocking).' },
      { board: { high: 'A', variant: 'green', streets: 5 }, correct: { label: 'Bluff (System 1)', variant: 'bet' }, explanation: 'Wide ranges → bluff weakest hands first.' },
      { board: { high: 'A', suit: 'monotone', variant: 'red', label: 'Busted straight + flush', streets: 5 }, correct: { label: "Don't bluff", variant: 'fold' }, explanation: 'QJ♥ blocks both busted straights AND flushes.' },
    ],
  },
}
