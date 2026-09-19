import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const PS7_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Betting small IP "for thin value" into unknown opponents', 're-opens the action with the exact hands a check-raise targets'],
  ['Turning A-high into a bluff on scary rivers', 'your SDV is real; the story isn\u2019t'],
  ['Never bluffing because "they always call"', 'checked-down ranges contain give-ups — the solver\u2019s worst-hand bluffs are profitable'],
  ['Bluffing without unblockers', 'holding the busted draw you\u2019re representing blocks the fold you need'],
  ['Folding the top of your checking range to small leads', 'OOP block bets are ~checks — defend them like checks'],
  ['Ignoring the player type', 'a nit\u2019s river lead is not a balanced range; neither is a maniac\u2019s'],
]

export function PS7Page() {
  return (
    <Section title="PS7 — River IP after XX Flop, XX Turn">
      <p>Two streets of silence and you hold the button on the river. The checked-down pot gives IP a structural gift: you see their action before you act, and check-check-check has condensed their range toward showdown value and give-ups. Your betting strategy is <strong>polar and sized by the check-raise threat</strong> — large bets and checks, rarely small ones.</p>

      <Leak items={PS7_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hand region' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>A · Strong value</strong></>,
            <>Two pair+ / strong top pair</>,
            <><Action variant="bet">Bet big 66–100%</Action>; vs non-check-raisers, jam more</>,
          ],
          [
            <><strong>B · Thin value / SDV</strong></>,
            <>Medium pairs, A-high</>,
            <><Action variant="check">Check back</Action> by default; bet 25–50% only when the CR threat is dead</>,
          ],
          [
            <><strong>C · Bluff</strong></>,
            <>Zero-SDV air with blockers</>,
            <><Action variant="bet">Bet big or jam</Action> — story + blockers required</>,
          ],
          [
            <><strong>D · Dead air</strong></>,
            <>No SDV, bad blockers</>,
            <><Action variant="check">Check back</Action> — take the zero-cost showdown</>,
          ],
        ]}
      />

      <Callout variant="bad"><strong>IP rivers: big or check — small bets donate the option.</strong> Solvers rarely make small IP river bets because betting IP re-opens the action to check-raises, and the hands that suffer most from a raise are exactly the medium thin-value hands. OOP exploits this with check-raises funded by the nutted hands they never bet. The free showdown is a win, not a failure.</Callout>

      <Subhead>Reading the OOP action</Subhead>
      <ul>
        <li><strong>OOP leads:</strong> switch to defense — PS6's exploit rules apply (raise condensed leads, call blocker-sized bets at MDF, fold vs polar leads without blockers).</li>
        <li><strong>OOP checks:</strong> the main branch — classify into A–D. On dynamic rivers that complete draws, your own checked-down range is mostly strong hands and strong draws, so it's hard for you to find bluffs — the solver bluffs its pure worst hands and traps in the middle.</li>
      </ul>

      <Subhead>The three bluff questions (with full force IP)</Subhead>
      <ul>
        <li><strong>What folds?</strong> Bluff-catchers, A-high — name the hands.</li>
        <li><strong>Does my range interact?</strong> The runout must fill your checked-back range with missed draws that tell the story (e.g. all-draws-bricked river with A5 no suit: unblocks their busted draws, bet big or jam).</li>
        <li><strong>Blockers:</strong> unblock the opponent's give-up/hero-fold region, block their calling region.</li>
      </ul>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Configuration' }, { header: 'Size' }]}
        rows={[
          ['Value vs CR threat', '50–66% pot'],
          ['Value vs non-check-raisers', '75–100% or jam'],
          ['Polar bluff', '75%+ or jam'],
          ['Thin value (CR threat dead)', '25–50%'],
          ['Vs OOP block bet (defense)', 'Call ~MDF; raise the condensed ones'],
        ]}
      />

      <Callout><strong>Bluff-catcher defense reframe (apestyles):</strong> the population under-bluffs rivers — with a pure bluff-catcher, lean fold. Better question than "are they bluffing?": <strong>"is this hand in the top half of my range?"</strong> Range position is knowable; villain's holding is not.</Callout>
    </Section>
  )
}

export default PS7Page
