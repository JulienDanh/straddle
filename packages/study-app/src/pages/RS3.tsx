import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const RS3_LEAKS: [ReactNode, ReactNode?][] = [
  ['Donk-leading medium hands', '"I have a pair, I should bet" feeds the traps and forfeits the bluff-catch'],
  ['Folding the top, calling the bottom', 'rank order within the wall is the only legitimate sort'],
  ['Over-defending early streets at SPR 5', 'spending the wall on cheap turn calls leaves the river jam undefendable'],
]

export function RS3Page() {
  return (
    <Section title="RS3 — Condensed Out of Position">
      <p>Toy Game 3: the <em>same</em> condensed range, now out of position against the IP polar player — and the range collapses strategically. Without the check-behind option, every medium hand must act first into a range that is either nuts or air. The equilibrium core: <strong>check-call the wall at MDF, never bet the middle</strong>.</p>

      <Leak items={RS3_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'OOP hand vs IP polar player' }, { header: 'Action' }]}
        rows={[
          [
            <><strong>A · Top of the wall</strong></>,
            <>Best catchers</>,
            <><Action variant="call">Check-call</Action> all sizes at MDF; the only lead candidates (nuts if present + blockers)</>,
          ],
          [
            <><strong>B · Middle of the wall</strong></>,
            <>Median catchers</>,
            <>Check; mixed calls to meet MDF</>,
          ],
          [
            <><strong>C · Bottom of the wall</strong></>,
            <>Weakest catchers</>,
            <><Action variant="fold">Check-fold</Action> — quota region</>,
          ],
          [
            <><strong>D · Residual air</strong></>,
            <>No showdown value</>,
            <><Action variant="fold">Check-fold</Action>; only the rare blocker-bluff leads</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>"Betting the middle pays twice for the same showdown."</strong> A condensed hand leading into a polar range folds out the air it beats and gets called/raised by the nuts it doesn't — the AKQ-game "K never bets" logic, now the whole range. Resist the urge to "do something" with medium hands OOP.</Callout>

      <Subhead>Leads belong to the ends</Subhead>
      <ul>
        <li>Real solver trees let OOP lead polar (nut region + blocker bluffs, geometric-to-jam at SPR 1) or tiny merged stabs (20–25% pot) — but the condensed middle is a check-call region even when leading is allowed.</li>
        <li>Voucher logic, reversed: the polar IP player took the risk and holds the profitable bluffs; your "bets that prefer folds" need special blockers — pure air into a polar range is a donation.</li>
      </ul>

      <Callout><strong>Position was the salary.</strong> IP-condensed (RS2) harvests free showdowns; OOP-condensed cannot — EV drops purely from acting first. SPR 1 is the mercy case (one geometric bet ends the game); SPR 2/5 force repeated exposure where each earlier call re-prices the river decision — don't spend the whole wall early, the cumulative α is what matters.</Callout>
    </Section>
  )
}

export default RS3Page
