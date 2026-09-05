import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "Covering 2x+", tagVariant: "default", board: <>BTN 125bb · avg 50bb · BB 36/68bb</>, desc: "Covering deep blinds", verdict: "agree", verdictText: "System agrees", system: "Open ~75%, more of everything vs 53% baseline.", solver: "~75% VPID." },
  { tag: "Covering but close", tagVariant: "risk", board: <>BTN 80bb · BB 73bb</>, desc: "Close stacks", verdict: "agree", verdictText: "System agrees", system: "Dial to ~68% — closer stacks hurt more if you lose (7bb left).", solver: "~68% VPID." },
  { tag: "Heavy open shoves", tagVariant: "default", board: <>BTN · blinds sub-30bb · you much bigger</>, desc: "Covering short blinds", verdict: "agree", verdictText: "System agrees", system: "~75% VPID + heavy open shoves (Kx suited, Qx suited, Jx suited).", solver: "BB calls <10%. Missing open shoves is a common leak." },
  { tag: "Covering EP 2x+", tagVariant: "default", board: <>UTG 100bb · table 20-50bb · BB 45bb</>, desc: "Covering the table from EP", verdict: "agree", verdictText: "System agrees", system: "Open ~35% (like a 30bb CO open in chips).", solver: "~35-36% VPID." },
  { tag: "Mixed: cover rest, covered by one", tagVariant: "risk", board: <>UTG 58bb · covered by CO</>, desc: "Cover most, covered by one", verdict: "agree", verdictText: "System agrees", system: "~25-26%. Wider than baseline; J8s/Q8s/T8s near zero but +EV if CO passive.", solver: "~25-26% VPID." },
  { tag: "Deep BB composition", tagVariant: "default", board: <>UTG 65bb · BB 26bb</>, desc: "Covering a mid BB", verdict: "agree", verdictText: "System agrees", system: "38.5%. Low suited connectors, sliver of 33s, marginal high-low suited.", solver: "~38.5% VPID." },
]

export function BM3Page() {
  return (
    <>
      <Section title="Opening Into Covering Stacks (You Cover)">
        <p>You cover most/all stacks behind. Open significantly wider than the ICM equal-stack baseline — often 2x+ from EP. Key adjustments: how much you cover and whether the blinds are deep or very short.</p>
        <Callout variant="warn"><strong>Open shoves are heavily underused by regs when covering on the bubble.</strong> When blinds are sub-20-25bb and you cover, open-shove a huge chunk of your range. Defaulting to min-raise/fold with 70-85% of hands leaves massive raise-fold equity on the table.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["BB deep (40-68bb)", "BB very short (sub-5bb)"]}
          intro="Your cover ratio (row) × BB depth (column). Composition shifts with BB stack."
          rows={[
            { label: "Cover by 2x+ (BTN)", cells: [
              { action: "~75% VPID", sub: "Low suited connectors, low pairs, suited high-low all OK.", color: "green" },
              { action: "~75% + heavy shoves", sub: "High-card dense, Ax-heavy. Drop speculative for raw equity.", color: "green" },
            ]},
            { label: "Cover but close (BTN)", cells: [
              { action: "~68%", sub: "Dial back — losing leaves you short (7bb).", color: "orange" },
              { action: "~68% + shoves", sub: "Closer stacks still allow shoves but less freely.", color: "orange" },
            ]},
            { label: "Cover by 2x+ (UTG)", cells: [
              { action: "~35%", sub: "2x+ baseline. Like a 30bb CO open.", color: "green" },
              { action: "~18-20%", sub: "High-card heavy; drop suited connectors.", color: "orange" },
            ]},
            { label: "Cover but close (UTG)", cells: [
              { action: "~25-26%", sub: "Wider than baseline; trim thinnest.", color: "orange" },
              { action: "~13-14%", sub: "Tighter; closer stacks hurt.", color: "orange" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>Composition by BB depth (when you cover)</h3>
        <table>
          <tr><th>BB stack</th><th>Open range composition</th></tr>
          <tr><td><strong>Deep (40-68bb)</strong></td><td>Low suited connectors (54s, 76s), suited high-low (Q4s, J7s), lowest pairs (22-33) all acceptable — want playability.</td></tr>
          <tr><td><strong>Mid (26bb)</strong></td><td>Sliver of low pairs, marginal suited connectors, marginal high-low suited.</td></tr>
          <tr><td><strong>Very short (sub-5bb)</strong></td><td>High-card dense, Ace-X heavy. Drop suited connectors and low pairs — want raw equity.</td></tr>
        </table>
        <Callout variant="good"><strong>Being covered by one or two players does NOT mean play tight.</strong> If you cover the rest (especially the BB), you still open wider than baseline. The covering player folds ~80%; you then pressure everyone you cover.</Callout>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Stacks behind close to yours</strong></td><td>Dial back top-line frequency; losing a pot hurts more.</td></tr>
          <tr><td><strong>Blinds sub-20-25bb</strong></td><td>Heavy open shoving appears. Commonly missed by regs — a major leak.</td></tr>
          <tr><td><strong>Blinds 30bb+</strong></td><td>Little/no open shove; min-raise range.</td></tr>
          <tr><td><strong>Micro stack about to hit blinds (other table)</strong></td><td>Blinds disincentivized to play — ramp up opens.</td></tr>
          <tr><td><strong>Covering and called</strong></td><td>Not a disaster — you still cover; losing the pot doesn't end your tournament.</td></tr>
        </table>
      </Section>

      <Section title="Sizing">
        <p>Min-raise when blinds are 30bb+ (fold to reshoves, preserve optionality). Open shove a heavy chunk when blinds are sub-20-25bb — BB calls &lt;10%. UTG baseline ~16.5%; covering by 2x+ expands to ~35%.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards['bm3']} />
      <QuizSection questions={quizzes['bm3']} />
    </>
  )
}

export default BM3Page
