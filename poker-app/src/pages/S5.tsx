import { Section, Callout, Action } from '../components/ui'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S5Page() {
  return (
    <>
      <Section title="System 5 \u2014 Barreling Medium-Strength Hands in Error">
        <p>Hero opened, c-bet flop, called. Evaluating turn barrel with medium hand. Core mistake: barreling medium-strength hands that should check.</p>

        <h3>The pyramid</h3>
        <table>
          <tr><th>Tier</th><th>Action</th><th>Why</th></tr>
          <tr><td>Nuts / very strong</td><td><Action variant="bet">Bet (value)</Action></td><td>Get called by worse</td></tr>
          <tr><td>Strong but not nuts</td><td><Action variant="bet">Bet (thin value)</Action></td><td>Needs to be strong enough</td></tr>
          <tr><td>Medium strength</td><td><Action variant="check">Check</Action></td><td>Loses to calls above, only beats bluffs</td></tr>
          <tr><td>Weak / trash</td><td><Action variant="bet">Bet (selective bluff)</Action></td><td>Low opportunity cost \u2014 only if enough value exists</td></tr>
        </table>

        <Callout variant="bad"><strong>Don't barrel medium-strength hands.</strong> They lose to hands that call and only beat bluffs. Check keeps them as bluff catchers. Barreling gets value-owned.</Callout>

        <h3>When medium CAN bet \u2014 the merge exception</h3>
        <p>A medium hand can bet only if it <strong>folds better AND gets called by worse</strong>. Classic merge: ATo on Q73\u2192J folds Q-x/K-x and gets called by J-T, J-4s, 10x draws. Not all medium hands can do this.</p>
        <Callout variant="good"><strong>Merge = thin value + fold equity.</strong> If your hand can't do both, it checks. J9 (no kicker) checks; AJ with a good kicker is the minimum jack to barrel.</Callout>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect on medium hands</th></tr>
          <tr><td><strong>Deep (80bb+)</strong></td><td>Opponent calls more top pair \u2192 more callers above medium</td></tr>
          <tr><td><strong>Short (25bb)</strong></td><td>Opponent CRs top pair instead of calling \u2192 fewer calls above</td></tr>
          <tr><td><strong>Turn improves your range (A/K)</strong></td><td>May justify barreling medium (range advantage)</td></tr>
          <tr><td><strong>EP open (range bet flop)</strong></td><td>Less need to polarize; range advantage vs BB</td></tr>
          <tr><td><strong>Turn card quality</strong></td><td>Bad card for range + medium strength → check (JJ on Q75→ bad turn)</td></tr>
          <tr><td><strong>Kicker</strong></td><td>No-kicker mediums (J9, 99) check; AJ/A\u2666 minimum to barrel</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>Default turn: <strong>polarize</strong> \u2014 pot-ish or check. Solver often prefers ~116% overbet or check. Adding 60% allows thinner value (K8s) but doesn't rescue medium hands (99 still checks).</p>
      </Section>

      <StrategyQuestions
        title="System 5 — Rules"
        questions={[
          { question: 'What is the core mistake System 5 corrects?', options: ['Barreling medium-strength hands that should check', 'Checking too much with strong hands', 'Betting too small', 'Not bluffing enough'], correct: 0, explanation: 'Medium-strength hands lose to hands that call and only beat bluffs. Barreling gets value-owned. Check keeps them as bluff catchers.' },
          { question: 'In the pyramid, what do you do with medium-strength hands?', options: ['Check', 'Bet (thin value)', 'Bet (bluff)', 'Fold'], correct: 0, explanation: 'Nuts/very strong bet (value), strong bets (thin value), medium checks, weak bets (selective bluff).' },
          { question: 'When CAN a medium hand bet? (the merge exception)', options: ['When it folds better AND gets called by worse', 'When it has showdown value', 'When the pot is small', 'Never'], correct: 0, explanation: 'Merge = thin value + fold equity. ATo on Q73→J folds Q-x/K-x and gets called by J-T/J-4s/10x. If it can\'t do both, it checks.' },
          { question: 'What is the minimum jack to barrel on J-high boards?', options: ['AJ with a good kicker', 'J9', 'JT', 'KJ'], correct: 0, explanation: 'J9 (no kicker) checks — loses to KJ/JT floats. AJ with a good kicker is the minimum jack to barrel.' },
          { question: 'What happens to medium hands on a bad card for your range?', options: ['Check (bad card for range + medium strength)', 'Bet for protection', 'Shove', 'Call'], correct: 0, explanation: 'Bad card for range + medium strength → check. JJ mostly checks (56% check, −72% if no donk).' },
          { question: 'What is the default turn sizing?', options: ['Polarize — pot-ish or check', 'Small (1/4 pot)', 'Half pot', 'Overbet always'], correct: 0, explanation: 'Default turn: polarize — pot-ish or check. Solver often prefers ~116% overbet or check. Adding 60% allows thinner value but doesn\'t rescue medium hands.' },
        ]}
      />
    </>
  )
}

export default S5Page
