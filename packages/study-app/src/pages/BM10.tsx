import { Section, Callout, Code, Action, Tabs, Collapsible, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM10Page() {
  return (
    <Section title="UTG Covers BB — Postflop">
      <p>UTG covers BB on the bubble. Two sides: BB defense (module 15) and UTG c-betting (module 16). UTG c-bets at very high frequency (~90%+) when covering by 2x+, because BB's tight defense range lacks low-board coverage. Checking ranges develop as stacks get deeper or closer.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <Callout variant="warn"><strong>The stack gap matters more than the fact that you cover.</strong> Covering by 2x+ → range bet. Stacks within ~8-10bb → check 50% on mid connected boards. "I cover" is not enough information.</Callout>
              
                      <h3>Board class × side</h3>
<DataTable columns={[{ header: 'Board class' }, { header: 'BB defense (covered)' }, { header: 'UTG c-bet (covering)' }]} rows={[[<><strong>Low disconnected (854, 752, A44)</strong></>, <><Action variant="call">Mostly check-call</Action> — Tight range lacks connection.</>, <><Action variant="bet">Range bet</Action> — BB folds offsuit connectors — can't connect.</>],
                  [<><strong>Mid connected (977, 764, J97)</strong></>, <><Action variant="call">Check-call / check-raise (deep)</Action> — Range composition overrides texture.</>, <><Action variant="check">Range bet (2x+); ~50% (close)</Action> — Stack gap determines.</>],
                  [<><strong>AK7, AQ2 (high)</strong></>, <><Action variant="call">Tight check-call</Action> — KQ only check-raise (short).</>, <><Action variant="check">Big bet/check split (40bb+ BB)</Action> — Check QQ/JJ/TT/weak Ax; bet large strong.</>],
                  [<><strong>Ace-low paired (A88, A77, A66)</strong></>, <><Action variant="call">Check-call mostly</Action> — Short: barely has the pair.</>, <><Action variant="bet">Range bet (short BB)</Action> — ICM pressure overrides; checks develop deeper.</>]]} /><Collapsible title="Core Rules — BB Defense (covered, short)">
              <DataTable columns={[{ header: 'Rule' }, { header: 'Detail' }]} rows={[[<><strong>Check-shove is a mistake vs UTG</strong></>, <>IP folds only ~60%; need &gt;75% for check-jam. UTG range too strong (sets, overpairs, TPTK).</>],
                  [<><strong>Check-raise threshold (short, ICM)</strong></>, <>KQ only on K84. KJ/KT/K9 and below = pure check-call. Much stronger than chipEV.</>],
                  [<><strong>Range composition overrides board texture</strong></>, <>944 looks good for BB, but if BB's defense range doesn't include offsuit 9x/4x (short), check-raising is wrong.</>],
                  [<><strong>Flush turns favor the short stack</strong></>, <>Short BB: flushes 17.8% of range (suited-heavy). Deep: 12.5%. Short leads more on flush turns.</>],
                  [<><strong>A♠ turn &gt; 4♠ turn for BB</strong></>, <>A♠ removes IP's suited aces. BB leads 40% on A♠, 26% on 4♠.</>]]} />
                      <Callout variant="bad"><strong>Bet LESS when you have the nuts on the bubble — leave 1-3bb behind.</strong> Shoving all-in when called and losing means zero tournament equity. Leaving 2bb means you're still alive — those 2bb are worth ~$200 in a $100 tournament on the bubble vs ~$0 early game.</Callout>
              </Collapsible><Collapsible title="Core Rules — UTG C-bet (covering)">
              <p><strong>Covering by 2x+ (~90%+ c-bet):</strong> Range bet or near-range-bet almost all boards. Even boards that check in chipEV (854 two-tone, 752, A44) are range-bets because BB's tight defense range lacks coverage.</p>
                      <p><strong>Stacks close (game of chicken):</strong> ~50% c-bet on mid connected boards. BB leads some boards. UTG opens tighter (~27%). Board-dependent. The stack gap matters more than coverage.</p>
                      <p><strong>40bb+ BB covered:</strong> Big-bet/check split on AK7, AQ2: check back QQ/JJ/TT/weak Ax/Kx; bet very large (67-80%) with strong hands.</p>
              </Collapsible><Collapsible title="Risk factors">
              <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Tighter opener = stronger IP range</strong></>, <>UTG ~20-24% vs late position much wider. Kills check-shove profitability.</>],
                  [<><strong>Flush-completing turns favor short BB</strong></>, <>Short has 17.8% flushes (suited-heavy) vs deep 12.5%.</>],
                  [<><strong>A♠ vs low spade turn</strong></>, <>A♠ better for BB (removes IP suited aces). BB leads 40% on A♠, 26% on 4♠.</>],
                  [<><strong>BB's preflop range determines c-bet strategy</strong></>, <>Not just "I cover." If BB defends wider (deeper, closer), they have more low-mid coverage → check more.</>],
                  [<><strong>ICM pressure is directional</strong></>, <>Cover by heaps → range bet (losing still leaves working stack). Close → check more (losing is catastrophic).</>]]} />
              </Collapsible><Collapsible title="Sizing">
              <p>River polar bet: <Code>~13.5bb</Code> leaving 1-3bb behind — never shove. Block-bet thin value ~40% pot. Check-raise short: ~4.3bb (no leverage); deep: ~6.5bb (turn/river threat). Check-shove needs &gt;75% fold; UTG folds only ~60% → mistake.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="UTG Covers BB — Practice"
              quiz={{
                options: [
                  { label: 'Range bet (cover 2x+)', variant: 'bet' },
                  { label: 'Check ~50% (close stacks)', variant: 'check' },
                  { label: 'Big bet/check split (40bb+ BB)', variant: 'bet' },
                  { label: 'BB check-call (KQ raises)', variant: 'call' },
                ],
                scenarios: [
                  { board: { high: '9', variant: 'green' }, correct: { label: 'Range bet (cover 2x+)', variant: 'bet' }, explanation: 'Low disconnected (854, 752, A44): range bet when covering by 2x+. BB folds offsuit connectors — can\'t connect.' },
                  { board: { high: '9', paired: true, variant: 'green' }, correct: { label: 'Range bet (cover 2x+)', variant: 'bet' }, explanation: '977-type: range bet. BB\'s tight defense lacks 7x. Cover by 2x+ → ~90%+ c-bet.' },
                  { board: { high: '9', connected: true, variant: 'orange', label: 'Mid connected (764)' }, correct: { label: 'Check ~50% (close stacks)', variant: 'check' }, explanation: 'Mid connected (764, J97) with close stacks → ~50% check. Stack gap matters more than coverage.' },
                  { board: { high: 'A', variant: 'orange' }, correct: { label: 'Big bet/check split (40bb+ BB)', variant: 'bet' }, explanation: 'AK7, AQ2 with 40bb+ BB covered: big bet/check split. Check QQ/JJ/TT/weak Ax/Kx; bet large (67-80%) strong.' },
                  { board: { high: 'K', variant: 'green' }, correct: { label: 'BB check-call (KQ raises)', variant: 'call' }, explanation: 'BB defense (covered, short): K84 → check-call. ICM threshold: KQ only. KJ/KT/K9 and below = pure check-call.' },
                  { board: { high: 'A', paired: true, variant: 'green' }, correct: { label: 'Range bet (cover 2x+)', variant: 'bet' }, explanation: 'Ace-low paired (A88, A77, A66): range bet (short BB). ICM pressure overrides; checks develop deeper.' },
                ],
              }}
              questions={[
                { question: 'What matters more than "I cover"?', options: ['The stack gap — covering by 2x+ → range bet; close stacks → check 50%', 'Absolute stack size', 'Board texture', 'Your hand'], correct: 0, explanation: 'Cover by 2x+ → range bet (~90%+). Stacks within ~8-10bb → check 50% on mid connected. "I cover" is not enough info.' },
                { question: 'Why is check-shove a mistake for BB vs UTG?', options: ['UTG folds only ~60%; need >75% for check-jam. UTG range too strong', 'BB has no equity', 'It\'s too small', 'It\'s too big'], correct: 0, explanation: 'No check-shove vs UTG. IP folds only ~60%; need >75% for check-jam. UTG range too strong (sets, overpairs, TPTK).' },
                { question: 'What is the BB check-raise threshold under ICM (short)?', options: ['KQ only on K84. KJ/KT/K9 and below = pure check-call', 'Any top pair', 'KJ+', 'Any king'], correct: 0, explanation: 'ICM threshold: KQ only. ChipEV: KJ/KT/K9 pure check-raise. ICM threshold much stronger.' },
                { question: 'Why leave 1-3bb behind on the river (never shove)?', options: ['Those 2bb are worth ~$200 in a $100 tourney. Shoving when called+lose = zero equity', 'It\'s a mistake', 'You lose fold equity', 'Pot odds'], correct: 0, explanation: 'Bet ~13.5bb leaving 1-3bb behind. NEVER shove. 1-3bb worth ~$200 in $100 tourney. Shoving when called+lose = zero tournament equity.' },
                { question: 'What happens on flush-completing turns?', options: ['Short BB leads more (17.8% flushes vs deep 12.5%)', 'Deep BB leads more', 'No one leads', 'UTG leads'], correct: 0, explanation: 'Short BB: flushes 17.8% of range (suited-heavy). Deep: 12.5%. Short leads more on flush turns. A♠ turn > 4♠ turn for BB (removes IP suited aces).' },
                { question: 'What is the river polar sizing?', options: ['~13.5bb leaving 1-3bb behind — never shove', 'All-in', 'Half pot', 'Quarter pot'], correct: 0, explanation: 'River polar bet: ~13.5bb leaving 1-3bb behind. Block-bet thin value ~40% pot. Check-raise short: ~4.3bb (no leverage).' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM10Page
