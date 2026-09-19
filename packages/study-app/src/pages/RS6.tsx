import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const RS6_LEAKS: [ReactNode, ReactNode?][] = [
  ['Small bets with a polar range', 'small is for merged, big is for polar — 25% pot with nuts-or-air wastes both'],
  ['Bluffing the wrong air', 'the few bluff slots belong to blocker hands; dead air in the stream is a donation'],
  ['Ignoring the check-raise threat', 'vs a proper check-raiser the merged stream must disband — forcing it funds the OOP traps (RS5)'],
  ['Sizing monotony', 'one size every river flips between the two errors above'],
]

export function RS6Page() {
  return (
    <Section title="RS6 — Small Bets In Position">
      <p>Toy Game 6: the IP player forgoes the geometric jam and bets <strong>small — 25–33% pot</strong> — with a wide, mostly linear range. Small bets are not cowardice; they are the α-correct instrument for a specific configuration: a wide IP range facing an OOP range that <strong>over-folds and cannot check-raise enough</strong>. Low α means a tiny bluff quota, so a merged range can bet — thin value, marginal protection, and blocker bluffs in one stream.</p>

      <Leak items={RS6_LEAKS} />

      <DataTable
        columns={[{ header: 'Bet size' }, { header: 'α (fold req.)' }, { header: 'Bluff share of betting range' }]}
        rows={[
          ['20% pot', '17%', '9%'],
          ['25% pot', '20%', '11%'],
          ['33% pot', '25%', '14%'],
          [<><strong>50% pot</strong></>, <><strong>33%</strong></>, <><strong>25% — polarity begins</strong></>],
        ]}
      />

      <Subhead>The stream</Subhead>
      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'IP hand vs OOP checker' }, { header: 'Action' }]}
        rows={[
          [
            <><strong>A · Thin value</strong></>,
            <>Second pair up, good kickers</>,
            <><Action variant="bet">Bet 25–33%</Action> — the core of the stream</>,
          ],
          [
            <><strong>B · Marginal made hands</strong></>,
            <>Weak pairs, ace-highs</>,
            <>Bet small as merged value/protection vs over-folding; check vs balanced defenders</>,
          ],
          [
            <><strong>C · Blocker bluffs</strong></>,
            <>Air with call-blocking cards</>,
            <><Action variant="bet">Bet</Action> the few bluff slots (keep the stream ≥ ~85% value-flavored)</>,
          ],
          [
            <><strong>D · Dead air</strong></>,
            <>No blockers, no showdown</>,
            <><Action variant="check">Check</Action> — the stream doesn\u2019t need you</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"Small bet, small α, merged range."</strong> At 25% pot the OOP range must defend 80% — worse hands call because folding 20%+ is all they're allowed. Thin value is the engine: second- and third-tier hands bet for value against a range that over-defends by decree.</Callout>

      <Callout variant="bad"><strong>"If they check-raise, the stream is dead."</strong> Small merged bets die to aggressive check-raising — that's why this game is conditioned on an OOP opponent who won't or can't raise enough (population-true in most pools). When they do: fold the C-tier instantly, defend A, and fold B more than equilibrium instincts suggest — the merged stream's weakness is exactly this node. Vs a proper check-raiser, revert to polar geometric betting.</Callout>

      <Callout><strong>Labeled exploit:</strong> real OOP pools defend far below the 75–80% MDF vs small bets and rarely check-raise — both deviations make the small-bet stream more profitable than equilibrium, where it merely breaks even.</Callout>
    </Section>
  )
}

export default RS6Page
