import { Section, Callout, Leak, Action, Subhead, DecisionTree, DataTable, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { S7_FLOP_JJ3, S7_FLOP_T33, S7_FLOP_533, S7_FLOP_662 } from '@poker/design-system/src/data/ranges'

export function S7Page() {
  return (
    <Section title="System 7 — C-bet Folding Flops (vs Check-Raises)">
      <p>You c-bet the flop as preflop raiser and face a CR. Which hands defend vs fold?</p>

      <Leak items={[
      ['Folding hands that are too strong', 'MDF says defend 65%, ace-high is snap call'],
      ['Not doing the MDF calculation', 'emotional decisions when facing a big raise'],
      ['Overfolding to check-raises', 'HUD-reading opponents will exploit high fold-to-CR'],
      ['Not identifying the worst hands', "if you can't identify trash, you can't engineer the fold correctly"],
      ]} />

      
      <Callout><strong>Fold% = Risk / (Pot + Risk)</strong> — makes zero-equity bluffs indifferent. But villain's bluffs have real equity → <strong>actual fold% is LOWER</strong>. Defend more than MDF.</Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"MDF keeps you rational — it doesn't produce a hand chart in your head"</li>
        <li>"Fold the trash, defend everything else"</li>
        <li>"When in doubt, the bet is too small to fold much"</li>
        <li>"Paired board: evaluate the unpaired card"</li>
        <li>"Villain's bluffs have equity — fold less than basic MDF"</li>
      </ul>

      <DecisionTree
        root={{
          question: 'Two overcards to the key card?',
          hint: 'Key card = second-highest board card. Ace-high first.',
          yes: {
            action: <Action variant="call">Defend (two overs)</Action>,
            actionVariant: 'call',
            reason: 'Pure call. Draws make it even stronger.',
            boards: [
              <BoardType cards="Kh9d4c" label="K94" variant="green" />,
              <BoardType cards="Qc8s3d" label="Q83" variant="green" />,
              <BoardType cards="Jh7d2c" label="J72" variant="green" />,
            ],
          },
          no: {
            question: 'Is the board paired?',
            yes: {
              action: <Action variant="call">Defend around unpaired</Action>,
              actionVariant: 'call',
              reason: 'Paired card unusable. Ace + BDFD = pure call.',
              boards: [
                <BoardType cards="Kh5d5c" label="K55" variant="red" />,
                <BoardType cards="Jc3h3d" label="J33" variant="red" />,
              ],
            },
            no: {
              question: 'Any draws? (BDFD, 3-straight, BD straight)',
              yes: {
                action: <Action variant="call">Defend (with draws)</Action>,
                actionVariant: 'call',
                reason: 'One over/one under or double unders + BDFD/3-straight = call.',
                boards: [
                  <BoardType cards="Kh9c7c" label="K97 — two-tone" variant="orange" />,
                  <BoardType cards="Qd8h6h" label="Q86 — two-tone" variant="orange" />,
                ],
              },
              no: {
                action: <Action variant="fold">Fold (total trash)</Action>,
                actionVariant: 'fold',
                reason: 'Naked double-unders, no equity, no BDFD, no 3-straight.',
                boards: [
                  <BoardType cards="9c6d2h" label="962" variant="red" />,
                  <BoardType cards="Th7s3d" label="T73" variant="red" />,
                ],
              },
            },
          },
        }}
      />

      <Subhead>Defend priority (for trash)</Subhead>
      <ol>
        <li>Direct equity (overcards to top pair) — Ace-high first</li>
        <li>Backdoor flush draw (high card of suit &gt; low)</li>
        <li>Three to a straight</li>
        <li>Backdoor straight draws</li>
        <li>Blocker effects (avoid suit that blocks villain's bluffs)</li>
      </ol>

      <Subhead>Risk factors</Subhead>
      <DataTable columns={[{header:'Factor'},{header:'Effect'}]} rows={[
        [<><strong>Villain bluffs have high equity</strong></>, 'Defend even more than MDF'],
        [<><strong>Paired boards (K55)</strong></>, 'Organize around unpaired card. Ace + BDFD = pure call'],
        [<><strong>Small raise sizes</strong></>, 'Defend almost everything; pot odds may prevent any fold'],
        [<><strong>Blocker suits (two-tone)</strong></>, 'Avoid suit villain bluffs with — blocks their bluff frequency'],
      ]} />

      <Subhead>Sizing</Subhead>
      <p>Depends on villain's CR size. Smaller CR → defend almost everything; larger → fold more.</p>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<BoardExample
        board="JsJh3c"
        spot="A5 on JJ3 (BTN, 50bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_JJ3}
      >CR to 4bb. MDF fold = 38%. A5 is way too strong to fold. Only trash folds.</BoardExample>
      <BoardExample
        board="TsTh4c"
        spot="K10 on T33 (BTN, 35bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_T33}
      >Paired board — key card = T. Overcards to T = pure call. Fold double-unders (98o, 87o).</BoardExample>
      <BoardExample
        board="5c3h3d"
        spot="AJ on 533r (BTN, 35bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_533}
      >CR to 7.3bb. AJ is near the nuts (BTN doesn't have 3s). Snap call.</BoardExample>
      <BoardExample
        board="6s6h2c"
        spot="K2s on 662 (BTN, 25bb)"
        action="Defend (call)"
        actionVariant="call"
        solve={S7_FLOP_662}
      >CR to 2bb (very small). K2s with BDFD is worth 45bb/100 — pure call. Almost nothing folds.</BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S7Page
