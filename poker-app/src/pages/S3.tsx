import { Section, Callout, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Fold target vs SB stab?","~25% (1bb into ~3.7bb). Defend ~75%. Focus on the 25% you fold."],["Which cards NOT relevant?","Ace and deuce. Everything has over/under. Ignore them."],["Three defending mechanisms?","1) High-card defending. 2) Three to a straight. 3) Backdoor flush draw."],["Double overs / over-under / double unders?","Double overs = easy play. Over-under = sensitive. Double unders = fold unless gut shots."],["BDFD always enough?","No. Worst hands (42s on K77) still fold even with BDFD. Identify worst first."],["Key card height heuristic?","High key card (8) → rarely fold double-overs. Low key card (5) → fold more."],["Paired board — which card?","The unpaired high card. Can't have equity vs trips."],["Preflop asymmetry BvB?","SB has folding range; BB doesn't. 2x/3x favor BB. BB capped (no AK/AQ/overpairs)."]]
const quizzes: QuizQuestion[] = [{q:"Fold target vs SB limp stab?",o:["~50%","~25% (1 into ~3.7)","~10%","~75%"],a:1,why:"1bb into ~3.7bb pot. 1/4 = 25%. Defend ~75%."},{q:"Which cards are NOT strategically relevant?",o:["King and 5","Ace and deuce","Ace and king","Deuce and 3"],a:1,why:"Everything has overcards to deuce / undercards to ace. No over-unders to either."},{q:"K77 paired. Which card do you build around?",o:["The 7 (paired)","The king (unpaired)","Both","Neither"],a:1,why:"Can't have equity vs trips. Evaluate around unpaired high card."},{q:"A42 two-tone. Worst hands contain which card?",o:["A 3","A 7","A deuce","A 5"],a:1,why:"3x and 5x have gutshots. 6x has backdoor straights. 7 is most disconnected."},{q:"K62 two-tone. 73 with spade. Action?",o:["Play — BDFD","Fold — worst hand, BDFD not enough","Check-raise","Call — gutshot"],a:1,why:"73 is worst hand (over-under to 6). Even with BDFD, it folds. 75 (3-straight) pure."},{q:"Key card: low (5) vs high (8). Double-overs?",o:["Same — always play","Low: fold more (plenty below). High: rarely fold (rare).","Always fold","Always play"],a:1,why:"Low key card = more double-unders below → double-overs less valuable."}]

const examples: HandExample[] = [
  { tag: "Fold", tagVariant: "fold", board: <>K<S>♠</S> 7<H>♥</H> 7<H>♥</H></>, holeCards: <>63o</>, desc: "K-high · paired · two-tone", verdict: "agree", verdictText: "System agrees", system: "Paired → evaluate king. 63o: no high card, no 3-straight, no BDFD. Pure fold.", solver: "~25% fold. A-high pure, Q-high ~pure, J-high starts folding. 98/86/65 (3-straight) pure. BDFD plays but worst (42s, 52s) fold." },
  { tag: "Defend", tagVariant: "call", board: <>A<S>♠</S> 4<H>♥</H> 2<H>♥</H></>, holeCards: <>J9<H>♥</H></>, desc: "A-high · two-tone", verdict: "agree", verdictText: "System agrees", system: "Ignore ace/deuce. Key=4. Gutshots (3x,5x) pure. Worst contain 7 (97,T7). J9♥ high enough → pure play.", solver: "3x/5x pure calls. 97/T7 pure folds. 6 outcompetes 7. J9♥ pure confirmed." },
  { tag: "Fold", tagVariant: "fold", board: <>K<S>♠</S> 6<H>♥</H> 2<H>♥</H></>, holeCards: <>Q3o (no spade)</>, desc: "K-high · two-tone", verdict: "agree", verdictText: "System agrees", system: "Key=6. Double-unders to 6 have gutshots (43,54,53) → pure calls. Folds from over-unders (73,83,93). Q3 no spade = fold.", solver: "Dense fold in over-unders. 73 with spade still folds. 75 (3-straight) pure. BDFDs pure on two-tone." },
  { tag: "Defend", tagVariant: "call", board: <>K<S>♠</S> Q<H>♥</H> 8<C>♣</C></>, holeCards: <>76o</>, desc: "KQ8 · rainbow", verdict: "agree", verdictText: "System agrees", system: "Key=8 (high). Double-unders fold — but 76 has 3-straight → pure play. 97 (over-under, 3-straight) pure. Double-overs (T9,J9,JT) pure.", solver: "Double-unders to 8 heavily folded. 76 pure. All 3-to-flush playable on rainbow (premium). Double-overs to 8 pure." },
  { tag: "Defend", tagVariant: "call", board: <>Q<S>♠</S> 8<H>♥</H> 3<H>♥</H></>, holeCards: <>K4<D>♦</D></>, desc: "Q-high · two-tone", verdict: "agree", verdictText: "System agrees", system: "Key=8. Worst contain deuce. K4 with K♦ = pure play (~40 bb/100). Don't fold.", solver: "72 even with diamond unplayable. K4 with K♦ ~40 bb/100. Treacherous fold by a pro." },
]

export function S3Page() {
  return (
    <>
      <Section title="System 3 — BB vs SB Limp Stab · Defending Flops">
        <p>SB limps, BB checks, SB stabs. We defend from BB. Highest-impact scenario — BB win rate determines winner/loser.</p>
        <Callout variant="good"><strong>Why BB matters:</strong> Skilled player goes from −112 bb/100 (walk-away) to −20 — 92 points of opportunity. UTG only has 27. BB skill is <em>definitively</em> most important.</Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["No draws", "BDFD or 3-straight", "Gut shot"]} intro="Find your hand type (row) x draws (column). Green = defend, red = fold."
          rows={[
            { label: "Double overs", labelSub: "both above key card", cells: [{ action: "Depends on key card height", sub: "See key-card height heuristic below.", color: "orange" }, { action: "Defend", sub: "Draws make double-overs playable regardless.", color: "green" }, { action: "Defend", color: "green" }] },
            { label: "Over-under", labelSub: "worst hands live here", cells: [{ action: "Fold", sub: "Worst hands in range. No equity to fall back on.", color: "red" }, { action: "Defend", sub: "BDFD or 3-straight rescues the worst category.", color: "green" }, { action: "Defend", sub: "Gut shot = direct equity.", color: "green" }] },
            { label: "Double unders", labelSub: "both below key card", cells: [{ action: "Fold", sub: "Unless BDFD rescues the very worst hands.", color: "red" }, { action: "Defend", sub: "BDFD can rescue, unless you're the absolute worst hand.", color: "green" }, { action: "Pure call", sub: "Gut shots (43, 54, 53) are pure plays.", color: "green" }] },
          ]}
        />
      </Section>
      <Section title="The System">
        <h3>Step 1 — Fold target</h3>
        <p>SB bets 1bb into ~3.7bb. Risk/reward = 1/4 ≈ <strong>25% fold</strong>. Defend ~75%. Focus on the 25% you fold.</p>
        <h3>Step 2 — Strategically relevant cards</h3>
        <Callout variant="warn"><strong>Ace and Deuce are NOT strategically relevant.</strong> Everything has overcards to deuce / undercards to ace. No over-unders to either. <em>Ignore them.</em> Build strategy around other board cards.</Callout>
        <h3>Step 3 — Three defending mechanisms</h3>
        <table>
          <tr><th>Mechanism</th><th>Example (K77)</th></tr>
          <tr><td><strong>High-card defending</strong></td><td>All A-high pure, Q-high ~pure, J-high starts folding</td></tr>
          <tr><td><strong>Three to a straight</strong></td><td>98o, 86o, 65o — pure calls</td></tr>
          <tr><td><strong>Backdoor flush draw</strong></td><td>85 with spade pure; 85 no spade folds. High card of suit &gt; low card.</td></tr>
        </table>
        <h3>Step 4 — Classify around the key card</h3>
        <table>
          <tr><th>Category</th><th>Definition</th><th>Playability</th></tr>
          <tr><td><strong>Double overs</strong></td><td>Both above key card</td><td>Easy play (high key card = rare; low = may fold)</td></tr>
          <tr><td><strong>Over-under</strong></td><td>One over, one under</td><td>Sensitive — worst hands. BDFD often needed.</td></tr>
          <tr><td><strong>Double unders</strong></td><td>Both below</td><td>Often fold — <em>unless</em> gut shots / 3-straight</td></tr>
        </table>
      </Section>
      <Section title="Key Skills & Exceptions">
        <h3>Identify the worst hand on the board</h3>
        <p>On A42 → worst contain a 7 (97, T7). On K62 → worst are over-unders to 6 (73, 83). On KQ8 → worst are double-unders to 8 (65, 54, 53).</p>
        <Callout variant="bad"><strong>BDFD is not always enough.</strong> If you have one of the <em>worst</em> hands, even BDFD won't save it. 42 with spade on K77 still folds. Identify worst first, then check if BDFD rescues.</Callout>
        <h3>Heuristic: key card height</h3>
        <ul><li><strong>High key card (8):</strong> double-overs rare/valuable → rarely fold.</li><li><strong>Low key card (5):</strong> double-overs common → fold more (plenty below).</li></ul>
        <h3>Paired boards</h3>
        <p>Paired card unusable (can't have equity vs trips). Evaluate around unpaired high card. High-card defending dominates.</p>
        <h3>Preflop asymmetry</h3>
        <Callout>SB has a folding range; BB does not. 2x/3x favor BB. BB checking = capped (no AK/AQ/overpairs). SB has advantage on Broadway boards; BB on low boards.</Callout>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S3Page
