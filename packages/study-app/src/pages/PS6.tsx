import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const PS6_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Leading middle pair "to see where I\u2019m at"', 'the definitive leak of this node'],
  ['Block-betting hands that can\u2019t handle a raise, then folding to one', ''],
  ['Building big overbet leads with a middling range', 'the check-raise jam does the job without capping your checks'],
  ['Never trapping nut hands (value panic)', ''],
  ['Check-folding 100% of middling hands vs small stabs', 'far above MDF'],
  ['Ignoring boards where your range legitimately owns the nuts', 'small leads are printed money there'],
]

export function PS6Page() {
  return (
    <Section title="PS6 — River OOP after XX Flop, XX Turn">
      <p>The pot nobody wanted: flop checked through, turn checked through, you act first on the river. This is the <strong>donk/lead decision</strong> — the most mishandled node in recreational and mid-stakes poker. The universal law: <strong>leads are only correct when your range can back them with nutted hands.</strong> A lead built from middling made hands is a capped range on a plate — solvers raise it relentlessly (near-100% in nodelock experiments, ~39% of responses all-in).</p>

      <Leak items={PS6_LEAKS} />

      <Callout variant="bad"><strong>No nuts advantage, no lead.</strong> First question: does my <em>range</em> hold the nutted region on this board? On 652tt the BB's defended range owns the suited straights and sets — leading ~11% of range is GTO and even middle-pair leads are protected value. On AT2r vs the preflop raiser, leading middle pair is the canonical anti-donk leak: villain folds everything worse, continues with everything better, and bluff-raises at will.</Callout>

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hand region' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>A · Nutted</strong></>,
            <>Straights+ / top of checked range</>,
            <><Action variant="raise">Check-raise jam</Action> vs stabs; check vs passive; never lead into weakness head-on</>,
          ],
          [
            <><strong>B · Strong marginal</strong></>,
            <>Two pair / good top pair</>,
            <><Action variant="bet">Block-bet 20–33%</Action> or check-raise vs aggressive villains</>,
          ],
          [
            <><strong>C · Middling SDV</strong></>,
            <>Second/third pair, A-high</>,
            <><Action variant="call">Check-call</Action> small stabs; block-bet only vs serial check-backers; fold to big polar bets</>,
          ],
          [
            <><strong>D · Air</strong></>,
            <>Zero-SDV busted hands</>,
            <><Action variant="fold">Check-fold</Action>; bluff-raise only the most exploitable stabs</>,
          ],
        ]}
      />

      <Subhead>Block bets and traps</Subhead>
      <ul>
        <li><strong>A block bet is a check wearing a costume.</strong> OOP, checking and betting ~10% pot are nearly identical — villain responds with the same betting/raising hands. Block-bet ranges should be slightly <em>stronger</em> than checking ranges, but only slightly.</li>
        <li><strong>Traps block the calling region.</strong> The best trapped hands block hands that would call a big bet — that's why they don't lose by checking.</li>
        <li><strong>Check-raise jam &gt; 200% lead</strong> when most of your range is middling showdown value.</li>
      </ul>

      <Subhead>Exploit reads</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Villain' }, { header: 'Your adjustment' }]}
        rows={[
          ['Never bluffs rivers', 'Check-fold the C region entirely; trap the A region only'],
          ['Stabs every checked river', 'Widen C calls; move more A into check-raises'],
          ['Raises leads too much', 'Stop block-betting C; check everything, jam A over their raises'],
          ['Never raises leads', 'Block-bet all of B and C for value and protection'],
        ]}
      />

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Line' }, { header: 'Size' }]}
        rows={[
          ['Block bet', '10–25% pot'],
          ['Lead on nut-advantage boards', '33% pot'],
          ['Check-raise vs stab', '2.5–3× the stab (jam when effective &lt;2.5× pot)'],
          ['Thin value lead vs stations', '33–50%'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">Checked-down pots explode in frequency near bubbles — everyone plays honest. C-region check-calls tighten to the top; traps keep full value since survival pressure makes villains' stabs more honest too. Below 25bb leads die: check or jam.</p>

      <Callout><strong>IP side of the node:</strong> raise leads that smell like medium strength — the response to a capped donk is heavy pressure (even JJ raises, Ax shoves as bluff).</Callout>
    </Section>
  )
}

export default PS6Page
