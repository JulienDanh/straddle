import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeGrid } from '../components/RangeGrid'
import { UTG_RFI_CEV, byStack } from '../data/ranges'

// RangeGrid demos for modes RangeBrowser doesn't cover (compact, multi-action).
// Single- and multi-stack range views live in RangeBrowser.stories.

const meta = {
  title: 'Range/RangeGrid',
  component: RangeGrid,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RangeGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Compact: Story = {
  args: { compact: true, raise: byStack(UTG_RFI_CEV, 20).actions.raise },
}

export const RaiseAndCall: Story = {
  args: {
    title: 'BB vs UTG RFI · 20bb',
    subtitle: 'ChipEV',
    raise: byStack(UTG_RFI_CEV, 20).actions.raise,
    call: '5d5c:0.037,6d6c:0.6,7d7c:0.5,8d8c:0.3,Kc4c:0.2723,Kc5c:0.298,KcTd:0.2073,Ac4d:0.0006,Ac5d:0.6107,Ac8d:0.2101,QcJd:0.2599,Tc9c:0.0108,Qc9c:0.0007',
  },
}

export const AllInSpot: Story = {
  args: {
    title: 'BB vs UTG All-in · 20bb',
    subtitle: 'ChipEV · 20bb',
    fold: '72o:1,73o:1,74o:1,82o:1,83o:1,92o:1,93o:1,T2o:1,T3o:1,J2o:1,J3o:1,J4o:1,Q2o:1,Q3o:1,Q4o:1,K2o:1,K3o:1,K4o:1,A2o:0.3,A3o:0.2,A4o:0.1,32s:1,42s:1,43s:1,52s:1,53s:1,62s:1,63s:1,72s:1,73s:1,74s:1,82s:1,83s:1,84s:1,92s:1,93s:1,94s:1,95s:1,T2s:1,T3s:1,T4s:0.5,T5s:0.3,J2s:1,J3s:1,J4s:0.2,Q2s:1,Q3s:1,Q4s:0.1,Q5s:0.05,K2s:1,K3s:0.8,K4s:0.3,K5s:0.1,A2s:0.05,A3s:0.03,A4s:0.01',
    allIn: 'AA:1,KK:1,QQ:1,JJ:1,TT:1,99:1,88:1,77:1,66:1,55:1,44:1,33:1,22:1,AKs:1,AQs:1,AJs:1,ATs:1,A9s:1,A8s:0.8,A7s:0.6,A6s:0.4,A5s:0.5,A4s:0.3,A3s:0.2,A2s:0.1,AKo:1,AQo:1,AJo:1,ATo:0.8,A9o:0.5,A8o:0.3,A7o:0.1,KQs:1,KJs:1,KTs:0.8,K9s:0.5,KQo:1,KJo:0.8,KTo:0.5,QJs:1,QTs:0.5,JTs:0.3,T9s:0.2,98s:0.1',
  },
}
