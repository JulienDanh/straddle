import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree, HandExample } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S12Page() {
  return (
    <Section title="System 12 \u2014 Defending 3-Bets OOP">
      <p>RFI, face 3-bet, call, OOP on flop. EP open, HJ/BTN 3-bets, we call.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="bad"><strong>Key thesis:</strong> 3-bettor is ahead preflop. High boards favor them; low boards favor caller. <em>Fold far more than MDF on high boards; defend robustly on low.</em></Callout>

              <Callout variant="warn"><strong>Common Leaks:</strong> Over-defending pocket pairs on ace/king high — 77, 88, 99 look playable but are heavy folds. Over-defending ace-high with BDFD — AJs with BDFD is worth zero on AJ4 vs a 3-bet. Under-defending low boards — folding pairs and high cards that are actually profitable. Applying MDF blindly — the 3-bettor's range is too strong on high boards for basic MDF to work.</Callout>

                            <Collapsible title="Heuristics">
                <ul>
                  <li>"T-high+: be nitty. 9-: be gangster."</li>
                  <li>"Ace and king high = danger zone — fold heavily"</li>
                  <li>"MDF doesn't apply normally on high boards vs 3-bets"</li>
                  <li>"Low boards = defend wide, be sticky"</li>
                  <li>"If neither player hits the board, the preflop favorite wins"</li>
                </ul>
              </Collapsible>

              <DecisionTree
                root={{
                  question: 'Is the board A-high or K-high?',
                  yes: {
                    action: <Action variant="fold">Fold 50%+</Action>,
                    actionVariant: 'fold',
                    reason: 'Extreme caution. Fold 77/88/99, BDFDs — all folds. Most over-defended.',
                    boards: [
                      <RandomBoard high="A" variant="red" />,
                      <RandomBoard high="K" variant="red" />,
                    ],
                  },
                  no: {
                    question: 'Broadway? (Q-J-T high)',
                    yes: {
                      action: <Action variant="fold">Fold 50%+</Action>,
                      actionVariant: 'fold',
                      reason: 'Tight / fit-or-fold. Far above MDF (~20–25%).',
                      boards: [
                        <RandomBoard high="Q" variant="red" />,
                        <RandomBoard high="J" variant="red" />,
                        <RandomBoard high="T" variant="red" />,
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
                          <RandomBoard high="9" paired variant="orange" />,
                          <RandomBoard high="9" variant="orange" label="Low · disconnected" />,
                        ],
                      },
                      no: {
                        action: <Action variant="call">Defend near MDF (~25%)</Action>,
                        actionVariant: 'call',
                        reason: 'Low boards favor caller. Call pairs, gut shots, BDFDs, 3-straight/flush.',
                        boards: [
                          <RandomBoard high="9" variant="green" />,
                          <RandomBoard high="9" connected variant="green" />,
                        ],
                      },
                    },
                  },
                }}
              />

              <Collapsible title="Common mistakes">
                <ol>
                  <li><strong>Over-defending preflop range</strong> — must fold the bottom.</li>
                  <li><strong>Over-defending weak pairs/draws on A/K-high</strong> — pocket 7s/8s/9s, BDFDs are all folds.</li>
                  <li><strong>Over-folding high card hands on low boards</strong> — K-J with BDFD, A-T with 3-straight are calls.</li>
                </ol>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Against 20–25% on high boards fold 50%+; against 33% on low boards fold ~27%.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Examples',
          content: (
            <>
<HandExample spot="AJs on 842 (EP vs HJ 3-bet, 20% c-bet)" action="Fold" actionVariant="fold">Two low cards help, but AJs is still worth zero vs a tight 3-bet range.</HandExample>
                <HandExample spot="77 on K84r (EP vs BTN 3-bet, 20%)" action="Fold" actionVariant="fold">King-high = danger zone. 77, 66, 55 = heavy folds. Even TT mixes to fold.</HandExample>
                <HandExample spot="55 on 984 (EP 3-bet caller, 33% c-bet)" action="Call" actionVariant="call">Low board = favorable. 55 is worth 100+ bb/100. Defend gut shots, KQs with BDFD.</HandExample>
                <HandExample spot="44 on 963 (EP vs BTN 3-bet, jam)" action="Call" actionVariant="call">Neither player hits this board. 44 is pure call. Pair vs pair, we're ahead often enough.</HandExample>
                <HandExample spot="AQo on 752 (EP vs BTN 3-bet, 25bb)" action="Call / shove" actionVariant="raise">AQ is worth 186 bb/100. Low board = hero is resilient.</HandExample>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 12 \u2014 Defending 3-Bets OOP — Practice"
              quiz={{
                options: [
                  { label: 'Fold 50%+ (high board)', variant: 'fold' },
                  { label: 'Defend near MDF (low board)', variant: 'call' },
                ],
                scenarios: [
                  { board: { high: 'A', variant: 'red' }, correct: { label: 'Fold 50%+ (high board)', variant: 'fold' }, explanation: 'A-high = extreme caution. Highest fold%. Fold 77/88/99, BDFDs — all folds. Most over-defended board type.' },
                  { board: { high: 'K', variant: 'red' }, correct: { label: 'Fold 50%+ (high board)', variant: 'fold' }, explanation: 'K-high = extreme caution. 3-bettor is ahead preflop; high boards favor them.' },
                  { board: { high: 'Q', variant: 'red' }, correct: { label: 'Fold 50%+ (high board)', variant: 'fold' }, explanation: 'Broadway (Q-J-T high) = tight / fit-or-fold. Far above MDF (~20-25%).' },
                  { board: { high: 'J', variant: 'red' }, correct: { label: 'Fold 50%+ (high board)', variant: 'fold' }, explanation: 'J-high Broadway = fit-or-fold. Fold far more than MDF.' },
                  { board: { high: '9', variant: 'green' }, correct: { label: 'Defend near MDF (low board)', variant: 'call' }, explanation: 'Low boards favor caller. Call pairs, gut shots, BDFDs, 3-straight/flush. K-J with BDFD, A-T 3-straight are calls.' },
                  { board: { high: '9', connected: true, variant: 'green' }, correct: { label: 'Defend near MDF (low board)', variant: 'call' }, explanation: 'Low connected → call near MDF (~25%). Low boards favor caller. Don\'t over-fold high cards.' },
                  { board: { high: '9', paired: true, variant: 'orange' }, correct: { label: 'Defend near MDF (low board)', variant: 'call' }, explanation: 'Low paired = defend with elevated fold. Paired is minor risk; disconnected is significant.' },
                ],
              }}
              questions={[
                { question: 'What is the key thesis of System 12?', options: ['3-bettor is ahead preflop; fold far more than MDF on high, defend on low', 'Always defend MDF', '3-bettor is behind', 'Call everything'], correct: 0, explanation: '3-bettor is ahead preflop. High boards favor them; low boards favor caller. Fold far more than MDF on high; defend robustly on low.' },
                { question: 'What do you do on A-high or K-high boards?', options: ['Fold 50%+ (extreme caution)', 'Defend MDF', 'Call everything', 'Shove'], correct: 0, explanation: 'A-high or K-high = extreme caution. Fold 77/88/99, BDFDs — all folds. Highest fold%, most over-defended.' },
                { question: 'What do you do on low boards (9-high and below)?', options: ['Defend near MDF (~25%) — call pairs, gut shots, BDFDs', 'Fold everything', 'Only call sets', 'Check-raise all'], correct: 0, explanation: 'Low boards favor caller. Call pairs, gut shots, BDFDs, 3-straight/flush. K-J with BDFD, A-T 3-straight are calls.' },
                { question: 'What is the common mistake on high boards?', options: ['Over-defending weak pairs/draws (77/88/99, BDFDs are folds)', 'Folding too much', 'Not calling enough', 'Betting too small'], correct: 0, explanation: 'Over-defending weak pairs/draws on A/K-high. Pocket 7s/8s/9s, BDFDs are all folds.' },
                { question: 'What is the common mistake on low boards?', options: ['Over-folding high card hands (K-J with BDFD, A-T 3-straight are calls)', 'Calling too much', 'Not shoving enough', 'Folding pairs'], correct: 0, explanation: 'Over-folding high card hands on low boards. K-J with BDFD, A-T with 3-straight are calls.' },
                { question: 'What sizing determines fold frequency on low boards?', options: ['Against 33% fold ~27%; against 20% on high fold 50%+', 'Always fold 50%', 'Always defend MDF', 'Bet size does not matter'], correct: 0, explanation: 'Against 20-25% on high boards fold 50%+; against 33% on low boards fold ~27%.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S12Page
