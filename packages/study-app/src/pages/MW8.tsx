import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DecisionTree, Action } from '@poker/design-system/src/components/ui'
import type { DecisionNode } from '@poker/design-system/src/components/ui'

export const MW8_LEAKS: [ReactNode, ReactNode?][] = [
  ['Auto-stabbing the check', 'multiway the check is often the trap half of an honest range — verify the turn card first'],
  ['Stabbing from the sandwich', 'the third player behind makes the stab a donation'],
  ['Checking down the capped river', 'players under-bluff fully checked rivers while the population over-folds them'],
  ['Hero-calling the delayed check-raise', 'the one line in poker that is honestly nutted — folding is correct most of the time'],
]

export const MW8_TREE: DecisionNode = {
  question: 'Did the aggressor check the card their range wanted to barrel?',
  hint: 'A multiway check is half trap, half surrender — the turn card tells you which half',
  yes: {
    action: <Action variant="bet">Stab</Action>,
    actionVariant: 'bet',
    reason: 'Genuine give-up — the card they wanted arrived (overcards on low boards) and they passed',
    size: '33–50% pot',
    detail: [
      'Stab from any seat with value + equity — but the middle seat still needs hands that survive a raise',
      'Value: top pair+ that beats the check-down region · semi-bluffs with nut potential',
    ],
  },
  no: {
    question: 'Is the card threatening to their range (completes draws, connects the defenders)?',
    hint: 'OOP bettors check strong hands on scary turns — two players can raise them',
    yes: {
      action: <Action variant="check">Check behind</Action>,
      actionVariant: 'check',
      reason: 'Trap-tilted — monsters pot-controlling into two players',
      detail: [
        '"Players in position will bet into you, setting up the check-raise"',
        'Stab only IP-last, with value only (50–66%) — and fold everything but the nuts to the delayed check-raise',
      ],
    },
    no: {
      action: <Action variant="bet">Stab small, in position only</Action>,
      actionVariant: 'bet',
      reason: 'Blank turn OOP — mixed trap/give-up: check the middle, stab 33–50% from position',
    },
  },
}

export function MW8Page() {
  return (
    <Section title="MW8 — Missed Turn Cbets">
      <p>The flop bettor checked the turn. Heads-up, this is a routine "delayed give-up" you attack on autopilot; multiway it is a loaded signal — a trap with the nut-tilted part of their range, a genuine give-up, or a positional concession. The check passes the clock; claim it only with hands that can survive the third player still in the pot.</p>

      <Leak items={MW8_LEAKS} />

      <DecisionTree root={MW8_TREE} />

      <Callout variant="good"><strong>Checked-down rivers are the bluffing lane.</strong> "Everyone's checking range is generally weaker and more capped multiway... river ranges are often quite weak when action checks down. Even more so in practice, as players tend to value bet too thin." When the aggressor checks turn <em>and</em> it checks around, three capped ranges reach the river — polarized large bluffs with blockers print because the field over-folds (MW10/MW11).</Callout>

      <Subhead>Seat still rules</Subhead>
      <ul>
        <li><strong>Last to act:</strong> may stab in every bucket except pure trap boards — small, value + blocker hands.</li>
        <li><strong>Middle/first with players behind:</strong> stab only the give-up card, only with hands that continue vs a raise. The sandwich rule never sleeps — the aggressor's check didn't remove the third player.</li>
        <li><strong>If your stab checks through:</strong> you own the river — value bet thin vs the capped field. If the aggressor check-raises your stab: fold everything but the nuts; the trap half just announced itself.</li>
      </ul>
    </Section>
  )
}

export default MW8Page
