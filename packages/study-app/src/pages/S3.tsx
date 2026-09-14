import { Section, Callout, Leak, Action, Subhead, DecisionTree, DataTable, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { SB_RFI_CEV, BB_VS_SB_LIMP_CEV, S3_FLOP_K72, S3_FLOP_A42, S3_FLOP_KQ8, S3_FLOP_JJ3 } from '@poker/design-system/src/data/ranges'

export function S3Page() {
  return (
    <Section title="System 3 — BB vs SB Limp Stab · Defending Flops">
      <p>SB limps, BB checks, SB stabs (1bb into ~3.7bb). We defend from BB. Highest-impact scenario — BB win rate determines winner/loser.</p>

      <Leak items={[
      ['Overfolding', 'BB win rate is the most important in all of NLHE (92 points of opportunity); folding too much vs stab = giving money away'],
      ['Defending every BDFD blindly', 'the worst hands with BDFDs still fold (42o with a spade on K72 is a fold)'],
      ['Not identifying the worst hand on the board', 'critical skill'],
      ['Underestimating three-to-a-straight value'],
      ]} />
      <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>

      
      <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>

      <p className="mt-4 mb-1 text-sm text-muted">The preflop shape of this exact spot — SB's first-in decision (the limp) and BB's iso-or-check response, at every stack depth:</p>
      <RangeBrowser ranges={SB_RFI_CEV} />
      <RangeBrowser ranges={BB_VS_SB_LIMP_CEV} />

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"Ace and deuce are not strategically relevant"</li>
        <li>"Double-overs play, double-unders fold, over-unders need help"</li>
        <li>"Three-to-a-straight never folds blind vs blind"</li>
        <li>"Identify the worst hand on the board — if you can't, you can't defend correctly"</li>
        <li>"High card BDFD &gt; low card BDFD"</li>
      </ul>

      <Subhead>Decision: defend or fold more?</Subhead>
      <p>SB bets 1bb into ~3.7bb. Risk/reward = 1/4 ≈ <strong>25% fold</strong>. Defend ~75%. Focus on the 25% you fold.</p>
      <p>Three defending mechanisms: <strong>high-card defending</strong> (A-high pure → J-high starts folding), <strong>three to a straight</strong> (98o, 86o, 65o — pure calls), <strong>backdoor flush draw</strong> (high card of suit &gt; low card).</p>
      <Callout variant="warn"><strong>Ace and Deuce are NOT strategically relevant.</strong> Everything has overcards to deuce / undercards to ace. No over-unders to either. <em>Ignore them.</em> Build strategy around the other board cards.</Callout>

      <DecisionTree
        root={{
          question: 'Is the board paired?',
          yes: {
            action: <Action variant="call">Defend around unpaired</Action>,
            actionVariant: 'call',
            reason: "Paired card unusable. Evaluate around unpaired high card.",
            boards: [
              <BoardType cards="Kh7d7c" label="K77" variant="green" />,
              <BoardType cards="Jh6s6d" label="J66" variant="green" />,
            ],
          },
          no: {
            question: 'Is the key card high (≈8+)?',
            hint: 'Key card = second-highest board card (ignore A and 2)',
            yes: {
              action: <Action variant="call">Defend ~75%</Action>,
              actionVariant: 'call',
              reason: 'Double-overs rare and valuable → rarely fold.',
              boards: [
                <BoardType cards="KdQh8c" label="KQ8 (key=8)" variant="green" />,
                <BoardType cards="Qc8d3h" label="Q83 (key=8)" variant="green" />,
              ],
            },
            no: {
              action: <Action variant="fold">Fold more</Action>,
              actionVariant: 'fold',
              reason: 'Double-overs common. Over-unders (73, 83, 93) fold. BDFD can rescue non-worst.',
              boards: [
                <BoardType cards="Ah4d2c" label="A42 (key=4)" variant="orange" />,
                <BoardType cards="Kh6d2c" label="K62 (key=6)" variant="orange" />,
              ],
            },
          },
        }}
      />

      <Subhead>Classify around the key card</Subhead>
      <DataTable columns={[{header:'Category'},{header:'Definition'},{header:'Playability'}]} rows={[
        [<><strong>Double Overs</strong></>, 'Both above key card', 'Easy play (high key card = rare; low = may fold)'],
        [<><strong>Over-under</strong></>, 'One over, one under', 'Sensitive — worst hands. BDFD often needed.'],
        [<><strong>Double unders</strong></>, 'Both below', 'Often fold — unless gut shots / 3-straight'],
      ]} />
      <Callout variant="bad"><strong>BDFD is not always enough.</strong> Identify the <em>worst</em> hand on the board first. Even with BDFD, the worst hands (42s on K77) still fold.</Callout>

      <Subhead>Preflop asymmetry & Sizing</Subhead>
      <Callout>SB has a folding range; BB does not. 2x/3x favor BB. BB checking = capped (no AK/AQ/overpairs). SB has advantage on Broadway boards; BB on low boards.</Callout>
      <p>1bb stab into ~3.7bb pot.</p>

      <Subhead>Examples</Subhead>

      <p>The system applied — pick a board on the left (70bb limped pot: SB limps, BB checks). The SB's stab varies with the board — 1.5bb (50% pot) usually, a big 3.9bb (130% pot) on KQ8 — and so does its frequency.</p>

      <ExampleBrowser>
      <BoardExample
        board="Ks7s2h"
        spot="K72 two-tone (high card)"
        action="Defend (high card)"
        actionVariant="call"
        solve={S3_FLOP_K72}
      >
        Key card = K (paired 7 is unusable). High card defending: defend all ace highs, then queen highs. 32o is a fold.
      </BoardExample>

      <BoardExample
        board="Ah4h2s"
        spot="A42 two-tone (gut shots)"
        action="Defend (gut shots)"
        actionVariant="call"
        solve={S3_FLOP_A42}
      >
        Key card = 4. All 3x and 5x are pure calls (gut shots). Worst hands contain a 7 (97, T7). J9 with a heart is pure play.
      </BoardExample>

      <BoardExample
        board="KcQh8d"
        spot="KQ8 rainbow (double-unders fold)"
        action="Fold double-unders"
        actionVariant="fold"
        solve={S3_FLOP_KQ8}
      >
        Key card = 8. Double-unders (65, 54, 53) = pure folds. 97 with three-to-straight = pure play. All BDFDs playable (scarce).
      </BoardExample>

      <BoardExample
        board="JsJh3c"
        spot="JJ3 two-tone (straights)"
        action="Defend (straights)"
        actionVariant="call"
        solve={S3_FLOP_JJ3}
      >
        Key card = 3 (very low). Anything with a deuce = death sentence. T9 with three-to-straight = pure play.
      </BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S3Page
