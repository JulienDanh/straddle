import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const PS2_LEAKS: [ReactNode, ReactNode?][] = [
  ['"Defending stubbornly" because you checked back', 'calling above MDF with capped mediocrity'],
  ['Raising turn probes as a routine counter', 'raise is the least-used option from a capped range'],
  ['Folding too much to small probes', 'stabs are funded by exactly this over-fold'],
  ['Calling gutshots vs overbets vs undisciplined opponents', 'that EV only exists vs good players'],
  ['Missing the Bucket D payoff', 'never taking the thin delayed value your flop check set up'],
]

export const PS2_TREE: DecisionNode = {
  question: 'Does the BB probe the turn?',
  hint: 'Your check-back capped you — bluff-catching at MDF, not "fighting back" on principle',
  yes: {
    question: 'Small probe (33–40%)?',
    hint: 'Size up the bet and the board before touching chips',
    yes: {
      action: <Action variant="call">Defend wide at MDF</Action>,
      actionVariant: 'call',
      reason: 'All Ace-highs with showdown value, pairs, good backdoors — rarely raise',
      detail: ['BB stabs are mostly marginal pairs and draws — over-folding funds them'],
    },
    no: {
      question: 'On a board where BB should be scared (you kept the range edge)?',
      hint: 'You checked back AK8-type and they bet anyway',
      yes: {
        action: <Action variant="fold">Bluff-catch tight</Action>,
        actionVariant: 'fold',
        reason: 'This ought to be scary for BB, yet they\u2019re shoveling money in — fold gutshots, tighten everything',
        detail: ['Turn honesty: your most medium pairs (QQ/JJ/TT) prefer checking, not raising or calling light'],
      },
      no: {
        action: <Action variant="call">Call Aces, fold the rest</Action>,
        actionVariant: 'call',
        reason: 'Vs a polar overbet (130–250%), any Ace is the premium call — it blocks BB\u2019s two-pair/set value region',
        detail: [
          'Raises = slow-played monsters (AA) or turned monsters (44 on a 4-turn) only',
          'Gutshot-type calls lean on river-bluff EV that only exists vs disciplined opponents — **fold vs most humans**',
        ],
      },
    },
  },
  no: {
    action: <Action variant="bet">Delayed c-bet</Action>,
    actionVariant: 'bet',
    reason: 'The profitable branch — the second check promotes your hands',
    size: '50–75% pot',
    detail: [
      'Thin value: A9/AJ-type hands that mixed on the flop are now **pure bets**',
      'Bluff with the air you deliberately saved on the flop — its payoff moment',
      'Check back QQ/JJ/TT — the honest-turn dynamic',
      'On turns that improved your checking range, value bet **less** thinly — no longer promoted',
    ],
  },
}

export function PS2Page() {
  return (
    <Section title="PS2 — Defending vs BB Probe Bets">
      <p>You raised preflop in position, checked back the flop, and the BB stabs the turn. Your check-back capped you, so the default is a <strong>bluff-catching game at roughly MDF</strong>, with raises reserved for slow-played or turned monsters. Checking the flop bought information; this system is how you spend it.</p>

      <Leak items={PS2_LEAKS} />

      <DecisionTree root={PS2_TREE} />

      <Callout variant="good"><strong>The promotion effect.</strong> Checking the flop makes BB conclude you're unlikely to hold AK/AQ/sets — they call lighter later, which licenses <em>you</em> to value bet more thinly once checked through. A second check from BB promotes your medium hands into thin-value territory even when they didn't improve in rank.</Callout>

      <Subhead>Your check-back range has three parts</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Part' }, { header: 'Examples' }, { header: 'Plan' }]}
        rows={[
          ['Robust medium hands', 'A2, K6, JJ-type', 'Bluff-catch; thin value when checked through'],
          ['Hopeless air', <>Saved deliberately</>, 'Delayed-aggression bluffs — the Bucket D payoff'],
          ['Blocking monsters', 'AA on AK8', 'Raise the probe — the rare raise region'],
        ]}
      />

      <Subhead>Sizing (when you bet)</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Action' }, { header: 'Size' }]}
        rows={[
          ['Delayed c-bet after BB checks turn', '50–75% pot (value-heavy is fine — BB expects delayed stabs)'],
          ['Thin value on river after turn checks through', '33–50% pot'],
          ['Delayed bluff', '66–75% pot — enough to pressure pairs, cheap vs your capped image'],
        ]}
      />

      <Subhead>Depth and ICM</Subhead>
      <ul>
        <li><strong>30–50bb:</strong> vs big polar probes, calling ranges tighten — stacking off capped grows relative to pot.</li>
        <li><strong>20–30bb:</strong> a polar probe is often a jam decision — count their missed-draw combos and your blockers.</li>
        <li><strong>Bubble/ICM:</strong> probe-calling is one of the first places survival pressure bites — drop the thinnest bluff-catchers, keep the blocker-heavy ones.</li>
        <li><strong>Over-probing population</strong> (delayed c-bets ~6% too often, sized too small — a documented leak): call down lighter, raise more good-but-not-nutted hands.</li>
      </ul>
    </Section>
  )
}

export default PS2Page
