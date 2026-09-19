import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const PS3_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Over-betting the XC-X-B line with nut hands', 'guts your checking range — trap instead'],
  ['Auto-bluffing every missed flush draw', 'your draw blocks their missed draws — bluffing into a denser value region'],
  ['Betting middling pairs big "for protection"', 'no protection on the last street — only value and fold equity'],
  ['Never leading at all', 'IP gets infinite free showdowns with A-high'],
  ['Ignoring which flop size you called', 'small-call range traps far more than big-call range'],
  ['Check-folding the entire C region vs small stabs', 'way above MDF fold'],
]

export function PS3Page() {
  return (
    <Section title="PS3 — River OOP after XC Flop, XX Turn">
      <p>You check-called a flop c-bet, the aggressor checked back the turn, and you act first on the river. The turn check-back removes IP's nutted hands — the flop caller holds the equity advantage on most rivers. But the XC-X line condenses your range toward showdown value, so the equilibrium shape is <strong>small bets, frequent traps, and check-raises instead of big bets</strong>.</p>

      <Leak items={PS3_LEAKS} />

      <DataTable
        columns={[{ header: 'Region' }, { header: 'Hands' }, { header: 'Strategy' }]}
        rows={[
          [
            <><strong>A · Value</strong></>,
            <>Top pair+ (strong 2nd pair on low boards)</>,
            <><Action variant="bet">Bet small 25–33%</Action> or check-raise; trap nut hands on scary runouts</>,
          ],
          [
            <><strong>B · Bluff</strong></>,
            <>Missed draws without showdown value</>,
            <><Action variant="bet">Bluff</Action> only when your range ran out of other air (post big-flop-call); check-fold A/K-high misses otherwise</>,
          ],
          [
            <><strong>C · Bluff-catch</strong></>,
            <>Mid/low pairs, weak top pairs</>,
            <><Action variant="check">Check</Action>, call at MDF vs polar bets; check-raise the blocker-heavy ones</>,
          ],
          [
            <><strong>D · Give-up</strong></>,
            <>Unpaired no-SDV hands that bricked</>,
            <><Action variant="fold">Check-fold</Action></>,
          ],
        ]}
      />

      <Callout variant="good"><strong>OOP nut hands check-raise; they don't build overbet ranges.</strong> Your best flop hands mostly check-raised the flop, so your XC range is condensed toward low pairs and high-card showdown value — while IP's bet-check range is heavy in give-up air. Why build a 200% pot betting range when a check-raise jam achieves it from a showdown-heavy range?</Callout>

      <Subhead>The flop size you called drives your river frequency</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Flop call' }, { header: 'Your range' }, { header: 'River default' }]}
        rows={[
          ['Bigger flop bet', 'Stronger, filtered', <><strong>Bet river more</strong></>],
          ['Small flop bet', 'High-card heavy', <><strong>Trap more, bet less</strong></>],
        ]}
      />

      <Subhead>Unblockers govern the whole line</Subhead>
      <ul>
        <li><strong>Flush-completing rivers:</strong> check strong hands over 50% — especially A-high flushes (they block IP's spade-holding reopening range). Flushes containing the Q/J of the suit bet more: they <em>unblock</em> IP's betting region.</li>
        <li><strong>Missed draws as bluffs:</strong> prefer K-high missed draws over A-high (the Ace blocks the opponent's remaining missed draws); blockers to the rivered nuts can override bad blockers.</li>
      </ul>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Hand class' }, { header: 'Size' }]}
        rows={[
          ['Thin value (top pair, good 2nd pair)', '25–33% pot'],
          ['Nut hands', 'Trap-check or check-raise jam'],
          ['Bluffs', 'Match the value sizing (25–33%); overbet only when heavily filtered'],
          ['Vs serial overbetters when you check', 'Call per MDF with C-region blockers'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">20–30bb: leads shrink to 25% or jam. Near bubbles, thin value leads survive ICM; bluff leads and hero bluff-catches shrink. Trips rivers (you hold the pair card) justify bigger sizing — nut advantage in trips.</p>
    </Section>
  )
}

export default PS3Page
