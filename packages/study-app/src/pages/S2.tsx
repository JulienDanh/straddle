import { Section, Callout, Leak, Action, Tabs, Subhead, DecisionTree, HandExample, BoardExample, ExampleBrowser, BoardType } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { BTN_RFI_CEV, BB_VS_BTN_CEV, S2_FLOP_A95, S2_FLOP_K93, S2_FLOP_A72, S2_FLOP_K84, S2_FLOP_963 } from '@poker/design-system/src/data/ranges'


export function S2Page() {
  return (
    <Section title="System 2 — BTN RFI vs BB Call · C-betting">
      <p>Button opens, BB calls, BB checks. Three flop buckets.</p>

      <Leak items={[
      ['Checking back boards that should be 100% c-bet', 'ace-high, T–K high with deuce/three'],
      ['Not recognizing when BTN misses a board entirely (no 8+)', 'must check, not bet blindly'],
      ['Only considering one suit for blocker effects', 'consider both calling suits'],
      ['Betting too small in position', 'IP can polarize, should bet larger'],
      ]} />

      
      <DecisionTree
        root={{
          question: 'What kind of board is it?',
          hint: 'Three buckets — the BTN range decides each one',
          branches: [
            {
              label: 'Ace-high',
              node: {
                question: 'Risk factors?',
                hint: 'Monotone · Paired · Deep stacks',
                yes: {
                  action: <Action variant="check">Mix</Action>,
                  actionVariant: 'check',
                  reason: 'Bet strong + weak, check medium. Deeper → more checking.',
                  boards: [
                    <BoardType cards="AhTh4h" label="A-high monotone" variant="orange" />,
                    <BoardType cards="AsJcJh" label="AJJ paired" variant="orange" />,
                  ],
                },
                no: {
                  action: <Action variant="bet">C-bet 100%</Action>,
                  actionVariant: 'bet',
                  reason: 'BTN has the most aces. Risk-free.',
                  boards: [
                    <BoardType cards="Ah9c4d" label="A94" variant="green" />,
                  ],
                },
              },
            },
            {
              label: 'T–K high',
              node: {
                question: 'Deuce or 3 present?',
                hint: 'Disconnected = no two low cards interacting',
                yes: {
                  action: <Action variant="bet">C-bet 100%</Action>,
                  actionVariant: 'bet',
                  reason: 'Disconnected → bet 100%.',
                  boards: [
                    <BoardType cards="Kd8s3c" label="K83" variant="green" />,
                    <BoardType cards="Qh9d2c" label="Q92" variant="green" />,
                    <BoardType cards="Th7d2s" label="T72" variant="green" />,
                  ],
                },
                no: {
                  action: <Action variant="check">Mix</Action>,
                  actionVariant: 'check',
                  reason: 'Two low cards (biggest risk) or monotone. Bet strong+weak, check middle.',
                  boards: [
                    <BoardType cards="Kh6d6c" label="K66 — two low cards" variant="orange" />,
                    <BoardType cards="Kh9h2h" label="K-high monotone" variant="orange" />,
                  ],
                },
              },
            },
            {
              label: '9-high & below',
              node: {
                action: <Action variant="check">Mix ~60/40</Action>,
                actionVariant: 'check',
                reason: 'No 8+ on board — BTN misses low boards harder. No 100% exists.',
                boards: [
                  <BoardType cards="9h6d3c" label="963" variant="orange" />,
                ],
              },
            },
          ],
        }}
      />

      <Callout>BTN range is wider (offsuit 8s+), so it misses low boards harder. When BTN doesn't interact, build a checking strategy — bet top, bet bottom, check middle.</Callout>

      <Subhead>Two-suit awareness (key skill)</Subhead>
      <p>On two-tone boards, BB defends around <em>two</em> suits. Most only think about the flush-draw suit. Also <strong>block the second suit</strong> (non-flush-draw suit BB calls with via backdoor draws) — no equity risk.</p>
      <Callout variant="warn"><strong>K83 two-tone (hearts+diamonds):</strong> KJ with heart+diamond = pure bet. KJ with spades+clubs (both off) = pure check.</Callout>

      <Subhead>Sizing</Subhead>
      <p>No explicit sizing prescribed in the transcript. The solved boards land at 19% pot (1.1bb — A72, K93, K84) and 72% pot (4.1bb — A95, 963): the small stabs carry the risk boards, the big front-loaded stabs come on the clean ace and the low board BTN misses.</p>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"If there's no 8+ on the board, BTN probably misses — check more"</li>
        <li>"Consider both suits, not just the flush draw suit"</li>
        <li>"In position can polarize — bet bigger"</li>
        <li>"Miss a 15% check? Costs ~0% EV — just bet range"</li>
      </ul>

      <Subhead>Examples</Subhead>

      <p>The system applied — pick a board on the left (40bb single-raised pot, BTN opens 2.1bb). Every bucket of the tree has a solved board.</p>

      <ExampleBrowser>
      <BoardExample
        board="Ac9h5d"
        spot="A95 rainbow (ace-high, clean)"
        action="C-bet 100%"
        actionVariant="bet"
        solve={S2_FLOP_A95}
      >
        BTN has the most aces — risk-free bucket. In position the solver even front-loads a big 72%-pot stab instead of small-stabbing.
      </BoardExample>

      <BoardExample
        board="Kh9d3c"
        spot="K93 (king-high, 3 present — disconnected)"
        action="C-bet 100%"
        actionVariant="bet"
        solve={S2_FLOP_K93}
      >
        The 3 keeps the board disconnected — no two low cards interacting. Same rule as the deuce: bet range at a small size.
      </BoardExample>

      <BoardExample
        board="Ah7h2h"
        spot="A72 monotone (ace-high, risk factor)"
        action="Mix"
        actionVariant="check"
        solve={S2_FLOP_A72}
      >
        The system says mix on monotone. The solver's answer: keep the stab tiny and the frequency near-range — the risk is priced into the size, not a check.
      </BoardExample>

      <BoardExample
        board="Kc8c4c"
        spot="K84 monotone (king-high, two low cards, risk factor)"
        action="Mix"
        actionVariant="check"
        solve={S2_FLOP_K84}
      >
        Monotone + two low cards — both risk factors. Bet the club-heavy strong and weak parts; check the medium hands that can't stand a raise.
      </BoardExample>

      <BoardExample
        board="9h6d3c"
        spot="963 (9-high & below — BTN misses)"
        action="Mix ~60/40"
        actionVariant="check"
        solve={S2_FLOP_963}
      >
        No 8+ on board — BTN's wide range barely connects. Bet top and bottom BIG, check the middling pairs that only beat bluffs.
      </BoardExample>

      <HandExample spot="AJJ paired (ace-high, 50bb)" action="Mix" actionVariant="check">Paired board = risk factor. Check KQ, QQ, TT-77 (medium). Bet Jx + trash. Solver checks ~50%.</HandExample>
      <HandExample spot="K63 two-tone (two low cards, no ace)" action="Mix" actionVariant="check">Two low cards interacting — risk factor. Check QQ, JJ, 9x (medium); bet strong + weak.</HandExample>
      </ExampleBrowser>
      <p className="mt-3 mb-1 text-sm text-muted">Buckets with no solved board yet are tagged Walk above.</p>

      <Subhead>Ranges</Subhead>
      <Tabs tabs={[
        {
          label: 'BTN RFI',
          content: (
            <>
              <p>BTN's opening range — the starting point of this system. ChipEV solutions at 15-40bb: the open tightens as stacks shorten (52% → 38%) and the jam mix grows below 20bb. Switch stacks with the selector.</p>
              <RangeBrowser ranges={BTN_RFI_CEV} />
            </>
          ),
        },
        {
          label: 'BB vs BTN',
          content: (
            <>
              <p>BB's defense vs the BTN open — raise, call, and all-in frequencies at 30-40bb. The 3-bet shrinks as stacks shorten (9bb → 7.5bb sizing) and the all-in slice grows (3% → 8%); calls stay ~71% of all hands. Switch stacks with the selector.</p>
              <RangeBrowser ranges={BB_VS_BTN_CEV} />
            </>
          ),
        },
      ]} />
    </Section>
  )
}

export default S2Page
