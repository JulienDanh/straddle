import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "Covering by 2x+", tagVariant: "default", board: <>UTG 100bb · table 20-50bb · BB 45bb</>, desc: "Covering the table", verdict: "agree", verdictText: "System agrees", system: "Open ~35% (like a 30bb CO open). J9o, K5s, 89o all small +EV.", solver: "~35-36% VPIP. More than 2x the ~16.5% baseline." },
  { tag: "Covered by heaps", tagVariant: "risk", board: <>BTN 12bb · BB 53bb</>, desc: "Covered by a deep stack", verdict: "agree", verdictText: "System agrees", system: "~20%. Almost no open shoves. Offsuit Ax very poor. Cut low pairs, worst Ax.", solver: "~20% VPIP. Common leak: autopilot shoving K7s/T9s/KTo." },
  { tag: "Game of chicken", tagVariant: "risk", board: <>BTN 12bb · BB 16bb</>, desc: "Covered but stacks close", verdict: "agree", verdictText: "System agrees", system: "~28% (wider). More open shoving. BB handicapped by risk.", solver: "~28% VPID. Same stack, different BB depth → different range." },
  { tag: "Covered EP, very tight", tagVariant: "fold", board: <>UTG 29bb · covered by most</>, desc: "Covered by most of the table", verdict: "agree", verdictText: "System agrees", system: "~9%. Fold nines, AJo, KQo, A9s in some configs.", solver: "~9% VPID. UTG+1 can barely get in QQ." },
  { tag: "Covered, deeper — don't over-tighten", tagVariant: "risk", board: <>BTN 33bb · BB 53bb</>, desc: "Covered at 30-40bb", verdict: "agree", verdictText: "System agrees", system: "~35%. Don't over-tighten at 30-40bb — BB must risk a lot to pressure you.", solver: "~35% VPID. Common leak: way too tight at 30-40bb covered." },
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

      <FlashcardsSection cards={flashcards['bm2']} />
      <QuizSection questions={quizzes['bm2']} />
    </>
  )
}

export default BM2Page
