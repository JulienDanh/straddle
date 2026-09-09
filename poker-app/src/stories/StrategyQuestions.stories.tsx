import type { Meta, StoryObj } from '@storybook/react-vite'
import { StrategyQuestions } from '../components/StrategyQuestions'

const meta = {
  title: 'Quiz/StrategyQuestions',
  component: StrategyQuestions,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StrategyQuestions>

export default meta
type Story = StoryObj<typeof meta>

export const Rules: Story = {
  args: {
    title: 'System 1 — Rules',
    questions: [
      { question: 'What are the two flop buckets for System 1?', options: ['T-high+ and 9-high & below', 'Ace-high and everything else', 'Paired and unpaired', 'Wet and dry'], correct: 0, explanation: 'Bucket 1: T-high+ → c-bet 100%. Bucket 2: 9-high & below → mix ~70/30.' },
      { question: 'What adaptation when shallow (20bb)?', options: ['C-bet less', 'C-bet more', 'No change', 'Check everything'], correct: 1, explanation: 'Shallow amplifies overpair advantage. Bet MORE, not less.' },
      { question: 'Is KK3 (high-high-low) a risk factor?', options: ['Yes', 'No — only paired low under high counts', 'Sometimes', 'Only if monotone'], correct: 1, explanation: 'KK3 is high-high-low, NOT high-low-low. Only K33, J66, T55 counts.' },
      { question: 'What is the default c-bet sizing for System 1?', options: ['1/4 to 1/3 pot', '~40% pot', 'Pot-sized', '1/5 pot'], correct: 1, explanation: 'Solver examples land at ~40% pot.' },
    ],
  },
}
