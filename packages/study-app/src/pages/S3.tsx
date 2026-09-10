import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree, DataTable, HandExample } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S3Page() {
  return (
    <Section title="System 3 — BB vs SB Limp Stab · Defending Flops">
      <p>SB limps, BB checks, SB stabs (1bb into ~3.7bb). We defend from BB. Highest-impact scenario — BB win rate determines winner/loser.</p>
      <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>

              <Callout variant="warn"><strong>Common Leaks:</strong> Overfolding — BB win rate is the most important in all of NLHE (92 points of opportunity). Folding too much vs stab = giving money away. Defending every BDFD blindly — the worst hands with BDFDs still fold (42o with a spade on K72 is a fold). Not identifying the worst hand on the board — critical skill. Underestimating three-to-a-straight value.</Callout>

                            <Collapsible title="Heuristics">
                <ul>
                  <li>"Ace and deuce are not strategically relevant"</li>
                  <li>"Double-overs play, double-unders fold, over-unders need help"</li>
                  <li>"Three-to-a-straight never folds blind vs blind"</li>
                  <li>"Identify the worst hand on the board — if you can't, you can't defend correctly"</li>
                  <li>"High card BDFD &gt; low card BDFD"</li>
                </ul>
              </Collapsible>

              <h3>Decision: defend or fold more?</h3>
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
                      <RandomBoard high="K" paired label="K77" variant="green" />,
                      <RandomBoard high="J" paired label="J66" variant="green" />,
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
                        <RandomBoard high="K" label="KQ8 (key=8)" variant="green" />,
                        <RandomBoard high="Q" label="Q83 (key=8)" variant="green" />,
                      ],
                    },
                    no: {
                      action: <Action variant="fold">Fold more</Action>,
                      actionVariant: 'fold',
                      reason: 'Double-overs common. Over-unders (73, 83, 93) fold. BDFD can rescue non-worst.',
                      boards: [
                        <RandomBoard high="A" label="A42 (key=4)" variant="orange" />,
                        <RandomBoard high="K" label="K62 (key=6)" variant="orange" />,
                      ],
                    },
                  },
                }}
              />

              <Collapsible title="Classify around the key card">
                <DataTable columns={[{header:'Category'},{header:'Definition'},{header:'Playability'}]} rows={[
                  [<><strong>Double Overs</strong></>, 'Both above key card', 'Easy play (high key card = rare; low = may fold)'],
                  [<><strong>Over-under</strong></>, 'One over, one under', 'Sensitive — worst hands. BDFD often needed.'],
                  [<><strong>Double unders</strong></>, 'Both below', 'Often fold — unless gut shots / 3-straight'],
                ]} />
                <Callout variant="bad"><strong>BDFD is not always enough.</strong> Identify the <em>worst</em> hand on the board first. Even with BDFD, the worst hands (42s on K77) still fold.</Callout>
              </Collapsible>

              <Collapsible title="Preflop asymmetry & Sizing">
                <Callout>SB has a folding range; BB does not. 2x/3x favor BB. BB checking = capped (no AK/AQ/overpairs). SB has advantage on Broadway boards; BB on low boards.</Callout>
                <p>1bb stab into ~3.7bb pot.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Examples',
          content: (
            <>
<HandExample spot="K72 two-tone, 70bb" action="Defend (high card)" actionVariant="call">Key card = K (paired 7 is unusable). High card defending: defend all ace highs, then queen highs. 32o is a fold.</HandExample>
                <HandExample spot="A42 two-tone, 70bb" action="Defend (gut shots)" actionVariant="call">Key card = 4. All 3x and 5x are pure calls (gut shots). Worst hands contain a 7 (97, T7). J9 with a heart is pure play.</HandExample>
                <HandExample spot="KQ8 rainbow" action="Fold double-unders" actionVariant="fold">Key card = 8. Double-unders (65, 54, 53) = pure folds. 97 with three-to-straight = pure play. All BDFDs playable (scarce).</HandExample>
                <HandExample spot="JJ3 two-tone" action="Defend (straights)" actionVariant="call">Key card = 3 (very low). Anything with a deuce = death sentence. T9 with three-to-straight = pure play.</HandExample>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 3 — Practice"
              quiz={{
                options: [
                  { label: 'Defend ~75%', variant: 'call' },
                  { label: 'Fold more', variant: 'fold' },
                ],
                scenarios: [
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'High key card (8) → double-overs rare and valuable. Rarely fold. (KQ8-type: key=8, high.)' },
                  { board: { high: 'Q', variant: 'green' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'High key card (8) → double-overs rare. Defend wide. Worst = double-unders to key card.' },
                  { board: { high: 'A', lowCard: 4, variant: 'orange' }, correct: { label: 'Fold more', variant: 'fold' }, explanation: 'Low key card (4) → double-overs common → fold more. Over-unders (73, 83, 93) fold.' },
                  { board: { high: 'K', lowCard: 6, variant: 'orange' }, correct: { label: 'Fold more', variant: 'fold' }, explanation: 'Low key card (6) → double-overs common → fold more. Worst = over-unders to 6.' },
                  { board: { high: 'K', paired: true, variant: 'orange' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'Paired board → organize around the unpaired high card. High-card defending dominates.' },
                  { board: { high: 'J', paired: true, variant: 'orange' }, correct: { label: 'Defend ~75%', variant: 'call' }, explanation: 'Paired board → evaluate around the unpaired high card (J). Overcards to J (A/Q/K-high) pure, undercards (T-high and below) start folding.' },
                ],
              }}
              questions={[
                { question: 'What is the fold target for SB 1bb stabs?', options: ['~25% (1/4)', '~50%', '~10%', '~75%'], correct: 0, explanation: 'SB bets 1bb into ~3.7bb. Risk/reward = 1/4 ≈ 25% fold. Defend ~75%.' },
                { question: 'Which board cards should you IGNORE strategically?', options: ['The ace and the deuce', 'The highest card', 'The lowest card', 'The middle card'], correct: 0, explanation: 'Ace and deuce are not strategically relevant. Everything has over/undercards to them. Ignore them.' },
                { question: 'What determines whether you defend wide or fold more?', options: ['The key card (second-highest) — high vs low', 'Whether the board is paired', 'The suit', 'Your stack depth'], correct: 0, explanation: 'High key card (8) → double-overs rare → defend ~75%. Low key card (5) → double-overs common → fold more.' },
                { question: 'What are the three defending mechanisms?', options: ['High-card defending, 3-straight, BDFD', 'Check-raise, donk-lead, call', 'Fold, call, raise', 'Value, bluff, trap'], correct: 0, explanation: 'High-card defending (A-high pure → J-high folds), three to a straight (98/86/65 pure), backdoor flush draw (high card > low).' },
                { question: 'What is the worst hand category on low key-card boards?', options: ['Over-unders (73, 83, 93)', 'Double-overs', 'Paired hands', 'Suited connectors'], correct: 0, explanation: 'Over-unders to a low key card are the worst — fold unless BDFD rescues them.' },
                { question: 'Why is BB defense the highest-impact scenario?', options: ['92 points of opportunity (−112 → −20 bb/100)', 'It happens most often', 'It has the biggest pots', 'UTG has no edge'], correct: 0, explanation: 'Skilled BB goes from −112 bb/100 (walk-away) to −20. UTG only has 27 points. BB skill is definitively most important.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S3Page
