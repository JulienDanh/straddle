import { Section, Callout, Action, RandomBoard, BoardTable } from '../components/ui'
import { StrategyQuiz } from '../components/StrategyQuiz'
import { StrategyQuestions } from '../components/StrategyQuestions'


export function S2Page() {
  return (
    <>
      <Section title="System 2 — BTN RFI vs BB Call · C-betting">
        <p>Button opens, BB calls, BB checks. Three flop buckets.</p>

        <h3>Board types and actions</h3>
        <BoardTable rows={[
          { boards: [<RandomBoard high="A" variant="green" />, <RandomBoard high="K" variant="green" />, <RandomBoard high="Q" variant="green" />], action: <Action variant="bet">C-bet 100%</Action>, note: "Ace-high. Risk factors: monotone, paired, deep stacks." },
          { boards: [<RandomBoard high="K" variant="green" />, <RandomBoard high="Q" variant="green" />, <RandomBoard high="J" variant="green" />, <RandomBoard high="T" variant="green" />], action: <Action variant="bet">C-bet 100%</Action>, note: "T–K high + deuce/3 present → disconnected → bet 100%." },
          { boards: [<RandomBoard high="A" suit="monotone" variant="orange" />, <RandomBoard high="A" paired variant="orange" label="A-J-J" />], action: <Action variant="check">Mix</Action>, note: <><Action variant="bet">Bet</Action> strong + weak · <Action variant="check">Check</Action> medium · deeper → more checking</> },
          { boards: [<RandomBoard high="K" paired variant="orange" />, <RandomBoard high="K" suit="monotone" variant="orange" />], action: <Action variant="check">Mix</Action>, note: "T–K risk factors: two low cards (biggest), monotone. Paired less concerning." },
          { boards: [<RandomBoard high="9" variant="orange" />, <RandomBoard high="9" variant="orange" />, <RandomBoard high="9" variant="orange" />], action: <Action variant="check">Mix ~60/40</Action>, note: "9-high & below. Bet top + bottom (selective), check middle. No 100% exists." },
        ]} />

        <Callout>BTN range is wider (offsuit 8s+), so it misses low boards harder. When BTN doesn't interact, build a checking strategy — bet top, bet bottom, check middle.</Callout>

        <h3>Two-suit awareness (key skill)</h3>
        <p>On two-tone boards, BB defends around <em>two</em> suits. Most only think about the flush-draw suit. Also <strong>block the second suit</strong> (non-flush-draw suit BB calls with via backdoor draws) — no equity risk.</p>
        <Callout variant="warn"><strong>K83 two-tone (hearts+diamonds):</strong> KJ with heart+diamond = pure bet. KJ with spades+clubs (both off) = pure check. KJ with a heart blocks BB's heart-based continuing range with no equity risk.</Callout>

        <h3>Sizing</h3>
        <p>No explicit sizing prescribed in the transcript. Small c-bet on low boards where BTN misses.</p>
      </Section>

      <StrategyQuiz
        title="System 2 — C-bet 100% or Mix?"
        options={[
          { label: 'C-bet 100%', variant: 'bet' },
          { label: 'Mix', variant: 'check' },
        ]}
        scenarios={[
          { board: { high: 'A', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'Ace-high clean → c-bet 100%. BTN has the most aces.' },
          { board: { high: 'K', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'K-high + deuce/3 present (disconnected) → c-bet 100%.' },
          { board: { high: 'Q', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'Q-high + deuce → disconnected → c-bet 100%.' },
          { board: { high: 'T', variant: 'green' }, correct: { label: 'C-bet 100%', variant: 'bet' }, explanation: 'T-high + deuce → disconnected → c-bet 100%.' },
          { board: { high: 'A', suit: 'monotone', variant: 'red' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Ace-monotone is a risk factor. Bet strong + weak, check medium.' },
          { board: { high: 'A', paired: true, variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Paired ace-high → not 100%. Bet the pair + trash, check KK/QQ/TT/99.' },
          { board: { high: 'K', paired: true, variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Paired K-high → mix. Less concerning than ace-paired but still a risk.' },
          { board: { high: 'K', suit: 'monotone', variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Monotone K-high → mix. Bet strong + weak, check medium.' },
          { board: { high: 'K', lowCard: 6, variant: 'red' }, correct: { label: 'Mix', variant: 'check' }, explanation: 'Two low cards (biggest risk factor for T-K high). Low cards interact with each other → not 100%.' },
          { board: { high: '9', variant: 'orange' }, correct: { label: 'Mix', variant: 'check' }, explanation: '9-high & below → always mix ~60/40. No 100% exists. BTN misses low boards harder.' },
        ]}
      />
      <StrategyQuestions
        title="System 2 — Rules"
        questions={[
          { question: 'What are the three flop buckets for BTN c-betting?', options: ['Ace-high, T-K high + deuce, 9-high & below', 'Ace-high, paired, monotone', 'High, medium, low', 'Connected, disconnected, paired'], correct: 0, explanation: 'Ace-high 100%; T-K high + deuce/3 present 100%; 9-high & below mix ~60/40.' },
          { question: 'What is the biggest risk factor for T-K high boards?', options: ['Monotone', 'Paired', 'Two low cards', 'Connected'], correct: 2, explanation: 'Two low cards interact with each other → not 100%. The second low card is the key driver.' },
          { question: 'What are the risk factors for ace-high boards?', options: ['Monotone, paired, deep stacks', 'Two low cards, connected', 'Paired only', 'Connected only'], correct: 0, explanation: 'Ace-high risk factors: monotone, paired, deep stacks. Otherwise bet 100%.' },
          { question: 'When BTN misses low boards, what is the strategy?', options: ['Check everything', 'Bet top + bottom, check middle', 'Bet everything small', 'Check-call'], correct: 1, explanation: 'BTN range is wider, misses low boards harder. Bet top + bottom (selective), check middle.' },
          { question: 'On two-tone boards, what should you also block?', options: ['Only the flush-draw suit', 'The second (non-FD) suit', 'No suits matter', 'Both suits equally'], correct: 1, explanation: 'BB defends around two suits. Also block the second suit (non-FD suit BB calls with via backdoor draws) — no equity risk.' },
          { question: 'What sizing does System 2 use on low boards?', options: ['Pot-sized', 'Small c-bet (~33-40%)', '1/5 pot', 'Overbet'], correct: 1, explanation: 'No explicit sizing prescribed in the transcript. Small c-bet on boards where BTN misses; bet top + bottom, check middle.' },
        ]}
      />
    </>
  )
}

export default S2Page
