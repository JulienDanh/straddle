import type { Meta, StoryObj } from '@storybook/react-vite'
import { DecisionTree, type DecisionNode } from '../components/ui-parts/decision-tree'
import { Board } from '../components/ui-parts/cards'
import { Action } from '../components/ui-parts/primitives'

const meta = {
  title: 'Visuals/DecisionTree',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

const tree: DecisionNode = {
  question: 'Is the high card T or higher?',
  hint: 'Bucket 1 covers most flops',
  yes: {
    question: 'Is the board two-tone or monotone?',
    hint: 'Suit texture decides risk',
    yes: {
      action: <Action variant="bet">C-bet ~40% pot</Action>,
      actionVariant: 'bet',
      reason: 'Range advantage holds — bet the bucket',
    },
    no: {
      action: <Action variant="check">Check</Action>,
      actionVariant: 'check',
      reason: 'Monotone crushes our range — check instead',
    },
  },
  no: {
    action: <Action variant="check">Check mostly</Action>,
    actionVariant: 'check',
    reason: 'Low boards favor the caller — check range',
  },
}

export const FlopClassification: Story = {
  render: () => <DecisionTree root={tree} />,
}

export const SingleBranch: Story = {
  render: () => (
    <DecisionTree
      root={{
        question: 'Are you in position?',
        yes: {
          action: <Action variant="bet">Bet ~40% pot</Action>,
          actionVariant: 'bet',
          reason: 'In position — apply pressure',
        },
        no: {
          action: <Action variant="check">Check</Action>,
          actionVariant: 'check',
          reason: 'Out of position — keep the pot small',
        },
      }}
    />
  ),
}

export const WithBoardNodes: Story = {
  render: () => (
    <DecisionTree
      root={{
        question: 'Is the flop paired?',
        yes: {
          action: <Action variant="bet">C-bet small</Action>,
          actionVariant: 'bet',
          reason: 'Paired boards favor the preflop aggressor',
        },
        no: {
          action: <Action variant="check">Check range</Action>,
          actionVariant: 'check',
          reason: 'Unpaired, connected — equity too close',
        },
      }}
    />
  ),
}

// Not every classification is binary — a node can fan out to N labeled
// branches (S2's three board buckets). Mixed with yes/no children below.
export const MultiBranch: Story = {
  render: () => (
    <DecisionTree
      root={{
        question: 'What kind of board is it?',
        hint: 'Three buckets',
        branches: [
          {
            label: 'Ace-high',
            node: {
              action: <Action variant="bet">C-bet 100%</Action>,
              actionVariant: 'bet',
              reason: 'The button has the most aces — risk-free',
            },
          },
          {
            label: 'T–K high',
            node: {
              question: 'Deuce or 3 present?',
              yes: {
                action: <Action variant="bet">C-bet 100%</Action>,
                actionVariant: 'bet',
                reason: 'Disconnected — bet range',
              },
              no: {
                action: <Action variant="check">Mix</Action>,
                actionVariant: 'check',
                reason: 'Two low cards interacting — check middle',
              },
            },
          },
          {
            label: '9-high & below',
            node: {
              action: <Action variant="check">Mix ~60/40</Action>,
              actionVariant: 'check',
              reason: 'The button misses low boards harder',
            },
          },
        ],
      }}
    />
  ),
}

// Demonstrate that leaves accept any ReactNode action alongside a live Board render
export const BoardInTree: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Board cards="AhKh2d" size="md" />
      <DecisionTree
        root={{
          question: 'Is this board AKx?',
          yes: {
            action: <Action variant="bet">C-bet ~40% pot</Action>,
            actionVariant: 'bet',
            reason: 'Ace-high boards favor the raiser',
          },
          no: {
            action: <Action variant="check">Check</Action>,
            actionVariant: 'check',
            reason: 'No ace advantage — check',
          },
        }}
      />
    </div>
  ),
}
