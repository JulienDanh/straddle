import { Section, Callout, Leak, Subhead, DataTable, Code } from '@poker/design-system/src/components/ui'

export const B1_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Treating PKOs like regular MTTs', 'structural disadvantage — bounties are real equity'],
  ['Applying the equity drop when covered', 'the bounty is only yours if you cover the player'],
  ['Using the early-stage conversion late', 'bounty chip value dilutes as stacks consolidate'],
  ['Not updating as the pool depletes', 'every elimination changes the math'],
]

export function B1Page() {
  return (
    <Section title="B1 — Bounty Math & Risk Premiums">
      <p>Every PKO adjustment — wider calls, thinner value, more aggression — flows from one concept: <strong>negative risk premiums</strong>. In regular tournaments, busting costs equity, so you need better than break-even odds to risk your stack. In PKOs, when you <strong>cover</strong> an opponent, their bounty adds dead equity to the pot that can offset or reverse that cost.</p>

      <Leak items={B1_LEAKS} />

      <Callout variant="bad"><strong>Negative risk premiums apply ONLY to covering stacks.</strong> If you don't cover the player, you cannot access their bounty — no equity drop, and normal (or higher) risk premiums apply. The bounty is dead equity in the pot only when you can win it.</Callout>

      <Subhead>How a PKO bounty splits on elimination</Subhead>
      <DataTable
        columns={[{ header: 'Part' }, { header: 'Share' }, { header: 'Goes' }]}
        rows={[
          [<><strong>Immediate payout</strong></>, '50%', 'Cash to the eliminator — removed from the game permanently'],
          [<><strong>Bounty increase</strong></>, '25%', 'Added to the eliminator\u2019s own head — deferred value'],
          [<><strong>Rolling bounty</strong></>, '25%', 'Carried forward, halved again each time it moves'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">Bounties compound: eliminating a player who already collected bounties is worth more than eliminating one who hasn't.</p>

      <Subhead>Calculation 1 — bounty-to-chip conversion (early stages)</Subhead>
      <p className="mb-1"><Code>Immediate Payout ÷ Entry Fee (ex rake) × Starting Chips = Bounty in Chips</Code></p>
      <p className="text-[13px] text-muted leading-snug">$109 PKO ($100 to pools, $9 rake), 50/50 split, 10,000 starting chips: immediate payout $25 → 25 ÷ 100 × 10,000 = <strong className="text-txt">2,500 chips</strong>. Add to the pot when calculating all-in pot odds. Accurate earliest; increasingly crude as the tournament progresses.</p>

      <Subhead>Calculation 2 — Bounty Power (mid/late stages)</Subhead>
      <p className="mb-1"><Code>Bounty Power = Total BB in Play ÷ (Remaining BPP + Remaining Main Pool)</Code></p>
      <p className="text-[13px] text-muted leading-snug">The BB value of $1 of bounty at the current stage. Worked ($215 buy-in, 1,000 entries, 500 left, 35bb avg): 17,500bb ÷ $75,000 = <strong className="text-txt">0.233bb per $1</strong>.</p>
      <DataTable
        compact
        columns={[{ header: 'Applying it' }, { header: '' }]}
        rows={[
          ['LJ must call 24bb to win 54.5bb; bounty = $50', 'Bounty in BB: 50 × 0.233 = 11.67bb'],
          ['Effective pot', '54.5 + 11.67 = 66.17bb'],
          ['Required equity', '24 ÷ 66.17 = 36.3% (vs 44% without the bounty)'],
          [<><strong>Equity drop</strong></>, <><strong>≈ 7.7 points — the negative risk premium in action</strong></>],
        ]}
      />

      <Subhead>Decision rules</Subhead>
      <ul>
        <li>Before any all-in call where you cover the shove: convert the bounty to chips/BB and add it to the pot.</li>
        <li>Early → simple conversion. Mid/late → Bounty Power, recomputed as fields shrink and pools deplete.</li>
        <li>Don't cover → no adjustment; standard (or ICM-elevated) thresholds.</li>
      </ul>

      <Callout variant="good"><strong>Direction of error.</strong> In regular ICM the better mistake is stacking off too tight; in PKOs — especially early — the better mistake is <strong>stacking off too wide</strong>. If unsure in-game, err toward aggression.</Callout>

      <Callout><strong>Bounties are a depleting resource.</strong> Bounty EV peaks on hand one; each elimination removes a starting bounty from circulation while ICM pressure grows. Only at the very late stages does the dynamic partially reverse — the winner claims their own accumulated head.</Callout>
    </Section>
  )
}

export default B1Page
