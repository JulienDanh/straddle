import { Section, Callout, Leak, Action, Subhead, DecisionTree, HandExample, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { S12_FLOP_842, S12_FLOP_K84, S12_FLOP_984 } from '@poker/design-system/src/data/ranges'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_VS_3BET_HJ_CEV, UTG_VS_3BET_BTN_CEV, UTG_VS_3BET_BB_CEV } from '@poker/design-system/src/data/ranges'

export function S12Page() {
  return (
    <Section title="System 12 — Defending 3-Bets OOP">
      <p>RFI, face 3-bet, call, OOP on flop. EP open, HJ/BTN 3-bets, we call.</p>

      <Leak items={[
      ['Over-defending pocket pairs on ace/king high', '77, 88, 99 look playable but are heavy folds'],
      ['Over-defending ace-high with BDFD', 'AJs with BDFD is worth zero on AJ4 vs a 3-bet'],
      ['Under-defending low boards', 'folding pairs and high cards that are actually profitable'],
      ['Applying MDF blindly', "the 3-bettor's range is too strong on high boards for basic MDF to work"],
      ]} />

      
      <Callout variant="bad"><strong>Key thesis:</strong> 3-bettor is ahead preflop.

<p className="mt-6 mb-1 text-sm text-muted">The preflop shape of this exact spot — UTG's 2bb open facing a 3-bet from HJ, BTN, and the BB, with the call and 4-bet options (at 20bb the 4-bet collapses to a pure jam). Toggle cEV / ICM and step depths to watch the defense tighten on the bubble:</p>
      <RangeBrowser ranges={UTG_VS_3BET_HJ_CEV} />
      <RangeBrowser ranges={UTG_VS_3BET_BTN_CEV} />
      <RangeBrowser ranges={UTG_VS_3BET_BB_CEV} /> High boards favor them; low boards favor caller. <em>Fold far more than MDF on high boards; defend robustly on low.</em></Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"T-high+: be nitty. 9-: be gangster."</li>
        <li>"Ace and king high = danger zone — fold heavily"</li>
        <li>"MDF doesn't apply normally on high boards vs 3-bets"</li>
        <li>"Low boards = defend wide, be sticky"</li>
        <li>"If neither player hits the board, the preflop favorite wins"</li>
      </ul>

      <DecisionTree
        root={{
          question: 'Is the board A-high or K-high?',
          yes: {
            action: <Action variant="fold">Fold 50%+</Action>,
            actionVariant: 'fold',
            reason: 'Extreme caution. Fold 77/88/99, BDFDs — all folds. Most over-defended.',
            boards: [
              <BoardType cards="AhJd5c" label="AJ5" variant="red" />,
              <BoardType cards="Kh9s2d" label="K92" variant="red" />,
            ],
          },
          no: {
            question: 'Broadway? (Q-J-T high)',
            yes: {
              action: <Action variant="fold">Fold 50%+</Action>,
              actionVariant: 'fold',
              reason: 'Tight / fit-or-fold. Far above MDF (~20–25%).',
              boards: [
                <BoardType cards="Qc9d5s" label="Q95" variant="red" />,
                <BoardType cards="Jh8s3d" label="J83" variant="red" />,
                <BoardType cards="Td7c2h" label="T72" variant="red" />,
              ],
            },
            no: {
              question: 'Low board. Risk factors?',
              hint: 'Paired (minor) · Disconnected (significant) · Deuce present',
              yes: {
                action: <Action variant="call">Defend (elevated fold)</Action>,
                actionVariant: 'call',
                reason: 'Paired = minor; disconnected = significant (want straights). Deuce favors 3-bettor.',
                boards: [
                  <BoardType cards="9h9c4d" label="994 paired" variant="orange" />,
                  <BoardType cards="9c6d2h" label="Low · disconnected" variant="orange" />,
                ],
              },
              no: {
                action: <Action variant="call">Defend near MDF (~25%)</Action>,
                actionVariant: 'call',
                reason: 'Low boards favor caller. Call pairs, gut shots, BDFDs, 3-straight/flush.',
                boards: [
                  <BoardType cards="9h5d3c" label="953" variant="green" />,
                  <BoardType cards="9c8d6h" label="986 connected" variant="green" />,
                ],
              },
            },
          },
        }}
      />

      <Subhead>Common mistakes</Subhead>
      <ol>
        <li><strong>Over-defending preflop range</strong> — must fold the bottom.</li>
        <li><strong>Over-defending weak pairs/draws on A/K-high</strong> — pocket 7s/8s/9s, BDFDs are all folds.</li>
        <li><strong>Over-folding high card hands on low boards</strong> — K-J with BDFD, A-T with 3-straight are calls.</li>
      </ol>

      <Subhead>Sizing</Subhead>
      <p>Against 20–25% on high boards fold 50%+; against 33% on low boards fold ~27%.</p>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<BoardExample
        board="8c4h2d"
        spot="AJs on 842 (EP vs HJ 3-bet)"
        action="Fold"
        actionVariant="fold"
        solve={S12_FLOP_842}
      >Two low cards help, but AJs is still worth zero vs a tight 3-bet range.</BoardExample>
        <BoardExample
        board="Kc8h4d"
        spot="77 on K84r (EP vs BTN 3-bet)"
        action="Fold"
        actionVariant="fold"
        solve={S12_FLOP_K84}
      >King-high = danger zone. 77, 66, 55 = heavy folds. Even TT mixes to fold.</BoardExample>
        <BoardExample
        board="9h8d4c"
        spot="55 on 984 (EP 3-bet caller)"
        action="Call"
        actionVariant="call"
        solve={S12_FLOP_984}
      >Low board = favorable. 55 is worth 100+ bb/100. Defend gut shots, KQs with BDFD.</BoardExample>
      <HandExample spot="44 on 963 (EP vs BTN 3-bet, jam)" action="Call" actionVariant="call">Neither player hits this board. 44 is pure call. Pair vs pair, we're ahead often enough.</HandExample>
        <HandExample spot="AQo on 752 (EP vs BTN 3-bet, 25bb)" action="Call / shove" actionVariant="raise">AQ is worth 186 bb/100. Low board = hero is resilient.</HandExample>
      </ExampleBrowser>
      <p className="mt-3 mb-1 text-sm text-muted">Walk-tagged boards have no solved spot (jam / 25bb lines are not in the 40bb capture set).</p>
    </Section>
  )
}

export default S12Page
