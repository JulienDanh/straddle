import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, BoardType } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW7_LEAKS: [ReactNode, ReactNode?][] = [
  ['Applying HU probe logic 3-way', 'PS1\u2019s "check-back caps the raiser" is false the moment a third player checked first'],
  ['Probing from the nuts-disadvantaged seat', 'on T98r/K76m you have hands, but not *the* hands'],
  ['Small block-betting polar spots', '33% pot just cheapens your monsters — probe big'],
  ['Ignoring card order', 'K-7-6-5 and 7-6-5-K are different strategic hands'],
]

export const MW7_TREE: DecisionNode = {
  question: 'On the checked flop, does your defended range hold at least as many nutted hands as raiser + caller?',
  hint: 'The 3-way check-around caps almost nobody — the middle player checks their entire range including the nuts; only the LAST checker is capped · classify the flop before looking at the turn',
  yes: {
    question: 'Did the turn give you hands nobody else has?',
    hint: 'Paired-low (K77) and low-connected (765tt) flops give BB nut parity',
    yes: {
      action: <Action variant="bet">Probe ~always, 100% pot</Action>,
      actionVariant: 'bet',
      reason: 'Straights, two pair, trips only you can hold — polar: value + bluffs with straight/trips blockers',
      boards: [
        <BoardType cards="Ks7d6c5d" label="K76 + 5 — only BB has straights" variant="green" />,
        <BoardType cards="Kc7h7s2d" label="K77 + deuce" variant="green" />,
      ],
    },
    no: {
      action: <Action variant="bet">Probe large (67–100%)</Action>,
      actionVariant: 'bet',
      reason: 'Nut parity from the flop alone — but read the card order',
      detail: [
        'Overcard fitting the checked ranges (K over 765) → still probe, **split 67%/100%** — BTN\u2019s check-back gained Kx',
        'Equity-parity board (T75r-type) → the exception: **small linear** with pair+draw (54s pushes CO off A5)',
        'Pure blank on a marginal flop → **check entire range** — "a blank like the 2♣ isn\u2019t good enough"',
      ],
      boards: [
        <BoardType cards="7d6c5dKs" label="765 + K — thinner edge" variant="orange" />,
      ],
    },
  },
  no: {
    action: <Action variant="check">Check — no probe exists</Action>,
    actionVariant: 'check',
    reason: 'Nuts-disadvantaged (T98r, K76m): probing donates the pot to the uncapped range behind',
    detail: [
      'Even with a nutty hand after the check-around, you\u2019re incentivized to check and let opponents bet',
      'The bottom of your range is irrelevant — **probe parity, not weakness**',
    ],
    boards: [
      <BoardType cards="Th9h8c" label="T98 — out-nutted" variant="red" />,
    ],
  },
}

export function MW7Page() {
  return (
    <Section title="MW7 — Missed Turn Probe Bets">
      <p>Three-way single-raised pot, flop checks through — the BBZ clock says everyone missed. The heads-up reflex says "probe the capped ranges." Wrong: in a 3-way pot the check-around caps <em>almost nobody</em>, and probing depends not on who checked, but on <strong>whether the flop and turn gave you nut parity</strong>. The most counterintuitive system in the course.</p>

      <Leak items={MW7_LEAKS} />

      <DecisionTree root={MW7_TREE} />

      <Callout variant="bad"><strong>Nut edge bets big; equity edge bets small.</strong> BB's 3-way probes are "sized almost exclusively large, often full-pot" — BB rarely has an equity advantage vs a player who checked their whole range, so the probe leverages the nuts advantage. The small-linear exception works because the nutted hands in the range make raising dangerous for opponents: "hands that want to get raised and hands that do not present tough, no-win decisions."</Callout>

      <Subhead>Population exploit</Subhead>
      <p className="text-[13px] text-muted leading-snug">Humans in the middle seat bet their strong hands far more than the solver does (fear of being drawn out on). If your human opponent would bet many of their strongest hands on the flop, their check-around genuinely caps them — probe turns more aggressively as the exploit. Vs solver-like checkers, stick to the buckets strictly.</p>
    </Section>
  )
}

export default MW7Page
