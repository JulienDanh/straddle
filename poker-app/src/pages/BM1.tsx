import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Why do blockers beat playability in ICM opens?","Opponents 3-bet/fold, not cold call. A2s blocks their 3-bet bluffs; 76s has no blocking value."],["Cold calling stronger = less capped?","Calling AQo/AJs/KQ means high-card board coverage — opponent can't barrel you off easily."],["Smaller 3-bet in ICM, yet defense tighter?","ICM 3-bet ~7.35bb vs 8.6bb ChipEV, but defender plays narrower. Risk premium overwhelms price."],["FGS can make you open tighter when short?","Yes — 1.5bb UTG: ICM says 49%, FGS says 25%. Folding has value when others bust for you."],["Open shoving 15bb on bubble with shorter stack?","Massive leak. Min-raise is 4-5x better in equity. AJo: +$1 min-raise vs -$17.70 shove."],["Zero-EV opens — open or fold?","If opponents overfold: open (positive). If Nash: fold. Decided by FGS + tendencies."],["Field size impact?","2/152 (1000-player) = more extreme than 3/33 (200-player). Use 1000-player model for direct bubble."],["Shove wider or tighter when short with fold equity?","Wider — 4.5bb FGS widens to 25%. Cost of posting blind next hand justifies shoving now."],["Shove wider or tighter when forced all-in next?","Tighter — 1.5bb FGS tightens to 25%. No fold equity; doubling leaves you in same spot."],["What hands drop from opens in ICM?","Low pairs, weak suited connectors, offsuit broadways — speculative play loses value."],["Value threshold tightens how?","AK barely 3-bets, Queens often flat. Kings+ becomes the default 3-bet value range."],["BTN open sizing ICM vs ChipEV?","2.1x (ICM) vs 2.3x (ChipEV). Smaller open, yet defense still tighter."]]
const quizzes: QuizQuestion[] = [{q:"Why do blockers beat playability in ICM opens?",o:["Opponents cold call wide","Opponents 3-bet/fold, not cold call","Blockers always win","Playability doesn't matter"],a:1,why:"A2s blocks 3-bet bluffs; 76s has no blocking value. Opponents 3-bet/fold in ICM."},{q:"3-bet bluff range shift ChipEV → ICM?",o:["Suited connectors → blocker-heavy (Ace-X suited, King-X suited)","Same","Blockers → suited connectors","Nothing"],a:0,why:"Board-coverage hands lose value; blocker-heavy hands gain it."},{q:"3-bet value threshold under ICM?",o:["AK, QQ, JJ all mix","Kings+ default; Queens flat; AKo barely 3-bets","Any pair","Looser than ChipEV"],a:1,why:"Value threshold tightens under ICM risk premium."},{q:"BTN open sizing ICM vs ChipEV?",o:["2.3x both","2.1x ICM vs 2.3x ChipEV — smaller yet defense tighter","2.3x ICM","Same"],a:1,why:"Smaller open in ICM, but risk premium overwhelms price — defense still tighter."},{q:"Cold calling as stacks shorten under ICM?",o:["Stays wide","Fades aggressively — calling 2bb off 20bb too risky %","Widens","No change"],a:1,why:"Calling a large % of stack near the bubble is too risky."},{q:"FGS makes 1.5bb UTG shove tighter. Why?",o:["No fold equity; folding lets others bust for you","Stack too small","ICM is wrong","Blinds too high"],a:0,why:"Doubling to 3.5bb is same spot. Folding has real value when others can bust."}]

const examples: HandExample[] = [
  { tag: "Blockers > playability", tagVariant: "default", board: <>UTG open · 30bb · 200-player bubble</>, desc: "ICM vs ChipEV open range shift", verdict: "agree", verdictText: "System agrees", system: "ICM drops low pairs, weak suited connectors, offsuit broadways. Adds A2s, A9o (blockers).", solver: "A2s opens where Q9s folds. A9o opens where T9s folds." },
  { tag: "Value threshold tightens", tagVariant: "risk", board: <>BTN defense vs UTG · 30bb</>, desc: "3-bet value range under ICM", verdict: "agree", verdictText: "System agrees", system: "Value = Kings+. Queens flat. AKo barely 3-bets. 3-bet bluffs = Ace-X suited, King-X suited.", solver: "No shoves. Cold call ~10% (vs ~15% chip)." },
  { tag: "Smaller 3-bet, tighter defense", tagVariant: "risk", board: <>SB defense vs BTN · 40bb</>, desc: "Sizing vs defense width", verdict: "agree", verdictText: "System agrees", system: "ICM 3-bet 7.35bb vs 8.6bb ChipEV. Defense still tighter — risk premium overwhelms price.", solver: "Very polar/blocker-heavy 3-bets. Jam eliminated. Cold call slightly wider (sizing-driven)." },
  { tag: "Cold calling fades", tagVariant: "fold", board: <>BTN cold call · 20bb equal</>, desc: "Short-stack cold calling under ICM", verdict: "agree", verdictText: "System agrees", system: "Cold calling 'fades aggressively.' Pairs mostly fold. Some jams with blockers.", solver: "Massive cold call range in chip → narrow + shove in ICM." },
]

export function BM1Page() {
  return (
    <>
      <Section title="ICM vs ChipEV — Preflop Adjustments">
        <p>Equal stacks on the bubble. We compare ICM-adjusted preflop ranges to ChipEV to identify the repeating shifts: blockers gain value, speculative hands and cold calls drop, value thresholds tighten, shoves fade.</p>
        <Callout variant="warn"><strong>Blockers become MORE valuable than playability in ICM.</strong> A2s opens where Q9s folds. A9o opens where T9s folds. You're blocking 3-bet bluffs, not playing postflop — because opponents 3-bet/fold, not cold call.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["ChipEV", "ICM-Adjusted"]}
          intro="Category (row) × model (column). Green = the ICM direction."
          rows={[
            { label: "Opens", cells: [
              { action: "Wide; suited connectors, low pairs, offsuit broadways", sub: "Playability matters.", color: "orange" },
              { action: "Tighter; drop speculative, add Ace-X blockers", sub: "A2s, A9o in; 76s, 55 out.", color: "green" },
            ]},
            { label: "3-bet bluffs", cells: [
              { action: "Board-coverage (suited connectors, gappers)", sub: "Postflop playability.", color: "orange" },
              { action: "Blocker-heavy (Ace-X suited, King-X suited)", sub: "Block their 3-bet bluffs.", color: "green" },
            ]},
            { label: "3-bet value", cells: [
              { action: "AK, QQ, JJ, TT all mixing", sub: "Wide value.", color: "orange" },
              { action: "Kings+; Queens flat; AKo barely 3-bets", sub: "Tighten the threshold.", color: "green" },
            ]},
            { label: "Cold calling", cells: [
              { action: "Wide; speculative hands, suited aces, mid pairs", sub: "Realize equity.", color: "orange" },
              { action: "Narrower; cold-call strong (AQo, AJs, KQ)", sub: "Speculative hands fold.", color: "green" },
            ]},
            { label: "Shoving (mid stacks)", cells: [
              { action: "Common for AK, QQ/JJ", sub: "Standard.", color: "orange" },
              { action: "Shoves fade; min-raise or non-all-in 3-bet", sub: "Preserve tournament life.", color: "green" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>The five shifts</h3>
        <table>
          <tr><th>Shift</th><th>Rule</th></tr>
          <tr><td><strong>1. Blockers up, playability down</strong></td><td>Ace-X blockers gain value; suited connectors and low pairs lose it.</td></tr>
          <tr><td><strong>2. Cold-call stronger = less capped</strong></td><td>Calling AQo/AJs/KQ means high-card board coverage — opponent can't barrel you off.</td></tr>
          <tr><td><strong>3. Value threshold tightens</strong></td><td>Queens often flat, AKo barely 3-bets, Kings+ becomes default.</td></tr>
          <tr><td><strong>4. Shoves fade</strong></td><td>Min-raise or non-all-in 3-bet replaces open shoves on direct bubble.</td></tr>
          <tr><td><strong>5. Smaller sizing, tighter defense</strong></td><td>ICM 3-bet 7.35bb vs 8.6bb ChipEV — yet defense is still tighter (risk premium &gt; price).</td></tr>
        </table>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Opponent behind overfolds</strong></td><td>Keep zero-EV fringe opens — worth more than sim says.</td></tr>
          <tr><td><strong>Opponent behind too loose</strong></td><td>Drop zero-EV fringe opens — they won't fold enough for blockers to work.</td></tr>
          <tr><td><strong>You're very deep (35-40bb+) in BB</strong></td><td>Cold calling less risky — opponent needs full stack to move you off equity.</td></tr>
          <tr><td><strong>You're short (20bb) cold calling</strong></td><td>Cold calling fades aggressively — calling 2bb off 20bb is too large a % of stack.</td></tr>
          <tr><td><strong>FGS: short stacks at other tables</strong></td><td>Tighten further — folding has positive $EV.</td></tr>
        </table>
      </Section>

      <Section title="Sizing">
        <p>BTN open <Code>2.1x</Code> (ICM) vs <Code>2.3x</Code> (ChipEV). SB 3-bet vs BTN <Code>7.35bb</Code> (ICM) vs <Code>8.6bb</Code> (ChipEV). Smaller sizing in ICM, yet defense plays a narrower, more polar range — the risk premium overwhelms the price.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM1Page
