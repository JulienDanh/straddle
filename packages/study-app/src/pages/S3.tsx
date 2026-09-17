import { Section, Callout, Leak, Action, Subhead, DecisionTree, DataTable, BoardType } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { SB_RFI_CEV, BB_VS_SB_LIMP_CEV } from '@poker/design-system/src/data/ranges'

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


    </Section>
  )
}

export default S3Page
