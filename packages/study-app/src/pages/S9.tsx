import { Section, Callout, Action, RandomBoard, BoardTable, Tabs, Collapsible } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S9Page() {
  return (
    <Section title="System 9 \u2014 Defending Flops (Calls and Raises)">
      <p>We defended preflop, face flop c-bet. Call, raise, or fold? Primarily BB vs RFI.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout><strong>Weak own range + Weak opponent range + Small bet \u2192 defend very wide.</strong></Callout>
              
                      <h3>Board types and actions</h3>
                      <BoardTable rows={[
                        { boards: [<RandomBoard high="T" suit="two-tone" variant="green" />, <RandomBoard high="J" suit="two-tone" variant="green" />], action: <Action variant="call">Call (BDFD)</Action>, note: "Bottom/weak pair + BDFD = call. BDFD &gt; good kicker almost always. High Card of suit &gt; low card." },
                        { boards: [<RandomBoard high="J" connected variant="green" />, <RandomBoard high="T" connected variant="green" />], action: <Action variant="call">Call ("super gut shot")</Action>, note: "Gut shot + BDFD = super gut shot. Turns combo draws on suit cards. Gut shot + overcard also calls." },
                        { boards: [<RandomBoard high="K" variant="green" />, <RandomBoard high="Q" variant="green" />], action: <Action variant="call">Call (double overs + BDFD)</Action>, note: "Ace-high + BDFD = pure call (vs small bet). Double overs + BDFD = pure call. 3-straight + 3-flush = call or CR." },
                        { boards: [<RandomBoard high="K" variant="red" />, <RandomBoard high="Q" variant="red" />], action: <Action variant="fold">Fold (naked)</Action>, note: "Naked gut shot (double unders, no BDFD) = fold. Naked high card (no BDFD, no 3-straight) = fold." },
                      ]} />
              
                      <Collapsible title="Check-raise criteria">
              <ul>
                        <li>Direct equity vs opponent's top pair (gut shot, overcard)</li>
                        <li>Backdoor straight draw potential</li>
                        <li>Backdoor flush draw (3-to-flush)</li>
                        <li>Opponent missed the board frequently</li>
                        <li>Opponent bet small</li>
                        <li>High card of suit &gt; low card (blocks linear RFI more effectively)</li>
                      </ul>
              </Collapsible><Collapsible title="Risk factors">
              <table>
                        <tr><th>Factor</th><th>Effect</th></tr>
                        <tr><td><strong>Bet sizing</strong></td><td>Scale up \u2192 fold more pairs. Q-J/K-J without \u2666: call vs 30% \u2192 fold vs 83%</td></tr>
                        <tr><td><strong>Rainbow vs two-tone</strong></td><td>Rainbow = messier (fewer BDFDs). Two-tone cleaner (flush draws supplement).</td></tr>
                        <tr><td><strong>Blind vs blind</strong></td><td>Ranges too wide \u2014 never fold pairs (even pocket 4s with BDFD)</td></tr>
                      </table>
              </Collapsible><Collapsible title="Sizing">
              <p>Against 25\u201333% defend wide; against 50%+ fold bottom of marginal.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 9 \u2014 Defending Flops (Calls and Raises) — Practice"
              quiz={{
                options: [
                  { label: 'Call (BDFD / gut shot)', variant: 'call' },
                  { label: 'Check-raise', variant: 'raise' },
                  { label: 'Fold (naked)', variant: 'fold' },
                ],
                scenarios: [
                  { board: { high: 'T', suit: 'two-tone', variant: 'green' }, correct: { label: 'Call (BDFD / gut shot)', variant: 'call' }, explanation: 'Bottom/weak pair + BDFD = call. BDFD > good kicker almost always. High card of suit > low card.' },
                  { board: { high: 'J', connected: true, variant: 'green' }, correct: { label: 'Call (BDFD / gut shot)', variant: 'call' }, explanation: 'Gut shot + BDFD = "super gut shot." Turns combo draws on suit cards. Gut shot + overcard also calls.' },
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'Call (BDFD / gut shot)', variant: 'call' }, explanation: 'Ace-high + BDFD = pure call (vs small bet). Double overs + BDFD = pure call. 3-straight + 3-flush = call or CR.' },
                  { board: { high: 'K', variant: 'red' }, correct: { label: 'Fold (naked)', variant: 'fold' }, explanation: 'Naked gut shot (double unders, no BDFD) = fold. Naked high card (no BDFD, no 3-straight) = fold.' },
                  { board: { high: 'Q', variant: 'red' }, correct: { label: 'Fold (naked)', variant: 'fold' }, explanation: 'Naked hands without BDFD/3-straight/overcards = fold. Need draws to defend.' },
                ],
              }}
              questions={[
                { question: 'What three conditions lead to defending very wide?', options: ['Weak own range + weak opponent range + small bet', 'Strong range + big bet', 'Deep stacks + connected board', 'Paired board + monotone'], correct: 0, explanation: 'Weak own range + weak opponent range + small bet → defend very wide.' },
                { question: 'What is a "super gut shot"?', options: ['Gut shot + BDFD', 'Open-ended straight draw', 'A gut shot to the nuts', 'Three to a flush'], correct: 0, explanation: 'Gut shot + BDFD = super gut shot. Turns combo draws on suit cards. Gut shot + overcard also calls.' },
                { question: 'BDFD vs good kicker — which matters more?', options: ['BDFD > good kicker almost always', 'Good kicker > BDFD', 'They are equal', 'Neither matters'], correct: 0, explanation: 'BDFD > good kicker almost always. High card of suit > low card for BDFD.' },
                { question: 'What is the check-raise criterion for high card of suit?', options: ['High card of suit > low card (blocks linear RFI more)', 'Low card > high card', 'Suit does not matter', 'Only spades matter'], correct: 0, explanation: 'High card of suit > low card — blocks linear RFI more effectively. CR criteria: direct equity, BD straight, BDFD, opponent missed, small bet.' },
                { question: 'How does bet sizing affect defense?', options: ['Scale up → fold more pairs. QJ/KJ without ♦: call vs 30% → fold vs 83%', 'Bigger bet → defend more', 'No effect', 'Always defend the same'], correct: 0, explanation: 'Scale up → fold more pairs. Q-J/K-J without the suit: call vs 30% → fold vs 83%.' },
                { question: 'What happens blind vs blind?', options: ['Ranges too wide — never fold pairs (even 4s with BDFD)', 'Fold more (ICM-like)', 'Play tight', 'Only play premium hands'], correct: 0, explanation: 'Blind vs blind: ranges too wide — never fold pairs, even pocket 4s with BDFD.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S9Page
