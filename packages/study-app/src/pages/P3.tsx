import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const P3_LEAKS: [ReactNode, ReactNode?][] = [
  ['Defaulting to 30% pot on every flop', 'texture + nut advantage pick the size'],
  ['Overbetting with medium hands', 'medium hands belong in the small-bet or check region'],
  ['Bluffing with air in the overbet region', 'big-bet bluffs need equity — draws, not zero-equity spazzes'],
  ['Big betting multiway', 'each caller erodes the range advantage — small and merged'],
  ['Abandoning the plan when the board changes — or failing to escalate when it doesn\u2019t', '"did the board change?" is every-street discipline'],
]

export const P3_TREE: DecisionNode = {
  question: 'Is the board raiser-favorable (broadway/ace-heavy, static — BB capped)?',
  hint: 'EP opens tight → bigger nut advantage on most flops · BTN wide → only on the most extreme textures',
  yes: {
    question: 'Little to gain from betting medium hands?',
    hint: 'Betting medium hands small would divert monsters from the overbet range — GTO Wizard',
    yes: {
      action: <Action variant="bet">Overbet</Action>,
      actionVariant: 'bet',
      reason: 'Nuts advantage + nothing to gain from medium hands = overbet',
      size: '100–150% pot · 1.5× pot default',
      detail: [
        'Value → two pair+, sets, strong top pairs, nut draws',
        'Bluffs → equity-heavy: combo draws, backdoor-heavy overs — **from draws, not air**',
      ],
      boards: [
        <BoardType cards="KdQc7d" label="KQ7 — BB capped at one pair" variant="green" />,
        <BoardType cards="AsJs4h" label="AJ4 — EP nut advantage" variant="green" />,
      ],
    },
    no: {
      action: <Action variant="bet">Standard c-bet</Action>,
      actionVariant: 'bet',
      reason: 'Neutral or dynamic — merged range, S1/S2 logic',
      size: '30–50% pot',
      boards: [
        <BoardType cards="Kh7s2c" label="K72 rainbow" variant="default" />,
      ],
    },
  },
  no: {
    action: <Action variant="check">Check</Action>,
    actionVariant: 'check',
    reason: 'BB-favorable — low, connected, or BB has the nut advantage',
    detail: [
      'Proceed to turn-probe logic (PS1/PS2)',
      'BB defends more low suited hands → **BB has the nuts more often than you**',
    ],
    boards: [
      <BoardType cards="7s5s3d" label="753 — smashes BB range" variant="red" />,
    ],
  },
}

export function P3Page() {
  return (
    <Section title="P3 — Flop Big-Betting vs BB">
      <p>You raised preflop, BB defended. Instead of defaulting to a 30% pot c-bet, this system finds the spots where a big bet (100%+) or overbet (&gt;pot) is the correct pressure play. The exploit: humans are consistently insensitive to bet sizing — people underfold vs overbets, which is great when you're pushing a lot of equity.</p>

      <Leak items={P3_LEAKS} />

      <DecisionTree root={P3_TREE} />

      <Callout variant="good"><strong>"Did the board change?"</strong> — the one question for the deeper-stacked aggressor IP. Turn is a brick and you still have the nut advantage → overbet again. Draw completed or overcard to your region → reassess: check/call or small bet.</Callout>

      <Subhead>Sizing ladder</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Situation' }, { header: 'Size' }]}
        rows={[
          ['Flop overbet (Bucket A)', '100–150% pot'],
          ['Standard overbet (Bungakat default)', '1.5× pot — sims also show 125%, 175%, 2×'],
          ['Geometric finisher', 'Same fraction each street to be all-in by the river (two streets, ~2.5× pot behind → ~100%/street)'],
          ['Unsure', '2/3 pot — "if you\u2019re not sure, bet two-thirds instead"'],
          ['Multiway (2+ opponents)', 'Small and merged: 25–40% pot — the big-bet region dies'],
        ]}
      />

      <Subhead>Choose the size before the hands</Subhead>
      <ul>
        <li>Bucket A → the size is 100–150% pot; assign hands to it: value first (you can't expect opponents to shovel money in for you), equity bluffs second.</li>
        <li>Against an unexploitable opponent flop size is not terribly important — provided you make up the difference later (small flop, overbet turn/river).</li>
        <li>Geometric sizing maximizes total money in the pot when ranges are polarized — don't size flop big then check down the nuts.</li>
      </ul>

      <Callout variant="bad"><strong>Multiway kills big bets.</strong> Each additional caller erodes the raiser's range advantage; multiway betting stays small to deny equity, not to polarize. Addamo–Negreanu is the template in reverse: BB flopped the nuts on a BTN-capped board and shoved 4× pot — when BB can have the nuts and you can't, you're on the wrong side of this system.</Callout>
    </Section>
  )
}

export default P3Page
