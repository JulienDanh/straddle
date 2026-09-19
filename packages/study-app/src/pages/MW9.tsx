import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW9_LEAKS: [ReactNode, ReactNode?][] = [
  ['Never leading checked-down rivers', 'the documented population over-fold is real money left on the table'],
  ['Leading the merged middle', 'weak one-pair leads get raised by the trap half and called by the value half'],
  ['Leading into completed draws OOP', 'donating the pot to the exact hands the runout built'],
  ['Over-calling as the early defender', 'your over-folds are close to free — the last player carries the defense burden'],
]

export const MW9_TREE: DecisionNode = {
  question: 'Does the river improve your checked-down range specifically?',
  hint: 'Lead your card, check their card · all three ranges are documented by the passive line — capped, weak, over-folded in practice',
  yes: {
    action: <Action variant="bet">Lead value 50–75%</Action>,
    actionVariant: 'bet',
    reason: 'Board pairs low / hits your defended range — a claim you\u2019re entitled to make',
    detail: [
      'Value: two pair+, TPGK on boards the callers can\u2019t have improved past',
      'Blocker bluffs merged at the same size: nut suit on flush rivers, board cards blocking trips',
      'The field over-folds checked rivers — charge them',
    ],
  },
  no: {
    question: 'Does it complete hands behind you (flush/straight arrives)?',
    hint: 'Runout determines who owns the lead — mirror of MW7',
    yes: {
      action: <Action variant="check">Check — trap the stabs</Action>,
      actionVariant: 'check',
      reason: 'A lead is a donation into the completed region: check-raise the value, check-call the blockers, check-fold the middle',
      detail: ['Two players behind means stabs come to you — with the effective nuts, check-raise targets beat leads'],
    },
    no: {
      action: <Action variant="bet">Lead small, merged</Action>,
      actionVariant: 'bet',
      reason: 'Neutral brick: value + blocker bluffs at 33–50%; check the confused middle',
      detail: ['Every hand you lead must be comfortable being called by one player'],
    },
  },
}

export function MW9Page() {
  return (
    <Section title="MW9 — Missed River Bets as OOP">
      <p>Multiway river, action checked to you out of position. In heads-up this is a rare donk-spot; multiway it's a systematic decision with a documented exploit attached: <strong>checked-down multiway ranges are weak, capped, and over-folded in practice</strong>. Bet the river the field doesn't want to defend, with the hands they can't beat.</p>

      <Leak items={MW9_LEAKS} />

      <DecisionTree root={MW9_TREE} />

      <Callout variant="bad"><strong>But the defense is shared.</strong> Fold frequencies multiply — each opponent defends <em>less</em> without being exploitable, so a bluff doesn't print just because two players are weak; it prints because the population over-folds checked-down rivers. The exploit is empirical, not theoretical. And OOP leads pay an information tax: last to act, MW10's rules apply instead.</Callout>

      <Subhead>Leads must be nut-tilted and linear</Subhead>
      <p className="text-[13px] text-muted leading-snug">Betting first into two+ players with a merged range is suicide-by-blockers: your bluffs face the exact hands they don't block, and your thin value faces the region that has it. "Betting ranges become more linear multiway" — bet the nuts region hard, bet blockers, check the confused middle. Value leads want to <em>unblock</em> folds: the flush-completion card in your hand makes your thin value worse (it removes the calls), so bet bigger or check.</p>

      <Subhead>Facing a bet after you checked</Subhead>
      <p className="text-[13px] text-muted leading-snug">You're a shared-defense caller: bluff-catch with blocker hands near the top of your capped range, and remember "the player who closes the action takes on a larger portion of defense than the players before them" — early seats can over-fold profitably. Tight is right.</p>
    </Section>
  )
}

export default MW9Page
