import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const MW6_LEAKS: [ReactNode, ReactNode?][] = [
  ['Frozen strategy after the fold', 'the bettor under-barrels thin value; the caller over-folds margins — both lose the transition EV'],
  ['The caller celebrating with aggression', 'the upgrade is defensive — second pair became a bluff-catcher, not a bluff-raise'],
  ['The bettor bluffing like it\u2019s still multiway', '"they can both fold" is gone — one defender now covers the MDF'],
  ['Forgetting the labels', 'treating the post-fold pot like a standard SRP c-bet line mis-prices every later street'],
]

export function MW6Page() {
  return (
    <Section title="MW6 — Missed Flop Folds from BB">
      <p>The quietest moment in a multiway pot is the most important one: the third player folding. The instant the BB folds to a flop bet, the pot is heads-up again — but it is <em>not</em> the heads-up pot your HU systems were built for. The core skill: <strong>re-price every continuation the moment the third player leaves</strong> — the math changed even though the cards didn't.</p>

      <Leak items={MW6_LEAKS} />

      <DataTable
        columns={[{ header: 'Situation after BB folds' }, { header: 'Bettor' }, { header: 'Caller' }]}
        rows={[
          [
            <><strong>A · Bettor barrels</strong></>,
            <><Action variant="bet">Thin value returns</Action>; sizes can grow (50–66% static)</>,
            <>Continue <strong>one grade wider</strong> than 3-way math</>,
          ],
          [
            <><strong>B · Bettor checks</strong></>,
            <>Trap / check-call with medium</>,
            <><Action variant="bet">Take the clock</Action> (MW8 transition)</>,
          ],
          [
            <><strong>C · Turn completes draws</strong></>,
            <>Barrel only with the nut region; stay 33–50% dynamic</>,
            <>Tighten back — textures still rule</>,
          ],
          [
            <><strong>D · River</strong></>,
            <>Thin value + blocker bluffs vs a single capped range</>,
            <>Bluff-catch at near-MDF vs a single range</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>Every hand near the margin improves a full grade when the field thins.</strong> BBZ's Q9 (second pair + gutshot) on KJQdd is a <em>pure fold</em> while the BB is still in the pot, and a <em>pure call</em> the moment the BB folds. "His opponent's ranges are too strong" applies to two opponents, not one — the fold changed the math, not the hand.</Callout>

      <Subhead>Bettor side — what the fold unlocks</Subhead>
      <ul>
        <li>While the BB was in, your betting range had to be honest against two ranges. Now you face a single capped, <em>documented</em> range — second-best top pairs, thin value, and bigger sizes come back online.</li>
        <li>Don't instantly blast: the caller's range is still the tightest defender at the table, blocker-rich by construction. Escalate sizes on static boards; keep 33–50% on dynamic ones.</li>
        <li>Your air is still air — one opponent now defends properly. Bluffs need blockers or equity.</li>
      </ul>

      <Subhead>Caller side — what the fold grants</Subhead>
      <ul>
        <li>Upgrade every marginal hand one grade: second pair is now a bluff-catcher, not a fold; TPWK is thin value on later streets, not a trap.</li>
        <li>Re-engage heads-up systems (S9 defense, S10 value) but with range labels: the bettor's condensed flop range contains fewer pure bluffs than a HU c-bet range.</li>
        <li>If the bettor checks the turn, the clock is yours — stab 50–60% with the medium hands that just gained showdown value.</li>
      </ul>

      <Callout variant="bad"><strong>Ranges stay labeled.</strong> The bettor's range is whatever bet this flop multiway (condensed, nut-tilted); the caller's is what called a bet with a player behind (tighter than a BB-call, blockers included). River hero calls (S11) and value bets (S10) should be sized against those shapes, not generic HU priors.</Callout>
    </Section>
  )
}

export default MW6Page
