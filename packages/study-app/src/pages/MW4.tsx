import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action, DataTable } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW4_LEAKS: [ReactNode, ReactNode?][] = [
  ['Overcalling on autopilot', 'the population overcalls at ~2× equilibrium in this exact seat'],
  ['Slow-playing premiums multiway', '"keep them both in" caps winnings and risks two streets of outdraw'],
  ['Overcalling dominated offsuit broadways', 'KJs no flush draw vs bet–call on KJQ is a fold, not a sigh-call'],
  ['Treating better pot odds as a reason to continue', 'equity falls faster than pot odds improve as players enter'],
]

export const MW4_TREE: DecisionNode = {
  question: 'Are you last to act (no live players behind)?',
  hint: 'The whole system rests on closing the action — one live player behind demotes you to call-or-fold',
  yes: {
    question: 'Premium, nut draw, or blocker-bluff?',
    hint: 'Medium pairs block sets/two pair · suited aces block the flush draws that continue',
    yes: {
      action: <Action variant="raise">Squeeze</Action>,
      actionVariant: 'raise',
      reason: 'Both opponents are capped — they can\u2019t defend wide AND can\u2019t re-raise light',
      size: '~3× the bet + the dead call',
      detail: [
        'Value-max line: overpairs, sets, two pair, nut draws — **AA always squeezes here**',
        'Blocker bluffs: second/third pair, suited aces blocking the nut region',
        'HJ raises 30.7% vs overcalls 14.5% after bet + call',
      ],
    },
    no: {
      question: 'Suited broadway that dominate the bettor\u2019s thin value, deep stacks?',
      hint: 'QJs-type: beat the thin value, realize position, keep both in',
      yes: {
        action: <Action variant="call">Overcall</Action>,
        actionVariant: 'call',
        reason: 'The exception, not the default — dominate the bettor\u2019s thin value with nut potential and position',
        detail: ['Plan the turn now: call one more street; take the lead when the bettor checks (MW8)'],
      },
      no: {
        action: <Action variant="fold">Fold</Action>,
        actionVariant: 'fold',
        reason: 'Equity-poor: offsuit broadways, dominated kickers, weak draws — reverse implied odds against two ranges',
      },
    },
  },
  no: {
    action: <Action variant="call">Call or fold</Action>,
    actionVariant: 'call',
    reason: 'A live player behind → MW3 Bucket B: raise ≈ never',
  },
}

export function MW4Page() {
  return (
    <Section title="MW4 — Missed Flop Squeezes">
      <p>Bet–call–you: the highest-leverage seat on a multiway flop. You close the action against two capped ranges, and the population's default — the overcall — is provably wrong. Treat the overcall as the exception, not the default, whenever your hand has any raise-case at all.</p>

      <Leak items={MW4_LEAKS} />

      <DecisionTree root={MW4_TREE} />

      <Callout variant="good"><strong>"Bet–call–you: the raise does the earning."</strong> The squeeze converts a passive, marginal spot into an aggressive, high-fold-equity situation — used more than twice as often as the call. And it's the value-max line, not a bluff device: pocket aces always squeeze here. Yes, it "feels miserable" — do it anyway. Two opponents drawing at your overpair is the most expensive free card in poker.</Callout>

      <Subhead>The missed squeeze — what your overcall survives as</Subhead>
      <ul>
        <li>Keep hands that (a) dominate the bettor's thin value, (b) have nut potential to outdraw both, or (c) realize well with position.</li>
        <li>QJs-type suited broadways are pure overcalls; KJs with <em>no flush draw</em> becomes a pure fold once bet–call happens — top pair + gutshot is dead weight against two strong ranges.</li>
        <li>An overcalled flop leaves three defined ranges: bettor (condensed, strong), caller (capped), you (capped, position). Your profit comes from the times they check (MW8) or from river mistakes (MW10/MW11). Do not "wake up" and stab into the bettor — their checking range still contains the hands they didn't need to barrel.</li>
      </ul>

      <Subhead>Facing the squeeze yourself</Subhead>
      <DataTable
        compact
        columns={[{ header: 'You were' }, { header: 'Response' }]}
        rows={[
          ['The bettor, squeezed after a call', <>Continue at tightest thresholds — sets/overpairs/nut draws; one-pair "value" folds more often than it wants to</>],
          ['The first caller', <>Now sandwiched — MW3 Bucket B with extra force</>],
        ]}
      />

      <Callout variant="bad"><strong>"Pot odds lie multiway."</strong> As more players enter the pot, your decrease in equity outweighs the improved pot odds — the reverse implied odds are doing the real math.</Callout>
    </Section>
  )
}

export default MW4Page
