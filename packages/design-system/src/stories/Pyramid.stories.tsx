import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pyramid } from '../components/ui-parts/pyramid'

const meta = {
  title: 'Visuals/Pyramid',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const HandStrengthTiers: Story = {
  render: () => (
    <Pyramid
      highlight={2}
      tiers={[
        { label: 'Nuts', action: 'Raise', why: 'Max value, stack a fish', variant: 'raise' },
        { label: 'Strong', action: 'Bet', why: 'Polarized pressure', variant: 'bet' },
        { label: 'Medium', action: 'Check', why: 'Showdown value, no fold equity', variant: 'check' },
        { label: 'Weak', action: 'Bluff', why: 'Folds out better hands', variant: 'bet' },
        { label: 'Trash', action: 'Fold', why: 'No equity, no fold equity', variant: 'fold' },
      ]}
    />
  ),
}

export const WithoutHighlight: Story = {
  render: () => (
    <Pyramid
      tiers={[
        { label: 'Value', action: 'Bet', why: 'Strong enough to bet for value', variant: 'bet' },
        { label: 'Showdown', action: 'Check', why: 'Realizes equity at showdown', variant: 'check' },
        { label: 'Give up', action: 'Fold', why: 'Nothing to barrel with', variant: 'fold' },
      ]}
    />
  ),
}

export const AllInTier: Story = {
  render: () => (
    <Pyramid
      tiers={[
        { label: 'Premium', action: 'All-in', why: 'Stack off preflop', variant: 'allIn' },
        { label: 'Playable', action: 'Call', why: 'Realize equity postflop', variant: 'call' },
        { label: 'Junk', action: 'Fold', why: 'Dominate or crush nothing', variant: 'fold' },
      ]}
    />
  ),
}
