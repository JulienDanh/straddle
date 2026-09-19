import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const RS5_LEAKS: [ReactNode, ReactNode?][] = [
  ['Leading the traps OOP', 'betting first lets the polar range fold its air and play perfectly'],
  ['Minimum check-raises deep', 'a click at SPR 3 gives them a cheap re-decision — raise to the geometric target'],
  ['Check-raising traps at SPR 1 vs jam-sized bets', 'the call IS the geometric play; raising folds out the bluffs you wanted to keep'],
]

export function RS5Page() {
  return (
    <Section title="RS5 — Condensed OOP with Traps">
      <p>Toy Game 5: the traps move <strong>out of position</strong> — the condensed OOP range contains hands beating the polar IP player's value. Traps are the OOP player's only weapon: they convert positional weakness into a toll the polar player must pay to bet. The core question is check-raise or check-call, and the answer follows SPR.</p>

      <Leak items={RS5_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'OOP hand' }, { header: 'Line vs IP polar aggression' }]}
        rows={[
          [
            <><strong>A · Traps</strong></>,
            <>Beat their value</>,
            <><Action variant="call">Check-call</Action> (shallow / vs small bets) or <Action variant="raise">check-raise geometric</Action> (deep / vs overgrown sizes)</>,
          ],
          [
            <><strong>B · Top wall</strong></>,
            <>Best catchers</>,
            <><Action variant="call">Check-call at MDF</Action></>,
          ],
          [
            <><strong>C · Middle/bottom wall</strong></>,
            <>Median/weak catchers</>,
            <>Check; mixed folds fill the quota</>,
          ],
          [
            <><strong>D · Air</strong></>,
            <>No showdown</>,
            <><Action variant="fold">Check-fold</Action>; blocker check-raises only with fold-unblocking cards</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"Shallow traps call, deep traps raise geometric."</strong> At SPR ≤ ~1.2, check-call — the geometric jam happens naturally on the river anyway. At SPR 2+, check-raise to the geometric target (~3× their bet to set up the river all-in). Their overgrown bets (beyond the trap-capped optimum) get raised more often — the size already paid the trap tax.</Callout>

      <Subhead>What traps do to the game</Subhead>
      <ul>
        <li><strong>Traps refresh the wall:</strong> the OOP checking range is no longer purely capped — IP cannot bet with impunity, and the wall defends a bit wider than MDF because their bluffs lose to the trap fraction too.</li>
        <li><strong>The polar player's counter:</strong> value-bet less thin, bluff with the best blockers, shrink sizes toward the RS4 band (~pot, not 3× pot).</li>
        <li><strong>When they check behind:</strong> traps miss value — accept it; at the river the trap simply wins the pot. The trap's value is the bet it induces, not the bet it makes.</li>
      </ul>

      <Callout variant="bad"><strong>Slow-play discipline.</strong> "Slow-playing the nuts doesn't make sense if the opponent won't bet" — here the opponent <em>will</em> bet (polar ranges must), so trapping is structurally sound. Leading the traps instead lets the air fold and the nuts stack you.</Callout>
    </Section>
  )
}

export default RS5Page
