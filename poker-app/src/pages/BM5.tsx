import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["SB cold-call threshold facing open?","~20bb. Below: ~0% cold calls, raise/fold only."],["SB cold calls wider when BB is short — why?","BB handcuffed (can't squeeze/lead). SB 'almost in the BB' — realizes more equity."],["Covered by wide opener — re-steal or call?","Re-steal. Win outright more often AND avoid losing postflop ~50%+ of time."],["3-bet sizing in high ICM from blinds?","Size up — deny equity to speculative calls, lower SPR for narrow value."],["3-bet value threshold covered vs EP?","Kings+, AQ (Queens mix). Much narrower than chip model."],["BB covers opener and SB — SB cold calls?","Shrinks. BB can squeeze/lead post. SB plays closer to raise/fold."],["BB defends wider vs tight UTG open when covering — why?","Can donk-lead low/mid boards that miss UTG's tight range. More equity realization."],["First hands trimmed from BB ICM defense?","Dominated offsuit gappers/connectors, weakest suited, weakest Ax offsuit."]]
const quizzes: QuizQuestion[] = [{q:"SB 17bb facing BTN open, covered. Cold-call freq?",o:["~15% — suited connectors","~0% — raise/fold only","~25%","~5%"],a:1,why:"Below ~20bb, SB has ~0% cold-call range. Raise/fold only."},{q:"BB 14bb, covered, BTN opens wide, A5s. Action?",o:["Call — suited, playable","Re-steal shove — win outright, avoid postflop losses","Fold","Min-3-bet"],a:1,why:"Re-steal wins outright more often; Ax blocker powerful. Calling loses ~50%+ postflop."},{q:"BB 45bb covers UTG 15bb (3x). Defense width?",o:["Very tight — premiums only","Call everything suited, fold dominated offsuit","3-bet bluff any two","Limp behind"],a:1,why:"Cover by heaps → defend wide but trim dominated offsuit. King-X offsuit ~0 EV."},{q:"3-bet sizing in high ICM from blinds?",o:["Smaller than chip","Size up — deny equity, lower SPR for narrow value","Same","Min-raise"],a:1,why:"Larger 3-bets deny equity to speculative calls and lower SPR."},{q:"3-bet value threshold covered vs EP?",o:["AK, QQ, JJ","Kings+, AQ (Queens mix)","Any pair","Looser"],a:1,why:"Much narrower than chip model under ICM risk premium."},{q:"SB cold calls wider when BB is short — why?",o:["BB overcalls","BB handcuffed — can't squeeze/lead; SB 'almost in the BB'","SB has fold equity","No reason"],a:1,why:"BTN opens 70%+; BB can't squeeze or lead post → SB realizes more equity."}]

const examples: HandExample[] = [
  { tag: "SB short — raise/fold", tagVariant: "fold", board: <>SB 17bb · BTN covers · vs BTN open</>, desc: "Short SB defense", verdict: "agree", verdictText: "System agrees", system: "~0% cold calls. Raise/fold only.", solver: "Below ~20bb, SB has essentially zero cold-call range." },
  { tag: "SB wide cold calls (BB short)", tagVariant: "default", board: <>SB 52bb · BB 22bb · BTN opens 71%</>, desc: "BB handcuffed", verdict: "agree", verdictText: "System agrees", system: "Wide cold calls — SB 'almost in the BB.' BB can't squeeze/lead.", solver: "BTN opens way wider than expected. SB realizes more equity." },
  { tag: "Re-steal > call (covered)", tagVariant: "risk", board: <>BB 14bb · BTN covers · A5s</>, desc: "Covered BB defense", verdict: "agree", verdictText: "System agrees", system: "Re-steal shove. Win outright more often; Ax blocker powerful.", solver: "Calling loses ~50%+ postflop. Re-steal avoids that." },
  { tag: "BB defends wide (covering)", tagVariant: "default", board: <>BB 45bb · UTG 15bb (covered 3x) · vs UTG open</>, desc: "Covering a short opener", verdict: "agree", verdictText: "System agrees", system: "Call everything suited; fold dominated offsuit. King-X offsuit ~0 EV.", solver: "BB can donk-lead low/mid boards that miss UTG's tight range." },
  { tag: "BB defends wide (equal, covering)", tagVariant: "default", board: <>BB 26bb · all ~equal · vs UTG open</>, desc: "Equal stacks, BB covers via ICM", verdict: "agree", verdictText: "System agrees", system: "Defend wider than chips. UTG opens only 8%.", solver: "BB realizes equity via donk leads on boards that miss UTG's tight range." },
]

export function BM5Page() {
  return (
    <>
      <Section title="Blinds Facing an Open on the Bubble">
        <p>Defense from SB and BB versus EP (UTG) and LP (BTN) opens. Short blind stacks (sub ~20bb) play almost pure raise/fold (no cold calls). Deeper stacks and covering stacks introduce cold calls. The BB re-steals aggressively when covered by a wide opener.</p>
        <Callout variant="warn"><strong>Re-steal MORE, not less, when covered and short.</strong> It feels terrible to shove A5s and bust on the bubble. But playing too passive reduces dollar EV — you cash slightly more often but never double. Think dollar EV, not binary cash/fail.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["vs EP (UTG) open", "vs BTN open"]}
          intro="Defender stack (row) × opener position (column)."
          rows={[
            { label: "SB short (≤20bb)", cells: [
              { action: "No cold calls; raise/fold", sub: "3-bet value: Kings+, AQ (Queens mix).", color: "red" },
              { action: "No cold calls; raise/fold", sub: "Re-steal with Ax blockers.", color: "red" },
            ]},
            { label: "SB deeper (25+bb)", cells: [
              { action: "Some cold calls begin", sub: "Especially if BB is short/handcuffed.", color: "orange" },
              { action: "Cold calls expand", sub: "SB 'almost in the BB' when BB is short.", color: "green" },
            ]},
            { label: "BB short (≤15bb)", cells: [
              { action: "Very tight defense", sub: "Some cold calls. Fold dominated offsuit.", color: "red" },
              { action: "Tight; re-steal shoves", sub: "Ax blocker-heavy. Don't shy from bust risk.", color: "orange" },
            ]},
            { label: "BB covering opener", cells: [
              { action: "Defend wide; cold call looser", sub: "Fold dominated offsuit. King-X offsuit ~0.", color: "green" },
              { action: "Defend wide; re-steal aggressively", sub: "Can donk-lead low/mid boards post.", color: "green" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>SB cold-call threshold</strong></td><td>~20bb. Below: ~0% cold calls, raise/fold only.</td></tr>
          <tr><td><strong>SB cold calls wider when BB is short</strong></td><td>BB handcuffed (can't squeeze/lead). SB 'almost in the BB' — realizes more equity.</td></tr>
          <tr><td><strong>Re-steal &gt; cold call when covered</strong></td><td>Win outright more often AND avoid losing postflop ~50%+ of the time.</td></tr>
          <tr><td><strong>3-bet sizing UP in ICM</strong></td><td>Larger 3-bets deny equity to speculative calls and lower SPR for narrow value.</td></tr>
          <tr><td><strong>BB defends wider than chips vs tight UTG</strong></td><td>UTG opens 8% on bubble. BB can donk-lead low/mid boards that miss UTG's range.</td></tr>
        </table>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>BB covers both opener and SB</strong></td><td>SB cold calls shrink — BB can squeeze/lead post. SB plays raise/fold.</td></tr>
          <tr><td><strong>BB is short</strong></td><td>SB cold calls more — BB can't apply pressure (handcuffed).</td></tr>
          <tr><td><strong>BTN opens 70%+ (BB short)</strong></td><td>SB cold-call range widens more than expected — SB 'almost in the BB.'</td></tr>
          <tr><td><strong>Squeeze when SB can't cold call</strong></td><td>BB squeezes very liberally — cold calls don't exist, so squeeze jams print.</td></tr>
        </table>
      </Section>

      <Section title="Sizing">
        <p>3-bet sizing increases in high ICM from the blinds. Size up — deny equity to speculative calls and lower SPR for your narrow value range. BTN open ~71% when BB is short (vs ~53% equal 50bb). BB 3-bet value threshold covered vs EP: <Code>Kings+, AQ</Code> (Queens mix).</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM5Page
