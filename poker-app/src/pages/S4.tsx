import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Two-system approach?","System 1: bottom of range up (weakest first, prioritize LOW card). System 2: blocking effects. Prioritize System 1."],["Why prioritize low card?","Low cards have good blocking effects vs linear ranges. Low EV when checking."],["When is System 2 easy?","Board 3-flushes → one-club bias (blocks flushes + hero calls)."],["When is System 1 forced?","Wide ranges (no obvious suit), or three Broadway + EP (no offsuit air)."],["Busted straight + flush draw?","Terrible bluff — blocks both folding regions. Prefer one or the other."],["High vs low card of suit?","High card (K♥) worse to hold when bluffing (blocks more folds). Low card less damaging."],["Value bets require bluffs?","Yes (in common scenarios). Bluffs need value to carry them."],["The realism constraint?","Can't always have ideal bluff (hearts bet flop/turn → no hearts left). Bluff with what you have."]]
const quizzes: QuizQuestion[] = [{q:"System 1 for river bluffs?",o:["Bluff strongest first","Bluff from bottom up (weakest first, prioritize LOW card)","Bluff middle","Best blockers only"],a:1,why:"Weakest hands have lowest EV when checking → lowest opportunity cost."},{q:"Board 3-flushes on river. Which system is easy?",o:["System 1","System 2 (one-club bias)","Neither","Both equally"],a:1,why:"One club blocks flushes AND hero calls. Obvious blocking effect."},{q:"Three Broadway, EP open. Why is System 1 forced?",o:["No offsuit air exists (linear range)","System 2 is wrong","Solvers don't work","Too deep"],a:0,why:"Linear EP range has no offsuit air. Only suited hands can bluff — scarce."},{q:"QJ♥ on river (busted straight + flush). Good bluff?",o:["Yes — double draw","No — blocks both folding regions","Only if shallow","Only vs passive"],a:1,why:"Blocking both busted straight AND flush draws is terrible."},{q:"Hearts bet flop+turn. On river, bluff with heart?",o:["Yes — hearts best","Rarely — you lost them on earlier streets","Always","Never"],a:1,why:"Realism constraint: if hearts bet earlier, you won't have them on river. Bluff with what you have."}]

const examples: HandExample[] = [
  { tag: "System 1+2 blend", tagVariant: "default", board: <>A<S>♠</S> K<H>♥</H> 4<H>♥</H></>, holeCards: <>86o (6<H>♥</H>)</>, desc: "A-high · two-tone", verdict: "agree", verdictText: "System agrees", system: "Opp check-calls with hearts/clubs → avoid those. 6♥ is low-card heart (less damaging). Near bottom → pure bluff.", solver: "86o avoids clubs → pure bluff. High-card heart versions check; low-card heart can bet." },
  { tag: "System 2 (easy)", tagVariant: "default", board: <>4<C>♣</C> 5<C>♣</C> K<C>♣</C></>, desc: "K-high · 3-flush · 75o no club", verdict: "agree", verdictText: "System agrees", system: "3-flush → one-club bias obvious. 75 no club = check-fold. 75 with 7♣ = bluff.", solver: "All bluffs have a club. One club blocks flushes + hero calls." },
  { tag: "System 1 forced", tagVariant: "risk", board: <>Three Broadway, EP</>, holeCards: <>T<S>♠</S>8<S>♠</S></>, desc: "Three Broadway · EP · T♠8♠", verdict: "agree", verdictText: "System agrees", system: "Linear EP = no offsuit air. Only suited hands can bluff — scarce. Pure bluff.", solver: "T8s pure bluff. No offsuit bluffs exist. 65s also pure. All equal-weight." },
  { tag: "Realism check", tagVariant: "risk", board: <>9<S>♠</S> 4<H>♥</H> 2<D>♦</D></>, holeCards: <>95o</>, desc: "9-high · BvB", verdict: "agree", verdictText: "System agrees", system: "Ideal bluffs = 4x (84,94,T4) but they had gutshots on turn → already barreled. 95o is realistically at the bottom. Pure bluff.", solver: "95o pure bluff. 84/94 were turn barrels → won't reach river. Checking 95o = no bluffing range." },
  { tag: "Block both = bad", tagVariant: "risk", board: <>QJ<H>♥</H> (busted straight + flush)</>, desc: "Busted straight + flush · QJ♥", verdict: "agree", verdictText: "System agrees", system: "QJ♥ blocks both busted straights AND flushes. Terrible bluff. Prefer 67♥, 78♥ (block flush only).", solver: "QJ♥ checks. 67♥/78♥ bluff. Intersection of blocking both folding regions is very bad." },
]

export function S4Page() {
  return (
    <>
      <Section title="System 4 — Missed River Bluffs">
        <p>Two-system approach. <strong>Prioritize System 1</strong> (easier) while acknowledging System 2 (solvers use it more).</p>
        <h3>System 1 — Bottom of range up</h3>
        <p>Bluff with <em>weakest</em> hands first — lowest EV when checking, lowest opportunity cost. <strong>Heuristic: prioritize the <em>lowest card</em> in the hand.</strong> 72o before 65o. 92o before 87o.</p>
        <Callout>Low cards have good blocking effects vs linear ranges (deuce blocks few value, unblocks folds — opponents folded 2x preflop).</Callout>
        <h3>System 2 — Blocking effects</h3>
        <p>Bluff with combos that <strong>block opponent's calls/raises</strong> and <strong>unblock their folds</strong>, while checking opportunity cost. Very difficult to manage all three — System 1 is default.</p>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["System 2 (blocking effects)", "System 1 (bottom of range up)"]} intro="Board texture (row) x which system to use (column). Green = bluff, red = don't. First: do you have a value bet? If no, no bluffs needed."
          rows={[
            { label: "Board 3-flush or suit blanked", labelSub: "easy System 2", cells: [{ action: "Bluff with one card of that suit", sub: "Blocks flushes AND hero calls. Obvious blocking effect.", color: "green" }, { action: "Secondary", sub: "System 2 is easy here — use it first.", color: "orange" }] },
            { label: "Wide ranges, no suit blanked", cells: [{ action: "Too hard", sub: "Can't identify blocking effects on wide ranges.", color: "red" }, { action: "Bluff weakest hands first", sub: "Prioritize the LOW card in hand. Lowest EV when checking.", color: "green" }] },
            { label: "Three Broadway, EP open", cells: [{ action: "Too hard", sub: "No offsuit air exists (linear range).", color: "red" }, { action: "Bluff all suited air", sub: "Only suited hands can bluff — scarce. Pure bluff them all.", color: "green" }] },
            { label: "Busted straight + flush draw", cells: [{ action: "Terrible bluff", sub: "Blocks both folding regions at once.", color: "red" }, { action: "Terrible bluff", sub: "Same — blocks both. Don't bluff with QJ♥.", color: "red" }] },
          ]}
        />
      </Section>
      <Section title="When to use which">
        <table>
          <tr><th>Situation</th><th>System</th><th>Why</th></tr>
          <tr><td>Board 3-flushes</td><td><strong>System 2</strong> (easy)</td><td>One-club bias obvious — blocks flushes + hero calls</td></tr>
          <tr><td>Wide ranges, no obvious suit blanked</td><td><strong>System 1</strong></td><td>Too hard to identify blocking effects</td></tr>
          <tr><td>Three Broadway, EP open</td><td><strong>System 1</strong></td><td>No offsuit air (linear range) — suited bluffs scarce, bluff them</td></tr>
          <tr><td>Opponent called flop with specific suits</td><td><strong>System 2</strong> (avoid those)</td><td>Block how they fold, unblock how they call</td></tr>
        </table>
        <h3>Key blocking patterns</h3>
        <ul>
          <li><strong>3-flush river:</strong> bluff with one card of the flush suit. Blocks flushes AND hero calls.</li>
          <li><strong>Two-tone flop called:</strong> opponent called with 2 suits. Bluff avoiding those; prefer others.</li>
          <li><strong>High card vs low card of suit:</strong> high card heart is <em>worse</em> (blocks more folds). Low card heart less damaging.</li>
          <li><strong>Busted straight + busted flush draw:</strong> <em>terrible</em> bluff — blocks both folding regions.</li>
        </ul>
      </Section>
      <Section title="The realism constraint">
        <Callout variant="bad"><strong>You can't always have the ideal bluff.</strong> If hearts bet flop+turn, you <em>won't have hearts left</em> on river. Don't wait for the perfect blocker — you'll have <em>no</em> bluffing range. Bluff with what you realistically arrived with.</Callout>
        <h3>Value bets require bluffs</h3>
        <p>If you identify value bets, you <em>must</em> have bluffs (in common scenarios). Bluffs need value to carry them.</p>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S4Page
