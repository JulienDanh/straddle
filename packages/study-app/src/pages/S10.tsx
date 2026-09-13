import { Section, Callout, Action, Collapsible, DataTable, HandExample, BoardExample, ExampleBrowser, Subhead } from '@poker/design-system/src/components/ui'
import { S10_FLOP_J97T9, S10_FLOP_K7222, S10_FLOP_A72 } from '@poker/design-system/src/data/ranges'

export function S10Page() {
  return (
    <Section title="System 10 — River Value Betting">
      <p>River, deciding value bet or check. <strong>Central thesis: absolute strength is irrelevant. Relative strength (vs opponent's range) determines value.</strong></p>

      
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

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<HandExample spot="Set of Js on 957 → 5 turn (EP vs CO, 100bb)" action="Block-bet 1/3" actionVariant="bet">Villain checks back turn = capped. Block-bet small. If you check, villain bets flushes/sets/overpairs (beat you) and checks medium hands (you beat). You lose value.</HandExample>
        <BoardExample
          board="Jh9c7dTh9d"
          spot="AQ on J97 → T → 9 river (EP vs SB, 80bb)"
          action="Bet pot / overbet"
          actionVariant="bet"
          solve={S10_FLOP_J97T9}
        >Villain checked back turn (no Jx, sets, two pair). River 9 blanks. AQ is near relative nuts. Bet pot or overbet.</BoardExample>
        <BoardExample
          board="Kh7c2d2h2s"
          spot="AK on K72 → 2 → 2 river (EP vs BB, 50bb)"
          action="Jam"
          actionVariant="allIn"
          solve={S10_FLOP_K7222}
        >Villain just called flop and turn (no raises). AK is near nuts — villain has no KK, 77, 22 (would raise). Pure jam.</BoardExample>
        <BoardExample
          board="Ah7c2d2h8d"
          spot="88 on A72 → 2 → 8 river (EP vs BB, 50bb)"
          action="Bet large"
          actionVariant="bet"
          solve={S10_FLOP_A72}
        >Villain checks turn and river → capped. 88 is near nuts. Bet big.</BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S10Page
