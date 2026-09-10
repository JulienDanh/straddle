import { Section, Callout, DataTable, Tabs } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function PrimerPage() {
  return (
    <Section title="Preflop Primer">
      <p className="muted">Post-flop outputs are a direct consequence of preflop inputs. Matching these ranges makes solver study relevant.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <h3>Core idea: all RFI ranges are <em>linear</em></h3>
              <p>You open the best hands first. Ace-high is most concentrated, then king-high, etc. Ranges widen as you move later in position.</p>
              <Callout variant="warn"><strong>Stack-depth sensitivity:</strong> shorter &rarr; slightly tighter, but backbones are stable. Memorize the <em>perimeter</em>, not every combo.</Callout>
              <h3>RFI range perimeters</h3>
              <DataTable columns={[{ header: 'Position' }, { header: 'Perimeter' }]} rows={[[<>UTG (17.7%)</>, <>Suited 9s+, A4s+ (mix A3s), K8s+, ATo+, KJo+, 22+</>],
                  [<>Cutoff</>, <>Suited 6s+, Q4s+, K2s+, T9o+, A5o, A7o+, 22+</>],
                  [<>Button</>, <>Suited 5s+, all suited Broadway, T8o+, A2o+, K6o+, Q7o+, 22+ (mix)</>]]} />
              <h3>Big Blind defense</h3>
              <DataTable columns={[{ header: 'Vs opener' }, { header: 'Defend perimeter' }, { header: 'Notes' }]} rows={[[<>Button (2.3x)</>, <>Offsuit 6s+, all suited, Q2o+</>, <>Connected hands competitive with 96o.</>],
                  [<>UTG (same size)</>, <>Offsuit 9s+ floor, nearly all suited in</>, <>Only 72s is clearly &lt;0; suited combos resilient.</>]]} />
              <Callout><strong>Key sensitivity:</strong> <em>offsuit</em> combos are enormously sensitive to sizing and position. <em>Suited</em> combos are resilient. vs min-raise &rarr; more offsuit; vs 2.5x &rarr; offsuit comes out; vs EP open &rarr; offsuit floor rises (9s vs 6s).</Callout>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="Preflop Primer — Practice"
              questions={[
                { question: 'What is the backbone of the BTN RFI range?', options: ['Offsuit 8s and suited 5s', 'Offsuit 9s and suited 6s', 'Offsuit Ts and suited 7s', 'Suited connectors only'], correct: 0, explanation: 'BTN backbone is offsuit 8s and suited 5s. CO is one pip higher (offsuit 9s, suited 6s). HJ is one pip higher again (offsuit Ts, suited 7s).' },
                { question: 'What happens to suited connectors at shorter stacks?', options: ['They deteriorate — offsuit aces replace them', 'They get stronger', 'No change', 'They become folds'], correct: 0, explanation: 'Suited connectors deteriorate at shorter stacks. Offsuit ace-high hands become more competitive and replace them.' },
                { question: 'Which combos are more sensitive to sizing and position?', options: ['Offsuit combos', 'Suited combos', 'Pocket pairs', 'All equally sensitive'], correct: 0, explanation: 'Offsuit combos are enormously sensitive. Suited combos are resilient. Vs min-raise: more offsuit. Vs 2.5x: offsuit comes out. Vs EP: offsuit floor rises.' },
                { question: 'What is the BB defense floor vs UTG at 40bb?', options: ['Offsuit 9s, nearly all suited', 'Offsuit 6s, all suited', 'Offsuit Ts only', 'All hands'], correct: 0, explanation: 'vs UTG (same size): offsuit 9s+ floor, nearly all suited in. Only 72s is clearly below zero.' },
                { question: 'What does "one pip higher per position" mean?', options: ['BTN offsuit 8s → CO offsuit 9s → HJ offsuit Ts', 'Each position adds a new suit', 'It means suited hands get worse', 'It means pairs get tighter'], correct: 0, explanation: 'As you move one position earlier (BTN → CO → HJ), the backbone shifts one pip higher. BTN: offsuit 8s. CO: offsuit 9s. HJ: offsuit Ts.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default PrimerPage
