import { Section, Callout, Code, Action } from '@poker/design-system/src/components/ui'

export function BMPrimerPage() {
  return (
    <>
      <Section title="Bubble Mastery — ICM & FGS Foundations">
        <p>The bubble is where MTT ROI lives. You see it far more often than the final table, and mastering it lets you extrapolate to near-bubble and post-bubble spots.</p>
        <Callout><strong>Study the perimeters.</strong> ChipEV (first hand) and the direct bubble are the two extremes. Spend ~40% on each, ~20% in the middle. Everything stems from the extremes.</Callout>

        <h3>The three models</h3>
        <table>
          <tr><th>Model</th><th>Captures</th><th>Misses</th></tr>
          <tr><td><strong>ChipEV</strong></td><td>Linear chips = equity. Good early/cash.</td><td>Bubble pressure, risk premium, bust value.</td></tr>
          <tr><td><strong>ICM</strong></td><td>Stack-relative equity; doubling ≠ double equity. Bubble baseline.</td><td>Skill edge, future hands, incoming blinds/position. Breaks down at large fields.</td></tr>
          <tr><td><strong>FGS</strong></td><td>ICM + N future hands. Blind cycles, forced all-ins, who busts next.</td><td>Single-table only. Limited future depth. No multi-table.</td></tr>
        </table>
        <p><strong>Hierarchy:</strong> ICM is the baseline → FGS tells you the <em>direction</em> to deviate → table/stack/position logic tells you the <em>magnitude</em>.</p>

        <h3>Stack situation × model</h3>
        <p>The directional shift is the lesson.</p>
        <table>
          <tr><th>Stack situation</th><th>ICM model</th><th>FGS model</th></tr>
          <tr><td><strong>Short stack, posts BB next (4.5bb)</strong></td><td><Action variant="raise">Shove ~18%</Action> — ICM baseline.</td><td><Action variant="bet">Shove ~25%</Action> — Wider — blind cost (~112bb/100) + fold equity now.</td></tr>
          <tr><td><strong>Ultra-short, forced all-in next (1.5bb)</strong></td><td><Action variant="raise">Shove ~49%</Action> — ICM baseline.</td><td><Action variant="fold">Shove ~25%</Action> — Tighter — no fold equity; doubling doesn't help. Fold and let others bust.</td></tr>
          <tr><td><strong>15bb HJ, shorter stack at table</strong></td><td><Action variant="raise">Some open shoves</Action> — ICM allows shoves.</td><td><Action variant="call">Min-raise only</Action> — No shoves. Open shove loses ~$18-35 in equity. Preserve tournament life.</td></tr>
        </table>

        <h3>ICM Pitfalls</h3>
        <ul>
          <li><strong>No skill edge:</strong> Doesn't know the player on your left overfolds or the big stack is a crusher.</li>
          <li><strong>No future hands:</strong> Doesn't know a micro stack posts BB next hand and will likely bust.</li>
          <li><strong>No position/blind accounting:</strong> Two identical stacks in different seats have different real equity.</li>
          <li><strong>Computational breakdown at scale:</strong> 50–500+ players on the bubble → output may be ~10–15% off.</li>
        </ul>

        <h3>Sizing / Numbers</h3>
        <table>
          <tr><th>Spot</th><th>Default</th><th>Notes</th></tr>
          <tr><td>BTN open</td><td><Code>2.1x</Code> (ICM) vs <Code>2.3x</Code> (ChipEV)</td><td>Smaller open in ICM.</td></tr>
          <tr><td>SB 3-bet vs BTN</td><td><Code>7.35bb</Code> (ICM) vs <Code>8.6bb</Code> (ChipEV)</td><td>Smaller 3-bet, yet defense still tighter.</td></tr>
          <tr><td>Cost of posting BB+ante</td><td>~<Code>-112bb/100</Code></td><td>Why short stacks should shove before the blind hits.</td></tr>
        </table>
        <Callout variant="warn"><strong>Open shoving 15bb on the bubble with a shorter stack present is a massive leak.</strong> Min-raising is 4–5x better in tournament equity. Open shoving AJo loses ~$17.70; JTs loses ~$35.</Callout>

        <h3>Field-Size Impact</h3>
        <table>
          <tr><th>Field</th><th>"Near Bubble"</th><th>Bust %</th><th>Pressure</th></tr>
          <tr><td>200 players</td><td>33 left, 30 paid (3 to bust)</td><td>9.1%</td><td>Moderate — closer to normal</td></tr>
          <tr><td>1000 players</td><td>152 left, 150 paid (2 to bust)</td><td>1.3%</td><td><strong>More extreme</strong></td></tr>
        </table>
        <p>The 1000-player near-bubble ≈ direct bubble of a smaller field. Use the 1000-player model for direct-bubble study.</p>
      </Section>
    </>
  )
}

export default BMPrimerPage
