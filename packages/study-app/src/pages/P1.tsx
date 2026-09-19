import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const P1_LEAKS: [React.ReactNode, React.ReactNode?][] = [
  ['Squeezing only QQ+/AK', 'dead money funds blocker bluffs'],
  ['Squeezing UTG/UTG+1 opens light', 'they 4-bet too often'],
  ['Sizing too small', 'no fold equity vs the capped caller'],
  ['3-bet-folding hands too good to fold (TT/JJ/AQ at 25-30bb OOP)', 'call or jam instead'],
  ['Flatting when squeezing is better', 'last to act + fold equity → squeeze > overcall'],
  ['Same OOP bluff range as IP', 'OOP is linear — drop low suited connectors'],
]

export function P1Page() {
  return (
    <Section title="P1 — Preflop Squeezing">
      <p>A player opens and at least one player cold-calls. You 3-bet (squeeze) to pressure both. The <strong>caller is the real target</strong>: by flatting they capped their range, so a big raise asks them to bloat a pot with a hand they signaled was only worth a flat.</p>

      <Leak items={P1_LEAKS} />

      <DataTable
        columns={[{ header: 'Bucket' }, { header: 'When' }, { header: 'Action' }]}
        rows={[
          [
            <><strong>A · IP squeeze</strong></>,
            <>BTN/CO behind open + call(s)</>,
            <><Action variant="raise">High · 8–14%</Action> — polarized: value + blocker bluffs</>,
          ],
          [
            <><strong>B · OOP squeeze</strong></>,
            <>SB/BB after open + call(s)</>,
            <><Action variant="raise">Med-high · 6–10%</Action> — more linear; more callers → higher</>,
          ],
          [
            <><strong>C · No squeeze</strong></>,
            <>Opener tight, caller strong, no leverage, &lt;25bb</>,
            <><Action variant="fold">Fold</Action> — two switches off → fold</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>Three switches must line up:</strong> the opener is wide and folds to 3-bets · the caller is sticky but capped (flats, doesn't 4-bet bluff) · you have leverage (close the action IP, or fold equity). Two or more off → fold.</Callout>

      <Subhead>The caller, not the opener</Subhead>
      <p className="text-[13px] text-muted leading-snug">The opener has a defined 4-bet/fold response; the caller has a capped, face-up range. Each additional cold-caller adds dead money from a capped range — squeeze <em>more</em>, not less, especially from the BB (more dead money, closes preflop action after a flat).</p>

      <Subhead>Range by bucket</Subhead>
      <DataTable
        columns={[{ header: '' }, { header: 'Value' }, { header: 'Bluffs' }]}
        rows={[
          [
            <><strong>A · IP (BTN/CO)</strong></>,
            <>TT+, AJs+, AQo+ vs HJ; wider (99+, 88/ATs at 40bb+) vs CO/BTN</>,
            <>A2s–A5s, A7s (Ace blocker); K8s, Q8s, J8s, T8s, 97s, 87s, 76s. Fade offsuit bluffs</>,
          ],
          [
            <><strong>B · Blinds</strong></>,
            <>TT+, AJs+, AQo+ — never 3-bet-fold hands too good to fold</>,
            <>A2s–A6s; K9s, Q9s, J9s, T9s. Fade low suited connectors OOP</>,
          ],
        ]}
      />

      <Subhead>Sizing (vs ~2.2–2.5bb open + 1 caller)</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Stacks' }, { header: 'Squeeze size' }]}
        rows={[
          ['50–60bb', '~3.2–3.5× open + call amount (≈10–12bb)'],
          ['35–50bb', '~3× + calls (≈9–11bb)'],
          ['25–35bb', '~2.8× + calls (≈8–10bb)'],
          [<>&lt; 25bb</>, <><strong>Prefer open-jam</strong></>],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">Each additional caller adds ~1× the open. Too big for the capped caller to flat profitably; small enough that you're not committed with bluffs. Below ~25bb raise-folding burns chips — reshove.</p>

      <Subhead>Vs a 4-bet (40bb)</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Hand' }, { header: 'Response' }]}
        rows={[
          ['QQ+, AK', <><Action variant="allIn">5-bet jam</Action></>],
          ['JJ, TT, AQ', <>Call a small 4-bet at 40bb+; jam if 4-bet large or &lt;30bb</>],
          ['88/99, AJs, KQs', <><Action variant="fold">Fold</Action></>],
          ['All bluffs', <><Action variant="fold">Fold</Action></>],
        ]}
      />

      <Subhead>Blockers do double duty</Subhead>
      <ul>
        <li><strong>Ace blocker (A2s–A7s):</strong> #1 — removes AA/AK/AQ, the calling/4-betting region, from both villains.</li>
        <li><strong>K-high suited (K8s/K9s):</strong> blocks KK/KQ — second best.</li>
        <li><strong>Q8s/J8s/T8s:</strong> block suited-broadway flats.</li>
      </ul>

      <Callout><strong>ICM leverage multiplies the play.</strong> On the bubble the opener hates calling a 3-bet with a player behind, and the capped caller hates bloating a pot even more. Vs covered opponents (you cover them): squeeze wider. Vs covering opponents: tighten.</Callout>
    </Section>
  )
}

export default P1Page
