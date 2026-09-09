import { Section, Callout, Code, Action, Tabs, Collapsible } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM1Page() {
  return (
    <Section title="ICM vs ChipEV — Preflop Adjustments">
      <p>Equal stacks on the bubble. We compare ICM-adjusted preflop ranges to ChipEV to identify the repeating shifts: blockers gain value, speculative hands and cold calls drop, value thresholds tighten, shoves fade.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <h3>ChipEV vs ICM-Adjusted</h3>
              <table>
                <tr><th>Category</th><th>ChipEV</th><th>ICM-Adjusted</th></tr>
                <tr><td><strong>Opens</strong></td><td>Wide; suited connectors, low pairs, offsuit broadways</td><td><Action variant="bet">Tighter; drop speculative, add Ace-X blockers</Action> — A2s, A9o in; 76s, 55 out</td></tr>
                <tr><td><strong>3-bet bluffs</strong></td><td>Board-coverage (suited connectors, gappers)</td><td><Action variant="bet">Blocker-heavy (Ace-X suited, King-X suited)</Action> — block their 3-bet bluffs</td></tr>
                <tr><td><strong>3-bet value</strong></td><td>AK, QQ, JJ, TT all mixing</td><td><Action variant="bet">Kings+; Queens flat; AKo barely 3-bets</Action></td></tr>
                <tr><td><strong>Cold calling</strong></td><td>Wide; speculative hands, suited aces, mid pairs</td><td><Action variant="call">Narrower; cold-call strong (AQo, AJs, KQ)</Action></td></tr>
                <tr><td><strong>Shoving (mid stacks)</strong></td><td>Common for AK, QQ/JJ</td><td><Action variant="fold">Shoves fade; min-raise or non-all-in 3-bet</Action> — preserve tournament life</td></tr>
              </table>

              <Callout variant="warn"><strong>Blockers become MORE valuable than playability in ICM.</strong> A2s opens where Q9s folds. A9o opens where T9s folds. You're blocking 3-bet bluffs, not playing postflop — because opponents 3-bet/fold, not cold call.</Callout>

              <Collapsible title="The five shifts">
                <table>
                  <tr><th>Shift</th><th>Rule</th></tr>
                  <tr><td><strong>1. Blockers up, playability down</strong></td><td>Ace-X blockers gain value; suited connectors and low pairs lose it.</td></tr>
                  <tr><td><strong>2. Cold-call stronger = less capped</strong></td><td>Calling AQo/AJs/KQ means high-card board coverage — opponent can't barrel you off.</td></tr>
                  <tr><td><strong>3. Value threshold tightens</strong></td><td>Queens often flat, AKo barely 3-bets, Kings+ becomes default.</td></tr>
                  <tr><td><strong>4. Shoves fade</strong></td><td>Min-raise or non-all-in 3-bet replaces open shoves on direct bubble.</td></tr>
                  <tr><td><strong>5. Smaller sizing (SB vs BTN), tighter defense</strong></td><td>ICM SB 3-bet vs BTN 7.35bb vs 8.6bb ChipEV — yet defense is still tighter (risk premium &gt; price). Note: BB 3-bets vs opens trend larger (see BM5).</td></tr>
                </table>
              </Collapsible>

              <Collapsible title="Risk factors">
                <table>
                  <tr><th>Factor</th><th>Effect</th></tr>
                  <tr><td><strong>Opponent behind overfolds</strong></td><td>Keep zero-EV fringe opens — worth more than sim says.</td></tr>
                  <tr><td><strong>Opponent behind too loose</strong></td><td>Drop zero-EV fringe opens — they won't fold enough for blockers to work.</td></tr>
                  <tr><td><strong>You're very deep (35-40bb+) in BB</strong></td><td>Cold calling less risky — opponent needs full stack to move you off equity.</td></tr>
                  <tr><td><strong>You're short (20bb) cold calling</strong></td><td>Cold calling fades aggressively — calling 2bb off 20bb is too large a % of stack.</td></tr>
                  <tr><td><strong>FGS: short stacks at other tables</strong></td><td>Tighten further — folding has positive $EV.</td></tr>
                </table>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>BTN open <Code>2.1x</Code> (ICM) vs <Code>2.3x</Code> (ChipEV). SB 3-bet vs BTN <Code>7.35bb</Code> (ICM) vs <Code>8.6bb</Code> (ChipEV). Smaller sizing in ICM, yet defense plays a narrower, more polar range — the risk premium overwhelms the price.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="ICM vs ChipEV — Practice"
              questions={[
                { question: 'What happens to blockers vs playability in ICM?', options: ['Blockers become MORE valuable than playability', 'Playability becomes more valuable', 'They are equal', 'Neither matters'], correct: 0, explanation: 'A2s opens where Q9s folds. A9o opens where T9s folds. You\'re blocking 3-bet bluffs, not playing postflop — opponents 3-bet/fold, not cold call.' },
                { question: 'What is the 3-bet value threshold under ICM?', options: ['Kings+. Queens flat. AKo barely 3-bets', 'QQ+, AK', 'JJ+, AQ', 'All pairs'], correct: 0, explanation: 'Value threshold tightens. Queens often flat, AKo barely 3-bets, Kings+ becomes default.' },
                { question: 'What happens to shoves under ICM?', options: ['Shoves fade — min-raise or non-all-in 3-bet instead', 'Shoves increase', 'No change', 'Only jam AA'], correct: 0, explanation: 'Shoves fade on the direct bubble. Min-raise or non-all-in 3-bet replaces open shoves.' },
                { question: 'What happens to 3-bet sizing in ICM vs ChipEV?', options: ['Smaller (7.35bb ICM vs 8.6bb chip), yet defense is still tighter', 'Larger in ICM', 'Same size', 'Always jam'], correct: 0, explanation: 'ICM 3-bet 7.35bb vs 8.6bb ChipEV — yet defense is still tighter. Risk premium overwhelms the price.' },
                { question: 'What are ICM 3-bet bluffs made of?', options: ['Blocker-heavy (Ace-X suited, King-X suited)', 'Suited connectors and gappers', 'Low pairs', 'Offsuit broadways'], correct: 0, explanation: '3-bet bluffs shift from board-coverage (suited connectors) to blocker-heavy (Axs, Kxs). Block their 3-bet bluffs.' },
                { question: 'What happens to cold calling under ICM?', options: ['Fades aggressively — narrow + shove with blockers', 'Widens', 'No change', 'Only call premiums'], correct: 0, explanation: 'Cold calling fades aggressively. Massive chip cold-call range → narrow + shove in ICM. Pairs mostly fold.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM1Page
