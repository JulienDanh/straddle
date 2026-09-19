import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, type DecisionNode } from '@poker/design-system/src/components/ui'
import { Action, BoardType } from '@poker/design-system/src/components/ui'

export const S1_LEAKS: [ReactNode, ReactNode?][] = [
  ['Betting less when shallow', 'bet more'],
  ['Checking medium-strength hands', 'the range you check back is vulnerable to aggression'],
]

export const S1_TREE: DecisionNode = {
  question: 'Is the board T-high or higher?',
  hint: 'A, K, Q, J, T as the highest card · one ace makes a flop ace-high · **the highest-ROI piece in the course**',
  yesLabel: 'YES · BY FAR THE MOST FLOPS',
  yes: {
    question: 'Are there risk factors?',
    hint: 'Monotone · AKx · Paired low under high · 3+ straights — **high-high-low is NOT one**',
    yes: {
      action: <Action variant="check">Mix</Action>,
      actionVariant: 'check',
      reason: 'Bet top, bet bottom, check middle',
      detail: [
        'Monotone A-high → still 20% pot; check the no-heart overpairs',
        'Paired low under high → 20% pot; bet trips + weak, check underpairs',
        'AT with the A → bets more; without it, check',
        'AKx → slow down, ~73% pot',
        '1 straight → bet frequently',
        '3+ straights → slow down heavily (~73%)',
      ],
      boards: [
        <BoardType cards="AhJh5h" label="Monotone" variant="orange" />,
        <BoardType cards="AsKh2c" label="AKx" variant="orange" />,
        <BoardType cards="Ad2c2s" label="A22 — paired low under high" variant="orange" />,
        <BoardType cards="Jh6s6d" label="J66 — high-low-low" variant="orange" />,
        <BoardType cards="JhTs9c" label="3+ straights" variant="red" />,
      ],
    },
    no: {
      action: <Action variant="bet">C-bet 100%</Action>,
      actionVariant: 'bet',
      reason: 'Every hand',
      size: '20% pot · 1.1bb at 40bb',
      boards: [
        <BoardType cards="Kh8h3c" label="K83 two-tone" variant="green" />,
        <BoardType cards="AhTd4c" label="AT4" variant="green" />,
        <BoardType cards="Qh8d2c" label="Q82" variant="green" />,
        <BoardType cards="Th8d5c" label="T85" variant="green" />,
      ],
    },
  },
  no: {
    action: <Action variant="check">Mix ~70/30</Action>,
    actionVariant: 'check',
    reason: '9-high & below — no 100% exists. Bet top, bet bottom, check middle',
    size: '~73% pot · 4bb at 40bb',
    detail: [
      'Straights possible / broadway-low (BB connects) → same mix',
    ],
    boards: [
      <BoardType cards="9h7d3c" label="973" variant="orange" />,
      <BoardType cards="9c9s4d" label="994 paired" variant="orange" />,
    ],
  },
}

export function S1Page() {
  return (
    <Section title="System 1 — UTG RFI vs BB Call · C-betting">
      <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>

      <Leak items={S1_LEAKS} />

      <DecisionTree root={S1_TREE} />

      <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>

      <Subhead>Why bet 100% on T-high+ clean?</Subhead>
      <p className="text-[13px] text-muted leading-snug"><strong className="text-txt">Overpair asymmetry</strong> — UTG has far more strong pairs than the BB caller.</p>

      <p className="text-[13px] text-muted leading-snug">
        The transcript does not prescribe sizes — these come from the solved spots (40bb single-raised pot, 5.5bb after antes, so 20% pot = 1.1bb).
        The small size grows with depth: 1.1bb (20%) at 40bb, 1.8bb (33%) at 50bb, ~2bb at 100bb, where the polar branch reaches overbet territory (6.5bb on AK2).
      </p>

    </Section>
  )
}

export default S1Page
