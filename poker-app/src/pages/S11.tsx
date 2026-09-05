import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Three keys to hero calling?","1) Range awareness. 2) Unblock bluffs. 3) Block value."],["When to focus on which key?","Wide value range → unblock bluffs (#2). Narrow → block value (#3)."],["Good vs bad bluff catcher?","Good: blocks value (King), unblocks bluffs (4,3,2). Bad: blocks bluffs (8,9,T)."],["Why does 4-x unblock bluffs?","BTN opens suited 5+ and offsuit 8+. 4-x wasn't opened → doesn't block bluffs."],["Opponent's required bluff frequency?","= your pot odds. Need 25% → they must bluff 25% of betting range."],["No natural bluffs?","Fold even if MDF says call. No draws missed, opponent won't bluff Ax."],["CR opportunity?","If opponent bets too small IP, CR second pair can fold better + call worse."],["Toy game lesson?","Not all bluff catchers equal. 87s (blocks 77, unblocks JTs) worth ~27% pot; 88 worth 0."]]
const quizzes: QuizQuestion[] = [{q:"Three keys to hero calling?",o:["1) Pot odds 2) Hand strength 3) Position","1) Range awareness 2) Unblock bluffs 3) Block value","1) MDF 2) Blockers 3) Sizing","1) Strength 2) Pot odds 3) Bluff freq"],a:1,why:"Know your combos, don't block opponent's bluffs, block their value."},{q:"Good vs bad bluff catcher (vs BTN opener)?",o:["Good: 8-x (blocks bluffs). Bad: 4-x.","Good: 4-x/3-x (unblocks bluffs). Bad: 8-x/9-x (blocks bluffs).","Both equal","Good: any pair. Bad: ace-high."],a:1,why:"BTN opens suited 5+ and offsuit 8+. 4-x/3-x unblock bluffs. 8-x/9-x block bluffs."},{q:"When to focus on block value vs unblock bluffs?",o:["Always block value","Wide value → unblock bluffs. Narrow → block value.","Always unblock bluffs","Never focus on blockers"],a:1,why:"Wide = hard to block specific hands → focus on not blocking bluffs. Narrow = block specific value."},{q:"No natural bluffs available?",o:["Call — MDF says so","Fold even if MDF says call","Check-raise","Call — must be bluffing"],a:1,why:"If you can't identify where bluffs come from, MDF is irrelevant. Fold."},{q:"Toy game: 22237, SPR 1x. 88 vs 87s vs pot jam?",o:["Both worth 0","88 = worth 0; 87s = ~27% pot (blocks 77, unblocks JTs)","Both same","87s worse"],a:1,why:"Not all bluff catchers equal. 87s blocks value (77) and unblocks bluffs (JTs). 88 blocks nothing useful."}]

const examples: HandExample[] = [
  { tag: "CR", tagVariant: "default", board: <>Q<S>♠</S> T<C>♣</C> 2<H>♥</H> → A<D>♦</D> → blank</>, holeCards: <>A<H>♥</H>3<H>♥</H> (second pair) · IP bet 1/3</>, desc: "Q-high · A♥3♥ · CR opportunity", verdict: "agree", verdictText: "System agrees", system: "Range dense with KQ/QJ (12 combos) vs A-3/4/5♥ (3 combos). CR to ~25bb.", solver: "May fold better (A-x hearts) and call worse (KQ, QJ)." },
  { tag: "Fold", tagVariant: "fold", board: <>6<S>♠</S> 5<H>♥</H> 4<C>♣</C></>, desc: "6-straight · AJs · no natural bluffs", verdict: "agree", verdictText: "System agrees", system: "Opponent won't bluff with A-2/3/4/5. No natural bluffs. Fold.", solver: "Lost to A-7 (thin value, not 6-bluff). No natural bluffs available." },
  { tag: "Call (blocker)", tagVariant: "call", board: <>T<S>♠</S> 4<H>♥</H> 2<C>♣</C></>, desc: "T-high · T6o · IP bet ¼", verdict: "agree", verdictText: "System agrees", system: "T-6 blocks pair of tens (value region). Call.", solver: "Lost to K-T but correctly identified value source." },
  { tag: "Blocker call", tagVariant: "call", board: <>A<S>♠</S> 7<H>♥</H> 2<C>♣</C> → blank (turn checked) → Q<S>♠</S></>, holeCards: <>K7 / 42 / 43 · IP bet 37.5%</>, desc: "A-high · K7/42/43 · IP bet 37.5%", verdict: "agree", verdictText: "System agrees", system: "Call K7/K3/K2, 42/43/74; fold 87/82/97/92.", solver: "K-x blocks value (KK/KQ); 4-x unblocks bluffs; 8/9-x block bluffs. Confirmed." },
  { tag: "Toy game", tagVariant: "risk", board: <>2<S>♠</S> 2<H>♥</H> 2<C>♣</C> 3<D>♦</D> 7<S>♠</S></>, desc: "Toy game · 22237 · 88 vs 87s", verdict: "agree", verdictText: "System agrees", system: "88 = worth 0 (indifferent); 87s = ~27% pot. 87s blocks 77 (value) and unblocks JTs (bluff).", solver: "Not all bluff catchers are equal." },
]

export function S11Page() {
  return (
    <>
      <Section title="System 11 — Hero Calling">
        <p>Systematically differentiating between bluff catchers on the river.</p>
        <h3>Three keys</h3>
        <table>
          <tr><th>#</th><th>Key</th><th>Description</th></tr>
          <tr><td>1</td><td><strong>Range awareness</strong></td><td>Know what combos you arrive with</td></tr>
          <tr><td>2</td><td><strong>Unblock bluffs</strong></td><td>Prefer hands that don't block opponent's bluffing region</td></tr>
          <tr><td>3</td><td><strong>Block value</strong></td><td>Prefer hands that block opponent's value region</td></tr>
        </table>
        <Callout>Value range <em>wide</em> → focus on #2 (unblock bluffs). <em>Narrow</em> → focus on #3 (block value).</Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Unblocks bluffs / blocks value", "Blocks bluffs / unblocks value"]} intro="Value range width (row) x your hand's blocker (column). Green = call, red = fold."
          rows={[
            { label: "Value range wide", labelSub: "focus: unblock bluffs", cells: [{ action: "Call", sub: "4-x, 3-x, 2-x: below BTN open threshold. Unblocks opponent's bluffing range.", color: "green" }, { action: "Fold", sub: "8-x, 9-x, T-x: above open threshold. Blocks opponent's bluffs.", color: "red" }] },
            { label: "Value range narrow", labelSub: "focus: block value", cells: [{ action: "Call", sub: "King: blocks KK, KQ (value). High card blocks value region.", color: "green" }, { action: "Fold", sub: "8/9: blocks nothing valuable. Doesn't block value.", color: "red" }] },
            { label: "No natural bluffs", labelSub: "no draws missed", cells: [{ action: "Fold — even if MDF says call", sub: "If you can't identify where bluffs come from, MDF is irrelevant.", color: "red" }, { action: "\u00a0", color: "red" }] },
          ]}
        />
      </Section>
      <Section title="Core principle">
        <Callout><strong>Opponent's required bluff frequency = your pot odds.</strong> Need 25% → they must bluff 25% of betting range. If balanced → worst callable = worth 0. But <em>better</em> bluff catchers (block value / unblock bluffs) = worth significant EV.</Callout>
        <h3>Good vs bad bluff catchers</h3>
        <table>
          <tr><th>Attribute</th><th>Good</th><th>Bad</th></tr>
          <tr><td>Blocks value</td><td>✅ King (blocks KK, KQ)</td><td>❌ 8/9 (blocks nothing valuable)</td></tr>
          <tr><td>Unblocks bluffs</td><td>✅ 4, 3, deuce</td><td>❌ 8, 9, T (blocks offsuit opens)</td></tr>
          <tr><td>Card vs open threshold</td><td>Below BTN open (4, 3, 2)</td><td>Above BTN open (8, 9, T)</td></tr>
        </table>
        <Callout variant="warn"><strong>Preflop awareness:</strong> BTN opens suited 5+ and offsuit 8+. 4-x/3-x <em>unblock</em> bluffs (not opened); 8-x/9-x <em>block</em> bluffs (opened).</Callout>
      </Section>
      <Section title="Exceptions">
        <ul><li><strong>Recreational players</strong> may bluff with too-strong hands → higher kickers marginally better.</li><li><strong>Check-raise opportunity:</strong> if opponent bets too small IP (1/3 pot, thin value), CR second pair can fold better + call worse.</li><li><strong>No natural bluffs:</strong> if no draws missed, opponent won't convert Ax to bluff → fold even if MDF says call.</li></ul>
        <h3>CR sizing</h3>
        <p>Modest CR (to ~25bb) can get hands you beat to call (KQ, QJ) and hands that beat you to fold (A-3/4/5<H>♥</H>).</p>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S11Page
