import { Section, Callout, Tag, Action, RandomBoard, BoardTable } from '../components/ui'

import { StrategyQuiz } from '../components/StrategyQuiz'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S1Page() {
  return (
    <>
      <Section title="System 1 — UTG RFI vs BB Call · C-betting">
        <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>

        <h3>Board types and actions</h3>
        <BoardTable rows={[
          { boards: [<RandomBoard high="T" variant="green" />, <RandomBoard high="J" variant="green" />, <RandomBoard high="K" variant="green" />, <RandomBoard high="A" variant="green" />, <RandomBoard high="Q" connected variant="green" />, <RandomBoard high="K" connected variant="green" />], action: <Action variant="bet">C-bet 100%</Action>, note: "Every hand. Small size. 1 straight → still bet frequently." },
          { boards: [<RandomBoard high="A" suit="monotone" variant="orange" />, <RandomBoard akx variant="orange" />, <RandomBoard akx variant="orange" />, <RandomBoard high="A" paired lowCard={2} variant="orange" label="A22" />, <RandomBoard high="J" paired lowCard={6} variant="orange" label="High-low-low" />], action: <Action variant="check">Mix</Action>, note: <><Action variant="bet">Bet</Action> strong + weak · <Action variant="check">Check</Action> medium</> },
          { boards: [<RandomBoard high="J" connected variant="red" />, <RandomBoard high="T" connected variant="red" />, <RandomBoard high="9" connected variant="red" />], action: <Action variant="check">Mix</Action>, note: <><Action variant="bet">Bet</Action> strong + weak · <Action variant="check">Check</Action> medium · 3 straights → slow down heavily</> },
          { boards: [<RandomBoard high="9" variant="orange" />, <RandomBoard high="9" paired variant="orange" label="9-high · paired" />], action: <Action variant="check">Mix ~70/30</Action>, note: "Strong+weak bet, medium checks. No 100% exists." },
        ]} />

        <Callout>Bucket 1 (T-high+) occurs far more often — one ace makes a flop ace-high. Highest-ROI piece.</Callout>

        <h3>Why bet 100% on T-high+?</h3>
        <p><strong>Overpair asymmetry</strong>: UTG has far more strong pairs than BB caller. Shorter stacks amplify → bet more. Deeper → more caution.</p>
        <Callout variant="warn"><strong>Bet MORE when shallow, not less.</strong> Most players do the opposite — correct the leak.</Callout>

        <h3>Risk factor details</h3>
        <p><strong>Stack depth</strong> <Tag variant="risk">secondary</Tag> — deeper (→150bb) → caution. Shallower (→20bb) → lean into 100%.</p>
        <p><strong>Blocker nuance (high-low-low):</strong> AT with an ace that blocks backdoor flush draws bets more; AT without that blocker checks more.</p>
        <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>

        <h3>Sizing</h3>
        <p>Solver examples land at ~40% pot. The transcript does not prescribe a specific size for this system.</p>
      </Section>

      <StrategyQuiz
        title="System 1 — C-bet or Mix?"
        options={[
          { label: 'C-bet 100%', variant: 'bet' },
          { label: 'Mix', variant: 'check' },
        ]}
        scenarios={[
          { board: { high: 'T', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'T-high+ clean → c-bet 100%. No risk factor present.' },
          { board: { high: 'J', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'J-high clean → c-bet 100%. No risk factor present.' },
          { board: { high: 'K', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'K-high clean → c-bet 100%. No risk factor present.' },
          { board: { high: 'A', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'A-high clean → c-bet 100%. Highest frequency bucket.' },
          { board: { high: 'Q', connected: true, variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: '1 straight possible → still bet frequently. 3 straights would slow down.' },
          { board: { high: 'K', connected: true, variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: '1 straight possible → still bet frequently.' },
          { board: { high: 'A', suit: 'monotone', variant: 'red' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Ace-monotone is a risk factor. Bet strong + weak, check medium.' },
          { board: { high: 'J', paired: true, lowCard: 6, variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'High-low-low (paired low card under high). Bet trips + weak, check underpairs.' },
          { board: { high: 'T', paired: true, lowCard: 5, variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'T55: even though T-high+, paired-low overrides → mix.' },
          { board: { akx: true, variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'AKx family (AK2/AK3/AK4). Slow down — not 100%.' },
          { board: { high: '9', variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: '9-high & below → always mix (~70/30). No 100% exists.' },
          { board: { high: 'J', connected: true, variant: 'red' }, correct: { label: 'Mix', variant: 'check' }, explanation: '3 straights possible → slow down. Bet strong + weak, check medium.' },
        ]}
      />
      <StrategyQuestions
        title="System 1 — Rules"
        questions={[
          { question: 'What are the two flop buckets for System 1?', options: ['T-high+ and 9-high & below', 'Ace-high and everything else', 'Paired and unpaired', 'Wet and dry'], correct: 0, explanation: 'Bucket 1: T-high+ → c-bet 100%. Bucket 2: 9-high & below → mix ~70/30.' },
          { question: 'What is the primary risk factor for c-betting 100%?', options: ['Paired boards', 'Monotone boards', 'Straights possible', 'Stack depth'], correct: 2, explanation: 'Straights possible is primary. 1 straight → still bet. 3 straights → slow down heavily.' },
          { question: 'What adaptation when shallow (20bb)?', options: ['C-bet less — less risk', 'C-bet more — overpair asymmetry amplified', 'No change', 'Check everything'], correct: 1, explanation: 'Shallow amplifies overpair advantage. Bet MORE, not less. Most players do the opposite — correct the leak.' },
          { question: 'Is KK3 (high-high-low) a risk factor?', options: ['Yes — two high cards', 'No — only paired low under high counts', 'Sometimes', 'Only if monotone'], correct: 1, explanation: 'KK3 is high-high-low, NOT high-low-low. Only paired low under high (like K33, J66, T55) is a risk factor.' },
          { question: 'On a risk board, which hands do you CHECK?', options: ['Very strong and very weak', 'Medium-strength only', 'Everything', 'Only sets'], correct: 1, explanation: 'Bet top (strong) + bottom (trash), check middle (underpairs, medium aces, AK/AQ/AT).' },
          { question: 'What is the default c-bet sizing for System 1?', options: ['1/4 to 1/3 pot', '~40% pot', 'Pot-sized', '1/5 pot'], correct: 1, explanation: 'Solver examples land at ~40% pot. The transcript does not prescribe a specific size for this system.' },
        ]}
      />
    </>
  )
}

export default S1Page
