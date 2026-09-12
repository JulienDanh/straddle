import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeBrowser } from '../components/RangeBrowser'
import { UTG_RFI_CEV, BB_VS_UTG_CEV, byStack } from '../data/ranges'

const meta = {
  title: 'Range/RangeBrowser',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

export const UtgRfiByStack: Story = {
  render: () => <RangeBrowser ranges={UTG_RFI_CEV} />,
}

export const DefaultStack: Story = {
  render: () => <RangeBrowser ranges={UTG_RFI_CEV} defaultStack={20} />,
}

export const SingleRange40bb: Story = {
  render: () => <RangeBrowser ranges={[byStack(UTG_RFI_CEV, 40)]} />,
}

export const SingleRange20bb: Story = {
  render: () => <RangeBrowser ranges={[byStack(UTG_RFI_CEV, 20)]} />,
}

export const BbVsUtg40bb: Story = {
  render: () => <RangeBrowser ranges={BB_VS_UTG_CEV} />,
}
