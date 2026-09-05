import { Section, Callout, Tag, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Two flop buckets?","1) T-high+ → c-bet 100%. 2) 9-high & below → ~70/30 bet/check."],["Clean T-high+, what %?","100% — every hand. Small size (~25–40%)."],["Why does UTG c-bet so much?","Overpair asymmetry: UTG's linear RFI has far more strong pairs."],["Shorter or deeper → bet more?","Shorter. Overpair asymmetry amplified shallow. Most do the opposite."],["Primary risk factor?","Straights possible. 1 → still bet. 3 → slow down heavily."],["Secondary risk factors?","Ace-monotone · AK2/3/4 · deeper stacks · high-low-low (paired low under high)."],["KK3 rainbow a risk factor?","No. High-high-low is fine → c-bet 100%. Only paired low under high (K33) counts."],["On risk board, which CHECK?","Medium-strength: underpairs, medium aces, AK/AT/KQ."],["On risk board, which BET?","Very strong (sets, flushes, 2pair) AND very weak (trash)."],["A95 monotone — QJo no-heart?","Bet. It's trash. QJo with heart (draw) → check."],["Bucket 2 default?","~70/30. Strong+weak bet, medium checks. Can't go 100%."],["Default c-bet size?","1/4 to 1/3 pot (~25–40%)."]]
const quizzes: QuizQuestion[] = [{q:"T-high+ disconnected, no straights. UTG RFI, BB checks. Best line?",o:["C-bet 100%","Check medium, bet rest","Check everything","C-bet only strong pairs"],a:0,why:"Clean T-high+ → 100% c-bet, every hand. No risk factor."},{q:"K♥K♦3♣ (high-high-low). Strategy?",o:["Slow down","C-bet 100%","Check 50%","Check medium"],a:1,why:"High-HIGH-low is NOT a risk factor. Only paired low under high. Bet 100%."},{q:"A♥9♥5♥ (ace-monotone). QJo no heart. Action?",o:["Check — risk board","Bet — it's trash","Check-raise","Fold pre"],a:1,why:"Risk factor (slow down), but QJo no-heart is trash → bets. Only medium hands check."},{q:"J♣6♦6♠ (high-low-low). How often does solver check?",o:["~0%","~50%","~100%","Never — bet 100%"],a:1,why:"High-low-low with paired low → ~50% checks."},{q:"Stacks 20bb. Clean T-high+ board. You should...",o:["C-bet less","C-bet more — overpair asymmetry amplified","Never c-bet","Check-raise"],a:1,why:"Shallow amplifies overpair advantage → bet MORE. 'Bet less when short' is a leak."},{q:"T55 rainbow. T-high+ AND high-low-low. What applies?",o:["T-high+ wins → bet 100%","High-low-low wins → mix","Both → check all","Neither"],a:1,why:"Paired-low risk factor overrides T-high+. Mix: bet A5s/5x/TT/JJ, check 99–66/AK/AQ."}]

const examples: HandExample[] = [
  { tag: "Bucket 1 · clean", tagVariant: "default", board: <>J<S>♠</S> 8<D>♦</D> 4<C>♣</C></>, desc: "J-high · disconnected · no straights", verdict: "agree", verdictText: "System agrees", system: "T-high+ clean → c-bet 100%. Hero checked — mistake.", solver: "~100% c-bet to 40%. Agrees." },
  { tag: "Bucket 1 · clean", tagVariant: "default", board: <>K<S>♠</S> K<D>♦</D> 3<C>♣</C></>, desc: "K-high · high-high-low · rainbow", verdict: "agree", verdictText: "System agrees", system: "High-high-low is NOT a risk factor → c-bet 100%.", solver: "~100% c-bet. Agrees." },
  { tag: "Bucket 1 · clean", tagVariant: "default", board: <>K<S>♠</S> 8<H>♥</H> 3<H>♥</H></>, desc: "K-high · 8 · 3 · two-tone", verdict: "agree", verdictText: "System agrees", system: "No risk factor → bet 100% — AK, AA, QJ, JTs, 77, everything.", solver: "~100% c-bet, 0 checks, 40%. Agrees." },
  { tag: "Risk: ace-high monotone", tagVariant: "risk", board: <>A<H>♥</H>9<H>♥</H>5<H>♥</H></>, desc: "A-high · ace-monotone", verdict: "agree", verdictText: "System agrees", system: "Risk factor → slow down. But QJo no-heart is trash → still bet.", solver: "Checks T9s, KK no-heart, A3s. Bets QJ no-heart. QJ with heart → checks." },
  { tag: "Risk: high-low-low (J66)", tagVariant: "risk", board: <>J<C>♣</C>6<D>♦</D>6<S>♠</S></>, desc: "J-high · high-low-low · J66", verdict: "agree", verdictText: "System agrees", system: "High-low-low → check ~50%.", solver: "Bets A6s, 76s, 65s, trips, JJ/TT; checks TT–77, AK, ATs." },
  { tag: "Risk: high-low-low (T55)", tagVariant: "risk", board: <>T<S>♠</S>5<H>♥</H>5<D>♦</D></>, desc: "T-high · high-low-low · T55 · rainbow", verdict: "agree", verdictText: "System agrees", system: "Even though T-high+, paired-low wins → mix, not 100%.", solver: "Bets A5s, 5x, TT, JJ; checks 99–66, A9, A8, AQ, AK." },
]

export function S1Page() {
  return (
    <>
      <Section title="System 1 — UTG RFI vs BB Call · C-betting">
        <p>UTG opens, BB calls, BB checks. We decide our flop c-bet.</p>
        <h3>Two flop buckets</h3>
        <table>
          <tr><th>Bucket</th><th>Boards</th><th>Default</th></tr>
          <tr><td><strong>1 · T-high+</strong></td><td>T, J, Q, K, A high</td><td><Tag variant="default">C-bet 100%</Tag> Subject to risk factors.</td></tr>
          <tr><td><strong>2 · 9-high & below</strong></td><td>9-high to trips-deuces</td><td><Tag variant="risk">~70/30 bet/check</Tag> Strong+weak bet; medium checks.</td></tr>
        </table>
        <Callout>Bucket 1 occurs far more often — one ace makes a flop ace-high. Highest-ROI piece.</Callout>
        <h3>Why bet 100% on T-high+?</h3>
        <p><strong>Overpair asymmetry</strong>: UTG has far more strong pairs than BB caller. Shorter stacks amplify → bet more. Deeper → more caution.</p>
        <Callout variant="warn"><strong>Bet MORE when shallow, not less.</strong> Most players do the opposite — correct the leak.</Callout>
        <h3>Sizing</h3>
        <p>Start at <Code>1/4 to 1/3 pot</Code>. Solver examples land at 25–40%.</p>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["No risk factor (clean)", "Risk factor present"]}
          intro="Find your flop bucket (row) x risk factor presence (column). Green = c-bet 100%, orange = mix."
          rows={[
            { label: "T-high+", labelSub: "T, J, Q, K, A high", cells: [
              { action: "C-bet 100%", sub: "Every hand — hit or miss. Small size (~25–40%). No checks.", color: "green" },
              { action: "Mix — bet strong + weak", sub: "See risk factors below.", color: "orange" },
            ]},
            { label: "9-high & below", labelSub: "always", cells: [
              { action: "Always mix (~70/30)", sub: "Default — no 100% exists.", color: "orange" },
              { action: "Mix", sub: "\u00a0", color: "orange" },
            ]},
          ]}
        />
      </Section>

      <Section title={'Risk Factors (override "c-bet 100%")'}>
        <h3>1. Straights possible <Tag variant="risk">primary</Tag></h3>
        <ul><li><strong>1 straight</strong> → still bet frequently.</li><li><strong>3 straights</strong> → slow down heavily.</li></ul>
        <h3>2. Ace-high monotone <Tag variant="risk">secondary</Tag></h3>
        <p>Bet very strong (flush, sets) + very weak (trash); check medium (88 no-heart, weak aces, KK no-heart).</p>
        <h3>3. AKx family <Tag variant="risk">secondary</Tag></h3>
        <p>AK2, AK3, AK4 — "looks like that." Slow down.</p>
        <h3>4. Stack depth <Tag variant="risk">secondary</Tag></h3>
        <p>Deeper (→150bb) → caution. Shallower (→20bb) → lean into 100%.</p>
        <h3>5. High-Low-Low (paired low card) <Tag variant="risk">secondary</Tag></h3>
        <p>High card (T–A) with two paired low cards: <Code>A22, K33, Q33, J66, T55</Code>.</p>
        <ul><li><strong>Bet:</strong> trips, overpairs (JJ, TT), very weak.</li><li><strong>Check:</strong> underpairs (99–66), medium aces, AK/AQ/AT.</li><li><strong>Blocker nuance:</strong> ATo bets more when ace blocks backdoor FD CRs.</li></ul>
        <Callout variant="bad"><strong>Not High-High-Low.</strong> KK3 rainbow is <em>not</em> a risk factor — c-bet 100%. Only paired low under high counts.</Callout>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default S1Page
