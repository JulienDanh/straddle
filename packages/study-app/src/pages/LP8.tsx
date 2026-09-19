import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP8_LEAKS: [ReactNode, ReactNode?][] = [
  ['Playing equilibrium vs a leaker', 'their error costs ~10bb/100 — but only if you answer with the counter, not the balanced line'],
  ['Folding too much vs pair-heavy stabs', 'the exploit is shove the nuts-advantage region, not "fold everything"'],
  ['Overusing the jam vs stations', 'if the over-bettler also calls too much, widen value and delete bluffs — read the whole player'],
]

export function LP8Page() {
  return (
    <Section title="LP8 — Exploiting Limped Pot Errors">
      <p>Limped pots are unfamiliar territory for most players — and unfamiliarity breeds systematic, exploitable errors, even from players who would play the analogous raised pot fine. Every exploit here is labeled as such, grounded in nodelock or population analysis: <strong>limping buys entry into their error zone</strong>.</p>

      <Leak items={LP8_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Villain error' }, { header: 'Counter' }]}
        rows={[
          [
            <><strong>A · Bets vulnerable pairs</strong></>,
            <>BB stabs top/2nd pair where the solver checks 100% (nodelock: EV −10bb/100)</>,
            <>Vs their bets: <Action variant="allIn">shove more</Action>, call less, fold slightly more. Vs their checks: bet small frequently</>,
          ],
          [
            <><strong>B · Iso range is linear</strong></>,
            <>"Good hands" only, junk checks back</>,
            <><Action variant="bet">Bet limped flops more</Action> — their checking range is weak by construction</>,
          ],
          [
            <><strong>C · Under-defends vs stabs</strong></>,
            <>Folds too much vs 1bb bets; undervalues unpaired hands</>,
            <>Stab more at every depth; extend thin value one notch (K-high down)</>,
          ],
          [
            <><strong>D · Never raises limps</strong></>,
            <>Passive preflop defense (population)</>,
            <>Limp wider <strong>and</strong> shove wider (apestyles exploit)</>,
          ],
          [
            <><strong>E · Over-limps with no plan</strong></>,
            <>Limping hands that should raise/fold, no traps, no follow-up</>,
            <><Action variant="raise">Iso relentlessly, polar</Action> — junky offsuit included; limp-shove your middles</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>The mapping error.</strong> "Checking to the raiser" is universally understood; "checking to the <em>limper</em>" is not. Players in the BB bet flops where a solver checks their entire range — because they overweight protecting vulnerable pairs. Wrong-way betting ranges are top-heavy: many good-but-not-great hands, few monsters — which shapes the counter.</Callout>

      <Subhead>Anatomy of the Bucket A exploit</Subhead>
      <ul>
        <li><strong>Vs their bets:</strong> the nodelock response converts calls to shoves (barely used at equilibrium) and folds the weakest floats slightly more — mid pairs put the top-heavy range to the test while jams block their top pair and unblock their folds.</li>
        <li><strong>Vs their checks:</strong> their checking range is weakened and less check-raise-happy — more frequent 29–33% small bets, even on boards where equilibrium checks.</li>
        <li><strong>When they adjust</strong> (start checking strong hands again), their range re-polarizes — return to the LP2/LP4 baselines.</li>
      </ul>

      <Callout><strong>These are exploits, not baselines.</strong> Against an unknown or a strong reg, play the LP1–LP7 solver-flavored lines and let them make the first mistake — one orbit of BvB usually reveals the class. On boards where the BB <em>should</em> bet (low connected, straights possible), the same deviation costs far less.</Callout>
    </Section>
  )
}

export default LP8Page
