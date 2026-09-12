import { Section, Callout, Tag, Action, RandomBoard, Tabs, Collapsible, DecisionTree, HandExample } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_RFI_CEV, BB_VS_UTG_CEV } from '@poker/design-system/src/data/ranges'

export function S1Page() {
  return (
    <Section title="System 1 — UTG RFI vs BB Call · C-betting">
      <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <DecisionTree
                root={{
                  question: 'Is the board T-high or higher?',
                  hint: 'A, K, Q, J, T as the highest card',
                  yes: {
                    question: 'Are there risk factors?',
                    hint: 'Monotone · AKx · Paired low under high · 3+ straights',
                    yes: {
                      action: <Action variant="check">Mix</Action>,
                      actionVariant: 'check',
                      reason: 'Bet strong + weak, check medium',
                      boards: [
                        <RandomBoard high="A" suit="monotone" variant="orange" />,
                        <RandomBoard akx variant="orange" />,
                        <RandomBoard high="A" paired lowCard={2} variant="orange" label="A22" />,
                        <RandomBoard high="J" paired lowCard={6} variant="orange" label="High-low-low" />,
                        <RandomBoard high="J" connected variant="red" />,
                      ],
                    },
                    no: {
                      action: <Action variant="bet">C-bet 100%</Action>,
                      actionVariant: 'bet',
                      reason: 'Every hand. Small size.',
                      boards: [
                        <RandomBoard high="T" variant="green" />,
                        <RandomBoard high="J" variant="green" />,
                        <RandomBoard high="K" variant="green" />,
                        <RandomBoard high="A" variant="green" />,
                        <RandomBoard high="Q" connected variant="green" />,
                      ],
                    },
                  },
                  no: {
                    action: <Action variant="check">Mix ~70/30</Action>,
                    actionVariant: 'check',
                    reason: '9-high & below. No 100% exists. Bet strong+weak, check medium.',
                    boards: [
                      <RandomBoard high="9" variant="orange" />,
                      <RandomBoard high="9" paired variant="orange" label="9-high paired" />,
                    ],
                  },
                }}
              />

              <Callout>Bucket 1 (T-high+) occurs far more often — one ace makes a flop ace-high. Highest-ROI piece.</Callout>
              <Callout variant="warn"><strong>Bet MORE when shallow, not less.</strong> Most players do the opposite — correct the leak.</Callout>

              <Callout variant="warn"><strong>Common Leaks:</strong> Most players bet LESS when shallow — should bet MORE (overpair asymmetry amplified at shallow depth). Checking medium-strength hands makes range vulnerable to aggression. Professional players routinely check back T-high+ clean boards — a systematic error this system corrects.</Callout>

              <Collapsible title="Heuristics">
                <ul>
                  <li>"Bet top, bet bottom, check middle"</li>
                  <li>"Bet MORE when shallow, not less"</li>
                  <li>"High-low-low IS a risk factor; high-high-low is NOT"</li>
                </ul>
              </Collapsible>

              <Collapsible title="Why bet 100% on T-high+?">
                <p><strong>Overpair asymmetry</strong>: UTG has far more strong pairs than BB caller. Shorter stacks amplify → bet more. Deeper → more caution.</p>
              </Collapsible>

              <Collapsible title="Risk factor details">
                <p><strong>Monotone</strong> — Ace-monotone is a risk factor. Bet strong + weak, check medium.</p>
                <p><strong>AKx family</strong> — AK2/AK3/AK4. Slow down — not 100%.</p>
                <p><strong>High-low-low (paired low under high)</strong> — T55, J66, K33. Bet trips + weak, check underpairs.</p>
                <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>
                <p><strong>Straights possible</strong> — 1 straight → still bet frequently. 3 straights → slow down heavily.</p>
                <p><strong>Stack depth</strong> <Tag variant="risk">secondary</Tag> — deeper (→150bb) → caution. Shallower (→20bb) → lean into 100%.</p>
                <p><strong>Blocker nuance (high-low-low):</strong> AT with an ace that blocks backdoor flush draws bets more; AT without that blocker checks more.</p>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Solver examples land at ~40% pot. The transcript does not prescribe a specific size for this system.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Examples',
          content: (
            <>
              <HandExample spot="K83 two-tone (king-high, disconnected, 40bb)" action="C-bet 100%" actionVariant="bet">Solver agrees — 0% check. Player checked, costing EV.</HandExample>
              <HandExample spot="KK3 rainbow (high-high-low)" action="C-bet 100%" actionVariant="bet">KK3 is NOT a risk factor (high-low-low would be K33). Player checked — mistake.</HandExample>
              <HandExample spot="AJ5 monotone (ace-high monotone)" action="Mix" actionVariant="check">Risk factor. Bet flushes/sets/trash, check medium (pocket Ks no heart, ATs, weak aces).</HandExample>
              <HandExample spot="J66 (high-low-low, paired)" action="Mix 50%" actionVariant="check">Bet trips (6x) + trash, check underpairs (TT-77) and medium aces (AT, AK).</HandExample>
            </>
          ),
        },
        {
          label: 'UTG RFI',
          content: (
            <>
              <p>UTG's opening range — the starting point of this system. ChipEV solutions at 6-40bb: pure 2bb opens at 20bb+, a raise/jam mix at 10-15bb, all-in below that. Switch stacks with the selector.</p>
              <RangeBrowser ranges={UTG_RFI_CEV} />
            </>
          ),
        },
        {
          label: 'BB vs UTG',
          content: (
            <>
              <p>BB's defense vs the UTG open — raise (3-bet) and call frequencies.</p>
              <RangeBrowser ranges={BB_VS_UTG_CEV} />
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 1 — Practice"
              quiz={{
                options: [
                  { label: 'C-bet 100%', variant: 'bet' },
                  { label: 'Mix', variant: 'check' },
                ],
                scenarios: [
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
                ],
              }}
              questions={[
                { question: 'What are the two flop buckets for System 1?', options: ['T-high+ and 9-high & below', 'Ace-high and everything else', 'Paired and unpaired', 'Wet and dry'], correct: 0, explanation: 'Bucket 1: T-high+ → c-bet 100%. Bucket 2: 9-high & below → mix ~70/30.' },
                { question: 'What is the primary risk factor for c-betting 100%?', options: ['Paired boards', 'Monotone boards', 'Straights possible', 'Stack depth'], correct: 2, explanation: 'Straights possible is primary. 1 straight → still bet. 3 straights → slow down heavily.' },
                { question: 'What adaptation when shallow (20bb)?', options: ['C-bet less — less risk', 'C-bet more — overpair asymmetry amplified', 'No change', 'Check everything'], correct: 1, explanation: 'Shallow amplifies overpair advantage. Bet MORE, not less. Most players do the opposite — correct the leak.' },
                { question: 'Is KK3 (high-high-low) a risk factor?', options: ['Yes — two high cards', 'No — only paired low under high counts', 'Sometimes', 'Only if monotone'], correct: 1, explanation: 'KK3 is high-high-low, NOT high-low-low. Only paired low under high (like K33, J66, T55) is a risk factor.' },
                { question: 'On a risk board, which hands do you CHECK?', options: ['Very strong and very weak', 'Medium-strength only', 'Everything', 'Only sets'], correct: 1, explanation: 'Bet top (strong) + bottom (trash), check middle (underpairs, medium aces, AK/AQ/AT).' },
                { question: 'What is the default c-bet sizing for System 1?', options: ['1/4 to 1/3 pot', '~40% pot', 'Pot-sized', '1/5 pot'], correct: 1, explanation: 'Solver examples land at ~40% pot. The transcript does not prescribe a specific size for this system.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S1Page
