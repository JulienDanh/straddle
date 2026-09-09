import { Section, Callout, Action } from '@poker/design-system/src/components/ui'
import { StrategyQuestions } from '@poker/design-system/src/components/StrategyQuestions'


export function S8Page() {
  return (
    <>
      <Section title="System 8 \u2014 Bet Sizing In Position">
        <p>IP player deciding bet sizing on flop/turn/river. Core mistake: betting too small.</p>

        <h3>IP advantage</h3>
        <ul>
          <li>IP checks \u2192 range uncaps on next card (turn improves hands).</li>
          <li>OOP checks \u2192 IP punishes immediately.</li>
          <li>IP can polarize more \u2192 <strong>IP bets larger on average</strong>.</li>
        </ul>

        <h3>Sizing by nut ratio</h3>
        <table>
          <tr><th>Situation</th><th>Sizing</th><th>Why</th></tr>
          <tr><td>Villain capped (low nut ratio)</td><td><Action variant="bet">Overbet / pot</Action></td><td>Geometric to get stacks in. Fold% rises slower than bet size.</td></tr>
          <tr><td>Both have nuts possible</td><td><Action variant="bet">~70% pot</Action></td><td>Large but not overbet. Nuts frequency constrains sizing.</td></tr>
          <tr><td>Thin value hand</td><td><Action variant="check">Check</Action></td><td>Don't bet thin hands small. &lt;50% pot almost never correct IP.</td></tr>
          <tr><td>&lt; 50% pot IP</td><td><Action variant="fold">Almost NEVER</Action></td><td>Small bets don't justify the CR risk.</td></tr>
          <tr><td>Medium-strong (merge)</td><td><Action variant="bet">Bet pot (merge)</Action></td><td>If folds better AND called by worse (e.g. pocket Queens).</td></tr>
        </table>

        <h3>Geometric betting</h3>
        <p>To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn \u2192 ~34bb river shove.</p>

        <Callout variant="bad">Reopening action risks being check-raised off equity. Small bets don't justify that risk. Fold% rises slower than bet size \u2192 bigger bets profit more.</Callout>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Villain uncapped (can have nuts)</strong></td><td>Don't overbet \u2014 ~70% pot</td></tr>
          <tr><td><strong>Quads risk</strong></td><td>~48 combos. Don't assume villain can't have quads.</td></tr>
          <tr><td><strong>Turn check-back inflection</strong></td><td>If you checked turn, villain's river check = weakness \u2192 bet big</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>Default pot-sized or slightly over; <strong>never sub-half-pot IP</strong>.</p>
      </Section>

      <StrategyQuestions
        title="System 8 — Rules"
        questions={[
          { question: 'What is the core mistake System 8 corrects?', options: ['Betting too small in position', 'Betting too large', 'Checking too much', 'Not bluffing enough'], correct: 0, explanation: 'IP player deciding bet sizing. Core mistake: betting too small. Fold% rises slower than bet size → bigger bets profit more.' },
          { question: 'When villain is capped (low nut ratio), what sizing?', options: ['Overbet / pot (geometric to get stacks in)', '~70% pot', 'Quarter pot', 'Check'], correct: 0, explanation: 'Villain capped → overbet/pot geometric. Fold% rises slower than bet size, so bigger bets profit more.' },
          { question: 'When both players can have nuts, what sizing?', options: ['~70% pot (large but not overbet)', 'Overbet', 'Quarter pot', 'Min-bet'], correct: 0, explanation: 'Both have nuts possible → ~70% pot. Nuts frequency constrains sizing.' },
          { question: 'When is sub-half-pot correct IP?', options: ['Almost NEVER', 'Always on dry boards', 'With strong hands', 'On the river'], correct: 0, explanation: '<50% pot IP almost never correct. Small bets don\'t justify the CR risk. Reopening action risks being CR\'d off equity.' },
          { question: 'What does a thin value hand do IP?', options: ['Check (don\'t bet thin hands small)', 'Bet small', 'Overbet', 'Shove'], correct: 0, explanation: 'Thin value hands check. Don\'t bet thin hands small — <50% pot almost never correct IP.' },
          { question: 'What is geometric betting?', options: ['~pot on both streets to get stacks in over 2', 'Quarter pot on both streets', 'Overbet then check', 'Min-bet then shove'], correct: 0, explanation: 'To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn → ~34bb river shove.' },
        ]}
      />
    </>
  )
}

export default S8Page
