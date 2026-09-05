import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Stack inflection for CR top pair?","35bb. Above → nuts-oriented. At/below → aggressive top-pair CR. Shorter = more CR."],["Top pair vs two pair/sets?","Top pair = CR. Two pair/sets = trap (check-call). SPR short enough to shove river."],["CR hierarchy on Q73?","KQ/QJ/QT pure CR. Q9 heavy. Q8 medium. Q7-Q4 taper. Q2 pure call."],["Backdoor FD effect?","Prefers check-call (Q9♥ calls more than Q9o). Realize the flush draw."],["Low vs high boards for CR?","Low: kicker matters less, draw factors more. More chaotic."],["Two low cards touching (Q75)?","3-straight top pairs (Q5,Q6,Q2) may CR MORE than non-straight (Q7,Q8)."],["Opponent c-betting 100%?","CR all top pairs — their range too weak to defend."],["CR sizing?","Small (~3x the c-bet). Short stacks = 2-street game."]]
const quizzes: QuizQuestion[] = [{q:"Stack-depth inflection for CR top pair?",o:["50bb","35bb","20bb","100bb"],a:1,why:"Above 35bb → nuts-oriented. At/below → aggressive top-pair CR. Shorter = more CR."},{q:"Top pair vs two pair at short (25bb)?",o:["Both CR","Top pair = CR; two pair/sets = trap (check-call)","Both check-call","Both fold"],a:1,why:"SPR short enough to shove river without raising. Top pair CR; two pair/sets trap."},{q:"Q73, Q9 offsuit vs Q9♥ (backdoor FD)?",o:["Both CR equally","Q9o CR; Q9♥ check-call (realize flush draw)","Both check-call","Q9♥ CR more"],a:1,why:"Backdoor FD prefers check-call to realize the draw. Offsuit CRs."},{q:"K84, 13bb, K7o. Action?",o:["Check-call — too strong to fold","Check-raise — too short to call","Fold","CR only with KQ"],a:1,why:"13bb = too short to call. KQ pure CR; K7–K2 pure CR (offsuit). BDFD → check-call."},{q:"Low boards vs high boards for CR?",o:["Same — kicker determines everything","Low: kicker less, draw factors more. More chaotic.","Low: always CR","High: always check"],a:1,why:"Opponent can't make top pair with low suited connectors. Secondary factors dominate."}]

const examples: HandExample[] = [
  { tag: "Pure CR", tagVariant: "default", board: <>Q<S>♠</S> 7<H>♥</H> 3<H>♥</H></>, desc: "Q-high · two-tone · 25bb", verdict: "agree", verdictText: "System agrees", system: "All top pairs KQ–Q9 → pure CR. Q8 heavy mix.", solver: "Pure CR KQ–Q9. Clean taper to Q4, Q2 pure call. Student check-called — mistake." },
  { tag: "Backdoor FD → call", tagVariant: "risk", board: <>Q<S>♠</S> 7<H>♥</H> 5<H>♥</H></>, holeCards: <>Q9<H>♥</H> · ~20bb</>, desc: "Q-high · two-tone · ~20bb", verdict: "agree", verdictText: "System agrees", system: "Q9o → CR. Q9♥ (BDFD) → check-call (realize flush draw).", solver: "QJ/QT pure CR; Q9 heavy (non-heart); Q9♥ → more call." },
  { tag: "Pure CR (very short)", tagVariant: "default", board: <>K<S>♠</S> 8<H>♥</H> 4<C>♣</C></>, desc: "K-high · rainbow · K7o · 13bb", verdict: "agree", verdictText: "System agrees", system: "Too short to call → CR. KQ pure CR, K7–K2 pure CR (offsuit).", solver: "KQ pure CR; K10/K9 mix; K7–K2 pure CR (offsuit). K2♦/K3♦ with BDFD → call. K8/84/44 → trap." },
  { tag: "Two pair → trap", tagVariant: "risk", board: <>J<S>♠</S> 9<H>♥</H> 6<C>♣</C></>, desc: "J-high · QJs / J9 two pair · 25bb", verdict: "agree", verdictText: "System agrees", system: "QJ (top pair) → pure CR. J9/J2/J3 (two pair) → trap (check-call).", solver: "QJ/JT pure CR; J9/92 → check-call; J3 pure call; J4 high-frequency call." },
]

export function S6Page() {
  return (
    <>
      <Section title="System 6 — Check-Raising Top Pair (Short Stacks)">
        <p>BB defender CR top pair on flop. Focus on <strong>short stacks (≤35bb)</strong>.</p>
        <Callout><strong>Inflection: 35bb.</strong> Above → nuts-oriented CR (sets, two pair, TPTK mix). <strong>At/below → aggressive top-pair CR.</strong> Shorter = more CR.</Callout>
        <h3>The pattern</h3>
        <p><strong>Top pair = CR</strong>; <strong>two pair/sets = trap (check-call)</strong> at short stacks. SPR short enough to shove river without raising.</p>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Top pair (offsuit)", "Top pair (suited / BDFD)", "Two pair / sets"]} intro="Stack depth (row) x hand type (column). Green = check-raise, orange = mix/call, red = trap."
          rows={[
            { label: "> 35bb", labelSub: "deeper", cells: [{ action: "Mix CR / check-call", sub: "Great kicker (KQ, QJ): mix CR. Weak kicker: check-call.", color: "orange" }, { action: "Check-call", sub: "BDFD prefers call to realize flush draw.", color: "orange" }, { action: "Check-raise", sub: "Nuts-oriented CR range.", color: "green" }] },
            { label: "≤ 35bb", labelSub: "short, aggressive", cells: [{ action: "Check-raise", sub: "Pure CR. Shorter = more CR (34bb < 24bb < 14bb).", color: "green" }, { action: "Check-call", sub: "Realize the flush draw. CR gives up flush equity.", color: "red" }, { action: "Trap (check-call)", sub: "SPR short enough to shove river without raising flop.", color: "red" }] },
          ]}
        />
      </Section>
      <Section title="CR hierarchy (high boards)">
        <p>On Q-high (Q73), kicker determines CR frequency:</p>
        <table>
          <tr><th>Hand</th><th>CR frequency</th></tr>
          <tr><td>KQ, QJ, QT</td><td>Pure CR</td></tr>
          <tr><td>Q9</td><td>Heavy CR (offsuit); backdoor FD → check-call</td></tr>
          <tr><td>Q8</td><td>Medium mix</td></tr>
          <tr><td>Q7, Q6, Q5, Q4</td><td>Tapering mix</td></tr>
          <tr><td>Q2</td><td>Pure call</td></tr>
        </table>
        <Callout variant="warn"><strong>Low boards (7-high, 6-high):</strong> kicker matters less (opponent can't make top pair with low suited connectors). Draw factors matter more. More chaotic.</Callout>
      </Section>
      <Section title="Risk Factors">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Backdoor FD (both suited)</strong></td><td>Prefers check-call (Q9♥ calls more than Q9o)</td></tr>
          <tr><td><strong>Two pair / sets / pockets</strong></td><td>Trap (check-call) — SPR short enough to shove</td></tr>
          <tr><td><strong>Two low cards touching (Q75)</strong></td><td>3-straight top pairs (Q5,Q6,Q2) may CR more than non-straight (Q7,Q8)</td></tr>
          <tr><td><strong>Opponent c-betting 100%</strong></td><td>CR all top pairs — their range too weak</td></tr>
          <tr><td><strong>Deeper stacks</strong></td><td>Less CR with thin top pair</td></tr>
        </table>
      </Section>
      <Section title="Sizing"><p>CR to <strong>small size</strong> (~3x the c-bet). Short stacks = 2-street game. No need for large CR sizes.</p></Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S6Page
