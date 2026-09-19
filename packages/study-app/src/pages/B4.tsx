import { Section, Callout, Leak, Subhead, DataTable, Code } from '@poker/design-system/src/components/ui'

export const B4_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Playing the early levels like a PKO', 'eliminations before the threshold earn chips and nothing else'],
  ['Treating the bounty phase like a scratch card', 'the Equity Drop is calculable — Average KO × coverage'],
  ['Folding to a min-cash with a short stack', 'short at the threshold: can\u2019t collect bounties, everyone calls you wide'],
  ['Not updating after envelope draws', 'the Disappointment Effect punishes stale wide ranges immediately'],
  ['Adjusting for the blind level', 'total chips in play and players remaining are the signal'],
]

export function B4Page() {
  return (
    <Section title="B4 — Mystery Bounty System">
      <p>Mystery Bounties look like PKOs but are a different game. The structural difference is <strong>timing</strong>: nothing is paid until a designated threshold (usually the money bubble or Day 2). Before it, eliminations earn chips and nothing else — effectively two separate games: a standard freezeout before the threshold, a heavily modified bounty tournament after.</p>

      <Leak items={B4_LEAKS} />

      <DataTable
        columns={[{ header: 'Phase' }, { header: 'State' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>1 · Early</strong></>,
            <>Bounty phase doesn\u2019t exist yet</>,
            <>Play EXACTLY like a vanilla freezeout — standard chip-EV decisions</>,
          ],
          [
            <><strong>2 · Pre-bounty bubble</strong></>,
            <>Approaching the threshold</>,
            <><strong>Build a covering stack over surviving</strong> — take higher-variance spots vs players you cover; entering the bounty phase big &gt; sneaking in short</>,
          ],
          [
            <><strong>3 · Active bounty phase</strong></>,
            <>Threshold crossed, envelopes live</>,
            <>Covering: call much wider (~15% vanilla → 30%+ for a covering BB vs a 15bb CO shove). Covered: fold equity gone — tighter, linear shoves, push-or-fold with a bigger stack, limp-first-in viable</>,
          ],
          [
            <><strong>4 · Late game</strong></>,
            <>Envelopes being drawn</>,
            <>Recompute Average KO after every elimination AND every major draw — adapt to Disappointment / Massive Average effects</>,
          ],
        ]}
      />

      <Subhead>Average KO and the Equity Drop</Subhead>
      <p className="mb-1"><Code>Average KO = Remaining Bounty Pool ÷ Players Remaining</Code></p>
      <p className="text-[13px] text-muted leading-snug">60 players left, $50,000 mystery pool → <strong className="text-txt">$833 average KO</strong>. When you cover an at-risk player, their average bounty is dead equity in the pot — like antes, except it can dwarf them. Equal stacks in that example: required equity falls from 50% to <strong className="text-txt">~40.9%</strong> — a gap of nearly 10 points.</p>

      <Callout variant="bad"><strong>Short at the threshold = worthless; big at the threshold = golden.</strong> Short stacks cannot cover anyone (no bounties collectible) and everyone calls their shoves wide because their head makes them worth more dead than alive.</Callout>

      <Subhead>Envelope effects (late game)</Subhead>
      <DataTable
        columns={[{ header: 'Effect' }, { header: 'Trigger' }, { header: 'Response' }]}
        rows={[
          [
            <><strong>Disappointment</strong></>,
            <>Top bounty drawn → remaining pool collapses (e.g. $833 → $200)</>,
            <><strong>Tighten</strong> — the Equity Drop shrinks dramatically; continuing to call wide is bleeding EV</>,
          ],
          [
            <><strong>Massive Average</strong></>,
            <>Big bounty STILL in the box late (e.g. 12 players left)</>,
            <><strong>Widen</strong> — one bounty can be worth more than the next four pay jumps combined</>,
          ],
        ]}
      />

      <Callout><strong>Blind levels are noise; chips in play are signal.</strong> The same 60-player setup at blinds 2,500/5,000 vs 25,000/50,000 has the identical risk premium — the ratio of average bounty to the chip economy is unchanged. And fewer players = tighter: payout jumps grow (ICM up) and the chip economy shrinks (Equity Drop down), both pushing required equity back toward standard.</Callout>
    </Section>
  )
}

export default B4Page
