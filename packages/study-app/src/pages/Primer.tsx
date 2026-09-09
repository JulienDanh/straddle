import { Section, Callout } from '@poker/design-system/src/components/ui'

export function PrimerPage() {
  return (
    <Section title="Preflop Primer">
      <p className="muted">Post-flop outputs are a direct consequence of preflop inputs. Matching these ranges makes solver study relevant.</p>
      <h3>Core idea: all RFI ranges are <em>linear</em></h3>
      <p>You open the best hands first. Ace-high is most concentrated, then king-high, etc. Ranges widen as you move later in position.</p>
      <Callout variant="warn"><strong>Stack-depth sensitivity:</strong> shorter &rarr; slightly tighter, but backbones are stable. Memorize the <em>perimeter</em>, not every combo.</Callout>
      <h3>RFI range perimeters</h3>
      <table>
        <tr><th>Position</th><th>Perimeter</th></tr>
        <tr><td>UTG (17.7%)</td><td>Suited 9s+, A4s+ (mix A3s), K8s+, ATo+, KJo+, 22+</td></tr>
        <tr><td>Cutoff</td><td>Suited 6s+, Q4s+, K2s+, T9o+, A5o, A7o+, 22+</td></tr>
        <tr><td>Button</td><td>Suited 5s+, all suited Broadway, T8o+, A2o+, K6o+, Q7o+, 22+ (mix)</td></tr>
      </table>
      <h3>Big Blind defense</h3>
      <table>
        <tr><th>Vs opener</th><th>Defend perimeter</th><th>Notes</th></tr>
        <tr><td>Button (2.3x)</td><td>Offsuit 6s+, all suited, Q2o+</td><td>Connected hands competitive with 96o.</td></tr>
        <tr><td>UTG (same size)</td><td>Offsuit 9s+ floor, nearly all suited in</td><td>Only 72s is clearly &lt;0; suited combos resilient.</td></tr>
      </table>
      <Callout><strong>Key sensitivity:</strong> <em>offsuit</em> combos are enormously sensitive to sizing and position. <em>Suited</em> combos are resilient. vs min-raise &rarr; more offsuit; vs 2.5x &rarr; offsuit comes out; vs EP open &rarr; offsuit floor rises (9s vs 6s).</Callout>
    </Section>
  )
}

export default PrimerPage
