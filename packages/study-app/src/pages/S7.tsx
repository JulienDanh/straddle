import { Section, Callout, Action, RandomBoard, Tabs, Collapsible, DecisionTree, DataTable, HandExample } from '@poker/design-system/src/components/ui'

export function S7Page() {
  return (
    <Section title="System 7 \u2014 C-bet Folding Flops (vs Check-Raises)">
      <p>You c-bet the flop as preflop raiser and face a CR. Which hands defend vs fold?</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout><strong>Fold% = Risk / (Pot + Risk)</strong> — makes zero-equity bluffs indifferent. But villain's bluffs have real equity → <strong>actual fold% is LOWER</strong>. Defend more than MDF.</Callout>

              <Callout variant="warn"><strong>Common Leaks:</strong> Folding hands that are too strong — MDF says defend 65%, ace-high is snap call. Not doing the MDF calculation — making emotional decisions when facing a big raise. Overfolding to check-raises — HUD-reading opponents will exploit high fold-to-CR. Not identifying the worst hands — if you can't identify trash, you can't engineer the fold correctly.</Callout>

                            <Collapsible title="Heuristics">
                <ul>
                  <li>"MDF keeps you rational — it doesn't produce a hand chart in your head"</li>
                  <li>"Fold the trash, defend everything else"</li>
                  <li>"When in doubt, the bet is too small to fold much"</li>
                  <li>"Paired board: evaluate the unpaired card"</li>
                  <li>"Villain's bluffs have equity — fold less than basic MDF"</li>
                </ul>
              </Collapsible>

              <DecisionTree
                root={{
                  question: 'Two overcards to the key card?',
                  hint: 'Key card = second-highest board card. Ace-high first.',
                  yes: {
                    action: <Action variant="call">Defend (two overs)</Action>,
                    actionVariant: 'call',
                    reason: 'Pure call. Draws make it even stronger.',
                    boards: [
                      <RandomBoard high="K" variant="green" />,
                      <RandomBoard high="Q" variant="green" />,
                      <RandomBoard high="J" variant="green" />,
                    ],
                  },
                  no: {
                    question: 'Is the board paired?',
                    yes: {
                      action: <Action variant="call">Defend around unpaired</Action>,
                      actionVariant: 'call',
                      reason: 'Paired card unusable. Ace + BDFD = pure call.',
                      boards: [
                        <RandomBoard high="K" paired variant="red" label="K55" />,
                        <RandomBoard high="J" paired variant="red" label="J33" />,
                      ],
                    },
                    no: {
                      question: 'Any draws? (BDFD, 3-straight, BD straight)',
                      yes: {
                        action: <Action variant="call">Defend (with draws)</Action>,
                        actionVariant: 'call',
                        reason: 'One over/one under or double unders + BDFD/3-straight = call.',
                        boards: [
                          <RandomBoard high="K" suit="two-tone" variant="orange" />,
                          <RandomBoard high="Q" suit="two-tone" variant="orange" />,
                        ],
                      },
                      no: {
                        action: <Action variant="fold">Fold (total trash)</Action>,
                        actionVariant: 'fold',
                        reason: 'Naked double-unders, no equity, no BDFD, no 3-straight.',
                        boards: [
                          <RandomBoard high="9" variant="red" />,
                          <RandomBoard high="T" variant="red" />,
                        ],
                      },
                    },
                  },
                }}
              />

              <Collapsible title="Defend priority (for trash)">
                <ol>
                  <li>Direct equity (overcards to top pair) — Ace-high first</li>
                  <li>Backdoor flush draw (high card of suit &gt; low)</li>
                  <li>Three to a straight</li>
                  <li>Backdoor straight draws</li>
                  <li>Blocker effects (avoid suit that blocks villain's bluffs)</li>
                </ol>
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{header:'Factor'},{header:'Effect'}]} rows={[
                  [<><strong>Villain bluffs have high equity</strong></>, 'Defend even more than MDF'],
                  [<><strong>Paired boards (K55)</strong></>, 'Organize around unpaired card. Ace + BDFD = pure call'],
                  [<><strong>Small raise sizes</strong></>, 'Defend almost everything; pot odds may prevent any fold'],
                  [<><strong>Blocker suits (two-tone)</strong></>, 'Avoid suit villain bluffs with — blocks their bluff frequency'],
                ]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Depends on villain's CR size. Smaller CR → defend almost everything; larger → fold more.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Examples',
          content: (
            <>
<HandExample spot="A5 on JJ3 (BTN, 50bb)" action="Defend (call)" actionVariant="call">CR to 4bb. MDF fold = 38%. Actual fold = ~18%. A5 is way too strong to fold. Only trash folds.</HandExample>
                <HandExample spot="K10 on T33 (BTN, 35bb)" action="Defend (call)" actionVariant="call">Paired board — key card = T. Overcards to T = pure call. Fold double-unders (98o, 87o).</HandExample>
                <HandExample spot="AJ on 533r (BTN, 35bb)" action="Defend (call)" actionVariant="call">CR to 7.3bb. MDF fold = 50%. Actual fold = ~42%. AJ is near the nuts (BTN doesn't have 3s). Snap call.</HandExample>
                <HandExample spot="K2s on 662 (BTN, 25bb)" action="Defend (call)" actionVariant="call">CR to 2bb (very small). Actual fold = ~2%. K2s with BDFD is worth 45bb/100 — pure call. Almost nothing folds.</HandExample>
            </>
          ),
        },
      ]} />
    </Section>
  )
}

export default S7Page
