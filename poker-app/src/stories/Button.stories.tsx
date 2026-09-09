import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui-shadcn/button'

const meta = {
  title: 'shadcn/Button',
  component: Button,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Next board',
  },
}
