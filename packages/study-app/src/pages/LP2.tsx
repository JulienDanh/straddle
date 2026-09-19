import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const LP2_LEAKS: [ReactNode, ReactNode?][] = [
  ['High-frequency stabbing on low boards', 'the math says check 55–75%+ of flops after limping'],
  ['Medium-size bets on low connected boards', 'half-pot stabs on 742 burn money — overbet polar or check'],
  ['Betting every flop at one frequency', 'the same 40% stab on AJ6 and 762 is two different mistakes'],
]

export const LP2_TREE: DecisionNode = {
  question: 'Is the flop big, static, and disconnected?',
  hint: 'Three dials: equity advantage · nuts advantage · board dynamism (positional disadvantage) — predict your betting frequency from texture before looking at your hand',
  yes: {
    action: <Action variant="bet">Bet ~75%+ of range, small</Action>,
    actionVariant: 'bet',
    reason: 'SB equity + nuts advantage — the limp is stronger than the BB check (SB can limp traps)',
    size: '33% pot · linear',
    detail: [
      'AJ6r at 60bb: SB has ~57% equity, bets ~77% of range',
      'Value from top pair decent kicker+ · thin value from any pair · A-high and K-high bet with backdoors',
    ],
    boards: [
      <BoardType cards="Aj6c2d" label="AJ6 — linear attack" variant="green" />,
      <BoardType cards="JcJh6s" label="J66 — overpair edge" variant="green" />,
    ],
  },
  no: {
    question: 'Is it low and connected (or middling/dynamic)?',
    hint: 'The low-board illusion: 742 looks good, but the BB\u2019s checked range retains the low cards',
    yes: {
      action: <Action variant="check">Check mostly</Action>,
      actionVariant: 'check',
      reason: 'Low boards: BB density edge — check at very high frequencies; overbet polar (overpairs, nut-advantage hands) when you do bet. Dynamic boards: already-strong hands + strong draws only',
      detail: [
        'Low + connected: **no pure small stabs** — 125–150%+ or check',
        'Middling dynamic: bet middle-pair-good-kicker+ and real draws; check A-high',
        'A3hh on 762tt: ~45% equity yet a **pure check-fold** — realization, not raw equity',
      ],
      boards: [
        <BoardType cards="7d4c2h" label="742 — the illusion" variant="red" />,
        <BoardType cards="7h6d2c" label="762 dynamic" variant="orange" />,
      ],
    },
    no: {
      action: <Action variant="bet">Bet often, small</Action>,
      actionVariant: 'bet',
      reason: 'Paired highs (222, J66): SB overpair/nuts advantage — bet often despite the low cards',
      boards: [
        <BoardType cards="2c2h2d" label="222 favors SB" variant="green" />,
      ],
    },
  },
}

export function LP2Page() {
  return (
    <Section title="LP2 — SB Flop Betting After a Limp">
      <p>SB limped, BB checked preflop, flop dealt — hero acts first OOP in a 2bb pot. The SB starts with a modest equity and nuts advantage (the limp is stronger than the check: the SB can trap, the BB's check closes the action). The SB compensates for position by <strong>betting small and linear on favorable flops</strong>.</p>

      <Leak items={LP2_LEAKS} />

      <DecisionTree root={LP2_TREE} />

      <Callout variant="good"><strong>"Check 55–75% of limped flops — aggression is a decision, not a habit."</strong> "Checking frequently and using very large bets like overbets is a strong betting strategy for the SB, in contrast to the high-frequency stabbing we see in most metagames." Most metagames stab far too often on low boards — the check-then-overbet structure is the exploit-shaped baseline the pool misses.</Callout>

      <Subhead>Follow-ups</Subhead>
      <ul>
        <li>A high-frequency flop bet is cashed-in equity: expect a <strong>lower, more polar</strong> turn frequency (LP6).</li>
        <li>BB calls your small bet → LP6. BB raises → LP5 (iso-response). You checked → LP3 governs the turn.</li>
        <li>At shallow depths (10–14bb) the BB protects strong hands by raising limps, so the flop ranges are weaker on both sides — frequency stays similar.</li>
      </ul>
    </Section>
  )
}

export default LP2Page
