import { Section, Callout, Tabs, Collapsible, Pyramid, DataTable, HandExample } from '@poker/design-system/src/components/ui'

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

              <Callout variant="warn"><strong>Common Leaks:</strong> Barreling medium-strength hands for "protection" — they get called by better and fold worse. Not recognizing when a hand is medium-strength: J9 on Q73 is jack-X no kicker = medium. Overestimating the value of a pair — pocket nines on K72 is medium, not a value bet. Missing merge opportunities when villain is capped.</Callout>

              <Collapsible title="Heuristics">
                <ul>
                  <li>"Bet top, bet bottom, check middle"</li>
                  <li>"Medium hands have no business betting — called by better, fold worse"</li>
                  <li>"Merge = bet that's simultaneously a bluff and a value bet"</li>
                  <li>"If you can't check-raise it, heavily consider betting it" (strong hands)</li>
                </ul>
              </Collapsible>

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
          label: 'Examples',
          content: (
            <>
              <HandExample spot="J9 on Q73 → J turn (CO, 80bb)" action="Check" actionVariant="check">Medium strength (Jx no kicker). Villain check-calls KQ, QJ at depth. Solver: KJ checks, J9 checks, only AJ barrels.</HandExample>
              <HandExample spot="99 on K72 → Q turn (50bb)" action="Check" actionVariant="check">Medium strength. Check. Solver: 99 and 88 don't bet even with small sizing added. Bet KK, A3s, T8s.</HandExample>
              <HandExample spot="JJ on Q75r → 8 turn (CO, 50bb)" action="Check" actionVariant="check">Medium strength. Bad turn (improves villain's connected hands). Check. 72% check with donk stripped out. Pocket 88 (open-ender) CAN barrel — 99 and JJ cannot.</HandExample>
              <HandExample spot="ATo on Q73 → J turn (merge, 50bb)" action="Bet pot (merge)" actionVariant="bet">Exception — merge bet. Villain checked back flop (capped). AT folds KX/QX (better) and calls J10/J4s/10Xd (worse).</HandExample>
            </>
          ),
        },
      ]} />
    </Section>
  )
}

export default S5Page
