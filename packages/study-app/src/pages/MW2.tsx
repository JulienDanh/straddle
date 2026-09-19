import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW2_LEAKS: [ReactNode, ReactNode?][] = [
  ['Range-betting out of habit', 'defense is shared multiway — nobody has to overfold vs any two cards'],
  ['Checking back every medium hand', 'vulnerable pairs can\u2019t survive two free cards — bet them small'],
  ['Big bets on dynamic boards', 'overbetting JT9 two-tone "does their work for them"'],
  ['Sizing down your value only', 'bet the top too — or your betting range is transparently medium'],
]

export const MW2_TREE: DecisionNode = {
  question: 'Do you flop the most nutted hands here?',
  hint: 'Count the nut edge first · "as the opponents\u2019 combined nut ratio rises, correct bet size falls"',
  yes: {
    question: 'Two of three — nut edge, closing action, low SPR?',
    hint: 'Static high/paired textures or nut-suit blockers · the big-bet windows',
    yes: {
      action: <Action variant="bet">Big-bet window</Action>,
      actionVariant: 'bet',
      reason: 'When two or three levers align, sizing up prints — otherwise always small',
      size: '50–66% SRP · 55–75% 3-bet pot · 60–80% squeeze pot',
      detail: [
        'BTN vs SB+BB on A/K-high static · raiser vs two callers on 942r/T62r/AQ4r',
        'Bluffs must block continues: nut-suit draws, AQ-type overs+backdoors',
      ],
      boards: [
        <BoardType cards="AsKs4d" label="AK4 — BTN vs blinds" variant="green" />,
        <BoardType cards="QhQd5c" label="QQ5 — 3-bet pot" variant="green" />,
      ],
    },
    no: {
      action: <Action variant="bet">Bet ~half, small</Action>,
      actionVariant: 'bet',
      reason: 'IP bets roughly half its range, honest, concentrated at 33% pot',
      size: '33% pot default · 28–33% wet',
      detail: [
        'Value: TPGK+, top two, sets, overpairs — small by default',
        'Medium hands become **bets**: bottom/middle pair, weak top pair (blocker + protection)',
        'Semi-bluffs need **nut potential** (K7ss not 64ss)',
      ],
      boards: [
        <BoardType cards="QsJd5h" label="QJ5 — BTN bets ~55%" variant="green" />,
        <BoardType cards="Kd9h2c" label="K92 — raiser c-bets ~66%" variant="green" />,
      ],
    },
  },
  no: {
    action: <Action variant="check">Check more</Action>,
    actionVariant: 'check',
    reason: 'Nut-disadvantaged — the blinds flop proportionally more sets, two pair, straights',
    detail: [
      'Play more passively regardless of raw equity',
      'If you bet, keep it small — "a player with a range advantage that lacks the strongest hands should typically play more passively"',
    ],
    boards: [
      <BoardType cards="7c5s3d" label="753 — the blinds\u2019 board" variant="red" />,
    ],
  },
}

export function MW2Page() {
  return (
    <Section title="MW2 — Missed Flop Bets">
      <p>Multiway flop, action checked to you in position (or you're the raiser with a range edge). The headline: the IP player bets roughly half their range, almost always small; medium-strength hands become <em>bets</em> rather than checks; and range betting — the backbone of heads-up c-betting — fails. Build a betting range that is honest about being watched by two opponents.</p>

      <Leak items={MW2_LEAKS} />

      <DecisionTree root={MW2_TREE} />

      <Callout variant="bad"><strong>Stop range betting.</strong> Range betting works heads-up because the opponent is forced to overfold. Multiway, defense is shared — a 33% bet only needs each opponent to fold ~half their range, and equity retention collapses vs two ranges: against a 125% bet called by the top quarter of two ranges, even two pair falls behind the collective calling range. Big bets select <em>against</em> you.</Callout>

      <Subhead>Planning the check-back</Subhead>
      <ul>
        <li>Checking caps you — check hands that can defend later or realize showdown: pocket pairs below the middle card (55–88 on K92r are pure checks), strong draws you don't want check-raised off, and the air you're giving up with.</li>
        <li>Your check doesn't get attacked as hard multiway: capped ranges are less exploitable when three players share the defense burden.</li>
      </ul>

      <Callout variant="good"><strong>"Bet small, bet honest, bet half."</strong> Medium hands graduate from checks to bets when the audience doubles — a small bet charges draws, denies equity, doubles as a semi-bluff, and by the river bottom pair blocks sets, two pair and TPGK — the exact calling region.</Callout>
    </Section>
  )
}

export default MW2Page
