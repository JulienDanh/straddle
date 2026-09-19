import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW1_LEAKS: [ReactNode, ReactNode?][] = [
  ['Treating the BB check as permission to blast', 'the check contains their entire defending range including the nuts'],
  ['Middle players stabbing "because it checked to me"', 'two live ranges behind, one of them uncapped'],
  ['Folding too fast vs blind donks', 'a 33% donk on a connected board needs only ~20% equity to continue'],
]

export const MW1_TREE: DecisionNode = {
  question: 'Is the board blind-favorable (low, connected, paired-low)?',
  hint: 'The clock: pre-flop it was the raiser; on the flop it starts with the BB, passes to the middle player, defaults to IP · a check passes it, a bet claims it',
  yes: {
    action: <Action variant="bet">Expect the donk ~10%</Action>,
    actionVariant: 'bet',
    reason: 'Blinds DO lead ~10% of flops, small — concentrated on the boards their defending range hits',
    size: '33% pot',
    detail: [
      'A lead is **board-love, not a random stab** — straights, sets, pair+draws',
      'If they check instead: trips/straights still possible from suited connectors',
    ],
    boards: [
      <BoardType cards="6s5s4h" label="654 two-tone" variant="orange" />,
      <BoardType cards="7c7h2d" label="K77 paired-low" variant="orange" />,
    ],
  },
  no: {
    action: <Action variant="check">BB checks range</Action>,
    actionVariant: 'check',
    reason: 'Neutral, high/wet, and dry-high boards: the check is automatic and tells you almost nothing',
    detail: [
      '"The big blind should be checking their entire range" — nutted hands, air, everything',
      'A missed donk is NOT a green light — **nobody\u2019s range is capped yet**',
      'Attack for range reasons (position, nut advantage), not because someone showed weakness',
    ],
    boards: [
      <BoardType cards="QsJd5h" label="QJ5 — IP bets ~55%" variant="default" />,
      <BoardType cards="KhJdQd" label="KJQ — wet, IP ~80%" variant="default" />,
      <BoardType cards="Kd9h2c" label="K92 — dry high" variant="default" />,
    ],
  },
}

export function MW1Page() {
  return (
    <Section title="MW1 — Missed BB Donk Bets">
      <p>Three-way flop (or wider). The first decision belongs to the first player out of position — almost always the BB, who <em>can</em> donk-lead (~10%, on boards that favor their range) but defaults to a check. This system is how to read the missed donk: what the check does to ranges, and how the betting initiative — the <strong>clock</strong> — passes around the table.</p>

      <Leak items={MW1_LEAKS} />

      <DecisionTree root={MW1_TREE} />

      <Callout variant="bad"><strong>The middle player is a freeze-out.</strong> When the BB checks, the next player (a cold-caller or EP raiser) checks nearly always — with an uncapped range including the literal nuts. Sandwiched players have no obligation to stab: checking is free and keeps the range protected, while a stab mostly wins a small pot and exposes you to a check-raise from two players.</Callout>

      <Subhead>By seat</Subhead>
      <DataTable
        columns={[{ header: 'Seat' }, { header: 'Default' }]}
        rows={[
          [
            <><strong>Middle player</strong></>,
            <><Action variant="check">Check behind</Action> — capped range, two live players behind; strong made hands and big draws can bet for value/protection, but solvers check nearly always here</>,
          ],
          [
            <><strong>Preflop raiser, OOP</strong></>,
            <>C-bet frequency drops sharply vs heads-up (LJ checks +11% more when both blinds call); skew toward strong made hands and draws, check-give up with air more than feels comfortable</>,
          ],
          [
            <><strong>In position</strong></>,
            <><Action variant="bet">You own the flop bet</Action> — bet ~50–60% of range on most textures (~80% on wet KJQ), nearly always small (MW2)</>,
          ],
        ]}
      />

      <Subhead>Blockers</Subhead>
      <ul>
        <li>Blind leads on blind-favorable boards correlate with suited/connected holdings — Ax and broadway cards block their <em>calls</em>, not their leads.</li>
        <li>Stabbing after a check on a paired-low board is safer holding a board card (trips blocker): it removes the exact hands that would check-raise you.</li>
      </ul>
    </Section>
  )
}

export default MW1Page
