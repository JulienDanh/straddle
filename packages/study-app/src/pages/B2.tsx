import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const B2_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Playing classic ranges regardless of coverage', 'the single biggest PKO leak'],
  ['Shoving wide when short and covered', 'no fold equity — big stacks are priced to call you light'],
  ['Auto-isolating', 'flatting to keep multiple bounties in can be worth more'],
  ['Jamming low suited connectors in wide-calling spots', 'they realize terribly vs KQs/JTs-type calling ranges'],
  ['Ignoring your own head', 'your bounty grows → opponents widen vs you → shift shape'],
  ['Overfolding to covering stacks\u2019 aggression', 'when you cover THEM your calling thresholds drop (B1)'],
]

export function B2Page() {
  return (
    <Section title="B2 — PKO Preflop Adjustments">
      <p>Bounty incentives reshape every preflop range. The direction is set by one variable: <strong>do you cover the players left to act?</strong> Covering stacks widen (negative risk premium); covered stacks tighten (their shoves get called wider, so they lose fold equity).</p>

      <Leak items={B2_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Stack vs field' }, { header: 'Adjustment' }]}
        rows={[
          [
            <><strong>A · Covering</strong></>,
            <>You cover the players to your left</>,
            <><Action variant="raise">Widen RFI</Action>, call shoves wider, pressure relentlessly — race to realize bounty EV</>,
          ],
          [
            <><strong>B · Symmetric</strong></>,
            <>No meaningful coverage either way</>,
            <><Action variant="call">Mild widening</Action> vs classic; use B1 math in all-in spots</>,
          ],
          [
            <><strong>C · Covered</strong></>,
            <>Players to your left cover you</>,
            <><Action variant="fold">Tighten</Action> and linearize shoves; expect to be called wider</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>The button with double cover is the golden seat.</strong> Covering both blinds lets you target bounties AND apply ICM pressure — the widest range in the format. Bubble factors are lower in PKOs overall, with the biggest impact on late-position players.</Callout>

      <Subhead>Solved numbers — PKO vs classic</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Spot' }, { header: 'Classic' }, { header: 'PKO' }]}
        rows={[
          ['BB defense vs UTG RFI (100bb, start)', '61.6%', <><strong>65.1%</strong> — 3-bets jump 44 → 60 combos</>],
          ['LJ (65bb) calls BTN 26bb reshove', '26.8%', <><strong>36.3%</strong></>],
          ['BB calls SB all-in (SB has a bounty)', '15.8%', <><strong>22.7%</strong></>],
        ]}
      />

      <Subhead>Range shape adjustments</Subhead>
      <ul>
        <li><strong>RFI:</strong> covering → open wider, mixing jam-oriented hands (pairs, Ax) at 15–25bb — they maximize equity realization + bounty unlock.</li>
        <li><strong>Flatting expands in position:</strong> with a UTG bounty available, BTN flats nearly 30%; 3-bets skew toward hands that realize equity if called (you'll be priced to call 4-bet jams wider).</li>
        <li><strong>Big bounty on your own head:</strong> shift jams toward pocket pairs over KQo/KTs — opponents call you ~10% wider and pairs perform better against wide ranges.</li>
        <li><strong>Multiway:</strong> a lot of PKO equity lives in multiway pots with multiple bounties at stake — KQs/JTs appear in these ranges, 54s/87s don't.</li>
        <li><strong>Don't isolate when you can invite:</strong> passive lines that keep additional covered players in can beat isolating one bounty.</li>
      </ul>

      <Subhead>Sizing notes</Subhead>
      <ul>
        <li>Early stages: sizings inflate slightly vs classic — bigger pots for bounty realization.</li>
        <li>Short with a bounty on your head: raise to a practically-shoving amount (~9.5bb) rather than jam — same fold equity, but opponents pay extra to win your bounty.</li>
        <li>First hand of a PKO is unique: everyone covers everyone — the only time all bounties are accessible simultaneously.</li>
      </ul>
    </Section>
  )
}

export default B2Page
