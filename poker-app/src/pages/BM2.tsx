import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Covering table from EP — how much wider?","Roughly 2x+ baseline. UTG ~16.5% baseline → ~35% when covering."],["What dictates shove vs min-raise when covering on BTN?","BB depth. Heavy open shoves appear when blinds sub-20-25bb; min-raise when 30bb+."],["Covered by one but cover the rest — tighten?","No. Still wider than baseline. Covering player folds ~80%; you pressure stacks you cover."],["BB very short (sub-5bb) — open range composition?","High-card dense, Ax-heavy. Drop suited connectors and low pairs — want raw equity."],["BB deep (40-68bb) — open range composition?","Low suited connectors, low pairs, suited high-low all acceptable — want playability."],["Covered at 12bb BTN vs BB 53bb — how wide?","~20%. Almost no open shoves. Offsuit Ax very poor. Common leak: autopilot shoving."],["Covered at 12bb BTN vs BB 16bb — how wide?","~28% (wider). Closer stacks = game of chicken; BB risks tournament life playing back."],["Why fold low pairs (22-33) when covered and short?","They block the blinds' pair-folds — bad when you rely on fold equity."],["UTG covered by most at 29bb — how tight?","~9%. Folds nines, AJo, KQo, A9s in some configs."],["Common leak at 30-40bb covered on BTN?","Over-tightening. Still ~35%. BB must risk heavily to pressure you."],["Covering and called — disaster?","No. You still cover. Losing the pot doesn't end your tournament; you retain equity."],["FGS effect when short stacks at other tables?","Tighten further — folding has positive $EV when others may bust before you."]]
const quizzes: QuizQuestion[] = [{q:"You cover table from UTG at 100bb, table 20-50bb. How wide?",o:["~16.5% (baseline)","~9% (covered-tight)","~35% (~2x+ baseline)","~50%"],a:2,why:"Covering by 2x+ expands UTG to ~35%, like a 30bb CO open in chips."},{q:"BTN 80bb, BB 73bb (close). How wide?",o:["~75% (max)","~68% — closer stacks dial back","~35%","~50%"],a:1,why:"Closer stacks hurt more if you lose (7bb left) → dial back from ~75%."},{q:"BTN 12bb, BB 53bb (covered by heaps), A8o. Action?",o:["Open shove — standard 12bb jam","Fold — offsuit Ax shove terribly when covered","Min-raise","Limp"],a:1,why:"Covered by heaps; offsuit Ax are very poor; ~20% range. Common leak: autopilot shoving."},{q:"UTG 29bb, covered by most, 99. Action?",o:["Always open — nines too strong","Fold — even nines fold in some configs (~9% open)","Open shove","Limp-call"],a:1,why:"Covered and short, EP ranges get extremely tight. Nines, AJo, KQo can fold."},{q:"BTN 12bb — BB 53bb vs BB 16bb. Which wider?",o:["53bb — deeper BB = more fold equity","16bb — closer stacks = game of chicken, BB risks life","Same","Neither"],a:1,why:"BB's depth drives your range. Closer BB → wider (~28% vs ~20%)."},{q:"BB sub-5bb, you cover. Composition shift?",o:["Low suited connectors + low pairs","High-card dense, Ax-heavy — raw equity","Same","Only premiums"],a:1,why:"Very short BB → drop speculative hands, want raw equity. Reverse of deep-BB composition."}]

const examples: HandExample[] = [
  { tag: "Covering by 2x+", tagVariant: "default", board: <>UTG 100bb · table 20-50bb · BB 45bb</>, desc: "Covering the table", verdict: "agree", verdictText: "System agrees", system: "Open ~35% (like a 30bb CO open). J9o, K5s, 89o all small +EV.", solver: "~35-36% VPIP. More than 2x the ~16.5% baseline." },
  { tag: "Covered by heaps", tagVariant: "risk", board: <>BTN 12bb · BB 53bb</>, desc: "Covered by a deep stack", verdict: "agree", verdictText: "System agrees", system: "~20%. Almost no open shoves. Offsuit Ax very poor. Cut low pairs, worst Ax.", solver: "~20% VPIP. Common leak: autopilot shoving K7s/T9s/KTo." },
  { tag: "Game of chicken", tagVariant: "risk", board: <>BTN 12bb · BB 16bb</>, desc: "Covered but stacks close", verdict: "agree", verdictText: "System agrees", system: "~28% (wider). More open shoving. BB handicapped by risk.", solver: "~28% VPIP. Same stack, different BB depth → different range." },
  { tag: "Covered EP, very tight", tagVariant: "fold", board: <>UTG 29bb · covered by most</>, desc: "Covered by most of the table", verdict: "agree", verdictText: "System agrees", system: "~9%. Fold nines, AJo, KQo, A9s in some configs.", solver: "~9% VPIP. UTG+1 can barely get in QQ." },
  { tag: "Covered, deeper — don't over-tighten", tagVariant: "risk", board: <>BTN 33bb · BB 53bb</>, desc: "Covered at 30-40bb", verdict: "agree", verdictText: "System agrees", system: "~35%. Don't over-tighten at 30-40bb — BB must risk a lot to pressure you.", solver: "~35% VPIP. Common leak: way too tight at 30-40bb covered." },
  { tag: "Very short BB — raw equity", tagVariant: "default", board: <>UTG 50bb · BB sub-5bb</>, desc: "Covering a very short BB", verdict: "agree", verdictText: "System agrees", system: "High-card dense, Ax-heavy. Drop 54s/76s/low pairs — want raw equity.", solver: "High-card range. Reverse of deep-BB composition." },
]

export function BM2Page() {
  return (
    <>
      <Section title="Opening Into Covered Stacks (You Are Covered)">
        <p>A stack (or several) behind covers you. You open much tighter than baseline, with the degree of tightness driven by how much the BB covers you, position of covering stacks, and presence of shorter stacks elsewhere.</p>
        <Callout variant="bad"><strong>Same stack, different range.</strong> 12bb on the button is not static. Into a 53bb BB you open ~20%; into a 16bb BB you open ~28%. The BB's depth, not just yours, drives your range.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["Covered by heaps (BB 2x+ you)", "Covered but close (game of chicken)"]}
          intro="Your stack vs the big blind (row) × cover ratio (column)."
          rows={[
            { label: "BTN 9-12bb", cells: [
              { action: "~20%", sub: "Fold ~80%. No open shoves. Offsuit Ax very poor.", color: "red" },
              { action: "~28%", sub: "More open shoving. BB handicapped by risk.", color: "orange" },
            ]},
            { label: "BTN 25-30bb", cells: [
              { action: "Tighter than baseline", sub: "Fringe trims; BB must risk heavily to pressure you.", color: "orange" },
              { action: "Moderate", sub: "Closer stacks widen slightly.", color: "orange" },
            ]},
            { label: "BTN 33-40bb", cells: [
              { action: "~35%", sub: "Don't over-tighten. BB must risk a lot to pressure you.", color: "orange" },
              { action: "~35%+", sub: "Forgiving at depth.", color: "green" },
            ]},
            { label: "UTG 16-29bb", cells: [
              { action: "~7-9%", sub: "Fold nines, AJo, KQo, A9s in some configs.", color: "red" },
              { action: "~13-14%", sub: "Covering the BB helps even if covered behind.", color: "orange" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>What tightens you</h3>
        <ul>
          <li><strong>BB covers you by heaps:</strong> open very tight — they can destroy you postflop, donk, float.</li>
          <li><strong>Very short / micro stacks at other tables:</strong> tighten (FGS overlay — folding has positive $EV).</li>
          <li><strong>Covered by a massive stack (120bb+) when you're mid:</strong> trim thinnest hands; no wider than ~35% on BTN.</li>
        </ul>
        <h3>What loosens you</h3>
        <ul>
          <li><strong>BB is close to your stack (game of chicken):</strong> you can open a bit more; they risk tournament life playing back.</li>
          <li><strong>You're deeper (30-50bb) and covered:</strong> more forgiving — losing a raise-fold costs &lt;10% of stack.</li>
          <li><strong>You're the shortest at the table:</strong> loosen back up — can't rely on others busting.</li>
        </ul>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Open-shove hand shift (covered)</strong></td><td>Shift stronger — AQ not AJ. Offsuit Ax shove terribly. Drop A2s/A3s.</td></tr>
          <tr><td><strong>Low pairs (22-33) when covered and short</strong></td><td>Often fold — they block the blinds' pair-folds, hurting your fold equity.</td></tr>
          <tr><td><strong>Covered by one but cover the rest</strong></td><td>Still wider than baseline — covering player folds ~80%; you pressure the rest.</td></tr>
          <tr><td><strong>FGS: short stacks at other tables</strong></td><td>Tighten further — folding has positive $EV when others may bust before you.</td></tr>
        </table>
        <Callout><strong>Folding is not zero EV on the bubble.</strong> With shorter stacks elsewhere, folding has positive $EV — and you get free hands coming next. This makes the thinnest opens pass.</Callout>
      </Section>

      <Section title="Sizing">
        <p>Min-raise dominant when covered (preserve tournament life, fold to reshoves). Open shoves drop sharply — and shift stronger (AQ, not AJ) when they do appear. BB 3-bet size vs a covering opener can be large/polar (~14bb) to deny price with Ax.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM2Page
