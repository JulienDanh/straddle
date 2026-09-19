import { Action, Board, type StudyNoteData } from '@poker/design-system/src/components/ui'
import { S1_LEAKS, S1_TREE } from '../pages/S1'

// The S1 daily note — leaks and flow are the SAME data as the system page;
// recall prompts are the drill layer (the extracted md's Quiz Spots).

function prompt(cards: string, label: string) {
  return (
    <>
      <Board cards={cards} size="sm" />
      <span className="text-[12px] text-muted">{label}</span>
    </>
  )
}

function answer(variant: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn', label: string, size: string, reason: string) {
  return (
    <>
      <Action variant={variant}>{label}</Action>
      <span className="text-[10px] font-semibold text-muted bg-panel2 border border-line rounded px-1.5 py-px whitespace-nowrap">{size}</span>
      <span>{reason}</span>
    </>
  )
}

export const S1_NOTE: StudyNoteData = {
  spot: 'UTG opens, BB calls, BB checks — hero decides the flop c-bet.',
  leaks: S1_LEAKS,
  flow: S1_TREE,
  recall: [
    { prompt: prompt('Kh8h3c', 'K83 two-tone — T-high+, clean'), answer: answer('bet', 'C-bet 100%', '20% pot', 'every hand') },
    { prompt: prompt('AhJh5h', 'monotone'), answer: answer('check', 'Mix', '20% pot', 'bet top/bottom, check middle — check the no-heart overpairs') },
    { prompt: prompt('AsKh2c', 'AKx'), answer: answer('check', 'Mix', '~73% pot', 'slow down') },
    { prompt: prompt('Ad2c2s', 'paired low under high'), answer: answer('check', 'Mix', '20% pot', 'bet trips + weak, check underpairs — AT with the A bets') },
    { prompt: prompt('JhTs9c', '3+ straights'), answer: answer('check', 'Mix', '~73% pot', 'slow down heavily') },
    { prompt: prompt('KsKd3c', 'KK3 rainbow — high-high-low'), answer: answer('bet', 'C-bet 100%', '20% pot', 'NOT a risk factor') },
    { prompt: prompt('9h7d3c', '9-high'), answer: answer('check', 'Mix ~70/30', '~73% pot', 'no 100% exists — bet top, bet bottom, check middle') },
  ],
  why: 'Overpair asymmetry — UTG has far more strong pairs than the BB caller; shorter stacks amplify it.',
  notes: 'Sizes come from the solved spots (40bb single-raised pot, 5.5bb after antes — 20% pot = 1.1bb). The small size grows with depth: 1.1bb @40, 1.8bb @50, ~2bb @100, where the polar branch reaches overbet territory (6.5bb on AK2).',
}
