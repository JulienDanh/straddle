import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Three flop buckets?","1) Ace-high → 100%. 2) T–K high + deuce/3 → 100%. 3) 9-high & below → 60/40."],["Ace-high risk factors?","Stack depth (deeper→check), monotone, paired."],["T–K + deuce/3 risk factors?","Two low cards (biggest), monotone. Paired less concerning."],["When BTN misses low boards?","Bet top, bet bottom (selective), check middle. Can't bet all bluffs."],["Two-suit awareness?","BB calls with TWO suits. Block the non-flush-draw suit too (no equity risk)."],["K83 two-tone, KJ with which suits?","Heart+diamond (both on-board) = pure bet. Spades+clubs (both off) = pure check."],["AJJ strategy?","Paired ace-high → not 100%. Check KK/QQ/medium. Bet Jx + trash."],["K92 strategy?","K-high + deuce → c-bet 100%. 86–90% solver; simplify to 100%."]]
const quizzes: QuizQuestion[] = [{q:"Three flop buckets for BTN vs BB?",o:["Ace-high → 100%; T–K+deuce/3 → 100%; 9-high & below → 60/40","Same as System 1","Only two buckets","All 100%"],a:0,why:"BTN has three buckets. Ace-high and T–K with deuce/3 get 100%; 9-high and below get 60/40."},{q:"AJJ (paired ace-high). Strategy?",o:["C-bet 100%","Not 100% — check KK/QQ/medium, bet Jx + trash","Check everything","Bet only Jx"],a:1,why:"Paired ace-high is a risk factor. Bet strong + weak; check medium."},{q:"K63 (K-high + deuce, but two low cards). Strategy?",o:["100% — deuce present","Not 100% — second low card causes problems","Check everything","Bet only sets"],a:1,why:"Two low cards is the biggest risk factor for T–K high. K92 is fine; K63 is not."},{q:"543 two-tone. BTN misses (no 8+). Ace-high is...",o:["A bluff (bet)","Medium strength (check)","Strong (value bet)","Fold"],a:1,why:"Ace-high beats trash but loses to all pairs → medium → check. Bet strong + weak."},{q:"K83 two-tone, KJ with spades+clubs (both off). Action?",o:["Bet — backdoor potential","Pure check — blocks nothing useful","Check-raise","Fold"],a:1,why:"Both off-board suits = pure check. KJ with heart+diamond (both on-board) = pure bet."},{q:"BTN vs BB, 25bb, AKQ flop. Strategy?",o:["Check — straights possible","C-bet 100% — shallow stack","Check-raise","Fold pre"],a:1,why:"Shallow stack on ace-high → bet 100%. Stack depth is key; shallow = more betting."}]

const examples: HandExample[] = [
  { tag: "Ace-high · shallow", tagVariant: "default", board: <>A<S>♠</S> K<D>♦</D> 3<C>♣</C></>, desc: "A-high · 25bb", verdict: "agree", verdictText: "System agrees", system: "Shallow → bet 100%. Hero checked — mistake.", solver: "100% c-bet. Agrees." },
  { tag: "K-high + deuce", tagVariant: "default", board: <>K<S>♠</S> 9<H>♥</H> 2<C>♣</C></>, desc: "K-high · rainbow · + deuce", verdict: "agree", verdictText: "System agrees", system: "K-high + deuce → c-bet 100%.", solver: "86–90%; simplify to 100% — loses ~0.14% EV. Worth it." },
  { tag: "Risk: two low cards", tagVariant: "risk", board: <>K<S>♠</S> 6<H>♥</H> 3<H>♥</H></>, desc: "K-high · two low cards", verdict: "agree", verdictText: "System agrees", system: "Second low card interacts with 3 → not 100%.", solver: "Significant checks. Bets sets/two-pair/overpairs; checks medium; bets some trash." },
  { tag: "Risk: paired (ace-high)", tagVariant: "risk", board: <>A<S>♠</S> J<H>♥</H> J<D>♦</D></>, desc: "A-high · paired · AJJ", verdict: "agree", verdictText: "System agrees", system: "Paired ace-high → not 100%. Bet Jx + trash, check KK/QQ/TT/99.", solver: "Checks kings, queens; bets Jx and 64s, 74s, T3s." },
  { tag: "Must check: low board", tagVariant: "risk", board: <>5<H>♥</H> 4<H>♥</H> 3<C>♣</C></>, desc: "5-high · two-tone · BTN misses", verdict: "agree", verdictText: "System agrees", system: "BTN misses (no 8+). Ace-high is medium (beats trash, loses to pairs) → check. Bet 78s, 67s; bet J8s (trash).", solver: "Heavy checking. Bets top + some bottom; checks A-high, KQ, 44, 33." },
  { tag: "Must check: 742r", tagVariant: "risk", board: <>7<S>♠</S> 4<H>♥</H> 2<C>♣</C></>, desc: "7-high · rainbow · BTN misses", verdict: "agree", verdictText: "System agrees", system: "No top pair for BTN. Bet 78s, 88, 99, K7s; check 44, 22, A-high, KQ; bet T9, T8 (selective). Can't bet all bluffs.", solver: "A7 pure bet. Sets bet (deeper); shallow = can trap. 77/55/33 check." },
]

export function S2Page() {
  return (
    <>
      <Section title="System 2 — BTN RFI vs BB Call · C-betting">
        <p>Button opens, BB calls, BB checks. Three flop buckets.</p>
        <h3>Three flop buckets</h3>
        <table>
          <tr><th>Bucket</th><th>Boards</th><th>Default</th></tr>
          <tr><td><strong>1 · Ace-high</strong></td><td>A high</td><td><Tag variant="default">C-bet 100%</Tag> Risk factors below.</td></tr>
          <tr><td><strong>2 · T–K high + 2 or 3</strong></td><td>K,Q,J,T high with a deuce or 3</td><td><Tag variant="default">C-bet 100%</Tag> The 2/3 makes it disconnected.</td></tr>
          <tr><td><strong>3 · 9-high & below</strong></td><td>9-high and lower</td><td><Tag variant="risk">~60/40 bet/check</Tag> Bet strong+weak, check middle.</td></tr>
        </table>
        <Callout>BTN range is wider (offsuit 8s+), so it misses low boards harder. When BTN doesn't interact, build a checking strategy — bet top, bet bottom, check middle.</Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Default", "If risk factor present"]} intro="Scan your flop type across one row. Green = c-bet 100%. Orange = mix (bet top + bottom, check middle)."
          rows={[
            { label: "Ace-high", labelSub: "A high", cells: [{ action: "C-bet 100%", color: "green" }, { action: "Mix", sub: "Risk factors: deep, monotone, paired", color: "orange" }] },
            { label: "T–K high + 2 or 3", labelSub: "disconnected", cells: [{ action: "C-bet 100%", color: "green" }, { action: "Mix", sub: "Risk factors: two low cards, monotone", color: "orange" }] },
            { label: "9-high & below", labelSub: "always", cells: [{ action: "Always mix (~60/40)", sub: "Default for this bucket.", color: "orange" }, { action: "Mix", sub: "\u00a0", color: "orange" }] },
          ]}
        />
      </Section>
      <Section title="Risk Factors">
        <h3>Ace-high boards</h3>
        <ul><li><strong>Stack depth:</strong> deeper → more checking. Shallow → bet 100%.</li><li><strong>Monotone:</strong> substantially more checking.</li><li><strong>Paired:</strong> more checking (A<S>♠</S> J<H>♥</H> J<D>♦</D> · paired → check KK/QQ/medium; bet Jx + trash).</li></ul>
        <h3>T–K high boards (with deuce/3)</h3>
        <ul><li><strong>Two low cards:</strong> biggest risk factor (K<S>♠</S> 6<H>♥</H> 3<H>♥</H> · two low cards — the <em>second</em> low card). K92, KT3 are fine.</li><li><strong>Monotone:</strong> substantially more checking.</li><li><strong>Paired:</strong> less concerning here. <strong>Stack depth:</strong> noisier.</li></ul>
      </Section>
      <Section title="The Pyramid (when you must check)">
        <p>On boards where BTN misses (no 8+, low interaction):</p>
        <Callout><strong>Bet the top</strong> (sets, overpairs, top pair) + <strong>bet the bottom</strong> (trash bluffs, selectively — can't bet all bluffs) + <strong>check the middle</strong> (underpairs, ace-high, KQ, middle pairs).</Callout>
        <h3>Two-suit awareness (key skill)</h3>
        <p>On two-tone boards, BB defends around <em>two</em> suits. Most only think about the flush-draw suit. Also <strong>block the second suit</strong> (non-flush-draw suit BB calls with via backdoor draws).</p>
        <Callout variant="warn"><strong>K83 two-tone (hearts+diamonds):</strong> KJ with heart+diamond = pure bet. KJ with spades+clubs (both off) = pure check. KJ with a heart blocks BB's heart-based continuing range with no equity risk.</Callout>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S2Page
