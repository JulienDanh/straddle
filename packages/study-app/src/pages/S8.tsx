import { Section, Callout, Action, Tabs, Collapsible, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function S8Page() {
  return (
    <Section title="System 8 — Bet Sizing In Position">
      <p>IP player deciding bet sizing on flop/turn/river. Core mistake: betting too small.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <h3>Sizing by nut ratio</h3>
              <DataTable columns={[{ header: 'Situation' }, { header: 'Sizing' }, { header: 'Why' }]} rows={[[<>Villain capped (low nut ratio)</>, <><Action variant="bet">Overbet / pot</Action></>, <>Geometric to get stacks in. Fold% rises slower than bet size.</>],
                  [<>Both have nuts possible</>, <><Action variant="bet">~70% pot</Action></>, <>Large but not overbet. Nuts frequency constrains sizing.</>],
                  [<>Thin value hand</>, <><Action variant="check">Check</Action></>, <>Don't bet thin hands small. &lt;50% pot almost never correct IP.</>],
                  [<>&lt; 50% pot IP</>, <><Action variant="fold">Almost NEVER</Action></>, <>Small bets don't justify the CR risk.</>],
                  [<>Medium-strong (merge)</>, <><Action variant="bet">Bet pot (merge)</Action></>, <>If folds better AND called by worse (e.g. pocket Queens).</>]]} />

              <Callout variant="bad">Reopening action risks being check-raised off equity. Small bets don't justify that risk. Fold% rises slower than bet size → bigger bets profit more.</Callout>

              <Collapsible title="IP advantage">
                <ul>
                  <li>IP checks → range uncaps on next card (turn improves hands).</li>
                  <li>OOP checks → IP punishes immediately.</li>
                  <li>IP can polarize more → <strong>IP bets larger on average</strong>.</li>
                </ul>
              </Collapsible>

              <Collapsible title="Geometric betting">
                <p>To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn → ~34bb river shove.</p>
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Villain uncapped (can have nuts)</strong></>, <>Don't overbet — ~70% pot</>],
                  [<><strong>Quads risk</strong></>, <>~48 combos. Don't assume villain can't have quads.</>],
                  [<><strong>Turn check-back inflection</strong></>, <>If you checked turn, villain's river check = weakness → bet big</>]]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>Default pot-sized or slightly over; <strong>never sub-half-pot IP</strong>.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="System 8 — Practice"
              quiz={{
                options: [
                  { label: 'Bet big (pot+)', variant: 'bet' },
                  { label: 'Bet ~70%', variant: 'bet' },
                  { label: 'Check', variant: 'check' },
                ],
                scenarios: [
                  { board: { high: 'Q', suit: 'two-tone', label: 'Villain capped' }, correct: { label: 'Bet big (pot+)', variant: 'bet' }, explanation: 'Villain capped — no straights/flushes, few sets. Geometric sizing gets stack in. Fold% rises slower than bet size → bigger bets profit more.' },
                  { board: { high: 'A', suit: 'monotone', label: 'Both have nuts' }, correct: { label: 'Bet ~70%', variant: 'bet' }, explanation: 'Both players can have flushes/straights. Nut ratio high → large but not overbet. ~70% pot constrains sizing.' },
                  { board: { high: 'K', variant: 'green', label: 'Thin value (QJ) on river' }, correct: { label: 'Check', variant: 'check' }, explanation: 'QJ on river is too thin to bet small. You need to win a lot — thin hands check. Don\'t bet thin hands small IP.' },
                  { board: { high: 'Q', suit: 'two-tone', label: 'Villain checked turn' }, correct: { label: 'Bet big (pot+)', variant: 'bet' }, explanation: 'Villain checked turn = inflection point, weak range. Your medium hands are now strong. Bet big.' },
                  { board: { high: 'J', connected: true, suit: 'two-tone' }, correct: { label: 'Bet big (pot+)', variant: 'bet' }, explanation: 'Connected flop with straight draws. Larger sizing denies draw equity. Bet big.' },
                  { board: { high: 'Q', suit: 'two-tone', label: 'Merge (pocket Queens)' }, correct: { label: 'Bet big (pot+)', variant: 'bet' }, explanation: 'Pocket Queens as merge: gets folds from flushes (better) AND calls from pairs/Jx (worse). Both properties = merge bet. Pot-sized.' },
                ],
              }}
              questions={[
                { question: 'What is the core mistake System 8 corrects?', options: ['Betting too small in position', 'Betting too large', 'Checking too much', 'Not bluffing enough'], correct: 0, explanation: 'IP player deciding bet sizing. Core mistake: betting too small. Fold% rises slower than bet size → bigger bets profit more.' },
                { question: 'When villain is capped (low nut ratio), what sizing?', options: ['Overbet / pot (geometric to get stacks in)', '~70% pot', 'Quarter pot', 'Check'], correct: 0, explanation: 'Villain capped → overbet/pot geometric. Fold% rises slower than bet size, so bigger bets profit more.' },
                { question: 'When both players can have nuts, what sizing?', options: ['~70% pot (large but not overbet)', 'Overbet', 'Quarter pot', 'Min-bet'], correct: 0, explanation: 'Both have nuts possible → ~70% pot. Nuts frequency constrains sizing.' },
                { question: 'When is sub-half-pot correct IP?', options: ['Almost NEVER', 'Always on dry boards', 'With strong hands', 'On the river'], correct: 0, explanation: '<50% pot IP almost never correct. Small bets don\'t justify the CR risk. Reopening action risks being CR\'d off equity.' },
                { question: 'What does a thin value hand do IP?', options: ['Check (don\'t bet thin hands small)', 'Bet small', 'Overbet', 'Shove'], correct: 0, explanation: 'Thin value hands check. Don\'t bet thin hands small — <50% pot almost never correct IP.' },
                { question: 'What is geometric betting?', options: ['~pot on both streets to get stacks in over 2', 'Quarter pot on both streets', 'Overbet then check', 'Min-bet then shove'], correct: 0, explanation: 'To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn → ~34bb river shove.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default S8Page
