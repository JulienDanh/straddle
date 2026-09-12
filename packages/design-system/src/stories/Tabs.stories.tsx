import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '../components/ui-parts/tabs'
import { Callout, Code } from '../components/ui-parts/primitives'

const meta = {
  title: 'Primitives/Tabs',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

const studyContent = (
  <>
    <p className="text-[13px] text-muted leading-relaxed">
      UTG opens, BB calls, BB checks. We c-bet <Code>~40% pot</Code> on T-high+ boards.
    </p>
    <Callout variant="good">Bucket 1 (T-high+) occurs far more often than any other bucket.</Callout>
  </>
)

const practiceContent = (
  <p className="text-[13px] text-muted leading-relaxed">
    Practice tab content — quiz and Q&A live here via <Code>PracticeFlow</Code>.
  </p>
)

export const StudyPractice: Story = {
  render: () => (
    <Tabs
      tabs={[
        { label: 'Study', content: studyContent },
        { label: 'Practice', content: practiceContent },
      ]}
    />
  ),
}

export const ThreeTabs: Story = {
  render: () => (
    <Tabs
      tabs={[
        { label: 'Study', content: studyContent },
        { label: 'Practice', content: practiceContent },
        { label: 'Hand Examples', content: practiceContent },
      ]}
    />
  ),
}

export const DefaultIndex: Story = {
  render: () => (
    <Tabs
      defaultIndex={1}
      tabs={[
        { label: 'Study', content: studyContent },
        { label: 'Practice', content: practiceContent },
      ]}
    />
  ),
}
