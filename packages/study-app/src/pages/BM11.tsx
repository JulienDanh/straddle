import { Section, Callout, Code, Action, Tabs, Collapsible } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM11Page() {
  return (
    <Section title="Polar Opens & Split-Range C-Betting (Short Stacks)">
      <p>BTN opens a polar split range (min-raise + open-jam) at ~12bb effective on the direct bubble. Postflop strategy is dominated by checking far more than in chip models, with flop jams appearing on draw-heavy textures. When BB covers by heaps (53bb), BTN opens tighter/stronger, which paradoxically allows more c-betting on dry boards.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="warn"><strong>You check MORE when covered in ICM, not less.</strong> The instinct to "bet to protect your hand" is backwards — you protect your tournament equity by checking. Chip model range-bets become check-backs.</Callout>
              
                      <h3>Board class × BB depth</h3>
<table>
                        <tr><th>Board class</th><th>vs shallow BB (16bb)</th><th>vs deeper BB (53bb)</th></tr>
                        <tr><td><strong>Monotone</strong></td><td><Action variant="check">Range check (65-82%+)</Action> — BTN lacks flushes (shoves suited pre).</td><td><Action variant="check">Range check</Action> — Same. If BB under-leads: range check.</td></tr>
                        <tr><td><strong>Dry ace-high (AQ4)</strong></td><td><Action variant="bet">Bet 40%</Action> — Deny gutshots. Not quarter pot.</td><td><Action variant="bet">Bet 40%</Action> — Same; BTN has Ax.</td></tr>
                        <tr><td><strong>Dry board (J-5-4)</strong></td><td><Action variant="check">Check ~50%</Action> — BB leads 40%; game of chicken.</td><td><Action variant="bet">Range bet</Action> — Tighter range = more value, less air.</td></tr>
                        <tr><td><strong>Two-tone</strong></td><td><Action variant="check">Check more + add jams</Action> — Flop jams with flush draws as semi-bluffs.</td><td><Action variant="check">Check more + add jams</Action> — Same # jam combos, larger share of tighter range.</td></tr>
                        <tr><td><strong>Low paired dry (6-6-2)</strong></td><td><Action variant="bet">Range bet</Action> — BB underrepresented on the deuce.</td><td><Action variant="bet">Range bet</Action> — Same.</td></tr>
                        <tr><td><strong>Low paired + draws (6-6-5)</strong></td><td><Action variant="check">Check ~40%</Action> — Draws flip the strategy.</td><td><Action variant="check">Check</Action> — Same.</td></tr>
                      </table><Collapsible title="Preflop range tiers (12bb BTN polar open)">
              <table>
                        <tr><th>Tier</th><th>Action</th><th>Shift vs deeper BB (53bb)</th></tr>
                        <tr><td><strong>Value jam</strong></td><td>Open shove JJ+, AQs, some AKo</td><td>AK pure shove; AQ, AJ, A9s join</td></tr>
                        <tr><td><strong>Semi-value min-raise</strong></td><td>A10s–A8s, suited Broadway, offsuit Broadway</td><td>Bluffs shift up: QJ, K10 raise-folds</td></tr>
                        <tr><td><strong>Raise-fold Ax</strong></td><td>A4o–A8o, some suited aces</td><td>Worst Axo shove = A8o (vs A4o)</td></tr>
                        <tr><td><strong>Folds</strong></td><td>Weak suited connectors, low offsuit</td><td>J9s, T9s barely make the cut</td></tr>
                      </table>
                      <Callout variant="good"><strong>Open TIGHTER into the deeper stack, but the BB defends WIDER.</strong> Tighter range + wider defender. The 53bb BB has less ICM risk and can get out of line. BB 3-bets blocker-heavy (Kxs, Axs, Axo) and small-3-bets AJ offsuit.</Callout>
              </Collapsible><Collapsible title="C-bet defaults (vs shallow BB, 16bb)">
              <ul>
                        <li><strong>Ace-high dry (AQ4):</strong> bet 40% (deny gutshots).</li>
                        <li><strong>A-high two-tone (AK5tt, AQ2tt):</strong> jam (~2x pot) + check to deny flush-draw equity.</li>
                        <li><strong>Monotone:</strong> range check (65-82%+) — BTN lacks flushes.</li>
                        <li><strong>Low paired dry (6-6-2):</strong> range bet (BB underrepresented).</li>
                        <li><strong>Low paired + draws (6-6-5):</strong> check ~40% (draws flip it).</li>
                        <li><strong>Connected mid (10-9-8):</strong> heavy check, jam-or-check (75-80%).</li>
                      </ul>
              </Collapsible><Collapsible title="Risk factors">
              <table>
                        <tr><th>Risk factor</th><th>Effect</th></tr>
                        <tr><td><strong>Paired boards (non-connected)</strong></td><td>BB check-raises more; over-c-betting is a leak. Amplified in ICM.</td></tr>
                        <tr><td><strong>Monotone flops</strong></td><td>BTN's preflop suited shoves → limited flushes; BB has every flush. Ace-high monotone worst.</td></tr>
                        <tr><td><strong>Two-tone flops</strong></td><td>Check-raise + flip vs flush draw is an ICM disaster. Check more; use jams to deny equity.</td></tr>
                        <tr><td><strong>Draws present generally</strong></td><td>Open-enders, gutshots for BB → more checking, more jam sizing.</td></tr>
                        <tr><td><strong>Higher paired card (A99 vs A77)</strong></td><td>Higher paired card = more BB coverage (J9, T9 vs J7) = more checking.</td></tr>
                      </table>
                      <Callout variant="warn"><strong>Weaker aces jam as semi-bluffs; stronger aces check.</strong> A4s/A5s shove the flop; A7 (can make a good pair) checks back. The hand with less showdown value is the bluff.</Callout>
              </Collapsible><Collapsible title="Sizing">
              <p>Standard c-bet <Code>~25% pot</Code> (quarter pot). Dry ace-high (AQ4-type): <Code>~40%</Code> to deny gutshots. Flop jam: <Code>~10bb into ~5.5bb</Code> (~1.8x pot, slightly less than 2x). Jams appear on two-tone, connected, flush-draw boards. Open-jam threshold (Axo) shifts up: <Code>A4o</Code> (16bb) → <Code>A8o</Code> (53bb).</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="Polar Opens & Split-Range C-Betting (Short Stacks) — Practice"
              quiz={{
                options: [
                  { label: 'Range check', variant: 'check' },
                  { label: 'Bet 40% (dry ace-high)', variant: 'bet' },
                  { label: 'Range bet', variant: 'bet' },
                  { label: 'Check ~50%', variant: 'check' },
                ],
                scenarios: [
                  { board: { high: '9', suit: 'monotone', variant: 'red', label: 'Monotone (765)' }, correct: { label: 'Range check', variant: 'check' }, explanation: 'Monotone: range check (65-82%+). BTN open-shoves suited pre → lacks flushes. BB can have any flush.' },
                  { board: { high: 'A', variant: 'green' }, correct: { label: 'Bet 40% (dry ace-high)', variant: 'bet' }, explanation: 'Dry ace-high (AQ4): bet 40% (not quarter pot). Deny gutshot equity. If check-raise → jam over.' },
                  { board: { high: 'J', variant: 'green', label: 'Dry board vs deep BB (53bb)' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'Dry board vs deep BB (53bb): range bet. Tighter range = more top pair/overpair/set, less air. BB checks pure.' },
                  { board: { high: '9', paired: true, variant: 'green', label: 'Low paired dry (662)' }, correct: { label: 'Range bet', variant: 'bet' }, explanation: 'Low paired dry (662): range bet. BB underrepresented on the deuce, no draws.' },
                  { board: { high: '9', paired: true, connected: true, variant: 'red', label: 'Low paired + draws (665)' }, correct: { label: 'Check ~50%', variant: 'check' }, explanation: 'Low paired + draws (665): check ~40%. Draws flip the strategy on paired boards.' },
                  { board: { high: 'K', suit: 'two-tone', variant: 'orange' }, correct: { label: 'Check ~50%', variant: 'check' }, explanation: 'Two-tone: check more + add flop jams as semi-bluffs with flush draws. Flush draw presence increases checking and jam sizing.' },
                ],
              }}
              questions={[
                { question: 'What is the counter-intuitive ICM c-bet rule for polar opens?', options: ['You check MORE when covered in ICM, not less', 'You bet more when covered', 'No change', 'Always range-bet'], correct: 0, explanation: 'The instinct to "bet to protect your hand" is backwards — you protect tournament equity by checking. Chip model range-bets become check-backs.' },
                { question: 'Why does BTN lack flushes on monotone boards?', options: ['BTN open-shoves suited hands preflop → few suited hands see flops', 'BTN folds suited hands', 'BB has all the flushes', 'Monotone is rare'], correct: 0, explanation: 'BTN open-shoves suited pre → lacks flushes postflop. BB can have any flush. Range check (65-82%+).' },
                { question: 'What sizing on dry ace-high (AQ4)?', options: ['~40% pot (not quarter pot) — deny gutshots', 'Quarter pot', 'Overbet', 'All-in'], correct: 0, explanation: 'Bet 40% (not quarter pot). Deny gutshot equity. If check-raise → jam over. Larger size on dry ace-high than standard.' },
                { question: 'What flips the strategy on low paired boards?', options: ['Draws present (665 → check ~40%; 662 → range bet)', 'Board pairing', 'Stack depth', 'Position'], correct: 0, explanation: '6-6-2: range bet (BB underrepresented, no draws). 6-6-5: check ~40% (draws flip it). Draws flip strategy on paired boards.' },
                { question: 'What is the overpair hierarchy on two-tone boards?', options: ['Queens jam most, Kings less, Aces pure check (nut traps)', 'Aces jam most', 'All jam equally', 'All check'], correct: 0, explanation: 'Queens jam the most, Kings less, Aces almost pure-check. Nut traps; weaker overpairs protect. Inverted from "bet your strong hands."' },
                { question: 'What is the standard c-bet sizing for polar opens?', options: ['~25% pot (quarter pot). Dry ace-high ~40%. Flop jam ~1.8x pot', 'Pot-sized', 'Overbet always', 'All-in'], correct: 0, explanation: 'Standard c-bet ~25% pot. Dry ace-high ~40%. Flop jam ~10bb into ~5.5bb (~1.8x pot). Jams on two-tone/connected/FD boards.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM11Page
