import type { Meta, StoryObj } from '@storybook/react-vite'
import { PracticeFlow } from '../components/PracticeFlow'

const meta = {
  title: 'Practice/PracticeFlow',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

const quizOptions = [
  { label: 'C-bet ~40% pot', variant: 'bet' as const },
  { label: 'C-bet 75% pot', variant: 'bet' as const },
  { label: 'Check', variant: 'check' as const },
  { label: 'Fold', variant: 'fold' as const },
]

const quiz = {
  options: quizOptions,
  scenarios: [
    {
      board: { high: 'A' as const, suit: 'rainbow' as const, label: 'Ace-high, dry' },
      correct: quizOptions[0],
      explanation: 'Dry ace-high boards are the cleanest c-bet bucket — bet ~40% pot.',
    },
    {
      board: { high: 'A' as const, suit: 'monotone' as const, label: 'Ace-monotone' },
      correct: quizOptions[2],
      explanation: 'Monotone boards crush the raiser range — check instead of betting.',
    },
    {
      board: { high: 'J' as const, suit: 'two-tone' as const, connected: true, label: 'J-high, connected' },
      correct: quizOptions[2],
      explanation: 'Connected middling boards favor the caller — checking wins the bucket.',
    },
  ],
}

const questions = [
  {
    question: 'What bucket does a T-high+ disconnected flop fall into?',
    options: ['Check-only bucket', 'C-bet bucket', 'Fold bucket'],
    correct: 1,
    explanation: 'T-high+ boards favor the preflop raiser — c-bet ~40% pot.',
  },
  {
    question: 'What is the default c-bet size in System 1?',
    options: ['~25% pot', '~40% pot', '75% pot', '100% pot'],
    correct: 1,
    explanation: 'System 1 uses ~40% pot across the c-betting range.',
  },
  {
    question: 'Is high-high-low a risk factor?',
    options: ['Yes', 'No — high-low-low is'],
    correct: 1,
    explanation: 'High-low-low (paired low under high) is the risk factor, not high-high-low.',
  },
]

export const QuizAndQuestions: Story = {
  render: () => (
    <PracticeFlow title="System 1 — Practice" quiz={quiz} questions={questions} />
  ),
}

export const QuestionsOnly: Story = {
  render: () => (
    <PracticeFlow title="Rules Q&A" questions={questions.slice(0, 2)} />
  ),
}

export const QuizOnly: Story = {
  render: () => <PracticeFlow title="Board spots" quiz={quiz} />
}
