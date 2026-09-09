import { Section, Callout, Code, Action, Tabs, Collapsible, StackMatrix } from '@poker/design-system/src/components/ui'
import { PracticeFlow } from '@poker/design-system/src/components/PracticeFlow'

export function BM5Page() {
  return (
    <Section title="Blinds Facing an Open on the Bubble">
      <p>Defense from SB and BB versus EP (UTG) and LP (BTN) opens. Short blind stacks (sub ~20bb) play almost pure raise/fold (no cold calls). Deeper stacks and covering stacks introduce cold calls. The BB re-steals aggressively when covered by a wide opener.</p>

      <Tabs tabs={[
        {
          label: 'Study',
          content: (
            <>
              <StackMatrix
                colAxisLabel="Opener position"
                rowAxisLabel="Defender"
                colLabels={['vs EP (UTG) open', 'vs BTN open']}
                rows={[
                  { label: 'SB short (≤20bb)', cells: [
                    { content: <><Action variant="fold">No cold calls; raise/fold</Action> — 3-bet value: Kings+, AQ (Queens mix).</>, variant: 'fold' },
                    { content: <><Action variant="fold">No cold calls; raise/fold</Action> — Re-steal with Ax blockers.</>, variant: 'fold' },
                  ]},
                  { label: 'SB deeper (25+bb)', cells: [
                    { content: <><Action variant="call">Some cold calls begin</Action> — especially if BB is short/handcuffed.</>, variant: 'call' },
                    { content: <><Action variant="bet">Cold calls expand</Action> — SB "almost in the BB" when BB is short.</>, variant: 'bet' },
                  ]},
                  { label: 'BB short (≤15bb)', cells: [
                    { content: <><Action variant="fold">Very tight defense</Action> — some cold calls. Fold dominated offsuit.</>, variant: 'fold' },
                    { content: <><Action variant="call">Tight; re-steal shoves</Action> — Ax blocker-heavy. Don't shy from bust risk.</>, variant: 'call' },
                  ]},
                  { label: 'BB covering opener', cells: [
                    { content: <><Action variant="bet">Defend wide; cold call looser</Action> — fold dominated offsuit. King-X offsuit ~0.</>, variant: 'bet' },
                    { content: <><Action variant="bet">Defend wide; re-steal aggressively</Action> — can donk-lead low/mid boards post.</>, variant: 'bet' },
                  ]},
                ]}
              />

              <Callout variant="warn"><strong>Re-steal MORE, not less, when covered and short.</strong> It feels terrible to shove A5s and bust on the bubble. But playing too passive reduces dollar EV — you cash slightly more often but never double. Think dollar EV, not binary cash/fail.</Callout>

              <Collapsible title="Core rules">
                <table>
                  <tr><th>Rule</th><th>Detail</th></tr>
                  <tr><td><strong>SB cold-call threshold</strong></td><td>~20bb. Below: ~0% cold calls, raise/fold only.</td></tr>
                  <tr><td><strong>SB cold calls wider when BB is short</strong></td><td>BB handcuffed (can't squeeze/lead). SB "almost in the BB" — realizes more equity.</td></tr>
                  <tr><td><strong>Re-steal &gt; cold call when covered</strong></td><td>Win outright more often AND avoid losing postflop ~50%+ of the time.</td></tr>
                  <tr><td><strong>3-bet sizing UP in ICM</strong></td><td>Larger 3-bets deny equity to speculative calls and lower SPR for narrow value.</td></tr>
                  <tr><td><strong>BB defends wider than chips vs tight UTG</strong></td><td>UTG opens 8% on bubble. BB can donk-lead low/mid boards that miss UTG's range.</td></tr>
                </table>
              </Collapsible>

              <Collapsible title="Risk factors">
                <table>
                  <tr><th>Factor</th><th>Effect</th></tr>
                  <tr><td><strong>BB covers both opener and SB</strong></td><td>SB cold calls shrink — BB can squeeze/lead post. SB plays raise/fold.</td></tr>
                  <tr><td><strong>BB is short</strong></td><td>SB cold calls more — BB can't apply pressure (handcuffed).</td></tr>
                  <tr><td><strong>BTN opens 70%+ (BB short)</strong></td><td>SB cold-call range widens more than expected — SB "almost in the BB."</td></tr>
                  <tr><td><strong>Squeeze when SB can't cold call</strong></td><td>BB squeezes very liberally — cold calls don't exist, so squeeze jams print.</td></tr>
                </table>
              </Collapsible>

              <Collapsible title="Sizing">
                <p>3-bet sizing increases in high ICM from the blinds. Size up — deny equity to speculative calls and lower SPR for your narrow value range. BTN open ~71% when BB is short (vs ~53% equal 50bb). BB 3-bet value threshold covered vs EP: <Code>Kings+, AK</Code> (Queens mix).</p>
              </Collapsible>
            </>
          ),
        },
        {
          label: 'Practice',
          content: (
            <PracticeFlow
              title="Blinds Facing Open — Practice"
              questions={[
                { question: 'What is the SB cold-call threshold?', options: ['~20bb. Below: ~0% cold calls, raise/fold only', '~10bb', '~30bb', 'No threshold'], correct: 0, explanation: 'Below ~20bb, SB has essentially zero cold-call range. Raise/fold only.' },
                { question: 'Why does SB cold-call wider when BB is short?', options: ['BB is handcuffed (can\'t squeeze/lead). SB "almost in the BB"', 'SB has more equity', 'BTN opens tighter', 'ICM pressure drops'], correct: 0, explanation: 'BB can\'t squeeze/lead. SB "almost in the BB" — realizes more equity. BTN opens way wider than expected (~71%).' },
                { question: 'Why re-steal MORE (not less) when covered and short?', options: ['Win outright more often AND avoid losing postflop ~50%+', 'You have more fold equity', 'Calling is +EV', 'ICM favors calling'], correct: 0, explanation: 'Calling loses ~50%+ postflop. Re-steal shove with Ax blocker wins outright more often. Think dollar EV, not binary cash/fail.' },
                { question: 'What does BB do when covering a short opener?', options: ['Defend wide; call suited, fold dominated offsuit; donk-lead low/mid', 'Play tight', '3-bet everything', 'Fold'], correct: 0, explanation: 'BB can donk-lead low/mid boards that miss UTG\'s tight range. Call everything suited; fold dominated offsuit (King-X offsuit ~0 EV).' },
                { question: 'What happens to 3-bet sizing in high ICM from the blinds?', options: ['Size UP — deny equity to speculative calls, lower SPR for narrow value', 'Size down', 'No change', 'Always jam'], correct: 0, explanation: '3-bet sizing increases in high ICM. Larger 3-bets deny equity to speculative calls and lower SPR for your narrow value range.' },
                { question: 'What is the BB 3-bet value threshold (covered vs EP)?', options: ['Kings+, AK (Queens mix)', 'JJ+, AQ', 'Any pair', 'AK only'], correct: 0, explanation: 'BB 3-bet value threshold covered vs EP: Kings+, AK (Queens mix). Tighter than chipEV.' },
              ]}
            />
          ),
        },
      ]} />
    </Section>
  )
}

export default BM5Page
