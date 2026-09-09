import { Section, Callout, Action, Tabs, Collapsible } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S10Page() {
  return (
    <Section title="System 10 — River Value Betting">
      <p>River, deciding value bet or check. <strong>Central thesis: absolute strength is irrelevant. Relative strength (vs opponent's range) determines value.</strong></p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <h3>Sizing by situation</h3>
              <table>
                <tr><th>Situation</th><th>Action</th><th>Sizing</th></tr>
                <tr><td>Can't CR but called by worse</td><td><Action variant="bet">Bet</Action></td><td>Don't let opponent polarize by checking</td></tr>
                <tr><td>Opponent checked turn, medium hand</td><td><Action variant="bet">Bet (block)</Action></td><td>Small (25–33%) forces them to defend 75%+</td></tr>
                <tr><td>Opponent capped (no nuts)</td><td><Action variant="bet">Bet large / overbet</Action></td><td>Large vs capped ranges</td></tr>
                <tr><td>Opponent has high nut ratio</td><td><Action variant="bet">Bet small</Action></td><td>Nuts frequency constrains sizing</td></tr>
                <tr><td>Short SPR (&lt;2x pot)</td><td><Action variant="allIn">Prefer jamming</Action></td><td>Checking loses optionality</td></tr>
              </table>

              <Callout variant="good">When villain's range weakens, your medium-strength hands become the <em>relative nuts</em> → bet for value.</Callout>
              <Callout variant="bad"><strong>Checking converts strong hands into bluff catchers.</strong> IP auto-polarizes — bets hands that beat you, checks hands you beat. You lose value against the entire medium-strength region.</Callout>

              <Collapsible title="Inflection points weakening villain's range">
                <ul>
                  <li>Villain checks turn or river → subtracts strong hands</li>
                  <li>No flop or turn raising → subtracts sets/2-pair/flushes</li>
                  <li>Very small bet sizes → thin value, not nuts</li>
                </ul>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>OOP: small/blocking bets (15–33%). IP: never small bet — pot-sized or over.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 10 — Practice"
              questions={[
                { question: 'What is the central thesis of System 10?', options: ['Absolute strength is irrelevant; relative strength (vs opponent range) determines value', 'Bet your strongest hands', 'Always check medium hands', 'Size based on pot odds'], correct: 0, explanation: 'Absolute strength is irrelevant. Relative strength vs opponent\'s range determines whether you can value bet.' },
                { question: 'When villain\'s range weakens, what happens to your medium hands?', options: ['They become the relative nuts → bet for value', 'They must check', 'They become folds', 'They lose value'], correct: 0, explanation: 'When villain\'s range weakens (checked turn, no raises, small bets), your medium hands become the relative nuts → bet for value.' },
                { question: 'What is the danger of checking strong hands?', options: ['IP auto-polarizes — bets hands that beat you, checks hands you beat', 'You lose the pot', 'You get bluffed', 'You miss value'], correct: 0, explanation: 'Checking converts strong hands into bluff catchers. IP auto-polarizes: bets hands that beat you, checks hands you beat. You lose value against the medium region.' },
                { question: 'What is the block-bet sizing when OOP with a medium hand?', options: ['Small (25-33%) — forces them to defend 75%+', 'Pot-sized', 'Overbet', 'All-in'], correct: 0, explanation: 'OOP block-bet: small (25-33%). Forces opponent to defend 75%+ of range. Checking lets them polarize.' },
                { question: 'What sizing vs a capped opponent (no nuts)?', options: ['Bet large / overbet', 'Small block bet', 'Check', 'Min-bet'], correct: 0, explanation: 'Opponent capped (no nuts) → bet large / overbet. Their nut ratio constrains your sizing — low ratio = bet big.' },
                { question: 'What is the IP river sizing rule?', options: ['Never small bet — pot-sized or over', 'Always block-bet', 'Quarter pot', 'Check-raise'], correct: 0, explanation: 'IP: never small bet — pot-sized or over. OOP: small/blocking bets (15-33%).' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S10Page
