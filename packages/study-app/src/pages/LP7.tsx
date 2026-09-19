import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP7_LEAKS: [ReactNode, ReactNode?][] = [
  ['Bluffing from the wrong side', 'the disadvantaged player bluffing their air into the advantaged range is the classic limped-pot donation'],
  ['Never bluffing trash on favorable boards', 'players bluff their "best no-made-hand" (A-high) — the math says the worst hands bluff; A-high retains showdown value'],
  ['Betting the middle', 'second-tier hands bleeding chips as thin "value" into ranges that only continue with better'],
  ['Symmetric-frequency thinking', 'one bluff frequency on AJ6 and 762 rivers — the board decides who bluffs'],
]

export function LP7Page() {
  return (
    <Section title="LP7 — River Value and Bluffing">
      <p>Limped pot on the river. River bluffing here is not a frequency you pick — it is a <strong>voucher you earned or didn't</strong>. The player who took on more risk on earlier streets and faded the worst outcomes holds the range advantage, and while they hold it, their <em>worst</em> hands are profitable bluffs. The player without it should not bluff their worst hands at all.</p>

      <Leak items={LP7_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'Hero hand on the river' }, { header: 'Action' }]}
        rows={[
          [
            <><strong>A · Top of range</strong></>,
            <>Nut region, strong value</>,
            <><Action variant="bet">Bet</Action> — geometric-to-jam on polar textures, smaller merged</>,
          ],
          [
            <><strong>B · Second-tier</strong></>,
            <>Bluff-catcher middle</>,
            <><Action variant="check">Check</Action> — never bet; call per MDF vs villain bets</>,
          ],
          [
            <><strong>C · Voucher bluffs</strong></>,
            <>Worst hands, favored board</>,
            <><Action variant="bet">Bluff</Action> — +EV by right of range advantage</>,
          ],
          [
            <><strong>D · Dead air, their board</strong></>,
            <>Worst hands, unfavorable board</>,
            <><Action variant="fold">Check-fold</Action> — indifference at best</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"One voucher, one bluff."</strong> Range advantage is earned by risk (a big call, a bet that got called) and kept until spent — lost by betting it in, an unlucky card, or the opponent's strong action. Trash that didn't bluff the flop or turn is a <em>profitable</em> river bluff on boards that favored you (AJ6-type); on boards that favored them (762-type) the same trash is a pure check-fold. If the opponent bets first, the voucher is void.</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Situation' }, { header: 'Size' }]}
        rows={[
          ['Polar value + voucher bluffs, last to act', 'geometric / jam (even 2×+ pot)'],
          ['Merged thin value (favorable static board)', '33–50% pot'],
          ['Bluff vs station', 'bluff less, not bigger'],
          ['Facing polar jam with B', 'call at MDF (pot-sized bet → 50%)'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">All-in geometric sizing for the last-to-act polar bettor — the river is the only street where "perfectly polar" is real, so solvers commonly use only the all-in size.</p>

      <Subhead>Blockers</Subhead>
      <ul>
        <li>Voucher bluffs are best spent on hands that block calls and unblock folds — missed draws that block villain's hits, low cards blocking their two-pairs on paired boards.</li>
        <li>Some equilibrium bluffs run with <em>bad</em> blockers and stay +EV — blockers refine selection, they don't create the right.</li>
        <li>Population: pools under-bluff favorable rivers after check-check lines and under-call vs polar jams — both make voucher bluffs and geometric jams more profitable than baseline.</li>
      </ul>
    </Section>
  )
}

export default LP7Page
