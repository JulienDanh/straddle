import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S4Page() {
  return (
    <Section title="System 4 — Missed River Bluffs">
      <p>Hero opened, BB called, betting river as bluff after missing. Two-system approach. <strong>Prioritize System 1</strong> (easier) while acknowledging System 2 (solvers use it more).</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <DecisionTree
                root={{
                  question: 'Is there a 3-flush on the river?',
                  hint: 'Monotone board — obvious blocking effect',
                  yes: {
                    action: <Action variant="raise">Bluff (System 2)</Action>,
                    actionVariant: 'raise',
                    reason: 'One card of the flush suit blocks flushes AND hero calls. Use System 2 first.',
                    boards: [
                      <RandomBoard high="K" suit="monotone" variant="green" label="3-flush on board" streets={5} />,
                    ],
                  },
                  no: {
                    question: 'Three Broadway on board + EP opener?',
                    hint: 'No offsuit air in range',
                    yes: {
                      action: <Action variant="bet">Bluff all suited air</Action>,
                      actionVariant: 'bet',
                      reason: 'Only suited hands can bluff — scarce. Pure bluff them all.',
                      boards: [
                        <RandomBoard high="A" variant="green" label="Three Broadway · EP" streets={5} />,
                      ],
                    },
                    no: {
                      question: 'Does your hand block both busted straights AND flushes?',
                      hint: 'e.g. QJ♥ on heart board with straight draws missed',
                      yes: {
                        action: <Action variant="fold">Don't bluff</Action>,
                        actionVariant: 'fold',
                        reason: 'Blocking both folding regions is terrible. Prefer hands blocking only one.',
                        boards: [
                          <RandomBoard high="A" suit="two-tone" variant="red" label="Busted straight + flush" streets={5} />,
                        ],
                      },
                      no: {
                        action: <Action variant="bet">Bluff (System 1)</Action>,
                        actionVariant: 'bet',
                        reason: 'Wide ranges, no obvious suit blanked. Bluff weakest hands first; prioritize the LOW card.',
                        boards: [
                          <RandomBoard high="A" variant="green" streets={5} />,
                          <RandomBoard high="K" variant="green" streets={5} />,
                        ],
                      },
                    },
                  },
                }}
              />

              <Callout>Low cards have good blocking effects vs linear ranges (deuce blocks few value, unblocks folds — opponents folded 2x preflop).</Callout>

              <Collapsible title="The two systems">
                <p><strong>System 1 — bottom of range up:</strong> bluff with <em>weakest</em> hands first — lowest EV when checking, lowest opportunity cost. Heuristic: prioritize the <em>lowest card</em> in the hand. 72o before 65o. 92o before 87o.</p>
                <p><strong>System 2 — blocking effects:</strong> bluff with combos that <strong>block opponent's calls/raises</strong> and <strong>unblock their folds</strong>. Very difficult to manage all three — System 1 is default.</p>
              </Collapsible>

              <Collapsible title="Key blocking patterns">
                <ul>
                  <li><strong>3-flush river:</strong> bluff with one card of the flush suit. Blocks flushes AND hero calls.</li>
                  <li><strong>Two-tone flop called:</strong> opponent called with 2 suits. Bluff avoiding those; prefer others.</li>
                  <li><strong>High card vs low card of suit:</strong> high card heart is <em>worse</em> (blocks more folds). Low card heart less damaging.</li>
                </ul>
                <Callout variant="bad"><strong>You can't always have the ideal bluff.</strong> If hearts bet flop+turn, you <em>won't have hearts left</em> on river. Don't wait for the perfect blocker — you'll have <em>no</em> bluffing range.</Callout>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>~65% pot for river bluffs.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 4 — Practice"
              quiz={{
                options: [
                  { label: 'Bluff (System 1)', variant: 'bet' },
                  { label: 'Bluff (System 2)', variant: 'raise' },
                  { label: "Don't bluff", variant: 'fold' },
                ],
                scenarios: [
                  { board: { high: 'K', suit: 'monotone', variant: 'green', streets: 5 }, correct: { label: 'Bluff (System 2)', variant: 'raise' }, explanation: '3-flush on river → obvious blocking effect. One card of the flush suit blocks flushes AND hero calls. Use System 2 first.' },
                  { board: { high: 'A', variant: 'green', streets: 5 }, correct: { label: 'Bluff (System 1)', variant: 'bet' }, explanation: 'Wide ranges, no obvious suit blanked → too hard for System 2. Bluff weakest hands first; prioritize the LOW card.' },
                  { board: { high: 'K', variant: 'green', streets: 5 }, correct: { label: 'Bluff (System 1)', variant: 'bet' }, explanation: 'Wide ranges, no suit blanked → System 1. Bluff from the bottom of range up.' },
                  { board: { high: 'A', variant: 'green', label: 'Three Broadway · EP', streets: 5 }, correct: { label: 'Bluff (System 1)', variant: 'bet' }, explanation: 'Three Broadway + EP opener = no offsuit air. Only suited hands can bluff — scarce. Pure bluff them all.' },
                  { board: { high: 'A', suit: 'monotone', variant: 'red', label: 'Busted straight + flush', streets: 5 }, correct: { label: "Don't bluff", variant: 'fold' }, explanation: 'QJ♥ blocks both busted straights AND flush draws. Blocking both folding regions is terrible. Prefer hands that block only one.' },
                ],
              }}
              questions={[
                { question: 'What is System 1 for river bluffs?', options: ['Bluff weakest hands first (bottom of range up)', 'Block opponent calls', 'Always shove', 'Only bluff suited hands'], correct: 0, explanation: 'Bottom of range up: bluff with weakest hands first — lowest EV when checking, lowest opportunity cost. Prioritize the LOW card.' },
                { question: 'What is System 2 for river bluffs?', options: ['Bluff combos that block calls/raises and unblock folds', 'Bluff the weakest hand', 'Bluff with high cards', 'Never bluff'], correct: 0, explanation: 'Block opponent calls/raises, unblock their folds. Very hard to manage all three — System 1 is default.' },
                { question: 'Which system should you prioritize?', options: ['System 1 (easier), acknowledge System 2', 'System 2 only', 'Neither', 'Both equally'], correct: 0, explanation: 'Prioritize System 1 (easier) while acknowledging System 2 (solvers use it more).' },
                { question: 'On a 3-flush river, what is the ideal bluff?', options: ['One card of the flush suit', 'No card of the flush suit', 'Two cards of the flush suit', 'A high card'], correct: 0, explanation: 'One card of the flush suit blocks flushes AND hero calls. Obvious blocking effect — use System 2 first.' },
                { question: 'Why is QJ♥ a terrible bluff on a heart board with busted straights?', options: ['Blocks both busted straights AND flushes', 'Not weak enough', 'Blocks nothing', 'Too strong to bluff'], correct: 0, explanation: 'QJ♥ blocks both folding regions (busted straights + busted flushes). Intersection of blocking both is very bad. Prefer 67♥/78♥ (block flush only).' },
                { question: 'What sizing for river bluffs?', options: ['~65% pot', 'Pot-sized', '1/4 pot', 'Overbet'], correct: 0, explanation: '~65% pot for river bluffs.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S4Page
