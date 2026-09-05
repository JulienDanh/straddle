import { Section, Callout, DecisionMatrix, FlashcardsSection, QuizSection } from '../components/ui'
import { flashcards, quizzes } from '../data/content'

export function BM7Page() {
  return (
    <>
      <Section title="Identifying Bubble Impact">
        <p>How to gauge ICM pressure before looking at ranges. Pressure is driven by what % of the field the remaining players-to-bust represent, plus table-stack positions, blind increases, and other-table dynamics the solver can't fully model.</p>
        <Callout variant="warn"><strong>One player left to bust is not one answer.</strong> 1/8 = 12.5% (tight), 1/16 = 6.25% (looser), 2/152 = 1.3% (extreme). The absolute number is meaningless without the %.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["Lower pressure (looser)", "Higher pressure (tighter)"]}
          intro="Bubble factor (row) × pressure level (column)."
          rows={[
            { label: "% of field to bust", cells: [
              { action: "1/16 = 6.25%", sub: "Each remaining player matters less.", color: "green" },
              { action: "1/8 = 12.5%", sub: "Each player matters more → tighter.", color: "red" },
            ]},
            { label: "Other-table stacks", cells: [
              { action: "Threatened stack has full orbit", sub: "Can play closer to default.", color: "orange" },
              { action: "4bb stack posts BB next hand", sub: "Tighten — nearly locked to cash.", color: "red" },
            ]},
            { label: "You cover other-table short", cells: [
              { action: "Short stack far from blinds", sub: "Looser than default.", color: "green" },
              { action: "Short stack posting next", sub: "Tighten — risk premium spikes.", color: "red" },
            ]},
            { label: "Your stack size", cells: [
              { action: "Chip leader", sub: "1-2% error costs little. Study less precisely.", color: "green" },
              { action: "Short stack", sub: "1-2% error costs 10-20% of stack. Study precisely.", color: "orange" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>Bubble-impact buckets</h3>
        <table>
          <tr><th>Bucket</th><th>Direction</th></tr>
          <tr><td><strong>% of field left to bust</strong></td><td>Higher % (12.5%) → tighter; lower % (1.3%) → slightly looser.</td></tr>
          <tr><td><strong>Stacks at other tables</strong></td><td>Short stacks elsewhere + you cover them → tighter opens (nearly locked to cash).</td></tr>
          <tr><td><strong>Position of those stacks</strong></td><td>4bb stack posting BB next → tight; full orbit left → closer to default.</td></tr>
          <tr><td><strong>Blind increases</strong></td><td>Who's getting hit — short/micro stacks affected; big stacks barely.</td></tr>
          <tr><td><strong>Someone already busting</strong></td><td>Other table busts a player you cover → you're now ITM → drop high-ICM ranges immediately.</td></tr>
        </table>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Shorter stacks at other tables (you cover)</strong></td><td>Tighten the default range.</td></tr>
          <tr><td><strong>Short stack posting BB next hand</strong></td><td>Tighten.</td></tr>
          <tr><td><strong>Blind increase about to hit micro-stack</strong></td><td>Tighten.</td></tr>
          <tr><td><strong>Fewer players per table to bust</strong></td><td>2 of 16 vs 2 of 57 → tighter.</td></tr>
          <tr><td><strong>You're short yourself</strong></td><td>Adjustments cost a larger % of your stack (10-20% vs 1-2% for chip leader).</td></tr>
        </table>
        <Callout variant="good"><strong>Short-stack range precision matters more than big-stack range precision.</strong> A 1-2% open-freq error costs a short stack 10-20% of their stack; the same error costs the chip leader 1-2%. Spend study time on the short-stack ranges.</Callout>
      </Section>

      <Section title="What the Sim Can't Capture">
        <ul>
          <li>Stack positions at other tables.</li>
          <li>Who posts blinds next hand.</li>
          <li>Blind increases.</li>
          <li>Whether someone else is already busting.</li>
        </ul>
        <p>You must reason about these yourself. The sim gives you a baseline; FGS + table logic gives you the directional shifts at the margins.</p>
      </Section>

      <FlashcardsSection cards={flashcards['bm7']} />
      <QuizSection questions={quizzes['bm7']} />
    </>
  )
}

export default BM7Page
