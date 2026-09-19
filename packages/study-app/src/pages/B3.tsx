import { Section, Callout, Leak, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export const B3_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Late registering or excessive re-entries', 'full price for a depleted bounty pool'],
  ['Playing early levels tight "to survive"', 'forfeits the format\u2019s peak EV window'],
  ['Applying early-stage aggression late', 'as ICM rises and bounties dilute, the same gambles become torches'],
  ['Pressuring players who cover YOU', 'no negative risk premium — just spewing'],
  ['Stopping at "be aggressive"', 'aggression without coverage math is spew with extra steps'],
]

export function B3Page() {
  return (
    <Section title="B3 — PKO Phase Strategy">
      <p>Bounty EV is not constant across a PKO — it peaks early and depletes steadily. Phase awareness tells you <strong>when</strong> to press and when to tighten. The operational plan: play from the start, race to cover, and gamble intelligently while bounties are rich.</p>

      <Leak items={B3_LEAKS} />

      <DataTable
        columns={[{ header: 'Phase' }, { header: 'Bounty dynamics' }, { header: 'Priority' }]}
        rows={[
          [
            <><strong>Early</strong><br /><span className="text-muted text-xs">start → first third</span></>,
            <>Peak bounty EV per chip; minimal ICM; everyone covers everyone on hand one</>,
            <><strong>Play from the start</strong> — contest bounties; build the covering stack; widest correct gambles</>,
          ],
          [
            <><strong>Mid</strong><br /><span className="text-muted text-xs">field halves</span></>,
            <>Pool depleting; stacks diverge; coverage now matters</>,
            <><strong>Race to cover</strong> — pressure players you cover, especially to your right; tighten when covered</>,
          ],
          [
            <><strong>Late</strong><br /><span className="text-muted text-xs">money / FT approach</span></>,
            <>ICM risk premiums rise; bounties relatively diluted</>,
            <><strong>Shift toward standard ICM</strong> — bounty adjustments shrink; pick spots selectively</>,
          ],
          [
            <><strong>Final table</strong></>,
            <>Reversal — accumulated heads are huge; winner keeps own head</>,
            <><strong>Contest the big heads</strong> — price the leader\u2019s scalp into your ranges</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>Bounty EV peaks on hand one and depletes from there.</strong> Individual bounties grow in dollars, but every elimination removes a starting bounty from circulation and the chip value of bounties trends downward — the monetary value of chips rises faster than that of progressive bounties.</Callout>

      <Subhead>Tactic 1 — always play from the start</Subhead>
      <p className="text-[13px] text-muted leading-snug">In regular MTTs late registration can increase ROI; in PKOs it actively harms win rate — every knockout removes bounty EV from the ecosystem, so entering late means paying full price for a tournament with less bounty EV remaining. Re-enter only while early: large field, many starting bounties, average stack still near starting stack.</p>

      <Subhead>Tactic 2 — play aggressively, especially when covering</Subhead>
      <p className="text-[13px] text-muted leading-snug">There is a race to become a covering stack: covering stacks enjoy negative risk premiums and realize bounty EV more efficiently. Building the covering stack early compounds. Requires pressuring shorter stacks, widening value thresholds, and embracing variance in profitable all-in spots — then relentless pressure on players you cover, especially to your right.</p>

      <Subhead>Tactic 3 — gamble early, gamble intelligently</Subhead>
      <p className="text-[13px] text-muted leading-snug">PKOs make marginal stack-offs more forgiving: the bounty often compensates for thinner equity margins. In regular ICM the better mistake is stacking off too tight; in PKOs the better mistake is often stacking off too wide — especially early. Not blind gambling: study off-table, and in-game err slightly toward aggression.</p>

      <Callout variant="bad"><strong>Too wide early beats too tight; too tight late beats too wide.</strong> The same gamble that prints in level 2 torches at two tables left — recompute Bounty Power, and when it has fallen materially, shift toward standard ICM play.</Callout>
    </Section>
  )
}

export default B3Page
