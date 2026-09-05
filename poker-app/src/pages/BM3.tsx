import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Covering table from EP — how much wider?","Roughly 2x+ baseline. UTG ~16.5% → ~35% when covering."],["Heavy open shoves when covering — when?","When blinds are sub-20-25bb. Commonly missed by regs — a major leak."],["Covered by one, cover rest of table — still wide?","Yes. ~80% the covering player folds; you pressure the stacks you cover."],["Same 12bb BTN stack — BB 53bb vs BB 16bb?","20% vs 28%. BB's depth, not just yours, drives your range."],["Covered 12bb BTN — open shove hand shift?","Stronger. AQ not AJ. Offsuit Ax shove terribly. Drop A2s/A3s."],["Covered by massive stack on BTN — cap?","No wider than ~35%. Trim thinnest suited/high-low and lowest pairs."],["Very short BB (sub-5bb) — composition?","High-card dense, Ax-heavy. Drop speculative hands for raw equity."],["Low pairs when covered and short — open or fold?","Often fold. They block blind pair-folds, hurting fold equity."],["Deeper (30-40bb) covered — how tight?","Don't over-tighten. ~35%. BB must risk a lot to pressure you."],["Limping threshold SB covered?","~18bb effective. Below that, no limps — pure shove/fold."],["BB fold freq when SB covers (short)?","~78-90% (vs ~37% chip model). Limping gives free equity — shove/raise."],["Open-shove hand shift in ICM when covered?","Shift up. Drop A2s/A3s; AJo becomes threshold. Bluffs shift up too."]]
const quizzes: QuizQuestion[] = [{q:"SB 11bb, BB 12bb on bubble. SB strategy?",o:["Limp most, raise premiums","Shove/raise, no limps","Min-raise all, fold to jams","Limp-fold"],a:1,why:"BB overfolds ~85%. Limping gives free equity to hands that fold to a shove."},{q:"SB covered, 10bb vs 45bb. Strategy?",o:["Limp wide","No limps; tight shove/fold (~33% VPID)","Min-raise all","Limp-shove"],a:1,why:"Below ~18bb covered, no limps. FGS: folding has value (others may bust)."},{q:"Open-shove selection when covered in ICM?",o:["Wider, weaker hands","Shift up — drop A2s/A3s, AJo threshold","Same as chip","Only premiums"],a:1,why:"Bluffs shift up with value. A2s/A3s drop; AJo becomes threshold."},{q:"SB 14bb vs BB 16bb (close). VPID vs BB 45bb?",o:["Tighter — closer stacks risk more","Wider — game of chicken, BB can't defend wide","Same","Always fold"],a:1,why:"Losing hurts BB's equity more when close → BB defends tighter → SB wider."},{q:"40+bb covered SB — limp-shove pairs?",o:["Yes, standard","Disappears — limp-call; BB can't pile vs uncapped traps","More limp-shoves","Never limp"],a:1,why:"SB is uncapped with traps; BB can't pile. Limp-call instead."},{q:"BB fold freq vs SB cover (short) vs chip model?",o:["~37% both","~78-90% (ICM) vs ~37% (chip)","~50%","Same"],a:1,why:"ICM pressure doubles BB fold frequency vs chip model."}]

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

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM3Page
