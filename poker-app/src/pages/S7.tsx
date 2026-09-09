import { Section, Callout, Action, RandomBoard, BoardTable } from '../components/ui'
import { StrategyQuiz } from '../components/StrategyQuiz'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S7Page() {
  return (
    <>
      <Section title="System 7 \u2014 C-bet Folding Flops (vs Check-Raises)">
        <p>You c-bet the flop as preflop raiser and face a CR. Which hands defend vs fold?</p>

        <Callout><strong>Fold% = Risk / (Pot + Risk)</strong> \u2014 makes zero-equity bluffs indifferent. But villain's bluffs have real equity \u2192 <strong>actual fold% is LOWER</strong>. Defend more than MDF.</Callout>

        <h3>Board types and actions</h3>
        <BoardTable rows={[
          { boards: [<RandomBoard high="K" variant="green" />, <RandomBoard high="Q" variant="green" />, <RandomBoard high="J" variant="green" />], action: <Action variant="call">Defend (two overs)</Action>, note: "Two overcards to key card = pure call. Ace-high first in defend priority. Draws make it even stronger." },
          { boards: [<RandomBoard high="K" suit="two-tone" variant="orange" />, <RandomBoard high="Q" suit="two-tone" variant="orange" />], action: <Action variant="call">Defend (with draws)</Action>, note: "One over/one under or double unders: call with BDFD (high card of suit), 3-straight, BD straight. Naked = fold candidate." },
          { boards: [<RandomBoard high="K" paired variant="red" label="K55" />, <RandomBoard high="J" paired variant="red" label="J33" />], action: <Action variant="call">Defend around unpaired</Action>, note: "Paired board: organize around unpaired card. Ace + BDFD = pure call. Paired card unusable." },
          { boards: [<RandomBoard high="9" variant="red" />, <RandomBoard high="T" variant="red" />], action: <Action variant="fold">Fold (total trash)</Action>, note: "Naked double-unders, no equity, no BDFD, no 3-straight = the folds. Worst defendable: naked BDFD may also fold." },
        ]} />

        <h3>Defend priority (for trash)</h3>
        <ol>
          <li>Direct equity (overcards to top pair) \u2014 Ace-high first</li>
          <li>Backdoor flush draw (high card of suit &gt; low)</li>
          <li>Three to a straight</li>
          <li>Backdoor straight draws</li>
          <li>Blocker effects (avoid suit that blocks villain's bluffs)</li>
        </ol>

        <h3>Risk factors</h3>
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Villain bluffs have high equity</strong></td><td>Defend even more than MDF</td></tr>
          <tr><td><strong>Paired boards (K55)</strong></td><td>Organize around unpaired card. Ace + BDFD = pure call</td></tr>
          <tr><td><strong>Small raise sizes</strong></td><td>Defend almost everything; pot odds may prevent any fold</td></tr>
          <tr><td><strong>Blocker suits (two-tone)</strong></td><td>Avoid suit villain bluffs with \u2014 blocks their bluff frequency</td></tr>
        </table>

        <h3>Sizing</h3>
        <p>Depends on villain's CR size. Smaller CR \u2192 defend almost everything; larger \u2192 fold more.</p>
      </Section>

      <StrategyQuiz
        title="System 7 — Defend or Fold vs CR?"
        options={[
          { label: 'Defend (two overs / draws)', variant: 'call' },
          { label: 'Defend (around unpaired)', variant: 'call' },
          { label: 'Fold (total trash)', variant: 'fold' },
        ]}
        scenarios={[
          { board: { high: 'K', variant: 'green' }, correct: { label: 'Defend (two overs / draws)', variant: 'call' }, explanation: 'Two overcards to key card = pure call. Ace-high first in defend priority. Draws make it stronger.' },
          { board: { high: 'Q', variant: 'green' }, correct: { label: 'Defend (two overs / draws)', variant: 'call' }, explanation: 'Two overcards = pure call. A-high + BDFD, 3-straight, BD straight all strengthen.' },
          { board: { high: 'K', suit: 'two-tone', variant: 'orange' }, correct: { label: 'Defend (two overs / draws)', variant: 'call' }, explanation: 'One over/one under or double unders: call with BDFD (high card of suit), 3-straight, BD straight. Naked = fold.' },
          { board: { high: 'K', paired: true, variant: 'red' }, correct: { label: 'Defend (around unpaired)', variant: 'call' }, explanation: 'Paired board: organize around the unpaired card. Ace + BDFD = pure call. Paired card unusable.' },
          { board: { high: '9', variant: 'red' }, correct: { label: 'Fold (total trash)', variant: 'fold' }, explanation: 'Naked double-unders, no equity, no BDFD, no 3-straight = the folds. Worst defendable may also fold.' },
          { board: { high: 'T', variant: 'red' }, correct: { label: 'Fold (total trash)', variant: 'fold' }, explanation: 'Total trash with no BDFD/3-straight/overcards = fold. Naked BDFD may also fold.' },
        ]}
      />
      <StrategyQuestions
        title="System 7 — Rules"
        questions={[
          { question: 'Why is actual fold% LOWER than MDF?', options: ["Villain's bluffs have real equity → defend more", 'MDF is wrong', 'You have range advantage', 'Pot odds force it'], correct: 0, explanation: 'Fold% = Risk/(Pot+Risk) makes zero-equity bluffs indifferent. But villain bluffs have real equity → defend more than MDF.' },
          { question: 'What is the first defend priority for trash hands?', options: ['Direct equity (overcards) — Ace-high first', 'Backdoor flush draw', 'Three to a straight', 'Blocker effects'], correct: 0, explanation: 'Priority: 1) direct equity (overcards, A-high first), 2) BDFD (high card > low), 3) 3-straight, 4) BD straight, 5) blockers.' },
          { question: 'How do you organize defense on paired boards (K55)?', options: ['Around the unpaired card', 'Around the paired card', 'Fold everything', 'Defend the pair'], correct: 0, explanation: 'Paired card is unusable (can\'t have equity vs trips). Organize around the unpaired card. Ace + BDFD = pure call.' },
          { question: 'On two-tone boards, what should you avoid?', options: ['The suit villain bluffs with (blocks their bluff freq)', 'All flush draws', 'The flush-draw suit', 'Rainbow boards'], correct: 0, explanation: 'Blocker suits: avoid the suit villain bluffs with — it blocks their bluff frequency.' },
          { question: 'What is the fold priority on high boards?', options: ['Naked double-unders with no equity', 'Ace-high', 'Top pair', 'Suited connectors'], correct: 0, explanation: 'Naked double-unders, no equity, no BDFD, no 3-straight = the folds.' },
          { question: 'How does villain CR size affect defense?', options: ['Smaller CR → defend almost everything; larger → fold more', 'Larger CR → defend more', 'No effect', 'Always defend MDF'], correct: 0, explanation: 'Smaller CR → pot odds may prevent any fold, defend almost everything. Larger → fold more.' },
        ]}
      />
    </>
  )
}

export default S7Page
