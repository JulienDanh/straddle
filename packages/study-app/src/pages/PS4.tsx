import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const PS4_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Value panic — never checking strong rivers', 'aggressive opponents bet when checked to; checking traps them'],
  ['Betting huge with the middle of your range', 'no nuts advantage — big pots favor OOP'],
  ['"Pot odds" excuses after betting into a nuts-only raiser and getting raised', 'the call was the mistake'],
  ['Bluffing without a story', 'no plan for what folds, no blocker logic'],
  ['Treating all opponents as check-raise threats', 'most populations barely CR rivers — thin value left on the table'],
]

export function PS4Page() {
  return (
    <Section title="PS4 — River after Cbet Flop, XX Turn">
      <p>You c-bet the flop in position, the turn checked through, and the river is here. You arrive <strong>capped, with both a nuts and equity disadvantage</strong> — the OOP flop-caller keeps the nutted region by checking strong rivers. Your edge lives in the <strong>middle of the equity distribution</strong>: medium value bets with strong-but-not-nut hands. The biggest lever: does your opponent check-raise rivers? Most don't — against them, thin value betting prints.</p>

      <Leak items={PS4_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hands' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>A · Strong value</strong></>,
            <>Two pair+ (or top pair where OOP is capped)</>,
            <>Vs balanced CR threat: <Action variant="bet">~50%</Action>; vs non-check-raisers: bet big or jam</>,
          ],
          [
            <><strong>B · Thin value</strong></>,
            <>Top/second pair good kicker</>,
            <><Action variant="bet">25–50%</Action>; vs non-check-raisers bet pot; never if CR risk is real</>,
          ],
          [
            <><strong>C · Bluff</strong></>,
            <>Missed draws, zero-SDV air</>,
            <><Action variant="bet">Bluff</Action> only with a story + blockers; size to fold out their bluff-catch class</>,
          ],
          [
            <><strong>D · Give-up</strong></>,
            <>Weak pairs, A-high with SDV</>,
            <><Action variant="check">Check back</Action>, take showdown</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>No check-raise threat = thin value festival.</strong> If BB never check-raises: shove weaker value (two pair as weak as A5), bet pot with one pair, eke out 25% bets with third pair, bluff more freely — measured ~6% of pot in solver experiments. Vs nuts-only raisers, their raise "might as well not exist": bet your hand strength, fold to the raise regardless of price. Any hand good enough to call the shove is a hand you should have shoved yourself.</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Configuration' }, { header: 'Size' }]}
        rows={[
          ['Equilibrium value (CR threat live)', '50% pot'],
          ['Vs non-check-raisers, strong value', '100% pot to jam'],
          ['Vs non-check-raisers, thin value', '50–100%'],
          ['Desperation thin value (3rd pair, CR threat dead)', '25% pot'],
          ['Polar bluffs', '75%+ (or jam when &lt;1.5× pot behind)'],
        ]}
      />

      <Subhead>Bluffs must make sense — three questions</Subhead>
      <ul>
        <li><strong>What are you trying to fold out?</strong> Target hands that can fold: A-high, missed draws worse than yours.</li>
        <li><strong>Does your range interact with the board?</strong> Your bet-flop/check-turn line still contains nutted hands.</li>
        <li><strong>Blockers:</strong> hold blockers to their calling region, unblock their folding region — e.g. all-in bluff with no diamond when diamonds bricked, unblocking their busted draws.</li>
      </ul>

      <Callout variant="bad"><strong>If you check and face a river lead:</strong> you're capped — bluff-catch with the top of your range and good blockers (any Ace blocks OOP value regions, same logic as PS2). Population reads: rivers are under-bluffed; lean fold with pure bluff-catchers unless you have a specific reason.</Callout>

      <Subhead>Depth &amp; ICM</Subhead>
      <ul>
        <li><strong>25–40bb:</strong> the 50%-pot staple dominates; jam or check replaces polar mid-sizes.</li>
        <li><strong>&lt;25bb:</strong> river decisions collapse to jam-or-check around your bucket.</li>
        <li><strong>Bubble:</strong> bluffing shrinks first (ICM punishes dead chips), thin value survives, bluff-catching tightens dramatically.</li>
      </ul>
    </Section>
  )
}

export default PS4Page
