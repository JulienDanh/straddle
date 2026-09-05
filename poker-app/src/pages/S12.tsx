import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Two board buckets?","T-high+ → tight (fold 50%+). 9-high & below → resilient (~25%)."],["A-high or K-high?","Extreme caution. Highest fold %. Most over-defended."],["Why fold on high boards?","3-bettor ahead preflop. High boards favor them. Fold far more than MDF."],["Why defend on low boards?","Low boards favor caller (3-bettor misses). Defend near MDF."],["Low board risk factors?","Paired (minor), disconnected (significant — want straights), deuce present (favors 3-bettor)."],["Mistake on A/K-high?","Over-defending weak pairs (77/88/99) and BDFDs — all folds."],["Mistake on low boards?","Over-folding high card hands. K-J with BDFD, A-T 3-straight are calls."],["vs jam on low disconnected?","Often a call — neither range hits."]]
const quizzes: QuizQuestion[] = [{q:"Two board buckets for defending 3-bets OOP?",o:["T-high+ → tight (fold 50%+); 9-high & below → resilient (~25%)","All same","Always fold","Always call"],a:0,why:"3-bettor ahead preflop. High → fold 50%+. Low → defend near MDF."},{q:"A-high or K-high boards vs 3-bet c-bet?",o:["Defend wide","Extreme caution — highest fold %, most over-defended","Call any pair","Check-raise"],a:1,why:"A/K-high most favor the 3-bettor's linear range. Fold 77/88/99, BDFDs — all folds."},{q:"K72 rainbow, AJs vs 20% c-bet?",o:["Call — ace high","Pure fold (worth 0). A-T with BDFD also = 0","Check-raise","Mix"],a:1,why:"K-high vs 3-bettor. AJs has no pair, no draw, blocks nothing. Pure fold."},{q:"984, 55 vs 33% c-bet?",o:["Fold — medium pair","Pure call (worth 100+ bb/100). Also defend AQo, KQs with BDFD.","Mix","Fold — too weak"],a:1,why:"Low board favors caller. 55 is a pair vs a board the 3-bettor misses. Pure call."},{q:"963 two-tone, 44♣ vs jam?",o:["Fold — too risky","Call — neither range hits board","Check-raise","Fold — disconnected"],a:1,why:"Low disconnected board: neither 3-bettor nor caller hits. 44 is a pair. Pure call."}]

const examples: HandExample[] = [
  { tag: "Fold (high board)", tagVariant: "fold", board: <>K<S>♠</S> 7<H>♥</H> 2<C>♣</C></>, desc: "K-high · rainbow · AJs · 20%", verdict: "agree", verdictText: "System agrees", system: "Pure fold. A-T with BDFD also = 0. Even A-Q mixing fold.", solver: "Pure fold (worth 0). Confirms." },
  { tag: "Fold (high board)", tagVariant: "fold", board: <>K<S>♠</S> 8<H>♥</H> 4<C>♣</C></>, desc: "K-high · rainbow · 77 · 20%", verdict: "agree", verdictText: "System agrees", system: "77/66/55 heavy folds. A-J with BDFD = 0. Pocket tens mixing fold.", solver: "Confirms. Medium pairs are folds on K-high." },
  { tag: "Call (low board)", tagVariant: "call", board: <>9<S>♠</S> 8<H>♥</H> 4<C>♣</C></>, desc: "9-high · 55 · 33%", verdict: "agree", verdictText: "System agrees", system: "Pure call (worth 100+ bb/100). Also defend A-Qo, K-Qs with BDFD, gut shots, A-T 3-straight.", solver: "Pure call. Confirms low-board resilience." },
  { tag: "Call vs jam", tagVariant: "call", board: <>9<S>♠</S> 6<H>♥</H> 3<D>♦</D></>, holeCards: <>44<C>♣</C> · Jam</>, desc: "9-high · two-tone · jam", verdict: "agree", verdictText: "System agrees", system: "Pure call. Neither range hits board. Must defend reasonable chunk.", solver: "Pure call. Confirms." },
  { tag: "Call or jam", tagVariant: "call", board: <>9<S>♠</S> 6<H>♥</H> 3<C>♣</C></>, desc: "9-high · AQ · 25bb", verdict: "agree", verdictText: "System agrees", system: "A-Q worth 186 bb/100. Don't fold any pairs. K-J with BDFD playable. Even jamming (+172) >> folding (0).", solver: "Confirms. Over-defending high cards on low boards is correct." },
]

export function S12Page() {
  return (
    <>
      <Section title="System 12 — Defending 3-Bets OOP">
        <p>RFI, call a 3-bet, out of position. EP open, HJ/BTN 3-bets, we call.</p>
        <h3>Two board buckets</h3>
        <table>
          <tr><th>Board type</th><th>Strategy</th><th>Fold % vs 25–33% bet</th></tr>
          <tr><td><strong>T-high+ (Broadway)</strong></td><td><Tag variant="fold">Tight / fit-or-fold</Tag></td><td>50%+ (far above MDF ~20–25%)</td></tr>
          <tr><td><strong>9-high & below</strong></td><td><Tag variant="call">Resilient / sticky</Tag></td><td>Near MDF (~25–27%)</td></tr>
          <tr><td><strong>A-high or K-high</strong></td><td><Tag variant="fold">Extreme caution</Tag></td><td>Highest fold %; most over-defended</td></tr>
        </table>
        <Callout variant="bad"><strong>Key thesis:</strong> 3-bettor is ahead preflop. High boards favor them; low boards favor caller. <em>Fold far more than MDF on high boards; defend robustly on low.</em></Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Default", "With risk factors"]} intro="3-bettor is ahead preflop. Red = fold heavily. Green = defend. Orange = between."
          rows={[
            { label: "A-high or K-high", labelSub: "most over-defended", cells: [{ action: "Fold 50%+", sub: "Extreme caution. Fold 77/88/99, BDFDs. Most over-defended bucket.", color: "red" }, { action: "Fold 50%+", sub: "No exception — always tight on A/K-high.", color: "red" }] },
            { label: "Q-J-T high", labelSub: "Broadway", cells: [{ action: "Fold 50%+", sub: "Tight / fit-or-fold. Far above MDF (~20–25%).", color: "red" }, { action: "Fold 50%+", sub: "No exception.", color: "red" }] },
            { label: "9-high & below", labelSub: "low boards", cells: [{ action: "Defend near MDF (~25%)", sub: "Call pairs, gut shots, BDFDs, 3-straight/flush. K-J with BDFD, A-T 3-straight are calls.", color: "green" }, { action: "Elevated fold %", sub: "Risk factors: paired, disconnected, deuce.", color: "orange" }] },
          ]}
        />
      </Section>
      <Section title="Risk factors (low boards)">
        <table>
          <tr><th>Factor</th><th>Effect</th><th>Severity</th></tr>
          <tr><td><strong>Paired</strong></td><td>Slightly elevated fold %</td><td>Minor</td></tr>
          <tr><td><strong>Disconnected</strong></td><td>Elevated fold %</td><td><Tag variant="risk">Significant</Tag> (want straights)</td></tr>
          <tr><td><strong>Deuce present</strong></td><td>Favors 3-bettor (misses both → preflop stronger wins)</td><td>Moderate</td></tr>
        </table>
        <h3>Common mistakes</h3>
        <ol><li><strong>Over-defending preflop range</strong> — must fold the bottom.</li><li><strong>Over-defending weak pairs/draws on A/K-high</strong> — pocket 7s/8s/9s, BDFDs are all folds.</li><li><strong>Over-folding high card hands on low boards</strong> — K-J with BDFD, A-T with 3-straight are calls.</li></ol>
      </Section>
      <Section title="Sizing response">
        <ul><li>vs small c-bet (20–33%) on high boards: fold 50%+ (not the 17–25% MDF suggests).</li><li>vs small c-bet on low boards: defend near MDF; call pairs, gut shots, BDFDs, 3-straight/flush.</li><li>vs jam on low disconnected board: often a call (neither range hits).</li></ul>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S12Page
