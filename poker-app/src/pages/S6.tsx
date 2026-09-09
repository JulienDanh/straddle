import { Section, Callout, Action, RandomBoard, BoardTable } from '../components/ui'
import { StrategyQuiz } from '../components/StrategyQuiz'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S6Page() {
  return (
    <>
      <Section title="System 6 \u2014 Check-Raising Top Pair (Short Stacks)">
        <p>Hero flats BB, flops top pair, faces c-bet. Check-raise or check-call? Focus on <strong>short stacks (\u226435bb)</strong>.</p>
        <Callout variant="warn"><strong>Inflection: 35bb.</strong> Above \u2192 nuts-oriented CR (sets, two pair, TPTK mix). <strong>At/below \u2192 aggressive top-pair CR.</strong> Shorter = more CR. Most players under-CR top pair when short \u2014 correct the leak.</Callout>

        <h3>Board types and actions</h3>
        <BoardTable rows={[
          { boards: [<RandomBoard high="Q" variant="green" />, <RandomBoard high="K" variant="green" />], action: <Action variant="raise">Check-raise top pair</Action>, note: <><strong>\u226435bb:</strong> top pair = pure CR. Shorter = more CR. KQ/QJ/QT pure CR; taper to Q2 pure call.</> },
          { boards: [<RandomBoard high="Q" suit="two-tone" variant="orange" label="Top pair + BDFD" />], action: <Action variant="call">Check-call</Action>, note: "Backdoor FD prefers check-call to realize the flush draw. Q9\u2665 calls more than Q9o. CR gives up flush equity." },
          { boards: [<RandomBoard high="J" variant="red" label="Two pair / sets" />, <RandomBoard high="K" variant="red" label="Two pair / sets" />], action: <Action variant="call">Trap (check-call)</Action>, note: "SPR short enough to shove river without raising flop. Two pair/sets/pockets trap." },
        ]} />

        <h3>CR hierarchy (high boards)</h3>
        <p>On Q-high (Q73), kicker determines CR frequency:</p>
        <table>
          <tr><th>Hand</th><th>CR frequency</th></tr>
          <tr><td>KQ, QJ, QT</td><td>Pure CR</td></tr>
          <tr><td>Q9</td><td>Heavy CR (offsuit); backdoor FD \u2192 check-call</td></tr>
          <tr><td>Q8</td><td>Medium mix</td></tr>
          <tr><td>Q7, Q6, Q5, Q4</td><td>Tapering mix</td></tr>
          <tr><td>Q2</td><td>Pure call</td></tr>
        </table>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Backdoor FD (both suited)</strong></td><td>Prefers check-call (Q9\u2665 calls more than Q9o)</td></tr>
          <tr><td><strong>Two pair / sets / pockets</strong></td><td>Trap (check-call) \u2014 SPR short enough to shove</td></tr>
          <tr><td><strong>Opponent c-betting 100%</strong></td><td>CR all top pairs \u2014 their range too weak</td></tr>
          <tr><td><strong>Deeper stacks (&gt;35bb)</strong></td><td>Less CR with thin top pair; mix CR/check-call with great kicker</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>CR to <strong>small size</strong> (~3x the c-bet). Short stacks = 2-street game.</p>
      </Section>

      <StrategyQuiz
        title="System 6 — Check-raise, Check-call, or Trap?"
        options={[
          { label: 'Check-raise top pair', variant: 'raise' },
          { label: 'Check-call (BDFD)', variant: 'call' },
          { label: 'Trap (check-call)', variant: 'check' },
        ]}
        scenarios={[
          { board: { high: 'Q', variant: 'green' }, correct: { label: 'Check-raise top pair', variant: 'raise' }, explanation: '≤35bb: top pair = pure CR. KQ/QJ/QT pure CR; taper to Q2 pure call. Shorter = more CR.' },
          { board: { high: 'K', variant: 'green' }, correct: { label: 'Check-raise top pair', variant: 'raise' }, explanation: '≤35bb: top pair = pure CR. Shorter = more aggressive. Most players under-CR top pair when short.' },
          { board: { high: 'Q', suit: 'two-tone', variant: 'orange' }, correct: { label: 'Check-call (BDFD)', variant: 'call' }, explanation: 'Backdoor FD prefers check-call to realize the flush draw. Q9♥ calls more than Q9o. CR gives up flush equity.' },
          { board: { high: 'J', paired: true, variant: 'red' }, correct: { label: 'Trap (check-call)', variant: 'check' }, explanation: 'Two pair / sets / pockets trap (check-call). SPR short enough to shove river without raising flop.' },
          { board: { high: 'K', variant: 'red' }, correct: { label: 'Trap (check-call)', variant: 'check' }, explanation: 'Two pair / sets trap. Check-call — short SPR lets you shove river for value.' },
        ]}
      />
      <StrategyQuestions
        title="System 6 — Rules"
        questions={[
          { question: 'What is the inflection point for aggressive top-pair CR?', options: ['35bb — at/below, aggressive top-pair CR', '50bb', '20bb', 'No inflection'], correct: 0, explanation: 'Above 35bb → nuts-oriented CR (sets, two pair, TPTK mix). At/below → aggressive top-pair CR. Shorter = more CR.' },
          { question: 'What is the common leak System 6 corrects?', options: ['Under-CR top pair when short', 'Over-CR top pair when deep', 'CR too small', 'Never CR'], correct: 0, explanation: 'Most players under-CR top pair when short. Shorter = more CR, not less.' },
          { question: 'What does a backdoor flush draw prefer?', options: ['Check-call (realize the flush draw)', 'Check-raise', 'Fold', 'Donk-lead'], correct: 0, explanation: 'BDFD prefers check-call to realize the flush draw. CR gives up flush equity. Q9♥ calls more than Q9o.' },
          { question: 'What do two pair / sets / pockets do on short stacks?', options: ['Trap (check-call)', 'Check-raise', 'Donk-lead', 'Fold'], correct: 0, explanation: 'SPR is short enough to shove river without raising flop. Two pair/sets/pockets trap (check-call).' },
          { question: 'On Q-high, what determines CR frequency?', options: ['Kicker (KQ pure CR → Q2 pure call)', 'Stack depth only', 'Suit', 'Board pairing'], correct: 0, explanation: 'KQ/QJ/QT pure CR; Q9 heavy (offsuit); Q8 medium mix; Q7-Q4 tapering; Q2 pure call.' },
          { question: 'What is the CR sizing for short stacks?', options: ['Small (~3x the c-bet)', 'Pot-sized', 'Min-raise', 'All-in'], correct: 0, explanation: 'CR to small size (~3x the c-bet). Short stacks = 2-street game.' },
        ]}
      />
    </>
  )
}

export default S6Page
