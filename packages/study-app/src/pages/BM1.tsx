import { Section, Callout, Code, Action, Tabs, Collapsible, DataTable } from '@poker/design-system/src/components/ui'
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
              <DataTable columns={[{ header: 'Category' }, { header: 'ChipEV' }, { header: 'ICM-Adjusted' }]} rows={[[<><strong>Opens</strong></>, <>Wide; suited connectors, low pairs, offsuit broadways</>, <><Action variant="bet">Tighter; drop speculative, add Ace-X blockers</Action> — A2s, A9o in; 76s, 55 out</>],
                  [<><strong>3-bet bluffs</strong></>, <>Board-coverage (suited connectors, gappers)</>, <><Action variant="bet">Blocker-heavy (Ace-X suited, King-X suited)</Action> — block their 3-bet bluffs</>],
                  [<><strong>3-bet value</strong></>, <>AK, QQ, JJ, TT all mixing</>, <><Action variant="bet">Kings+; Queens flat; AKo barely 3-bets</Action></>],
                  [<><strong>Cold calling</strong></>, <>Wide; speculative hands, suited aces, mid pairs</>, <><Action variant="call">Narrower; cold-call strong (AQo, AJs, KQ)</Action></>],
                  [<><strong>Shoving (mid stacks)</strong></>, <>Common for AK, QQ/JJ</>, <><Action variant="fold">Shoves fade; min-raise or non-all-in 3-bet</Action> — preserve tournament life</>]]} />

              <Callout variant="warn"><strong>Blockers become MORE valuable than playability in ICM.</strong> A2s opens where Q9s folds. A9o opens where T9s folds. You're blocking 3-bet bluffs, not playing postflop — because opponents 3-bet/fold, not cold call.</Callout>

              <Collapsible title="The five shifts">
                <DataTable columns={[{ header: 'Shift' }, { header: 'Rule' }]} rows={[[<><strong>1. Blockers up, playability down</strong></>, <>Ace-X blockers gain value; suited connectors and low pairs lose it.</>],
                  [<><strong>2. Cold-call stronger = less capped</strong></>, <>Calling AQo/AJs/KQ means high-card board coverage — opponent can't barrel you off.</>],
                  [<><strong>3. Value threshold tightens</strong></>, <>Queens often flat, AKo barely 3-bets, Kings+ becomes default.</>],
                  [<><strong>4. Shoves fade</strong></>, <>Min-raise or non-all-in 3-bet replaces open shoves on direct bubble.</>],
                  [<><strong>5. Smaller sizing (SB vs BTN), tighter defense</strong></>, <>ICM SB 3-bet vs BTN 7.35bb vs 8.6bb ChipEV — yet defense is still tighter (risk premium &gt; price). Note: BB 3-bets vs opens trend larger (see BM5).</>]]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Opponent behind overfolds</strong></>, <>Keep zero-EV fringe opens — worth more than sim says.</>],
                  [<><strong>Opponent behind too loose</strong></>, <>Drop zero-EV fringe opens — they won't fold enough for blockers to work.</>],
                  [<><strong>You're very deep (35-40bb+) in BB</strong></>, <>Cold calling less risky — opponent needs full stack to move you off equity.</>],
                  [<><strong>You're short (20bb) cold calling</strong></>, <>Cold calling fades aggressively — calling 2bb off 20bb is too large a % of stack.</>],
                  [<><strong>FGS: short stacks at other tables</strong></>, <>Tighten further — folding has positive $EV.</>]]} />
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
