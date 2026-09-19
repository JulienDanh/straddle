import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const P2_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Defending too wide as the opener — AJo/KQo-type OOP realizes terribly', 'fold the bottom of your open'],
  ['Cold-4-bet bluffing from the sandwich seat', 'your flat capped you — pressing into two stronger ranges'],
  ['Calling too wide as the sandwiched flat', 'capped range in a 3-bet pot OOP is the worst configuration in poker'],
  ['Ignoring who covers whom on the bubble', 'vs a covering squeezer your calls must shrink'],
  ['4-bet-folding at short stacks', 'below ~35bb, 4-betting anything means committing'],
]

export function P2Page() {
  return (
    <Section title="P2 — Facing Squeezes">
      <p>You opened (or cold-called) and a player behind squeezes over open + call(s). Your response depends entirely on <strong>which seat you are</strong> — and the squeezer profits from dead money, not from the pot. Deny that profit by defending with the right hands, not by defending wide.</p>

      <Leak items={P2_LEAKS} />

      <DataTable
        columns={[{ header: 'Seat' }, { header: 'Response' }]}
        rows={[
          [
            <><strong>Opener</strong><br /><span className="text-muted text-xs">strongest range at the table</span></>,
            <><Action variant="raise">4-bet QQ+/AK</Action> core + calls with equity-realizing hands (88–JJ, AQs, AJs, KQs). Never open-fold premiums.</>,
          ],
          [
            <><strong>Sandwiched caller</strong><br /><span className="text-muted text-xs">capped range, worst seat</span></>,
            <><Action variant="call">Call-or-fold only</Action>: TT–JJ, AQs, AJs, KQs in position and deep. Never bluff-raise — a live opener still acts behind.</>,
          ],
          [
            <><strong>Behind the squeeze</strong><br /><span className="text-muted text-xs">cold 4-bet</span></>,
            <><Action variant="raise">KK+</Action> premiums only — everything else folds; the squeezer showed strength.</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>The sandwiched player is structurally punished for raising.</strong> Raising into a live player behind exposes you to a re-raise from a stronger range; ICM adds the cost of elimination. Call-or-fold is the equilibrium shape of the sandwich seat.</Callout>

      <Subhead>As the opener vs the squeeze</Subhead>
      <ul>
        <li><strong>4-bet region:</strong> premiums only — QQ+/AK by default. Widen to JJ/AQ only vs demonstrated light squeezing, at 40bb+ with position on the squeezer.</li>
        <li><strong>Call region:</strong> hands that realize equity and dominate the squeezer's bluffs — 88–JJ, AQs, AJs, KQs, QJs-type suited broadways. Prefer calling when IP on the squeezer; tighten when OOP.</li>
        <li><strong>Fold:</strong> everything else, including the bottom of your opening range. The solved 40bb EP opener 4-bets only ~2–3% and calls ~10–15% vs a 3-bet — vs a squeeze the calls drop further because you don't close action.</li>
      </ul>

      <Subhead>As the sandwiched caller</Subhead>
      <ul>
        <li>Call-or-fold with the top of your capped range: TT–JJ, AQs, AJs, KQs; suited connectors only in position and deep.</li>
        <li>4-betting is premium-only (QQ+/AK) — cold-4-bet bluffs play terribly into the squeezer's strong range and the opener's live range.</li>
        <li>Folding a lot here is NOT exploitable if your preflop flats were sound — the squeeze prices out the weak-middle of your flatting range by design.</li>
      </ul>

      <Subhead>4-bet sizing (as the opener)</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Stacks' }, { header: 'Size' }]}
        rows={[
          ['50–60bb', '~2.2–2.4× the squeeze — leaves a fold or a river shove'],
          ['35–50bb', 'Jam-oriented: a committing size, or just jam the top'],
          [<>&lt; 35bb</>, <><strong>4-bet = jam</strong> — no 4-bet-fold</>],
        ]}
      />

      <Callout><strong>ICM tightens everything.</strong> On the bubble both 4-betting semi-bluffs and OOP calls shrink — the squeezer's leverage comes precisely from your survival pressure. Defend with the top of your range and hands that play well postflop, and fold JJ to a covering stack's squeeze when the pay jump is steep.</Callout>
    </Section>
  )
}

export default P2Page
