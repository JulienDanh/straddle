import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const RS2_LEAKS: [ReactNode, ReactNode?][] = [
  ['Hero-calling with the bottom of the wall', 'the quota comes from the bottom folding, not the bottom calling'],
  ['Bluffing air into a polar range', 'their traps want exactly that action — take the free showdown instead'],
  ['Checking the top into air-heavy checks', 'the polar check is weak — A-tier hands leave thin value on the table'],
  ['Over-adjusting to story', 'the size sets the math; the narrative only re-sorts the wall'],
]

export function RS2Page() {
  return (
    <Section title="RS2 — Condensed In Position">
      <p>Toy Game 2: the in-position player holds the <strong>condensed range</strong> — mostly bluff catchers with a capped top, no nuts, no air — facing an OOP polar range of nuts and air. The condensed IP player is not trying to win the betting war; they are <strong>solving for how to call</strong>, plus harvesting thin value when the polar player shows weakness.</p>

      <Leak items={RS2_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'IP hand vs OOP polar bet' }, { header: 'Action' }]}
        rows={[
          [
            <><strong>A · Top of the wall</strong></>,
            <>Best bluff catchers / thin value</>,
            <><Action variant="call">Call at MDF</Action>; bet small when checked to</>,
          ],
          [
            <><strong>B · Middle of the wall</strong></>,
            <>Median bluff catchers</>,
            <>Mixed calls to hit MDF exactly</>,
          ],
          [
            <><strong>C · Bottom of the wall</strong></>,
            <>Weakest catchers</>,
            <><Action variant="fold">Fold</Action> — the quota comes from here</>,
          ],
          [
            <><strong>D · Residual air</strong></>,
            <>No showdown value</>,
            <><Action variant="check">Check</Action>; never bluff into a polar range that wants action</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"The wall pays from the top, folds from the bottom."</strong> Rank order within a condensed range is the only sorting tool: calls come from the top down until MDF is met, C folds. Never pay with C and fold A.</Callout>

      <Subhead>When the polar player checks</Subhead>
      <ul>
        <li>Bluffs behind a check are weak — nuts would bet, so their check is air-heavy: bet small (~25–33% pot) with A-tier for thin value.</li>
        <li>Check behind with B/C/D — showdown value is the condensed player's salary; don't risk it.</li>
        <li>When betting, unblock their folds (avoid holding the key bricks their air whiffed on); the best bluff-catchers block the polar player's <em>value</em>.</li>
      </ul>

      <Callout variant="bad"><strong>Position is the condensed player's edge.</strong> OOP must act first; IP checks behind and realizes showdown value OOP cannot protect — which is why the same condensed range is far stronger IP than OOP (RS3). Facing multi-street polar attacks at SPR 2/5: hold the <em>cumulative</em> defense at MDF — earlier calls are cheaper per street and keep the river decision inside the α math.</Callout>
    </Section>
  )
}

export default RS2Page
