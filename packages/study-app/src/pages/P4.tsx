import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const P4_LEAKS: [ReactNode, ReactNode?][] = [
  ['Check-raising only monsters', 'value starts at strong top pair — face-up ranges get exploited'],
  ['Check-raising into the raiser\u2019s nut-advantage boards', 'raising when range-disadvantaged burns money'],
  ['Bluffing with air instead of draws', 'check-raise bluffs need equity to survive a call'],
  ['Small check-raise sizes', 'the point is to make IP\u2019s medium region indifferent'],
  ['Same bluff frequency multiway as heads-up', 'live players behind punish it'],
]

export const P4_TREE: DecisionNode = {
  question: 'Does the board favor the BB\u2019s range — or is BB polar on it?',
  hint: 'Ace-high (connect-or-miss, no middling hands) · low connected · BB has the nut flush region',
  yes: {
    question: 'Heads-up?',
    hint: 'Multiway → respect the nut ratio of live players',
    yes: {
      action: <Action variant="raise">Check-raise large</Action>,
      actionVariant: 'raise',
      reason: 'BB polarity converts continues into check-raises rather than check-calls',
      size: '~3× the c-bet · ~4× vs small bets',
      detail: [
        'Value → **two pair+, sets, strong top pair** (KJ on K86 = pure frequency), nut draws',
        'Bluffs → **draws, never air**: OESDs, flush draws, overcards with backdoors (KJ bdfd on T22r)',
      ],
      boards: [
        <BoardType cards="As7d3c" label="A73 — ace-high polarity" variant="green" />,
        <BoardType cards="Kd8d6c" label="K86 — strong top pair" variant="green" />,
        <BoardType cards="9c7s2d" label="972 — BB smashes it" variant="green" />,
        <BoardType cards="7s5s3d" label="753 two-tone — nut-ish draws" variant="green" />,
      ],
    },
    no: {
      action: <Action variant="raise">Two pair+ / nut draws only</Action>,
      actionVariant: 'raise',
      reason: 'Multiway check-raise needs stronger value and fewer bluffs',
      detail: ['Fold out weak draws — the nut ratio of live players punishes light raises'],
      boards: [
        <BoardType cards="Th2h2s" label="T22 multiway — fold or check-call" variant="orange" />,
      ],
    },
  },
  no: {
    action: <Action variant="check">Check-call / check-fold</Action>,
    actionVariant: 'check',
    reason: 'Raiser\u2019s board (broadway-heavy) — raising into a nut disadvantage is suicide',
    detail: ['This is P3 Bucket A from the other side — **learn both systems**'],
    boards: [
      <BoardType cards="KdQc7d" label="KQ7 — the raiser\u2019s overbet flop" variant="red" />,
    ],
  },
}

export function P4Page() {
  return (
    <Section title="P4 — Flop Check-Raising from the BB">
      <p>You defended the BB, checked, and faced a c-bet. This system decides when to convert the check into a check-raise — the BB's primary counter-pressure weapon. The BB's preflop discount means its range connects on boards the raiser's range misses, and on those boards continues skew toward check-raises rather than check-calls.</p>

      <Leak items={P4_LEAKS} />

      <DecisionTree root={P4_TREE} />

      <Callout variant="good"><strong>The low-stakes exploit: opponents underfold vs check-raises.</strong> Sims say the c-bettor should continue with QT/JT/ace-highs that turn straight draws — at lower stakes they don't. If they fold those, check-raising with equity prints.</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Facing' }, { header: 'Check-raise size' }]}
        rows={[
          ['33% pot c-bet', '~3–4× the bet (large)'],
          ['50%+ pot c-bet', '~2.5–3×'],
          ['Multiway', 'Larger or fold — small check-raises give great odds and no fold equity'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">Big enough to make even IP's strong top pair indifferent on the flop. On paired flops the bettor must continue ~40% (MDF) or the BB gets profitable bluffs with any two cards.</p>

      <Subhead>Turn plan after a call</Subhead>
      <ul>
        <li>Equity draws barrel favorable turns.</li>
        <li>Strong value bets again or check-raises depending on runout — "did the board change?" (P3 logic in reverse).</li>
        <li>Read-dependent: they overfold → keep printing with draws; they call wide and jam light → tighten bluffs, keep value.</li>
      </ul>

      <Callout variant="bad"><strong>Polar boards for BB → check-raise; polar boards for raiser → check-call.</strong> The same texture reading that drives P3's overbets drives this system from the other seat. KQ7 is a check-call/fold as BB and an overbet as the raiser.</Callout>
    </Section>
  )
}

export default P4Page
