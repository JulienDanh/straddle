import { Section, Callout, Action, Tabs, Collapsible, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM7Page() {
  return (
    <Section title="Identifying Bubble Impact">
      <p>How to gauge ICM pressure before looking at ranges. Pressure is driven by what % of the field the remaining players-to-bust represent, plus table-stack positions, blind increases, and other-table dynamics the solver can't fully model.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <StackMatrix
                colAxisLabel="Pressure level"
                rowAxisLabel="Factor"
                colLabels={['Lower pressure (looser)', 'Higher pressure (tighter)']}
                rows={[
                  { label: '% of field to bust', cells: [
                    { content: <><Action variant="bet">1/16 = 6.25%</Action> — each remaining player matters less.</>, variant: 'bet' },
                    { content: <><Action variant="fold">1/8 = 12.5%</Action> — each player matters more → tighter.</>, variant: 'fold' },
                  ]},
                  { label: 'Other-table stacks', cells: [
                    { content: <><Action variant="call">Threatened stack has full orbit</Action> — can play closer to default.</>, variant: 'call' },
                    { content: <><Action variant="fold">4bb stack posts BB next hand</Action> — tighten; nearly locked to cash.</>, variant: 'fold' },
                  ]},
                  { label: 'You cover other-table short', cells: [
                    { content: <><Action variant="bet">Short stack far from blinds</Action> — looser than default.</>, variant: 'bet' },
                    { content: <><Action variant="fold">Short stack posting next</Action> — tighten; risk premium spikes.</>, variant: 'fold' },
                  ]},
                  { label: 'Your stack size', cells: [
                    { content: <><Action variant="bet">Chip leader</Action> — 1-2% error costs little. Study less precisely.</>, variant: 'bet' },
                    { content: <><Action variant="call">Short stack</Action> — 1-2% error costs 10-20% of stack. Study precisely.</>, variant: 'call' },
                  ]},
                ]}
              />

              <Callout variant="warn"><strong>One player left to bust is not one answer.</strong> 1/8 = 12.5% (tight), 1/16 = 6.25% (looser), 2/152 = 1.3% (extreme). The absolute number is meaningless without the %.</Callout>

              <Collapsible title="Bubble-impact buckets">
                <DataTable columns={[{ header: 'Bucket' }, { header: 'Direction' }]} rows={[[<><strong>% of field left to bust</strong></>, <>Higher % (12.5%) → tighter; lower % (1.3%) → slightly looser.</>],
                  [<><strong>Stacks at other tables</strong></>, <>Short stacks elsewhere + you cover them → tighter opens (nearly locked to cash).</>],
                  [<><strong>Position of those stacks</strong></>, <>4bb stack posting BB next → tight; full orbit left → closer to default.</>],
                  [<><strong>Blind increases</strong></>, <>Who's getting hit — short/micro stacks affected; big stacks barely.</>],
                  [<><strong>Someone already busting</strong></>, <>Other table busts a player you cover → you're now a lock to cash → play tighter, not looser.</>]]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Shorter stacks at other tables (you cover)</strong></>, <>Tighten the default range.</>],
                  [<><strong>Short stack posting BB next hand</strong></>, <>Tighten.</>],
                  [<><strong>Blind increase about to hit micro-stack</strong></>, <>Tighten.</>],
                  [<><strong>Fewer players per table to bust</strong></>, <>2 of 16 vs 2 of 57 → tighter.</>],
                  [<><strong>You're short yourself</strong></>, <>Adjustments cost a larger % of your stack (10-20% vs 1-2% for chip leader).</>]]} />
                <Callout variant="good"><strong>Short-stack range precision matters more than big-stack range precision.</strong> A 1-2% open-freq error costs a short stack 10-20% of their stack; the same error costs the chip leader 1-2%. Spend study time on the short-stack ranges.</Callout>
              </Collapsible>

              <Collapsible title="What the sim can't capture">
                <ul>
                  <li>Stack positions at other tables.</li>
                  <li>Who posts blinds next hand.</li>
                  <li>Blind increases.</li>
                  <li>Whether someone else is already busting.</li>
                </ul>
                <p>You must reason about these yourself. The sim gives you a baseline; FGS + table logic gives you the directional shifts at the margins.</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="Identifying Bubble Impact — Practice"
              questions={[
                { question: 'Why is "one player left to bust" not one answer?', options: ['The % of the field matters: 1/8 = 12.5% (tight), 1/16 = 6.25% (looser), 2/152 = 1.3% (extreme)', 'It is always the same', 'Only the absolute number matters', 'It depends on your hand'], correct: 0, explanation: '1/8 = 12.5% → tighter. 1/16 = 6.25% → looser. 2/152 = 1.3% → extreme. The absolute number is meaningless without the %.' },
                { question: 'What is the higher-pressure bubble scenario?', options: ['1/8 = 12.5% of field to bust', '1/16 = 6.25%', '2/152 = 1.3%', '100/152'], correct: 0, explanation: 'Higher % (12.5%) → tighter. Each player matters more → tighten.' },
                { question: 'How does a short stack\'s position at another table affect you?', options: ['4bb posting BB next → tighten; full orbit left → closer to default', 'Always tighten', 'Always loosen', 'No effect'], correct: 0, explanation: '4bb stack posting BB next hand → tighten (nearly locked to cash). Full orbit left → closer to default.' },
                { question: 'Why does short-stack range precision matter more?', options: ['A 1-2% open-freq error costs a short stack 10-20% of their stack; chip leader only 1-2%', 'Short stacks play more hands', 'Chip leaders make more errors', 'It doesn\'t'], correct: 0, explanation: 'Spend study time on short-stack ranges. A 1-2% error costs the short stack 10-20% of stack; the same error costs the chip leader 1-2%.' },
                { question: 'What can the sim NOT capture that you must reason about yourself?', options: ['Stack positions at other tables, who posts blinds next, blind increases, someone already busting', 'Hand ranges', 'Pot odds', 'Bet sizing'], correct: 0, explanation: 'The sim gives a baseline. FGS + table logic gives directional shifts at the margins. Stack positions, blind posts, increases, other-table busts are yours to reason about.' },
                { question: 'What happens when someone at another table busts a player you cover?', options: ['You\'re now a lock to cash → play tighter to protect it', 'Nothing changes', 'You should loosen up', 'You should shove everything'], correct: 0, explanation: 'Other table busts a player you cover → you\'re now a lock to cash → play tighter, not looser. Protect your guaranteed ITM status.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM7Page
