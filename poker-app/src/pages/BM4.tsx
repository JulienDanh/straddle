import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["SB covers short BB on bubble — limp or shove?","Shove/raise, no limps. BB overfolds ~85%; limping gives free equity."],["Limping reappears for covered SB at?","~18bb effective. Below: pure shove/fold."],["Open-shove selection covered in ICM?","Shift up — drop A2s/A3s, shove AJo+ threshold, mid pairs over low pairs."],["Close stacks BvB (14 vs 16bb)?","Wider VPIP. Game of chicken — BB can't defend wide (losing hurts them)."],["40+bb covered SB — limp-shove?","Disappears. Limp-call pairs; BB can't pile vs uncapped trapping range."],["BB fold freq vs SB cover (short)?","~78-90% (vs ~37% chip model)."],["Covering SB at 22bb — shove or limp?","Depends on other-table ICM pressure. More pressure = more shoving."],["Covered deep (37+bb) — BB ISO?","~49.5% (vs 42% chips). SB overfolds to ISO; limp-shoves less."]]
const quizzes: QuizQuestion[] = [{q:"SB 11bb covers BB on bubble. Limp or shove?",o:["Limp — see cheap flop","Shove/raise — BB overfolds ~85%, limping gives free equity","Min-raise all","Limp-fold"],a:1,why:"BB overfolds ~85%. Limping gives free equity realization to hands that'd fold to shove."},{q:"Limping reappears for covered SB at what depth?",o:["10bb","18bb","25bb","30bb"],a:1,why:"~18bb effective — deep enough that BB can't easily leverage against a limp."},{q:"SB 14bb vs BB 16bb. VPIP vs BB 45bb?",o:["Tighter","Wider — game of chicken, BB can't defend wide","Same","Always fold"],a:1,why:"Close stacks: losing hurts BB more → BB defends tighter → SB wider."},{q:"Covered SB 37+bb. Limp-shove pairs?",o:["Yes","Disappears — limp-call; BB can't pile vs uncapped traps","More","Never limp"],a:1,why:"SB uncapped with traps at depth; BB can't pile. Limp-call instead."},{q:"Covering SB at 22bb — shove or limp?",o:["Always shove","Depends on other-table ICM pressure","Always limp","Fold"],a:1,why:"More other-table pressure = more shoving; less = more limping."},{q:"BB fold freq vs SB cover (short) vs chip model?",o:["~37% both","~78-90% (ICM) vs ~37% (chip)","~50%","Same"],a:1,why:"ICM pressure roughly doubles BB fold frequency."}]

const examples: HandExample[] = [
  { tag: "Covering short — shove", tagVariant: "default", board: <>SB 11bb · BB 12bb · SB covers</>, desc: "Covering a short BB", verdict: "agree", verdictText: "System agrees", system: "Pure shove/raise, no limps. BB overfolds ~85%.", solver: "BB folds ~85% (vs ~37% chip). Limping = free equity to folders." },
  { tag: "Covered short — fold", tagVariant: "fold", board: <>SB 10bb · BB 45bb · SB covered</>, desc: "Covered, short, direct bubble", verdict: "agree", verdictText: "System agrees", system: "No limps; tight shove/fold (~33% VPIP).", solver: "Limping reappears at 25% field left, gone on direct bubble." },
  { tag: "Game of chicken", tagVariant: "risk", board: <>SB 14bb · BB 16bb</>, desc: "Close stacks", verdict: "agree", verdictText: "System agrees", system: "Wider VPIP; more open-shoving than vs big stack.", solver: "BB can't defend wide — losing hurts BB's equity." },
  { tag: "Limping threshold", tagVariant: "risk", board: <>SB 18bb · BB 30bb · SB covered</>, desc: "Covered, deeper", verdict: "agree", verdictText: "System agrees", system: "Limping begins; raise-fold marginal. ~18bb is the threshold.", solver: "BB ISO tighter than chips." },
  { tag: "Deep — pure limp", tagVariant: "default", board: <>SB 37bb · BB 45+bb · SB covered</>, desc: "Covered, deep", verdict: "agree", verdictText: "System agrees", system: "Pure limp. BB ISO ~49.5%. No limp-shove at 40+bb — limp-call pairs.", solver: "BB can't pile vs uncapped, trapping range." },
]

export function BM4Page() {
  return (
    <>
      <Section title="Blind vs Blind on the Bubble">
        <p>SB vs BB, one stack covers the other. The covered stack plays very tight (shove/fold, almost no limping short); the covering stack leverages chip advantage with aggressive open-shoving and raising to deny free equity. Limping only reappears at ~18bb+ effective and especially deeper.</p>
        <Callout variant="bad"><strong>Limping is a MISTAKE when you cover a short stack on the bubble.</strong> BB overfolds ~85%. Limping gives free equity realization to hands that would fold to a shove. Shove/raise instead.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["SB covers BB", "SB covered by BB"]}
          intro="Stack situation (row) × who covers (column)."
          rows={[
            { label: "Short (≤12bb)", cells: [
              { action: "Aggressive shove/raise", sub: "No limps. BB overfolds ~85%.", color: "green" },
              { action: "Tight shove/fold", sub: "~33% VPIP. No limps. Folding has value.", color: "red" },
            ]},
            { label: "Close (14-17bb)", cells: [
              { action: "High VPIP", sub: "Game of chicken; more open-shoving.", color: "green" },
              { action: "Wider VPIP", sub: "Game of chicken; BB can't defend wide.", color: "orange" },
            ]},
            { label: "Deeper (18-22bb)", cells: [
              { action: "More raising, some limps", sub: "Less ISO leverage for BB.", color: "orange" },
              { action: "Limping begins", sub: "~18bb threshold. Raise-fold marginal.", color: "orange" },
            ]},
            { label: "Deep (37+bb)", cells: [
              { action: "Lots of limps", sub: "BB can't pile; SB limp range weak/uncapped.", color: "green" },
              { action: "Pure limp", sub: "BB ISO ~49.5%. No limp-shove — limp-call pairs.", color: "green" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>Bb overfolds ~78-90%</strong></td><td>vs ~37% in chip model. ICM pressure roughly doubles BB fold frequency.</td></tr>
          <tr><td><strong>Open-shove selection shifts UP in ICM</strong></td><td>Drop A2s/A3s; AJo becomes threshold (not A2o). Bluffs shift up with value.</td></tr>
          <tr><td><strong>Limp-shove disappears at 40+bb</strong></td><td>Limp-call pairs instead — BB can't pile vs uncapped, trapping range.</td></tr>
          <tr><td><strong>Covering SB at ~22bb</strong></td><td>Shove vs limp depends on other-table ICM pressure. More pressure = more shoving.</td></tr>
        </table>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Other-table short stacks</strong></td><td>Covering SB leans harder into shoving/raising (max ICM pressure on BB).</td></tr>
          <tr><td><strong>BB call frequency</strong></td><td>BB overfolds ~78-90% when covered — limping gives free equity to folders.</td></tr>
          <tr><td><strong>At 25% field left</strong></td><td>Limping reappears for covered short stacks; on direct bubble, gone.</td></tr>
        </table>
      </Section>

      <Section title="Sizing">
        <p>Short covered: pure shove/fold. Close stacks: more open-shoving. Deeper covered (~18bb+): limping begins. Deep (37+bb): pure limp, no limp-shove — limp-call pairs. BB ISO ~49.5% (vs 42% chips) when SB is covered deep.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM4Page
