import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Core mistake?","Barreling medium-strength hands that should check. Lose to calls above, only beat bluffs."],["The pyramid?","Bet top (nuts) + bet bottom (trash, selective) + check middle (medium)."],["Deep vs short?","Deep → opponent calls more top pair (more callers above). Short → CRs top pair (fewer calls above)."],["When can medium hand bet?","Merge play: strong enough to fold better AND called by worse (ATo on Q73→J)."],["Default turn sizing?","Polarize — pot-ish or check. Avoid medium sizing with medium hands."],["J9 on Q73→J?","Check — J9 no kicker is medium. AJ with A♦ minimum to barrel."],["99 on K72→Q?","Check — medium, opponent has many K-x calls. 88 (open-ender) borderline."]]
const quizzes: QuizQuestion[] = [{q:"Core mistake in barreling?",o:["Betting too small","Barreling medium-strength hands that should check","Not bluffing enough","Betting too large"],a:1,why:"Medium hands lose to calls above, only beat bluffs. Check them as bluff catchers."},{q:"99 on K72→Q turn. Action?",o:["Barrel — overpair","Check — medium, opponent has many K-x calls","Check-raise","Fold"],a:1,why:"Pocket 9s is medium. Opponent has many K-x calls above you. 88 (open-ender) borderline."},{q:"ATo on Q73→J. Merge — bet or check?",o:["Check — medium","Bet — folds Q-x/K-x, called by worse","Fold","Check-raise"],a:1,why:"ATo folds better (Q-x, K-x) AND called by worse (J-T, draws). Classic merge."},{q:"Default turn sizing?",o:["30% pot","Pot-ish or check (avoid medium with medium hands)","Min-bet","Overbet only"],a:1,why:"Polarize: bet big (pot, ~116% overbet) or check. Medium doesn't rescue medium."},{q:"Deep stacks (80bb+) effect on medium hands?",o:["More barrelable","Opponent calls more top pair → more callers above","Less betting","No effect"],a:1,why:"Deep = opponent calls more top pair. Medium hands face more callers above."}]

const examples: HandExample[] = [
  { tag: "Medium → check", tagVariant: "risk", board: <>Q73 two-tone → J<H>♥</H></>, holeCards: <>J9o</>, desc: "Q-high · two-tone · J9o", verdict: "agree", verdictText: "System agrees", system: "J9 (no kicker) is medium — loses to KJ/JT floats. Check.", solver: "Checks J9. AJ with A♦ is minimum jack to barrel." },
  { tag: "Medium → check", tagVariant: "risk", board: <>K<S>♠</S> 7<H>♥</H> 2<H>♥</H></>, desc: "K-high · two-tone · 99", verdict: "agree", verdictText: "System agrees", system: "Pocket 9s medium — opponent has many K-x calls. Check.", solver: "99 and 88 both check. 88 (open-ender) borderline. 99 pure check." },
  { tag: "Medium → check", tagVariant: "risk", board: <>Q<S>♠</S> 7<H>♥</H> 5<C>♣</C></>, desc: "Q-high · rainbow · JJ · bad turn", verdict: "agree", verdictText: "System agrees", system: "Bad card for range + medium strength → check.", solver: "JJ mostly checks (56%, →72% if no donk). 88/99 can barrel (open-ender)." },
  { tag: "Merge → bet", tagVariant: "default", board: <>Q73 → J<H>♥</H></>, holeCards: <>ATo</>, desc: "Q-high · two-tone · ATo · merge", verdict: "agree", verdictText: "System agrees", system: "Merge — folds Q-x/K-x, called by J-T/J-4s/10x. Bet.", solver: "Confirms. ATo folds out Q-x/K-x, called by dominated J-x and draws." },
]

export function S5Page() {
  return (
    <>
      <Section title="System 5 — Barreling Medium-Strength Hands in Error">
        <p>Turn barrels after flop c-bet is called. Core mistake: barreling medium-strength hands that should check.</p>
        <h3>The Pyramid</h3>
        <table>
          <tr><th>Tier</th><th>Action</th><th>Why</th></tr>
          <tr><td>Nuts / very strong</td><td>BET (value)</td><td>Get called by worse</td></tr>
          <tr><td>Strong but not nuts</td><td>BET (thin value, selective)</td><td>Needs to be strong enough</td></tr>
          <tr><td>Medium strength</td><td><Tag variant="risk">CHECK</Tag></td><td>Loses to calls above, only beats bluffs</td></tr>
          <tr><td>Weak / trash</td><td>BET (bluff, selective)</td><td>Low opportunity cost</td></tr>
        </table>
        <Callout variant="bad"><strong>Don't barrel medium-strength hands.</strong> They lose to hands that call and only beat bluffs. Check keeps them as bluff catchers. Barreling gets value-owned.</Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Default action", "Exception"]} intro="Find your hand tier (row) x qualifier (column). The pyramid: bet top, bet bottom, check middle."
          rows={[
            { label: "Very strong", labelSub: "nuts, sets", cells: [{ action: "BET (value)", sub: "Pot-ish or overbet. Get called by worse.", color: "green" }, { action: "Always bet", sub: "No exception.", color: "green" }] },
            { label: "Medium strength", labelSub: "loses to calls above, beats bluffs", cells: [{ action: "CHECK", sub: "Keep as bluff catcher. Barreling gets value-owned.", color: "red" }, { action: "BET (merge)", sub: "Only if: folds better AND gets called by worse. e.g. ATo on Q73→J.", color: "green" }] },
            { label: "Weak / trash", cells: [{ action: "CHECK", sub: "If not enough value bets to carry bluffs.", color: "red" }, { action: "BET (selective bluff)", sub: "Only if enough value bets exist. Not all trash — only some.", color: "green" }] },
          ]}
        />
      </Section>
      <Section title="Risk Factors & Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Deep (80bb+)</strong></td><td>Opponent calls more top pair → more callers above medium</td></tr>
          <tr><td><strong>Short (25bb)</strong></td><td>Opponent CRs top pair instead of calling → fewer calls above</td></tr>
          <tr><td><strong>Turn improves your range (A/K)</strong></td><td>May justify barreling medium (range advantage)</td></tr>
          <tr><td><strong>EP open (range bet flop)</strong></td><td>Less need to polarize; range advantage vs BB</td></tr>
          <tr><td><strong>Merge play (exception)</strong></td><td>Strong-enough medium can bet if folds better AND called by worse</td></tr>
        </table>
        <Callout variant="good"><strong>Merge example (ATo on Q73→J):</strong> Barreling ATo folds Q-x/K-x (better) and gets called by J-T, J-4s, 10x draws (worse). Merge = thin value + fold equity. Not all medium hands can do this.</Callout>
      </Section>
      <Section title="Sizing"><p>Default turn: <strong>polarize</strong> — pot-ish or check. Solver often prefers ~116% overbet or check. Adding 60% allows thinner value (K8s) but doesn't rescue medium hands (99 still checks).</p></Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S5Page
