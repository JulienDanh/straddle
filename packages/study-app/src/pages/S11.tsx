import { Section, Callout, H, Collapsible, DataTable, HandExample, BoardExample, ExampleBrowser, Subhead } from '@poker/design-system/src/components/ui'
import { S11_FLOP_A732K } from '@poker/design-system/src/data/ranges'

export function S11Page() {
  return (
    <Section title="System 11 — Hero Calling">
      <p>Face river bet with bluff catcher. Call or fold? Systematically differentiating between bluff catchers.</p>

      
      <h3>Good vs bad bluff catchers</h3>
      <DataTable columns={[{ header: 'Attribute' }, { header: 'Good' }, { header: 'Bad' }]} rows={[[<>Blocks value</>, <>King (blocks KK, KQ)</>, <>8/9 (blocks nothing valuable)</>],
          [<>Unblocks bluffs</>, <>4, 3, deuce</>, <>8, 9, T (blocks offsuit opens)</>]]} />

      <Callout>Value range <em>wide</em> → focus on unblocking bluffs. <em>Narrow</em> → focus on blocking value.</Callout>
      <Callout variant="warn"><strong>Preflop awareness:</strong> BTN opens suited 5+ and offsuit 8+. 4-x/3-x <em>unblock</em> bluffs (not opened); 8-x/9-x <em>block</em> bluffs (opened).</Callout>

      <Callout variant="warn"><strong>Common Leaks:</strong> Treating all bluff catchers as equal — some are worth 27% of the pot, others are worth zero. Not thinking about villain's preflop range — it determines which cards block bluffs vs value. Calling with hands that block villain's bluffs — you make it harder for them to fold. Not recognizing when villain's range is imbalanced (too much value, no bluffs) — fold.</Callout>

                    <Collapsible title="Heuristics">
        <ul>
          <li>"Not all bluff catchers are equal — some are worth a lot, some are worth zero"</li>
          <li>"Block value, unblock bluffs"</li>
          <li>"Focus on what to AVOID, not what to call with"</li>
          <li>"Preflop range determines which cards matter"</li>
          <li>"Turn check = inflection point = call wider"</li>
        </ul>
      </Collapsible>

      <Collapsible title="Three keys">
        <DataTable columns={[{ header: '#' }, { header: 'Key' }, { header: 'Description' }]} rows={[[<>1</>, <><strong>Range awareness</strong></>, <>Know what combos you arrive with</>],
          [<>2</>, <><strong>Unblock bluffs</strong></>, <>Prefer hands that don't block opponent's bluffing region</>],
          [<>3</>, <><strong>Block value</strong></>, <>Prefer hands that block opponent's value region</>]]} />
      </Collapsible>

      <Collapsible title="Core principle">
        <Callout><strong>Opponent's required bluff frequency = your pot odds.</strong> Need 25% → they must bluff 25% of betting range. If balanced → worst callable = worth 0. But <em>better</em> bluff catchers = worth significant EV.</Callout>
      </Collapsible>

      <Collapsible title="Exceptions">
        <ul>
          <li><strong>No natural bluffs:</strong> if no draws missed, opponent won't convert Ax to bluff → fold even if MDF says call.</li>
          <li><strong>Check-raise opportunity:</strong> if opponent bets too small IP (1/3 pot, thin value), CR second pair can fold better + call worse. Modest CR (to ~25bb) can get hands you beat to call (KQ, QJ) and hands that beat you to fold (A-3/4/5<H>♥</H>).</li>
        </ul>
      </Collapsible>

      <Collapsible title="Sizing">
        <p>No explicit sizing — it's a call/fold decision.</p>
      </Collapsible>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<HandExample spot="A3♥ on A972K (EP, 4-way, 1/3 bet)" action="Check-raise" actionVariant="raise">Villain's small bet = thin value (KQ, QJ) or A3-A5♥. CR folds A3-A5♥, calls KQ/QJ.</HandExample>
        <HandExample spot="A9s on 9642A (4-way, 7bb into 28bb)" action="Fold" actionVariant="fold">No natural bluffs in villain's range. They need 25% bluffs — no suited connectors called multi-way. Range is all value.</HandExample>
        <BoardExample
          board="Ah7c3d2hKs"
          spot="K7 on A73 2 K (BTN vs BB, 1/2 pot)"
          action="Call"
          actionVariant="call"
          solve={S11_FLOP_A732K}
        >Villain checked turn → no AK, AQ, sets. K7 blocks KX value, unblocks 8x/9x bluffs. 87 is a bad call (blocks 8x bluffs).</BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S11Page
