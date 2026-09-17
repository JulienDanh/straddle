import { Section, Callout, Leak, Action, BoardType, Tabs, Subhead, DataTable, DecisionTree } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_RFI_CEV, BB_VS_UTG_CEV } from '@poker/design-system/src/data/ranges'

export function S1Page() {
  return (
    <Section title="System 1 — UTG RFI vs BB Call · C-betting">
      <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>

      <Leak items={[
      ['Betting less when shallow', 'bet more'],
      ['Checking medium-strength hands', 'the range becomes vulnerable to aggression — pros routinely check back T-high+ clean boards, a systematic error this system corrects'],
      ]} />

      
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

      <Subhead>Heuristics</Subhead>
      <ul className="list-disc pl-5 text-[13px] text-txt space-y-0.5">
        <li>"Bet top, bet bottom, check middle"</li>
        <li>"Bet MORE when shallow, not less"</li>
        <li>"High-low-low IS a risk factor; high-high-low is NOT"</li>
      </ul>

      <Subhead>Why bet 100% on T-high+?</Subhead>
      <p className="text-[13px] text-muted leading-snug"><strong className="text-txt">Overpair asymmetry</strong> — UTG has far more strong pairs than the BB caller. Shorter stacks amplify it (bet more); deeper stacks demand more caution.</p>

      <Subhead>Risk factors</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Factor' }, { header: 'Response' }]}
        rows={[
          ['Monotone (ace-high)', 'Still 20% — the risk is priced by checking more (the no-heart overpairs check)'],
          ['AKx family — AK2/AK3/AK4', 'Slow down — not 100%'],
          ['High-low-low — paired low under high (T55, J66, K33)', 'Bet trips + weak, check underpairs'],
          ['Straights — 1 straight', 'Bet frequently'],
          ['Straights — 3+ straights', 'Slow down heavily'],
          ['Stack depth (secondary)', 'Deeper (→150bb) caution · shallower (→20bb) lean into 100%'],
          ['Blocker nuance (high-low-low)', 'AT with the backdoor-flush-blocking ace bets more; without it, check'],
        ]}
      />
      <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Branch' }, { header: 'Size' }, { header: 'At 40bb' }]}
        rows={[
          ['T-high+ clean — range bet', '20% pot', '1.1bb'],
          ['Monotone ace-high · high-low-low (soft risk factors)', '20% pot — handle the risk by checking more, not by sizing up', '1.1bb'],
          ['Mix branch — AKx family · 9-high & below · straights possible · broadway-low (BB connects)', '~73% pot — the polar branch needs the big size', '4bb'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">
        The transcript does not prescribe sizes — these come from the solved spots (40bb single-raised pot, 5.5bb after antes, so 20% pot = 1.1bb).
        The small size grows with depth: 1.1bb (20%) at 40bb, 1.8bb (33%) at 50bb, ~2bb at 100bb, where the polar branch reaches overbet territory (6.5bb on AK2).
      </p>


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
