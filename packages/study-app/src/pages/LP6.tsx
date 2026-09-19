import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Code, Action } from '@poker/design-system/src/components/ui'

export const LP6_LEAKS: [ReactNode, ReactNode?][] = [
  ['Barreling at flop frequency', '"I bet flop so I bet turn" ignores that the caller self-selected for strength'],
  ['Geometric monotony', 'betting geometric with vulnerable hands on dynamic boards gives cheap cards to the hands that beat you later'],
  ['Tiny river-setup bets', '25% turn with the nuts and 12bb behind wastes the geometric path — stack the streets to arrive all-in'],
]

export function LP6Page() {
  return (
    <Section title="LP6 — Turn Barrels and Geometric Sizing">
      <p>SB bet a limped flop and got called (or the flop checked through); the turn decision. Two governing principles: <strong>(1) you only cash in your equity advantage once</strong> — a high-frequency flop bet is followed by a lower-frequency, more polar turn; and <strong>(2) sizing follows geometry</strong> — the fraction of pot that goes all-in if repeated each street, with systematic departures for equity denial.</p>

      <Leak items={LP6_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Turn situation' }, { header: 'Barrel' }]}
        rows={[
          [
            <><strong>A · Dynamic, draws complete</strong></>,
            <>Straight/flush arrives</>,
            <><Action variant="bet">Barrel polar and large</Action> — fold equity vs the capped caller</>,
          ],
          [
            <><strong>B · Static blank</strong></>,
            <>No range change</>,
            <>Lower frequency, two sizes: thin value small, nut hands geometric-to-jam</>,
          ],
          [
            <><strong>C · Overcard to your value</strong></>,
            <>K/Q/A over the middling board</>,
            <><Action variant="check">Check the middling hands</Action>; only nut+ or blocker bluffs continue</>,
          ],
          [
            <><strong>D · Checked-through flop</strong></>,
            <>Both checked</>,
            <>The flop-favored player resumes — barrel favorable boards, check-give-up unfavorable ones</>,
          ],
        ]}
      />

      <Subhead>Geometric sizing</Subhead>
      <p className="mb-1">The bet fraction <Code>s</Code> of pot such that betting <Code>s</Code> on each remaining street ends exactly all-in:</p>
      <DataTable
        compact
        columns={[{ header: 'Geometry' }, { header: 'Size' }]}
        rows={[
          ['SPR 1, one street', 'one pot-sized bet'],
          ['SPR 2, two streets', '~73% pot twice'],
          ['SPR 5, three streets', '~82% pot three times'],
          ['Vulnerable value vs overcards/draws', 'larger than geometric (125–200%) — hypergeometric'],
          ['River, last to act, polar', 'all-in geometric, even 2×+ pot'],
        ]}
      />

      <Callout variant="good"><strong>Vulnerable value frontloads; nut value stacks geometrically.</strong> The hypergeometric (bigger-than-geometric) bet exists to fold out draw equity: 99 on 742 that barreled the flop should barrel the turn <em>bigger</em> than geometric — deny the live overcards their easy river decision. Solvers go smaller-than-geometric early (equities run together), geometric/large on the river — the one street where hands are pure value or pure air.</Callout>

      <Callout variant="bad"><strong>Flop-favored keeps the edge through checks.</strong> If the flop checked through, the player favored on that flop usually retains their advantage on turn and river — SB bluffs 5-high on AJ6-type runouts (profitable) and check-folds K-high on 762-type ones (indifferent). Restart from LP2's texture read.</Callout>

      <Subhead>Risk factors</Subhead>
      <ul>
        <li>Hypergeometric bets need a real top-end advantage — if the caller has many strong hands, your bluffs lose too much when called.</li>
        <li>ICM compresses all of this: under pressure, frontloading jams gains, geometry loses importance.</li>
      </ul>
    </Section>
  )
}

export default LP6Page
