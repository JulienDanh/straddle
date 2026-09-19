import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const PS5_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Leading big with unimproved value every time — never trapping', 'villains\u2019 stabs get a free pass when you hold the nuts'],
  ['Bluffing the wrong missed draws (A-high FDs)', 'the Ace blocks the folding region'],
  ['Check-raising flop with a merged range, then no coherent river story', 'fix upstream: P4 polar construction'],
  ['Auto-folding weak showdown hands to any stab', 'small stabs still get called at MDF'],
  ['Bluffing rivers that improved the hands that called your XR', 'pick runouts that kept their calling region weak'],
]

export function PS5Page() {
  return (
    <Section title="PS5 — River after XR Flop, XX Turn">
      <p>You check-raised the flop from the blinds, got called, and the turn checked through. Your XR defined you as <strong>polar: two pair+ for value, draws for bluffs</strong> — so the river decision is unusually clean: did my bluffs complete? Did the board help the hands that called me? Who has to fold?</p>

      <Leak items={PS5_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'River situation' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>A · Nuts / improved</strong></>,
            <>Completed draws, boats, top of XR region</>,
            <><Action variant="raise">Check-raise jam</Action> vs aggressive villains; lead big vs passive ones who won\u2019t bet</>,
          ],
          [
            <><strong>B · Unimproved value</strong></>,
            <>Two pair / sets on safe rivers</>,
            <><Action variant="bet">Lead 66–100%</Action> — their flop-call of a check-raise is a filtered, capped bluff-catch range; size up vs stations</>,
          ],
          [
            <><strong>C · Missed draws / air</strong></>,
            <>Zero-SDV bricked draws</>,
            <><Action variant="bet">Polar bluff</Action> with the best blockers (K-high FD &gt; A-high FD; nut-blockers); otherwise check-fold</>,
          ],
          [
            <><strong>D · Weak showdown</strong></>,
            <>Small pairs that XR'd "for value" or picked up pairs</>,
            <><Action variant="check">Check-call</Action> small stabs; check-fold vs big polar bets</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>The river sorts your bluffs.</strong> Missed draws are now zero-SDV air; completed draws moved into the value region. Your bluffing frequency is mechanically tied to how many draws completed — "bricked-everything rivers polarize: jam the top, fold the bottom, no middle."</Callout>

      <Subhead>Blocker audit before bluffing</Subhead>
      <ul>
        <li><strong>K-high missed draws bluff better than A-high:</strong> after villain folds their non-nut draws earlier, the Ace blocks their remaining busted flush draws — the exact hands that fold.</li>
        <li><strong>Blockers to the rivered nuts can outweigh bad blockers entirely.</strong></li>
        <li>Bluff the draws that block calls least — pick cards that kept their calling region weak.</li>
      </ul>

      <Callout variant="bad"><strong>OOP with the nuts: check-raise jam beats the overbet lead.</strong> With a showdown-heavy polar range, leading big with only value is readable; checking threatens everything. "Why develop a 200% pot betting range when you could just check-raise all-in?"</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Line' }, { header: 'Size' }]}
        rows={[
          ['Lead for value (unimproved two pair+)', '66–100% pot'],
          ['Polar bluff lead', 'Jam or 150%+ (make bluff-catchers indifferent)'],
          ['Check-raise jam', '~2.2–3× their stab'],
          ['Thin block with weak made hands', '20–25% pot (rare; only vs serial stabbers)'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">20–30bb: river is bet-jam or check-raise-jam; block-betting dies. On the bubble: keep shoving nutted value (they still call bluff-catchers) but mute the bluffs — their bluff-catching vs you tightens.</p>
    </Section>
  )
}

export default PS5Page
