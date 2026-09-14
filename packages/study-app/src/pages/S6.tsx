import { Section, Callout, Leak, Action, Subhead, DecisionTree, DataTable, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { S6_FLOP_Q75, S6_FLOP_K84, S6_FLOP_K94, S6_FLOP_864 } from '@poker/design-system/src/data/ranges'

export function S6Page() {
  return (
    <Section title="System 6 — Check-Raising Top Pair (Short Stacks)">
      <p>Hero flats BB, flops top pair, faces c-bet. Check-raise or check-call? Focus on <strong>short stacks (≤35bb)</strong>.</p>

      <Leak items={[
      ['Check-calling top pair at short stacks', 'should be check-raising for value protection'],
      ['Overvaluing position ("EP opened so I need TPTK")', 'stack depth matters more than position'],
      ['Not recognizing the 35bb inflection point'],
      ['Trapping with top pair instead of two pair', 'top pair needs protection, two pair can trap'],
      ]} />

      
      <Callout variant="warn"><strong>Inflection: 35bb.</strong> Above → nuts-oriented CR (sets, two pair, TPTK mix). <strong>At/below → aggressive top-pair CR.</strong> Shorter = more CR. Most players under-CR top pair when short — correct the leak.</Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"35bb = inflection point — below it, check-raise top pair"</li>
        <li>"Top pair check-raises, two pair traps"</li>
        <li>"Shorter = more check-raising"</li>
        <li>"Lower flop = kicker matters less"</li>
        <li>"Backdoor flush draw = check-call (doesn't need protection)"</li>
      </ul>

      <DecisionTree
        root={{
          question: 'Is your stack ≤35bb?',
          hint: 'Short stack = aggressive top-pair CR',
          yes: {
            question: 'Top pair (good kicker)?',
            hint: 'KQ/QJ/QT pure CR; taper to Q2 pure call',
            yes: {
              question: 'Backdoor flush draw (both suited)?',
              yes: {
                action: <Action variant="call">Check-call</Action>,
                actionVariant: 'call',
                reason: 'Realize the flush draw. CR gives up flush equity.',
                boards: [
                  <BoardType cards="Qh9d4d" label="Top pair + BDFD" variant="orange" />,
                ],
              },
              no: {
                action: <Action variant="raise">Check-raise top pair</Action>,
                actionVariant: 'raise',
                reason: 'Pure CR. Shorter = more aggressive.',
                boards: [
                  <BoardType cards="Qh8d5c" label="Q-high" variant="green" />,
                  <BoardType cards="Kh7s3d" label="K-high" variant="green" />,
                ],
              },
            },
            no: {
              action: <Action variant="call">Trap (check-call)</Action>,
              actionVariant: 'call',
              reason: 'Two pair/sets/pockets trap. SPR short enough to shove river.',
              boards: [
                <BoardType cards="Jd8s6c" label="Two pair / sets" variant="red" />,
                <BoardType cards="Kc7h5d" label="Two pair / sets" variant="red" />,
              ],
            },
          },
          no: {
            action: <Action variant="call">Nuts-oriented CR</Action>,
            actionVariant: 'call',
            reason: 'Sets, two pair, TPTK mix. Less top-pair CR when deep.',
            boards: [],
          },
        }}
      />

      <Subhead>CR hierarchy (high boards)</Subhead>
    <p>On Q-high (Q73), kicker determines CR frequency:</p>
    <DataTable columns={[{header:'Hand'},{header:'CR frequency'}]} rows={[
      ['KQ, QJ, QT', 'Pure CR'],
      ['Q9', 'Heavy CR (offsuit); backdoor FD → check-call'],
      ['Q8', 'Medium mix'],
      ['Q7, Q6, Q5, Q4', 'Tapering mix'],
      ['Q2', 'Pure call'],
    ]} />

      <Subhead>Risk factors</Subhead>
      <DataTable columns={[{header:'Factor'},{header:'Effect'}]} rows={[
        [<><strong>Backdoor FD (both suited)</strong></>, 'Prefers check-call (Q9♥ calls more than Q9o)'],
        [<><strong>Two pair / sets / pockets</strong></>, 'Trap (check-call) — SPR short enough to shove'],
        [<><strong>Opponent c-betting 100%</strong></>, 'CR all top pairs — their range too weak'],
        [<><strong>Deeper stacks (&gt;35bb)</strong></>, 'Less CR with thin top pair; mix CR/check-call with great kicker'],
      ]} />

      <Subhead>Sizing</Subhead>
      <p>CR to <strong>small size</strong> (~3x the c-bet). Short stacks = 2-street game.</p>

      <Subhead>Examples</Subhead>

      <ExampleBrowser>
<BoardExample
        board="Qh7c5d"
        spot="K7 on Q75 (HJ, 25bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_Q75}
      >Pure check-raise. KQ, QJ, QT all pure CR. Q9 heavy mix, Q8 medium, Q2 pure call. Hierarchical taper.</BoardExample>
      <BoardExample
        board="Kc8h4d"
        spot="K7 on K84 (EP, 13bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_K84}
      >Pure check-raise. All Kx from KQ to K2 pure CR. K8 (two pair) = trap (check-call).</BoardExample>
      <BoardExample
        board="Kc9c4h"
        spot="K3♣ on K94 (HJ, 15bb)"
        action="Check-call (trap)"
        actionVariant="call"
        solve={S6_FLOP_K94}
      >Flush draw hands trap, non-flush-draw top pairs CR. K7 no club = check-raise (protection).</BoardExample>
      <BoardExample
        board="8c6h4d"
        spot="65o on 864r (CO, 25bb)"
        action="Check-raise"
        actionVariant="raise"
        solve={S6_FLOP_864}
      >Pure check-raise (top pair + gut shot). Need protection. 85, 87 with gut shots = good CR.</BoardExample>
      </ExampleBrowser>
    </Section>
  )
}

export default S6Page
