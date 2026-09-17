import { Section, Callout, Leak, Action, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export function S10Page() {
  return (
    <Section title="System 10 — River Value Betting">
      <p>River, deciding value bet or check. <strong>Central thesis: absolute strength is irrelevant. Relative strength (vs opponent's range) determines value.</strong></p>

      <Leak items={[
      ['Checking back the relative nuts (failing to identify villain is capped)'],
      ['Confusing absolute with relative strength', '"I only have second pair" but villain can\'t have better'],
      ['Betting too small in position', 'reopening action to CR for little reward'],
      ['Not betting because "they\'ll check back what I beat"', 'bet yourself to monetize'],
      ]} />

      
      <Subhead>Sizing by situation</Subhead>
      <DataTable columns={[{ header: 'Situation' }, { header: 'Action' }, { header: 'Sizing' }]} rows={[[<>Can't CR but called by worse</>, <><Action variant="bet">Bet</Action></>, <>Don't let opponent polarize by checking</>],
          [<>Opponent checked turn, medium hand</>, <><Action variant="bet">Bet (block)</Action></>, <>Small (25–33%) forces them to defend 75%+</>],
          [<>Opponent capped (no nuts)</>, <><Action variant="bet">Bet large / overbet</Action></>, <>Large vs capped ranges</>],
          [<>Opponent has high nut ratio</>, <><Action variant="bet">Bet small</Action></>, <>Nuts frequency constrains sizing</>],
          [<>Short SPR (&lt;2x pot)</>, <><Action variant="allIn">Prefer jamming</Action></>, <>Checking loses optionality</>]]} />

      <Callout variant="good">When villain's range weakens, your medium-strength hands become the <em>relative nuts</em> → bet for value.</Callout>
      <Callout variant="bad"><strong>Checking converts strong hands into bluff catchers.</strong> IP auto-polarizes — bets hands that beat you, checks hands you beat. You lose value against the entire medium-strength region.</Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"Relative &gt; absolute hand strength"</li>
        <li>"Villain checks back turn = inflection point = your medium hand becomes strong"</li>
        <li>"If you can't check-raise, bet"</li>
        <li>"Block bet OOP = 1/3 pot (forces 75% defense)"</li>
        <li>"When villain is capped, bet large"</li>
      </ul>

      <Subhead>Inflection points weakening villain's range</Subhead>
      <ul>
        <li>Villain checks turn or river → subtracts strong hands</li>
        <li>No flop or turn raising → subtracts sets/2-pair/flushes</li>
        <li>Very small bet sizes → thin value, not nuts</li>
      </ul>

      <Subhead>Sizing</Subhead>
      <p>OOP: small/blocking bets (15–33%). IP: never small bet — pot-sized or over.</p>


    </Section>
  )
}

export default S10Page
