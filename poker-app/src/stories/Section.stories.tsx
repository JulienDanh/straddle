import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Callout } from '../components/ui-parts/primitives'

const meta = {
  title: 'Primitives/Section',
  component: Section,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'System 1 — UTG RFI vs BB Call',
    children: (
      <>
        <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>
        <Callout>Bucket 1 (T-high+) occurs far more often.</Callout>
      </>
    ),
  },
}

export const WithCallouts: Story = {
  args: {
    title: 'Callout Variants',
    children: (
      <>
        <Callout>Default callout — neutral info.</Callout>
        <Callout variant="warn">Warn — be cautious here.</Callout>
        <Callout variant="bad">Bad — common mistake.</Callout>
        <Callout variant="good">Good — correct play.</Callout>
      </>
    ),
  },
}
