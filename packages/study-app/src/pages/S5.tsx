import { Section, Callout, Tabs, Collapsible, Pyramid, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S5Page() {
  return (
    <Section title="System 5 — Barreling Medium-Strength Hands in Error">
      <p>Hero opened, c-bet flop, called. Evaluating turn barrel with medium hand. Core mistake: barreling medium-strength hands that should check.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Pyramid tiers={[
                { label: 'Nuts / very strong', action: 'Bet (value)', why: 'Get called by worse', variant: 'bet' },
                { label: 'Strong but not nuts', action: 'Bet (thin value)', why: 'Needs to be strong enough', variant: 'bet' },
                { label: 'Medium strength', action: 'Check', why: 'Loses to calls above, only beats bluffs', variant: 'check' },
                { label: 'Weak / trash', action: 'Bet (selective bluff)', why: 'Low opportunity cost — only if enough value exists', variant: 'bet' },
              ]} highlight={2} />

              <Callout variant="bad"><strong>Don't barrel medium-strength hands.</strong> They lose to hands that call and only beat bluffs. Check keeps them as bluff catchers. Barreling gets value-owned.</Callout>
              <Callout variant="good"><strong>Merge = thin value + fold equity.</strong> A medium hand can bet only if it <em>folds better AND gets called by worse</em>. Classic merge: ATo on Q73→J folds Q-x/K-x and gets called by J-T, J-4s, 10x draws. If it can't do both, it checks.</Callout>

              <Collapsible title="When medium CAN bet — the merge exception">
                <p>A medium hand can bet only if it <strong>folds better AND gets called by worse</strong>. Not all medium hands can do this.</p>
                <p>J9 (no kicker) checks — loses to KJ/JT floats. AJ with a good kicker is the minimum jack to barrel.</p>
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect on medium hands' }]} rows={[[<><strong>Deep (80bb+)</strong></>, <>Opponent calls more top pair → more callers above medium</>],
                  [<><strong>Short (25bb)</strong></>, <>Opponent CRs top pair instead of calling → fewer calls above</>],
                  [<><strong>Turn improves your range (A/K)</strong></>, <>May justify barreling medium (range advantage)</>],
                  [<><strong>EP open (range bet flop)</strong></>, <>Less need to polarize; range advantage vs BB</>],
                  [<><strong>Turn card quality</strong></>, <>Bad card for range + medium strength → check (JJ on Q75→ bad turn)</>],
                  [<><strong>Kicker</strong></>, <>No-kicker mediums (J9, 99) check; AJ/A♥ minimum to barrel</>]]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Default turn: <strong>polarize</strong> — pot-ish or check. Solver often prefers ~116% overbet or check. Adding 60% allows thinner value (K8s) but doesn't rescue medium hands (99 still checks).</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 5 — Practice"
              quiz={{
                options: [
                  { label: 'Barrel', variant: 'bet' },
                  { label: 'Check', variant: 'check' },
                ],
                scenarios: [
                  { board: { high: 'Q', suit: 'two-tone' }, correct: { label: 'Check', variant: 'check' }, explanation: 'Q73 two-tone, turn J. J9 (no kicker) is medium strength — loses to KJ/JT floats. Too thin to barrel. Check the middle.' },
                  { board: { high: 'K', suit: 'two-tone' }, correct: { label: 'Check', variant: 'check' }, explanation: 'K72 two-tone, turn Q. Pocket 99 is medium strength. The Q is good for BB range — encourages checking even more.' },
                  { board: { high: 'Q', variant: 'green' }, correct: { label: 'Check', variant: 'check' }, explanation: 'Q75 rainbow, blank turn. JJ is a clean medium hand. Bad card for your range + medium strength = check.' },
                  { board: { high: 'Q', variant: 'green', label: 'Q75 + A/K turn' }, correct: { label: 'Barrel', variant: 'bet' }, explanation: 'Q75 rainbow but turn is A or K. Range advantage card — may justify barreling medium hands. Exception to the check-middle rule.' },
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'Barrel', variant: 'bet' }, explanation: 'K-high dry board with AJ (good kicker). AJ is the minimum jack to barrel — can value-bet thinly.' },
                  { board: { high: 'Q', suit: 'two-tone', connected: true }, correct: { label: 'Barrel', variant: 'bet' }, explanation: 'Connected Q-high board with ATo = merge play. Folds Qx/Kx (better) AND gets called by JT/J4s/10x draws (worse).' },
                  { board: { high: 'Q', variant: 'green', label: 'Q75 + 8/9 turn' }, correct: { label: 'Barrel', variant: 'bet' }, explanation: 'Q75 rainbow, turn 8 or 9. Pocket 88/89 has open-ender + pair = much stronger. Barreling is correct — the open-ender adds equity.' },
                ],
              }}
              questions={[
                { question: 'What is the core mistake System 5 corrects?', options: ['Barreling medium-strength hands that should check', 'Checking too much with strong hands', 'Betting too small', 'Not bluffing enough'], correct: 0, explanation: 'Medium-strength hands lose to hands that call and only beat bluffs. Barreling gets value-owned. Check keeps them as bluff catchers.' },
                { question: 'In the pyramid, what do you do with medium-strength hands?', options: ['Check', 'Bet (thin value)', 'Bet (bluff)', 'Fold'], correct: 0, explanation: 'Nuts/very strong bet (value), strong bets (thin value), medium checks, weak bets (selective bluff).' },
                { question: 'When CAN a medium hand bet? (the merge exception)', options: ['When it folds better AND gets called by worse', 'When it has showdown value', 'When the pot is small', 'Never'], correct: 0, explanation: 'Merge = thin value + fold equity. ATo on Q73→J folds Q-x/K-x and gets called by J-T/J-4s/10x. If it can\'t do both, it checks.' },
                { question: 'What is the minimum jack to barrel on J-high boards?', options: ['AJ with a good kicker', 'J9', 'JT', 'KJ'], correct: 0, explanation: 'J9 (no kicker) checks — loses to KJ/JT floats. AJ with a good kicker is the minimum jack to barrel.' },
                { question: 'What happens to medium hands on a bad card for your range?', options: ['Check (bad card for range + medium strength)', 'Bet for protection', 'Shove', 'Call'], correct: 0, explanation: 'Bad card for range + medium strength → check. JJ mostly checks (56% check, −72% if no donk).' },
                { question: 'What is the default turn sizing?', options: ['Polarize — pot-ish or check', 'Small (1/4 pot)', 'Half pot', 'Overbet always'], correct: 0, explanation: 'Default turn: polarize — pot-ish or check. Solver often prefers ~116% overbet or check. Adding 60% allows thinner value but doesn\'t rescue medium hands.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S5Page
