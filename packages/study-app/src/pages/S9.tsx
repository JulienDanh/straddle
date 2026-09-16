import { Section, Callout, Leak, Action, Subhead, DecisionTree, DataTable, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { S9_FLOP_J105, S9_FLOP_T72, S9_FLOP_T52, S9_FLOP_Q62 } from '@poker/design-system/src/data/ranges'

export function S9Page() {
  return (
    <Section title="System 9 — Defending Flops (Calls and Raises)">
      <p>We defended preflop, face flop c-bet. Call, raise, or fold? Primarily BB vs RFI.</p>

      <Leak items={[
      ['Folding bottom pair to small bets', 'bottom pair with a BDFD is a "super pair," worth hundreds of bb/100'],
      ['Not recognizing when all three inputs align (small bet + weak opener + weak hero range)', 'must defend very wide'],
      ['Folding gut shots with BDFDs', 'these are "super gut shots," much more resilient'],
      ['Not differentiating between similar-looking hands', '97♦ (gut shot + BDFD = play) vs 97o (gut shot, double unders = fold vs big bet)'],
      ]} />

      
      <Callout><strong>Weak own range + Weak opponent range + Small bet → defend very wide.</strong></Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"Three inputs: small bet + weak opener + weak hero range = defend wide"</li>
        <li>"Compare hands to themselves — a super gut shot beats a naked gut shot"</li>
        <li>"BDFD &gt; good kicker"</li>
        <li>"High card of the suit &gt; low card"</li>
        <li>"Rainbow = creative defense; two-tone = clean defense"</li>
      </ul>

      <DecisionTree
        root={{
          question: 'What do you hold vs the c-bet?',
          hint: 'Backdoor draws carry the defense',
          branches: [
            {
              label: 'Weak pair + BDFD',
              node: {
                action: <Action variant="call">Call (BDFD)</Action>,
                actionVariant: 'call',
                reason: 'BDFD > good kicker almost always. High Card of suit > low card.',
                boards: [
                  <BoardType cards="Td8h4h" label="T84 — two-tone" variant="green" />,
                  <BoardType cards="Jc9d5d" label="J95 — two-tone" variant="green" />,
                ],
              },
            },
            {
              label: 'Gut shot + BDFD ("super gut shot")',
              node: {
                action: <Action variant="call">Call (super gut shot)</Action>,
                actionVariant: 'call',
                reason: 'Turns combo draws on suit cards. Gut shot + overcard also calls.',
                boards: [
                  <BoardType cards="Jh9c8d" label="J98" variant="green" />,
                  <BoardType cards="Td9s7c" label="T97" variant="green" />,
                ],
              },
            },
            {
              label: 'Ace-high / double overs + BDFD',
              node: {
                action: <Action variant="call">Call (double overs + BDFD)</Action>,
                actionVariant: 'call',
                reason: 'Pure call (vs small bet). 3-straight + 3-flush = call or CR.',
                boards: [
                  <BoardType cards="Kc9h5h" label="K95 — two-tone" variant="green" />,
                  <BoardType cards="Qh7d2d" label="Q72 — two-tone" variant="green" />,
                ],
              },
            },
            {
              label: 'None — naked',
              node: {
                action: <Action variant="fold">Fold (naked)</Action>,
                actionVariant: 'fold',
                reason: 'Naked gut shot (double unders, no BDFD) = fold. Naked high card = fold.',
                boards: [
                  <BoardType cards="Kh7c2d" label="K72" variant="red" />,
                  <BoardType cards="Qh6d3c" label="Q63" variant="red" />,
                ],
              },
            },
          ],
        }}
      />

      <Subhead>Check-raise criteria</Subhead>
      <ul>
        <li>Direct equity vs opponent's top pair (gut shot, overcard)</li>
        <li>Backdoor straight draw potential</li>
        <li>Backdoor flush draw (3-to-flush)</li>
        <li>Opponent missed the board frequently</li>
        <li>Opponent bet small</li>
        <li>High card of suit &gt; low card (blocks linear RFI more effectively)</li>
      </ul>

      <Subhead>Risk factors</Subhead>
      <DataTable columns={[{header:'Factor'},{header:'Effect'}]} rows={[
        [<><strong>Bet sizing</strong></>, <>Scale up → fold more pairs. Q-J/K-J without ♦: call vs 30% → fold vs 83%</>],
        [<><strong>Rainbow vs two-tone</strong></>, <>Rainbow = messier (fewer BDFDs). Two-tone cleaner (flush draws supplement).</>],
        [<><strong>Blind vs blind</strong></>, <>Ranges too wide — never fold pairs (even pocket 4s with BDFD)</>],
      ]} />

      <Subhead>Sizing</Subhead>
      <p>Against 25–33% defend wide; against 50%+ fold bottom of marginal.</p>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<BoardExample
        board="JdTc5h"
        spot="97♦ on J105 (HJ, 60bb)"
        action="Call"
        actionVariant="call"
        solve={S9_FLOP_J105}
      >"Super gut shot" — gut shot + BDFD. Can turn combo draws on diamond turns. 97o is a pure fold; 97♦ is a call.</BoardExample>
      <BoardExample
        board="Td7c2s"
        spot="Q9 with Q♦ on T72 (BTN, 80bb)"
        action="Call"
        actionVariant="call"
        solve={S9_FLOP_T72}
      >Pure play. Overcard to T, BDFD, blocks villain's diamond calls.</BoardExample>
      <BoardExample
        board="Tc5s2d"
        spot="J6♠ on T52 (CO, 60bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S9_FLOP_T52}
      >Direct equity vs T (jack), backdoor straight (6), BDFD (spades). Opponent misses this board a lot.</BoardExample>
      <BoardExample
        board="Qc6h2d"
        spot="JTo on Q62r (BTN, 80bb)"
        action="Fold"
        actionVariant="fold"
        solve={S9_FLOP_Q62}
      >Three-to-straight but no BDFD. Sizing-sensitive — folds vs big bet, calls vs small.</BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S9Page
