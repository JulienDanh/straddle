import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Check-shove vs UTG — profitable?","No. UTG folds only ~60%; need >75%. UTG's range too strong (sets, overpairs, TPTK)."],["River polar sizing on bubble?","~13.5bb leaving 1-3bb behind. Never shove. 1-3bb worth ~$200 in $100 tourney."],["K84 short stack ICM — check-raise threshold?","KQ only. KJ/KT/K9 and below = pure check-call. ICM threshold much stronger."],["Short vs deep BB — flush % in range?","Short: 17.8% (tight range suited-heavy). Deep: 12.5%. Short leads more on flush turns."],["A♠ vs 4♠ turn — which better for BB?","A♠ (removes IP's suited aces). BB leads 40% on A♠, 26% on 4♠."],["AJ vs AT river after ace pairs — strategy?","AJ checks (blocks KJ bluff-catcher). AT value-bets (doesn't block KJ)."],["UTG covers BB by 2x+ — c-bet freq?","~90%+. Range bet almost all boards. BB's tight defense lacks coverage."],["Stacks close (66v58bb) — c-bet freq?","~50% on mid connected. Game of chicken. Stack gap > coverage fact."],["854/752/A44 vs short BB — bet or check?","Range bet. BB's tight ICM range folds offsuit connectors — can't connect. (Check in chip.)"],["AK7 vs 40bb+ BB — strategy?","Big-bet/check split. Check QQ/JJ/TT/weak Ax; bet large (67-80%) with strong hands."]]
const quizzes: QuizQuestion[] = [{q:"BB 17bb covered by UTG 31bb, K♣J♦ on K♠8♣4♥. Action?",o:["Check-raise for value","Check-call — ICM threshold is KQ only","Check-shove","Check-fold"],a:1,why:"ICM check-raise threshold: KQ+. KJ and below pure check-call. Check-shove needs >75% fold, UTG folds ~60%."},{q:"BB 17bb, nuts on river, polar sizing?",o:["Shove all-in","~13.5bb leaving 1-3bb behind — never shove","40% pot","Check-raise"],a:1,why:"1-3bb worth ~$200 in $100 tourney. Shoving when called+lose = zero equity."},{q:"9♦4♠4♣, BB 17bb covered. Strategy?",o:["Check-raise aggressively","Mostly check-call — tight range lacks 9x/4x coverage","Check-shove","Donk bet"],a:1,why:"Range composition overrides board texture. At 17bb, BB barely has 9x/4x."},{q:"Q♣J♦2♠ → A♠ turn, BB 17bb, A♥J♠. Lead freq?",o:["Rarely — flushes rare","~40% — flushes 17.8% of tight suited-heavy range","Always","Never"],a:1,why:"Tight range is suited-heavy → 17.8% flushes on A♠ (vs 12.5% deep). Leads 40% on A♠, 26% on 4♠."},{q:"UTG 29bb covers BB 17bb, 9♠7♥7♦. C-bet?",o:["Check — 977 connects BB","Range bet — BB's tight defense lacks 7x; cover by 2x+","Check 50%","Bet small polar"],a:1,why:"BB defense at 17bb doesn't even call 7x suited. ICM pressure lets you range-bet."},{q:"UTG 66bb vs BB 58bb (close), 7♠6♦4♣. C-bet?",o:["Range bet — you cover","~50% check — close stacks = game of chicken","Check all","Overbet"],a:1,why:"Stack gap > coverage. Close stacks → check ~50% on mid connected. BB may lead."}]

const examples: HandExample[] = [
  { tag: "Check-shove mistake", tagVariant: "fold", board: <>K-high · 9<H>♥</H> 7<H>♥</H></>, holeCards: <>9<H>♥</H> 7<H>♥</H> · BB 17bb covered by UTG</>, desc: "Check-shove vs UTG", verdict: "mistake", verdictText: "System: mistake", system: "No check-shove vs UTG. Small check-raise or check-call only.", solver: "IP folds only ~60%; need >75% for check-jam. UTG range too strong." },
  { tag: "K84 ICM threshold", tagVariant: "risk", board: <>K<S>♠</S> 8<C>♣</C> 4<H>♥</H></>, holeCards: <>BB 17bb · K♣J♦</>, desc: "Check-raise threshold under ICM", verdict: "agree", verdictText: "System agrees", system: "Check-call. ICM threshold: KQ only. KJ/KT/K9 and below = pure check-call.", solver: "ChipEV: check-raise KJ/KT/K9 pure. ICM threshold much stronger." },
  { tag: "River non-all-in", tagVariant: "default", board: <>4<S>♠</S> 3<H>♥</H> 2<D>♦</D> → 8<S>♠</S> → 9<C>♣</C></>, holeCards: <>6<S>♠</S> 5<S>♠</S> · BB 17bb · nuts</>, desc: "Polar river sizing", verdict: "agree", verdictText: "System agrees", system: "Bet ~13.5bb leaving 1-3bb behind. NEVER shove.", solver: "1-3bb worth ~$200 in $100 tourney. Shoving when called+lose = zero equity." },
  { tag: "Range bet (cover 2x+)", tagVariant: "default", board: <>9<S>♠</S> 7<H>♥</H> 7<D>♦</D></>, holeCards: <>UTG 29bb covers BB 17bb</>, desc: "977 board, covering by 2x+", verdict: "agree", verdictText: "System agrees", system: "Range bet. BB's tight defense lacks 7x; cover by 2x+.", solver: "Even with expanded BB range (more 7x suited), UTG still range-bets." },
  { tag: "Game of chicken", tagVariant: "risk", board: <>7<S>♠</S> 6<D>♦</D> 4<C>♣</C></>, holeCards: <>UTG 66bb · BB 58bb (close)</>, desc: "Close stacks, mid connected", verdict: "agree", verdictText: "System agrees", system: "~50% check. Stack gap > coverage. Game of chicken. BB may lead.", solver: "Cover by 2x+ → 74% bet. Close stacks → 50% check." },
  { tag: "Big-bet/check split", tagVariant: "risk", board: <>A<S>♠</S> K<D>♦</D> 7<H>♥</H></>, holeCards: <>UTG 100bb · BB 44bb covered</>, desc: "AK7 vs 40bb+ BB", verdict: "agree", verdictText: "System agrees", system: "Big bet/check split. Check QQ/JJ/TT/weak Ax/Kx; bet large (67-80%) strong.", solver: "At 40bb+ BB covered, big sizing develops on high boards." },
  { tag: "Short-stack flush leads", tagVariant: "risk", board: <>Q<C>♣</C> J<D>♦</D> 2<S>♠</S> → A<S>♠</S></>, holeCards: <>A<H>♥</H> J<S>♠</S> · BB 17bb</>, desc: "Flush turn, short vs deep", verdict: "agree", verdictText: "System agrees", system: "Short: leads ~40% on A♠ (flushes 17.8%). Deep: ~11% (12.5%).", solver: "Tight range suited-heavy → short has more flushes." },
]

export function BM10Page() {
  return (
    <>
      <Section title="UTG Covers BB — Postflop">
        <p>UTG covers BB on the bubble. Two sides: BB defense (module 15) and UTG c-betting (module 16). UTG c-bets at very high frequency (~90%+) when covering by 2x+, because BB's tight defense range lacks low-board coverage. Checking ranges develop as stacks get deeper or closer.</p>
        <Callout variant="warn"><strong>The stack gap matters more than the fact that you cover.</strong> Covering by 2x+ → range bet. Stacks within ~8-10bb → check 50% on mid connected boards. "I cover" is not enough information.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["BB defense (covered)", "UTG c-bet (covering)"]}
          intro="Board class (row) × side (column). Green = default."
          rows={[
            { label: "Low disconnected (854, 752, A44)", cells: [
              { action: "Mostly check-call", sub: "Tight range lacks connection.", color: "orange" },
              { action: "Range bet", sub: "BB folds offsuit connectors — can't connect.", color: "green" },
            ]},
            { label: "Mid connected (977, 764, J97)", cells: [
              { action: "Check-call / check-raise (deep)", sub: "Range composition overrides texture.", color: "orange" },
              { action: "Range bet (2x+); ~50% (close)", sub: "Stack gap determines.", color: "orange" },
            ]},
            { label: "AK7, AQ2 (high)", cells: [
              { action: "Tight check-call", sub: "KQ only check-raise (short).", color: "orange" },
              { action: "Big bet/check split (40bb+ BB)", sub: "Check QQ/JJ/TT/weak Ax; bet large strong.", color: "orange" },
            ]},
            { label: "Ace-low paired (A88, A77, A66)", cells: [
              { action: "Check-call mostly", sub: "Short: barely has the pair.", color: "orange" },
              { action: "Range bet (short BB)", sub: "ICM pressure overrides; checks develop deeper.", color: "green" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules — BB Defense (covered, short)">
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>Check-shove is a mistake vs UTG</strong></td><td>IP folds only ~60%; need &gt;75% for check-jam. UTG range too strong (sets, overpairs, TPTK).</td></tr>
          <tr><td><strong>Check-raise threshold (short, ICM)</strong></td><td>KQ only on K84. KJ/KT/K9 and below = pure check-call. Much stronger than chipEV.</td></tr>
          <tr><td><strong>Range composition overrides board texture</strong></td><td>944 looks good for BB, but if BB's defense range doesn't include offsuit 9x/4x (short), check-raising is wrong.</td></tr>
          <tr><td><strong>Flush turns favor the short stack</strong></td><td>Short BB: flushes 17.8% of range (suited-heavy). Deep: 12.5%. Short leads more on flush turns.</td></tr>
          <tr><td><strong>A♠ turn &gt; 4♠ turn for BB</strong></td><td>A♠ removes IP's suited aces. BB leads 40% on A♠, 26% on 4♠.</td></tr>
        </table>
        <Callout variant="bad"><strong>Bet LESS when you have the nuts on the bubble — leave 1-3bb behind.</strong> Shoving all-in when called and losing means zero tournament equity. Leaving 2bb means you're still alive — those 2bb are worth ~$200 in a $100 tournament on the bubble vs ~$0 early game.</Callout>
      </Section>

      <Section title="Core Rules — UTG C-bet (covering)">
        <h3>Covering by 2x+ (~90%+ c-bet)</h3>
        <p>Range bet or near-range-bet almost all boards. Even boards that check in chipEV (854 two-tone, 752, A44) are range-bets because BB's tight defense range lacks coverage.</p>
        <h3>Stacks close (game of chicken)</h3>
        <p>~50% c-bet on mid connected boards. BB leads some boards. UTG opens tighter (~27%). Board-dependent. The stack gap matters more than coverage.</p>
        <h3>40bb+ BB covered</h3>
        <p>Big-bet/check split on AK7, AQ2: check back QQ/JJ/TT/weak Ax/Kx; bet very large (67-80%) with strong hands.</p>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Tighter opener = stronger IP range</strong></td><td>UTG ~20-24% vs late position much wider. Kills check-shove profitability.</td></tr>
          <tr><td><strong>Flush-completing turns favor short BB</strong></td><td>Short has 17.8% flushes (suited-heavy) vs deep 12.5%.</td></tr>
          <tr><td><strong>A♠ vs low spade turn</strong></td><td>A♠ better for BB (removes IP suited aces). BB leads 40% on A♠, 26% on 4♠.</td></tr>
          <tr><td><strong>BB's preflop range determines c-bet strategy</strong></td><td>Not just "I cover." If BB defends wider (deeper, closer), they have more low-mid coverage → check more.</td></tr>
          <tr><td><strong>ICM pressure is directional</strong></td><td>Cover by heaps → range bet (losing still leaves working stack). Close → check more (losing is catastrophic).</td></tr>
        </table>
      </Section>

      <Section title="Sizing">
        <p>River polar bet: <Code>~13.5bb</Code> leaving 1-3bb behind — never shove. Block-bet thin value ~40% pot. Check-raise short: ~4.3bb (no leverage); deep: ~6.5bb (turn/river threat). Check-shove needs &gt;75% fold; UTG folds only ~60% → mistake.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM10Page
