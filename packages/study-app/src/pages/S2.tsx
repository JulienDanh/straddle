import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree, HandExample } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { BTN_RFI_CEV, BB_VS_BTN_CEV } from '@poker/design-system/src/data/ranges'


export function S2Page() {
  return (
    <Section title="System 2 — BTN RFI vs BB Call · C-betting">
      <p>Button opens, BB calls, BB checks. Three flop buckets.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <DecisionTree
                root={{
                  question: 'Is the high card T or higher?',
                  yes: {
                    question: 'Ace-high?',
                    hint: 'BTN has the most aces',
                    yes: {
                      question: 'Risk factors?',
                      hint: 'Monotone · Paired · Deep stacks',
                      yes: {
                        action: <Action variant="check">Mix</Action>,
                        actionVariant: 'check',
                        reason: 'Bet strong + weak, check medium. Deeper → more checking.',
                        boards: [
                          <RandomBoard high="A" suit="monotone" variant="orange" />,
                          <RandomBoard high="A" paired variant="orange" label="A-J-J" />,
                        ],
                      },
                      no: {
                        action: <Action variant="bet">C-bet 100%</Action>,
                        actionVariant: 'bet',
                        reason: 'BTN has the most aces. Risk-free.',
                        boards: [
                          <RandomBoard high="A" variant="green" />,
                        ],
                      },
                    },
                    no: {
                      question: 'T–K high. Deuce or 3 present?',
                      hint: 'Disconnected = no two low cards interacting',
                      yes: {
                        action: <Action variant="bet">C-bet 100%</Action>,
                        actionVariant: 'bet',
                        reason: 'Disconnected → bet 100%.',
                        boards: [
                          <RandomBoard high="K" variant="green" />,
                          <RandomBoard high="Q" variant="green" />,
                          <RandomBoard high="T" variant="green" />,
                        ],
                      },
                      no: {
                        action: <Action variant="check">Mix</Action>,
                        actionVariant: 'check',
                        reason: 'Two low cards (biggest risk) or monotone. Bet strong+weak, check middle.',
                        boards: [
                          <RandomBoard high="K" paired variant="orange" />,
                          <RandomBoard high="K" suit="monotone" variant="orange" />,
                        ],
                      },
                    },
                  },
                  no: {
                    action: <Action variant="check">Mix ~60/40</Action>,
                    actionVariant: 'check',
                    reason: '9-high & below. No 100% exists. BTN misses low boards harder.',
                    boards: [
                      <RandomBoard high="9" variant="orange" />,
                    ],
                  },
                }}
              />

              <Callout>BTN range is wider (offsuit 8s+), so it misses low boards harder. When BTN doesn't interact, build a checking strategy — bet top, bet bottom, check middle.</Callout>

              <Collapsible title="Two-suit awareness (key skill)">
                <p>On two-tone boards, BB defends around <em>two</em> suits. Most only think about the flush-draw suit. Also <strong>block the second suit</strong> (non-flush-draw suit BB calls with via backdoor draws) — no equity risk.</p>
                <Callout variant="warn"><strong>K83 two-tone (hearts+diamonds):</strong> KJ with heart+diamond = pure bet. KJ with spades+clubs (both off) = pure check.</Callout>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>No explicit sizing prescribed in the transcript. Small c-bet on low boards where BTN misses.</p>
              </Collapsible>

              <Callout variant="warn"><strong>Common Leaks:</strong> Checking back boards that should be 100% c-bet (ace-high, T–K high with deuce/three). Not recognizing when BTN misses a board entirely (no 8+) — must check, not bet blindly. Only considering one suit for blocker effects — should consider both calling suits. Betting too small in position — IP can polarize, should bet larger.</Callout>

                            <Collapsible title="Heuristics">
                <ul>
                  <li>"If there's no 8+ on the board, BTN probably misses — check more"</li>
                  <li>"Consider both suits, not just the flush draw suit"</li>
                  <li>"In position can polarize — bet bigger"</li>
                  <li>"Miss a 15% check? Costs ~0% EV — just bet range"</li>
                </ul>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Examples',
          content: (
            <>
<HandExample spot="AJJ paired (ace-high, 50bb)" action="Mix" actionVariant="check">Paired board = risk factor. Check KQ, QQ, TT-77 (medium). Bet Jx + trash. Solver checks ~50%.</HandExample>
                <HandExample spot="KJ2 (king-high with deuce)" action="C-bet 100%" actionVariant="bet">Solver shows 14% check — simplification to 100% costs ~0% EV.</HandExample>
                <HandExample spot="543 two-tone (no 8+, BTN misses)" action="Check" actionVariant="check">Must check. Bet top (66+, 87s), check middle (A8, KQ, pairs), bet some bottom (J8s with BDFD).</HandExample>
                <HandExample spot="K63 (two low cards)" action="Mix" actionVariant="check">Risk factor. Not 100%. Check medium (QQ, JJ, 9x). Bet strong + weak.</HandExample>
            </>
          ),
        },
        {
          label: 'BTN RFI',
          content: (
            <>
              <p>BTN's opening range — the starting point of this system. ChipEV solutions at 15-40bb: the open tightens as stacks shorten (52% → 38%) and the jam mix grows below 20bb. Switch stacks with the selector.</p>
              <RangeBrowser ranges={BTN_RFI_CEV} />
            </>
          ),
        },
        {
          label: 'BB vs BTN',
          content: (
            <>
              <p>BB's defense vs the BTN open — raise, call, and all-in frequencies at 30-40bb. The 3-bet shrinks as stacks shorten (9bb → 7.5bb sizing) and the all-in slice grows (3% → 8%); calls stay ~71% of all hands. Switch stacks with the selector.</p>
              <RangeBrowser ranges={BB_VS_BTN_CEV} />
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 2 — Practice"
              quiz={{
                options: [
                  { label: 'C-bet 100%', variant: 'bet' },
                  { label: 'Mix', variant: 'check' },
                ],
                scenarios: [
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
                ],
              }}
              questions={[
                { question: 'What are the three flop buckets for BTN c-betting?', options: ['Ace-high, T-K high + deuce, 9-high & below', 'Ace-high, paired, monotone', 'High, medium, low', 'Connected, disconnected, paired'], correct: 0, explanation: 'Ace-high 100%; T-K high + deuce/3 present 100%; 9-high & below mix ~60/40.' },
                { question: 'What is the biggest risk factor for T-K high boards?', options: ['Monotone', 'Paired', 'Two low cards', 'Connected'], correct: 2, explanation: 'Two low cards interact with each other → not 100%. The second low card is the key driver.' },
                { question: 'What are the risk factors for ace-high boards?', options: ['Monotone, paired, deep stacks', 'Two low cards, connected', 'Paired only', 'Connected only'], correct: 0, explanation: 'Ace-high risk factors: monotone, paired, deep stacks. Otherwise bet 100%.' },
                { question: 'When BTN misses low boards, what is the strategy?', options: ['Check everything', 'Bet top + bottom, check middle', 'Bet everything small', 'Check-call'], correct: 1, explanation: 'BTN range is wider, misses low boards harder. Bet top + bottom (selective), check middle.' },
                { question: 'On two-tone boards, what should you also block?', options: ['Only the flush-draw suit', 'The second (non-FD) suit', 'No suits matter', 'Both suits equally'], correct: 1, explanation: 'BB defends around two suits. Also block the second suit (non-FD suit BB calls with via backdoor draws) — no equity risk.' },
                { question: 'What sizing does System 2 use on low boards?', options: ['Pot-sized', 'Small c-bet (~33-40%)', '1/5 pot', 'Overbet'], correct: 1, explanation: 'No explicit sizing prescribed in the transcript. Small c-bet on boards where BTN misses; bet top + bottom, check middle.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S2Page
