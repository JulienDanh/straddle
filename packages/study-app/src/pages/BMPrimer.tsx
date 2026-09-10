import { Section, Callout, Code, Action, DataTable, Tabs } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BMPrimerPage() {
  return (
    <Section title="Bubble Mastery — ICM & FGS Foundations">
      <p>The bubble is where MTT ROI lives. You see it far more often than the final table, and mastering it lets you extrapolate to near-bubble and post-bubble spots.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout><strong>Study the perimeters.</strong> ChipEV (first hand) and the direct bubble are the two extremes. Spend ~40% on each, ~20% in the middle. Everything stems from the extremes.</Callout>

              <h3>The three models</h3>
              <DataTable columns={[{ header: 'Model' }, { header: 'Captures' }, { header: 'Misses' }]} rows={[[<><strong>ChipEV</strong></>, <>Linear chips = equity. Good early/cash.</>, <>Bubble pressure, risk premium, bust value.</>],
                  [<><strong>ICM</strong></>, <>Stack-relative equity; doubling ≠ double equity. Bubble baseline.</>, <>Skill edge, future hands, incoming blinds/position. Breaks down at large fields.</>],
                  [<><strong>FGS</strong></>, <>ICM + N future hands. Blind cycles, forced all-ins, who busts next.</>, <>Single-table only. Limited future depth. No multi-table.</>]]} />
              <p><strong>Hierarchy:</strong> ICM is the baseline → FGS tells you the <em>direction</em> to deviate → table/stack/position logic tells you the <em>magnitude</em>.</p>

              <h3>Stack situation × model</h3>
              <p>The directional shift is the lesson.</p>
              <DataTable columns={[{ header: 'Stack situation' }, { header: 'ICM model' }, { header: 'FGS model' }]} rows={[[<><strong>Short stack, posts BB next (4.5bb)</strong></>, <><Action variant="raise">Shove ~18%</Action> — ICM baseline.</>, <><Action variant="bet">Shove ~25%</Action> — Wider — blind cost (~112bb/100) + fold equity now.</>],
                  [<><strong>Ultra-short, forced all-in next (1.5bb)</strong></>, <><Action variant="raise">Shove ~49%</Action> — ICM baseline.</>, <><Action variant="fold">Shove ~25%</Action> — Tighter — no fold equity; doubling doesn't help. Fold and let others bust.</>],
                  [<><strong>15bb HJ, shorter stack at table</strong></>, <><Action variant="raise">Some open shoves</Action> — ICM allows shoves.</>, <><Action variant="call">Min-raise only</Action> — No shoves. Open shove loses ~$18-35 in equity. Preserve tournament life.</>]]} />

              <h3>ICM Pitfalls</h3>
              <ul>
                <li><strong>No skill edge:</strong> Doesn't know the player on your left overfolds or the big stack is a crusher.</li>
                <li><strong>No future hands:</strong> Doesn't know a micro stack posts BB next hand and will likely bust.</li>
                <li><strong>No position/blind accounting:</strong> Two identical stacks in different seats have different real equity.</li>
                <li><strong>Computational breakdown at scale:</strong> 50–500+ players on the bubble → output may be ~10–15% off.</li>
              </ul>

              <h3>Sizing / Numbers</h3>
              <DataTable columns={[{ header: 'Spot' }, { header: 'Default' }, { header: 'Notes' }]} rows={[[<>BTN open</>, <><Code>2.1x</Code> (ICM) vs <Code>2.3x</Code> (ChipEV)</>, <>Smaller open in ICM.</>],
                  [<>SB 3-bet vs BTN</>, <><Code>7.35bb</Code> (ICM) vs <Code>8.6bb</Code> (ChipEV)</>, <>Smaller 3-bet, yet defense still tighter.</>],
                  [<>Cost of posting BB+ante</>, <>~<Code>-112bb/100</Code></>, <>Why short stacks should shove before the blind hits.</>]]} />
              <Callout variant="warn"><strong>Open shoving 15bb on the bubble with a shorter stack present is a massive leak.</strong> Min-raising is 4–5x better in tournament equity. Open shoving AJo loses ~$17.70; JTs loses ~$35.</Callout>

              <h3>Field-Size Impact</h3>
              <DataTable columns={[{ header: 'Field' }, { header: '"Near Bubble"' }, { header: 'Bust %' }, { header: 'Pressure' }]} rows={[[<>200 players</>, <>33 left, 30 paid (3 to bust)</>, <>9.1%</>, <>Moderate — closer to normal</>],
                  [<>1000 players</>, <>152 left, 150 paid (2 to bust)</>, <>1.3%</>, <><strong>More extreme</strong></>]]} />
              <p>The 1000-player near-bubble ≈ direct bubble of a smaller field. Use the 1000-player model for direct-bubble study.</p>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="ICM & FGS Foundations — Practice"
              questions={[
                { question: 'What does ICM mean for chip equity?', options: ['Doubling your stack does not double your equity', 'Chips scale linearly', 'Equity is always 1:1 with chips', 'ICM doesn\'t affect equity'], correct: 0, explanation: 'Under ICM, chips do not scale linearly. Doubling from 5,000 to 10,000 chips might take you from $100 to $195, not $200.' },
                { question: 'What does FGS add beyond ICM?', options: ['Future hands — blind cycles, forced all-ins, who busts next', 'Nothing', 'Only skill edge', 'Only position'], correct: 0, explanation: 'FGS = ICM + N future hands. It captures the cost of posting blinds, the benefit of others busting before you, and forced all-in situations.' },
                { question: 'What is the hierarchy for applying these models?', options: ['ICM baseline → FGS direction → table logic magnitude', 'FGS first then ICM', 'ChipEV only', 'Table logic only'], correct: 0, explanation: 'ICM gives the baseline strategy. FGS tells you which direction to deviate. Table/stack/position logic tells you how much to deviate.' },
                { question: 'What happens to your shove range when you post BB next (4.5bb) under FGS?', options: ['Wider — blind cost + fold equity now', 'Tighter', 'No change', 'Fold everything'], correct: 0, explanation: 'FGS says shove ~25% vs ICM\'s ~18%. The blind cost (~112bb/100) plus having fold equity now means you should shove wider.' },
                { question: 'What is a key ICM pitfall?', options: ['No skill edge, no future hands, no position/blind accounting, computational breakdown at scale', 'It\'s always wrong', 'It only works for cash games', 'It requires too much computation'], correct: 0, explanation: 'ICM doesn\'t account for skill edge, future hands, or position. It also breaks down computationally with 50-500+ players (output may be 10-15% off).' },
                { question: 'Why is open shoving 15bb on the bubble with a shorter stack present a massive leak?', options: ['Min-raising is 4-5x better in tournament equity. Open shoving AJo loses ~$17.70', 'You might get called', 'You should limp instead', 'It\'s not a leak'], correct: 0, explanation: 'FGS says preserve tournament life. Min-raise only. Open shoving loses ~$18-35 in equity vs min-raising.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BMPrimerPage
