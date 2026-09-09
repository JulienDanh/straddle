import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S6Page() {
  return (
    <Section title="System 6 \u2014 Check-Raising Top Pair (Short Stacks)">
      <p>Hero flats BB, flops top pair, faces c-bet. Check-raise or check-call? Focus on <strong>short stacks (\u226435bb)</strong>.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="warn"><strong>Inflection: 35bb.</strong> Above → nuts-oriented CR (sets, two pair, TPTK mix). <strong>At/below → aggressive top-pair CR.</strong> Shorter = more CR. Most players under-CR top pair when short — correct the leak.</Callout>

              <DecisionTree
                root={{
                  question: 'Is your stack ≤35bb?',
                  hint: 'Short stack = aggressive top-pair CR',
                  yes: {
                    question: 'Top pair (good kicker)?',
                    hint: 'KQ/QJ/QT pure CR; taper to Q2 pure call',
                    yes: {
                      question: 'Backdoor flush draw (both suited)?',
                      yes: {
                        action: <Action variant="call">Check-call</Action>,
                        actionVariant: 'call',
                        reason: 'Realize the flush draw. CR gives up flush equity.',
                        boards: [
                          <RandomBoard high="Q" suit="two-tone" variant="orange" label="Top pair + BDFD" />,
                        ],
                      },
                      no: {
                        action: <Action variant="raise">Check-raise top pair</Action>,
                        actionVariant: 'raise',
                        reason: 'Pure CR. Shorter = more aggressive.',
                        boards: [
                          <RandomBoard high="Q" variant="green" />,
                          <RandomBoard high="K" variant="green" />,
                        ],
                      },
                    },
                    no: {
                      action: <Action variant="call">Trap (check-call)</Action>,
                      actionVariant: 'call',
                      reason: 'Two pair/sets/pockets trap. SPR short enough to shove river.',
                      boards: [
                        <RandomBoard high="J" variant="red" label="Two pair / sets" />,
                        <RandomBoard high="K" variant="red" label="Two pair / sets" />,
                      ],
                    },
                  },
                  no: {
                    action: <Action variant="call">Nuts-oriented CR</Action>,
                    actionVariant: 'call',
                    reason: 'Sets, two pair, TPTK mix. Less top-pair CR when deep.',
                    boards: [],
                  },
                }}
              />

              <Collapsible title="CR hierarchy (high boards)">
              <p>On Q-high (Q73), kicker determines CR frequency:</p>
              <DataTable columns={[{header:'Hand'},{header:'CR frequency'}]} rows={[
                ['KQ, QJ, QT', 'Pure CR'],
                ['Q9', 'Heavy CR (offsuit); backdoor FD → check-call'],
                ['Q8', 'Medium mix'],
                ['Q7, Q6, Q5, Q4', 'Tapering mix'],
                ['Q2', 'Pure call'],
              ]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{header:'Factor'},{header:'Effect'}]} rows={[
                  [<><strong>Backdoor FD (both suited)</strong></>, 'Prefers check-call (Q9♥ calls more than Q9o)'],
                  [<><strong>Two pair / sets / pockets</strong></>, 'Trap (check-call) — SPR short enough to shove'],
                  [<><strong>Opponent c-betting 100%</strong></>, 'CR all top pairs — their range too weak'],
                  [<><strong>Deeper stacks (&gt;35bb)</strong></>, 'Less CR with thin top pair; mix CR/check-call with great kicker'],
                ]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>CR to <strong>small size</strong> (~3x the c-bet). Short stacks = 2-street game.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 6 \u2014 Check-Raising Top Pair (Short Stacks) — Practice"
              quiz={{
                options: [
                  { label: 'Check-raise top pair', variant: 'raise' },
                  { label: 'Check-call (BDFD)', variant: 'call' },
                  { label: 'Trap (check-call)', variant: 'check' },
                ],
                scenarios: [
                  { board: { high: 'Q', variant: 'green' }, correct: { label: 'Check-raise top pair', variant: 'raise' }, explanation: '≤35bb: top pair = pure CR. KQ/QJ/QT pure CR; taper to Q2 pure call. Shorter = more CR.' },
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'Check-raise top pair', variant: 'raise' }, explanation: '≤35bb: top pair = pure CR. Shorter = more aggressive. Most players under-CR top pair when short.' },
                  { board: { high: 'Q', suit: 'two-tone', variant: 'orange' }, correct: { label: 'Check-call (BDFD)', variant: 'call' }, explanation: 'Backdoor FD prefers check-call to realize the flush draw. Q9♥ calls more than Q9o. CR gives up flush equity.' },
                  { board: { high: 'J', paired: true, variant: 'red' }, correct: { label: 'Trap (check-call)', variant: 'check' }, explanation: 'Two pair / sets / pockets trap (check-call). SPR short enough to shove river without raising flop.' },
                  { board: { high: 'K', variant: 'red' }, correct: { label: 'Trap (check-call)', variant: 'check' }, explanation: 'Two pair / sets trap. Check-call — short SPR lets you shove river for value.' },
                ],
              }}
              questions={[
                { question: 'What is the inflection point for aggressive top-pair CR?', options: ['35bb — at/below, aggressive top-pair CR', '50bb', '20bb', 'No inflection'], correct: 0, explanation: 'Above 35bb → nuts-oriented CR (sets, two pair, TPTK mix). At/below → aggressive top-pair CR. Shorter = more CR.' },
                { question: 'What is the common leak System 6 corrects?', options: ['Under-CR top pair when short', 'Over-CR top pair when deep', 'CR too small', 'Never CR'], correct: 0, explanation: 'Most players under-CR top pair when short. Shorter = more CR, not less.' },
                { question: 'What does a backdoor flush draw prefer?', options: ['Check-call (realize the flush draw)', 'Check-raise', 'Fold', 'Donk-lead'], correct: 0, explanation: 'BDFD prefers check-call to realize the flush draw. CR gives up flush equity. Q9♥ calls more than Q9o.' },
                { question: 'What do two pair / sets / pockets do on short stacks?', options: ['Trap (check-call)', 'Check-raise', 'Donk-lead', 'Fold'], correct: 0, explanation: 'SPR is short enough to shove river without raising flop. Two pair/sets/pockets trap (check-call).' },
                { question: 'On Q-high, what determines CR frequency?', options: ['Kicker (KQ pure CR → Q2 pure call)', 'Stack depth only', 'Suit', 'Board pairing'], correct: 0, explanation: 'KQ/QJ/QT pure CR; Q9 heavy (offsuit); Q8 medium mix; Q7-Q4 tapering; Q2 pure call.' },
                { question: 'What is the CR sizing for short stacks?', options: ['Small (~3x the c-bet)', 'Pot-sized', 'Min-raise', 'All-in'], correct: 0, explanation: 'CR to small size (~3x the c-bet). Short stacks = 2-street game.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S6Page
