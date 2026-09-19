import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const PS1_LEAKS: [ReactNode, ReactNode?][] = [
  ['Blocker-betting small on turned overcards', 'defense is required, not offense'],
  ['Probing every turn with air regardless of card classification', 'the card is the strategy switch'],
  ['Bluffing with zero-equity hands on raiser-favorable flops', 'bluffs need equity when called into a strong checking range'],
  ['Forgetting board-pairing turns are below average for BB', 'IP still has pocket pairs and A-high'],
  ['Never probing because "the raiser\u2019s range is stronger"', 'the check-back caps them — the door is flimsy'],
]

export const PS1_TREE: DecisionNode = {
  question: 'Is the turn a draw-completer (straight/flush card)?',
  hint: 'The check-back caps them; the turn card tells you how much · draw-completers are BB gold, overcards are BB poison',
  yes: {
    action: <Action variant="bet">Probe small-linear</Action>,
    actionVariant: 'bet',
    reason: '70%+ of IP\u2019s range under 50% equity — "a light nudge is enough to push down a flimsy door"',
    size: '33–50% pot',
    detail: [
      'Bet most pairs and decent draws — even **third pair top kicker** (A7 on T72-8)',
      'Thin value + equity denial + semi-bluffs',
      'Population always c-bets draws → probe **more** than solver baselines',
    ],
    boards: [
      <BoardType cards="Th7s2d8h" label="T72 → 8" variant="green" />,
      <BoardType cards="9h8d3cTh" label="983 → T (straight)" variant="green" />,
    ],
  },
  no: {
    question: 'Is it an overcard (A worst, then K, Q)?',
    hint: 'IP backs into top pair / checked back A-high — you\u2019re equity-disadvantaged (~57% IP)',
    yes: {
      action: <Action variant="check">Check (or polar-huge)</Action>,
      actionVariant: 'check',
      reason: 'Never small "blocker" bets — if you bet, tell the story that beats turned top pair: two pair+ for value, or a big bluff',
      size: '150–250% pot when you do bet',
      detail: [
        'Value → **two pair+** · Bluffs → missed draws, blocker air (53/43, QJ)',
        'Vs stations on this card: bluff less, value bet bigger',
      ],
      boards: [
        <BoardType cards="Th7s2dAc" label="T72 → A (poison)" variant="red" />,
      ],
    },
    no: {
      question: 'Does it pair the flop board?',
      hint: 'IP still holds pocket pairs and A-high that withstand pressure',
      yes: {
        action: <Action variant="check">Temper aggression</Action>,
        actionVariant: 'check',
        reason: 'Below-average card for BB — modest probing, check more',
        boards: [
          <BoardType cards="Th7s2d2c" label="T72 → 2" variant="orange" />,
        ],
      },
      no: {
        action: <Action variant="bet">Dual sizes</Action>,
        actionVariant: 'bet',
        reason: 'Brick turn, near-even ranges, slight BB nut edge — split your sizing',
        size: '33% thin value + 75–100% with TPTK+',
        detail: ['Weak underpairs and second pair bet **small for protection** · strong pairs bet big'],
        boards: [
          <BoardType cards="Th7s2d4c" label="T72 → 4" variant="default" />,
        ],
      },
    },
  },
}

export function PS1Page() {
  return (
    <Section title="PS1 — BB Turn Probe Betting">
      <p>Heads-up, you defended from the BB and the in-position raiser checked back the flop. A <strong>probe bet</strong> attacks that check: overpairs, sets, strong top pairs and most draws usually c-bet, so the check-back caps the raiser. The single biggest skill: <strong>classify the turn card before deciding anything</strong>.</p>

      <Leak items={PS1_LEAKS} />

      <DecisionTree root={PS1_TREE} />

      <Callout variant="bad"><strong>Never block-bet a turned overcard.</strong> IP holds top pair ~30% of the time and ~57% equity overall — a small bet just bleeds chips. Defense (check) or a polar overbet (200–250% pot, jam when &lt;2× pot behind) are the only sound options.</Callout>

      <Subhead>Read the flop first</Subhead>
      <ul>
        <li><strong>Raiser-favorable flop (AK8, A-high, paired highs) checked back:</strong> they checked medium hands, not air. You have nuts advantage only → low-frequency, large-size probing; bluffs need equity (flush draws, gutshots); check-fold your worst.</li>
        <li><strong>Even/unfavorable flop (654-type) checked back:</strong> they checked because they had to — weak-heavy range. Probe liberally: any pair for value/protection, no-pair hands with pair outs as bluffs.</li>
      </ul>

      <Subhead>Depth and population</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Situation' }, { header: 'Adjustment' }]}
        rows={[
          ['50–60bb', 'Full system, all sizes incl. 200%+ overbets'],
          ['30–50bb', 'Overbets shrink toward pot/jam; Bucket B polar bets become shoves'],
          ['20–30bb', 'Probes compress to 40–60% or jam; fold equity matters more'],
          ['3-bet pots', 'IP c-bets &gt;80% after 3-betting → check-backs are rare and telling — probe aggressively on any card that helps you'],
          ['Serial c-bettors', 'You rarely get to probe at all — switch to flop check-raising (P4)'],
        ]}
      />
    </Section>
  )
}

export default PS1Page
