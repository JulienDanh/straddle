import { Section, Callout, Leak, Action, Subhead, DecisionTree, HandExample, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { S4_FLOP_AK4 } from '@poker/design-system/src/data/ranges'

export function S4Page() {
  return (
    <Section title="System 4 — Missed River Bluffs">
      <p>Hero opened, BB called, betting river as bluff after missing. Two-system approach. <strong>Prioritize System 1</strong> (easier) while acknowledging System 2 (solvers use it more).</p>

      <Leak items={[
      ["Waiting for the perfect blocker and never bluffing", "if you can't have the ideal hand, bluff with what you have"],
      ['Not having a bluffing range at all', 'checking every weak hand means your value bets lose fold equity'],
      ['Bluffing with hands too high up', 'the opportunity cost of checking is too high'],
      ['Only considering one suit for blocker effects', 'must consider how villain calls AND folds by suit'],
      ]} />

      
      <DecisionTree
        root={{
          question: 'Is there a 3-flush on the river?',
          hint: 'Monotone board — obvious blocking effect',
          yes: {
            action: <Action variant="raise">Bluff (System 2)</Action>,
            actionVariant: 'raise',
            reason: 'One card of the flush suit blocks flushes AND hero calls. Use System 2 first.',
            boards: [
              <BoardType cards="Kh9h5h8d3c" label="3-flush on board" variant="green" />,
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
                <BoardType cards="AhKdQh8s3c" label="Three Broadway · EP" variant="green" />,
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
                  <BoardType cards="AhJh9c7d4s" label="Busted straight + flush" variant="red" />,
                ],
              },
              no: {
                action: <Action variant="bet">Bluff (System 1)</Action>,
                actionVariant: 'bet',
                reason: 'Wide ranges, no obvious suit blanked. Bluff weakest hands first; prioritize the LOW card.',
                boards: [
                  <BoardType cards="Ah9c6d4s2h" label="A-high" variant="green" />,
                  <BoardType cards="Kd8s5c3h2s" label="K-high" variant="green" />,
                ],
              },
            },
          },
        }}
      />

      <Callout>Low cards have good blocking effects vs linear ranges (deuce blocks few value, unblocks folds — opponents folded 2x preflop).</Callout>

      <Subhead>The two systems</Subhead>
      <p><strong>System 1 — bottom of range up:</strong> bluff with <em>weakest</em> hands first — lowest EV when checking, lowest opportunity cost. Heuristic: prioritize the <em>lowest card</em> in the hand. 72o before 65o. 92o before 87o.</p>
      <p><strong>System 2 — blocking effects:</strong> bluff with combos that <strong>block opponent's calls/raises</strong> and <strong>unblock their folds</strong>. Very difficult to manage all three — System 1 is default.</p>

      <Subhead>Key blocking patterns</Subhead>
      <ul>
        <li><strong>3-flush river:</strong> bluff with one card of the flush suit. Blocks flushes AND hero calls.</li>
        <li><strong>Two-tone flop called:</strong> opponent called with 2 suits. Bluff avoiding those; prefer others.</li>
        <li><strong>High card vs low card of suit:</strong> high card heart is <em>worse</em> (blocks more folds). Low card heart less damaging.</li>
      </ul>
      <Callout variant="bad"><strong>You can't always have the ideal bluff.</strong> If hearts bet flop+turn, you <em>won't have hearts left</em> on river. Don't wait for the perfect blocker — you'll have <em>no</em> bluffing range.</Callout>

      <Subhead>Sizing</Subhead>
      <p>~65% pot for river bluffs.</p>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"Bluff from the bottom of the range up"</li>
        <li>"Pay attention to the lowest card in your hand, not the highest"</li>
        <li>"If you have value, you need bluffs"</li>
        <li>"Three Broadway = no offsuit air = bluff aggressively"</li>
        <li>"How should you NOT bluff? — easier to identify what to avoid"</li>
        <li>"Don't wait for the perfect blocker — it's not realistic"</li>
      </ul>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<BoardExample
  board="AhKh4c7d9s"
  spot="86o on AK4 two-tone (BB vs SB, river)"
  action="Bluff"
  actionVariant="bet"
  solve={S4_FLOP_AK4}
>System 1 — bottom of range, bluff. Avoid clubs and hearts (villain calls with both). Pure bluff.</BoardExample>
        <HandExample spot="75o with 7♣ on Q106cc → Tc river" action="Bluff (one-club)" actionVariant="bet">One-club bias (System 2). Board 3-flushed — obvious suit to block. Without a club = check.</HandExample>
        <HandExample spot="J9s on AKQ J T board (EP vs CO)" action="Bluff" actionVariant="bet">Three Broadway — no offsuit air in EP range. Bluffs are scarce. System 1 overrides System 2.</HandExample>
        <HandExample spot="82s on Q106 → J → A river (BB vs SB)" action="Bluff" actionVariant="bet">2x combos are ideal System 2 bluffs — villain folded 2x preflop, so having a deuce unblocks their folding range.</HandExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S4Page
