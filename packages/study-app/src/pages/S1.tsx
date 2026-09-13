import { Section, Callout, Tag, Action, BoardType, Tabs, Collapsible, DecisionTree, BoardExample, ExampleBrowser, Subhead } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_RFI_CEV, BB_VS_UTG_CEV, S1_FLOP_K83, S1_FLOP_KK3, S1_FLOP_AK2, S1_FLOP_MONOTONE, S1_FLOP_J66 } from '@poker/design-system/src/data/ranges'

export function S1Page() {
  return (
    <Section title="System 1 — UTG RFI vs BB Call · C-betting">
      <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>

      
      <DecisionTree
        root={{
          question: 'Is the board T-high or higher?',
          hint: 'A, K, Q, J, T as the highest card',
          yes: {
            question: 'Are there risk factors?',
            hint: 'Monotone · AKx · Paired low under high · 3+ straights',
            yes: {
              action: <Action variant="check">Mix</Action>,
              actionVariant: 'check',
              reason: 'Bet strong + weak, check medium',
              boards: [
                <BoardType cards="AhJh5h" label="Monotone" variant="orange" />,
                <BoardType cards="AsKh2c" label="AKx" variant="orange" />,
                <BoardType cards="Ad2c2s" label="A22 — paired low under high" variant="orange" />,
                <BoardType cards="Jh6s6d" label="J66 — high-low-low" variant="orange" />,
                <BoardType cards="JhTs9c" label="3+ straights" variant="red" />,
              ],
            },
            no: {
              action: <Action variant="bet">C-bet 100%</Action>,
              actionVariant: 'bet',
              reason: 'Every hand. Small size.',
              boards: [
                <BoardType cards="Kh8h3c" label="K83 two-tone" variant="green" />,
                <BoardType cards="AhTd4c" label="AT4" variant="green" />,
                <BoardType cards="Qh8d2c" label="Q82" variant="green" />,
                <BoardType cards="Th8d5c" label="T85" variant="green" />,
              ],
            },
          },
          no: {
            action: <Action variant="check">Mix ~70/30</Action>,
            actionVariant: 'check',
            reason: '9-high & below. No 100% exists. Bet strong+weak, check medium.',
            boards: [
              <BoardType cards="9h7d3c" label="973" variant="orange" />,
              <BoardType cards="9c9s4d" label="994 paired" variant="orange" />,
            ],
          },
        }}
      />

      <Callout>Bucket 1 (T-high+) occurs far more often — one ace makes a flop ace-high. Highest-ROI piece.</Callout>
      <Callout variant="warn"><strong>Bet MORE when shallow, not less.</strong> Most players do the opposite — correct the leak.</Callout>

      <Callout variant="warn"><strong>Common Leaks:</strong> Most players bet LESS when shallow — should bet MORE (overpair asymmetry amplified at shallow depth). Checking medium-strength hands makes range vulnerable to aggression. Professional players routinely check back T-high+ clean boards — a systematic error this system corrects.</Callout>

      <Collapsible title="Heuristics">
        <ul>
          <li>"Bet top, bet bottom, check middle"</li>
          <li>"Bet MORE when shallow, not less"</li>
          <li>"High-low-low IS a risk factor; high-high-low is NOT"</li>
        </ul>
      </Collapsible>

      <Collapsible title="Why bet 100% on T-high+?">
        <p><strong>Overpair asymmetry</strong>: UTG has far more strong pairs than BB caller. Shorter stacks amplify → bet more. Deeper → more caution.</p>
      </Collapsible>

      <Collapsible title="Risk factor details">
        <p><strong>Monotone</strong> — Ace-monotone is a risk factor. Bet strong + weak, check medium.</p>
        <p><strong>AKx family</strong> — AK2/AK3/AK4. Slow down — not 100%.</p>
        <p><strong>High-low-low (paired low under high)</strong> — T55, J66, K33. Bet trips + weak, check underpairs.</p>
        <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>
        <p><strong>Straights possible</strong> — 1 straight → still bet frequently. 3 straights → slow down heavily.</p>
        <p><strong>Stack depth</strong> <Tag variant="risk">secondary</Tag> — deeper (→150bb) → caution. Shallower (→20bb) → lean into 100%.</p>
        <p><strong>Blocker nuance (high-low-low):</strong> AT with an ace that blocks backdoor flush draws bets more; AT without that blocker checks more.</p>
      </Collapsible>

      <Collapsible title="Sizing">
        <p>Solver examples land at 20-73% pot: K83, KK3, AJ5 and J66 are solved at 20% (1.1bb), AK2 at 73% (4bb). The transcript does not prescribe a specific size for this system.</p>
      </Collapsible>

      <Subhead>Examples</Subhead>

      <p>The system applied — pick a board on the left. Each card walks the read, then the solver's answer where that board has been solved (40bb single-raised pot).</p>

      <ExampleBrowser>
      <BoardExample
        board="Kh8h3c"
        spot="K83 two-tone (king-high, disconnected, 40bb)"
        action="C-bet 100%"
        actionVariant="bet"
        solve={S1_FLOP_K83}
      >
        Solver agrees — at 20% pot it c-bets 100% of the opening range. Player checked, costing EV.
      </BoardExample>

      <BoardExample
        board="KhKd3c"
        spot="KK3 rainbow (high-high-low)"
        action="C-bet 100%"
        actionVariant="bet"
        solve={S1_FLOP_KK3}
      >
        KK3 is NOT a risk factor (high-low-low would be K33). Player checked — mistake.
      </BoardExample>

      <BoardExample
        board="AsKh2c"
        spot="AK2 (AKx family)"
        action="Mix"
        actionVariant="check"
        solve={S1_FLOP_AK2}
      >
        AKx is a risk factor: BB connects with every Ax/Kx too, so the overpair
        advantage that powers 100% c-bets on clean boards is gone. Slow down —
        not 100%.
      </BoardExample>

      <BoardExample
        board="AhJh5h"
        spot="AJ5 monotone (ace-high monotone)"
        action="Mix"
        actionVariant="check"
        solve={S1_FLOP_MONOTONE}
      >
        Risk factor, softened by the small size. Bet sets, heart draws and trash; check the no-heart overpairs (KK most, then 99/TT/QQ).
      </BoardExample>

      <BoardExample
        board="Jh6s6d"
        spot="J66 (high-low-low, paired)"
        action="Mix"
        actionVariant="check"
        solve={S1_FLOP_J66}
      >
        Risk factor, softened by the small size. Bet trips (6x), JJ and Ax; check QJo — the middle pairs (TT-88) are near 50/50 splits.
      </BoardExample>
      </ExampleBrowser>

      <Subhead>Ranges</Subhead>
      <Tabs tabs={[
        {
          label: 'UTG RFI',
          content: (
            <>
              <p>UTG's opening range — the starting point of this system. ChipEV solutions at 6-40bb: pure 2bb opens at 20bb+, a raise/jam mix at 10-15bb, all-in below that. Switch stacks with the selector.</p>
              <RangeBrowser ranges={UTG_RFI_CEV} />
            </>
          ),
        },
        {
          label: 'BB vs UTG',
          content: (
            <>
              <p>BB's defense vs the UTG open — raise (3-bet) and call frequencies.</p>
              <RangeBrowser ranges={BB_VS_UTG_CEV} />
            </>
          ),
        },
      ]} />
    </Section>
  )
}

export default S1Page
