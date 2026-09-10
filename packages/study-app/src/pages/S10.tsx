import { Section, Callout, Action, Tabs, Collapsible, DataTable, HandExample } from '@poker/design-system/src/components/ui'
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
              <DataTable columns={[{ header: 'Situation' }, { header: 'Action' }, { header: 'Sizing' }]} rows={[[<>Can't CR but called by worse</>, <><Action variant="bet">Bet</Action></>, <>Don't let opponent polarize by checking</>],
                  [<>Opponent checked turn, medium hand</>, <><Action variant="bet">Bet (block)</Action></>, <>Small (25–33%) forces them to defend 75%+</>],
                  [<>Opponent capped (no nuts)</>, <><Action variant="bet">Bet large / overbet</Action></>, <>Large vs capped ranges</>],
                  [<>Opponent has high nut ratio</>, <><Action variant="bet">Bet small</Action></>, <>Nuts frequency constrains sizing</>],
                  [<>Short SPR (&lt;2x pot)</>, <><Action variant="allIn">Prefer jamming</Action></>, <>Checking loses optionality</>]]} />

              <Callout variant="good">When villain's range weakens, your medium-strength hands become the <em>relative nuts</em> → bet for value.</Callout>
              <Callout variant="bad"><strong>Checking converts strong hands into bluff catchers.</strong> IP auto-polarizes — bets hands that beat you, checks hands you beat. You lose value against the entire medium-strength region.</Callout>

              <Callout variant="warn"><strong>Common Leaks:</strong> Checking back the relative nuts (failing to identify villain is capped). Confusing absolute with relative strength — "I only have second pair" but villain can't have better. Betting too small in position — reopening action to CR for little reward. Not betting because "they'll check back what I beat" — bet yourself to monetize.</Callout>

                            <Collapsible title="Heuristics">
                <ul>
                  <li>"Relative &gt; absolute hand strength"</li>
                  <li>"Villain checks back turn = inflection point = your medium hand becomes strong"</li>
                  <li>"If you can't check-raise, bet"</li>
                  <li>"Block bet OOP = 1/3 pot (forces 75% defense)"</li>
                  <li>"When villain is capped, bet large"</li>
                </ul>
              </Collapsible>

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
          label: 'Examples',
          content: (
            <>
<HandExample spot="Set of Js on 957 → 5 turn (EP vs CO, 100bb)" action="Block-bet 1/3" actionVariant="bet">Villain checks back turn = capped. Block-bet small. If you check, villain bets flushes/sets/overpairs (beat you) and checks medium hands (you beat). You lose value.</HandExample>
                <HandExample spot="AQ on J97 → T → 9 river (EP vs SB, 80bb)" action="Bet pot / overbet" actionVariant="bet">Villain checked back turn (no Jx, sets, two pair). River 9 blanks. AQ is near relative nuts. Bet pot or overbet.</HandExample>
                <HandExample spot="AK on K72 → 2 → 2 river (EP vs BB)" action="Jam" actionVariant="allIn">Villain just called flop and turn (no raises). AK is near nuts — villain has no KK, 77, 22 (would raise). Pure jam.</HandExample>
                <HandExample spot="88 on A72 → 2 → 8 river (EP vs BB, 50bb)" action="Bet large" actionVariant="bet">Villain checks turn and river → capped. 88 is near nuts. Bet 6-8bb, not 2.5bb. Small bet risks CR by worse hands.</HandExample>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 10 — Practice"
              quiz={{
                options: [
                  { label: 'Bet pot / overbet', variant: 'bet' },
                  { label: 'Block-bet (1/3 pot)', variant: 'bet' },
                  { label: 'Check', variant: 'check' },
                ],
                scenarios: [
                  { board: { high: 'J', variant: 'green', label: 'Villain checked turn (capped)' }, correct: { label: 'Bet pot / overbet', variant: 'bet' }, explanation: 'Villain checked back turn = inflection point. No sets, two pair, strong top pair. Your medium hand is near the relative nuts. Bet pot or overbet.' },
                  { board: { high: 'A', variant: 'green', label: 'Villain called flop+turn, no raises' }, correct: { label: 'Bet pot / overbet', variant: 'bet' }, explanation: 'Villain didn\'t raise flop or turn = no sets, two pair, or strong hands. Your top pair is near the nuts. Jam or bet large.' },
                  { board: { high: 'K', suit: 'two-tone', label: 'Set of Js, villain checked turn' }, correct: { label: 'Block-bet (1/3 pot)', variant: 'bet' }, explanation: 'Can\'t check-raise (not strong enough). Block-bet 1/3 pot forces villain to defend 75%+. Checking lets villain perfectly polarize.' },
                  { board: { high: 'Q', variant: 'green', label: 'Medium hand, villain checked turn' }, correct: { label: 'Bet pot / overbet', variant: 'bet' }, explanation: 'Villain checked back turn = capped. Your second pair is near the relative nuts. Bet large to get stacks in.' },
                  { board: { high: 'A', suit: 'monotone', label: 'Both can have flushes' }, correct: { label: 'Check', variant: 'check' }, explanation: 'High nut ratio — villain can have flushes. Don\'t bet large into a range that can have the nuts. Check and bluff-catch.' },
                  { board: { high: 'K', variant: 'green', label: '88, villain checks turn+river' }, correct: { label: 'Bet pot / overbet', variant: 'bet' }, explanation: 'Villain checks turn and river = capped. 88 is near relative nuts. Bet large — don\'t bet small and reopen to CR.' },
                ],
              }}
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
