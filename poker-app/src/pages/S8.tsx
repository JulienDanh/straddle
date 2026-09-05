import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["IP sizing default?","Bet LARGER on average. IP can polarize (check uncaps on next card)."],["Villain capped (low nut ratio)?","Overbet / pot (geometric to get stacks in)."],["Villain has nuts possible?","~70% pot — large but not overbet."],["< 50% pot IP?","Almost NEVER correct. Risk of CR not worth the small reward."],["Geometric betting?","~pot on both streets to get stacks in (equal fractions)."],["Turn check-back inflection?","If you checked turn, villain's river check = weakness → bet big, not small."],["Quads risk?","~48 combos (similar to ~45 flush on 3-flush). Don't assume villain can't have quads."],["Merge bet?","Pot with medium-strong (Queens) folds better + called by worse."]]
const quizzes: QuizQuestion[] = [{q:"IP vs OOP sizing?",o:["IP bets smaller","IP bets LARGER (can polarize, check uncaps)","Same","IP always overbets"],a:1,why:"IP checks → range uncaps on turn. OOP checks → IP punishes. IP polarizes more → bets larger."},{q:"Villain capped (low nut ratio). IP sizing?",o:["Small — get called","Overbet / pot (geometric to get stacks in)","Check","30% pot"],a:1,why:"Bigger bets vs capped ranges: fold% rises slower than bet size → more profit."},{q:"Betting < 50% pot IP is...",o:["Standard","Almost NEVER correct","Required for thin value","Only for bluffs"],a:1,why:"Small bets don't justify the risk of being check-raised off equity."},{q:"You checked turn. Villain checks river. Your pair is likely...",o:["Behind — check","Best — bet big, not small","A bluff","Irrelevant"],a:1,why:"Villain's check after your turn check-back = weakness. Your pair beats almost everything."},{q:"K-K-x → K river (quads possible). You have J-10.?",o:["Bet pot for value","Check — J-x splits all jacks, loses to K-x/quads","Bet small","Check-raise"],a:1,why:"J-x can't value bet. Would bet Queens (merge) to ~¾ pot. Quarter-pot never chosen."}]

const examples: HandExample[] = [
  { tag: "River too small", tagVariant: "risk", board: <>QJx → J<D>♦</D> → blank</>, holeCards: <>QJ (Q<D>♦</D>) · 80bb</>, desc: "Q-high · QJ (Q♦) · 80bb", verdict: "agree", verdictText: "System agrees", system: "Turn check (medium). River: check or bet pot. 40% is 'disastrously thin' — loses ~160–200bb/100.", solver: "No small bet exists. AJ with A♦ is minimum river barrel (pure). Queens bets pot (merge). Quarter-pot never chosen." },
  { tag: "Bet pot", tagVariant: "default", board: <>9<S>♠</S> 9<H>♥</H> 2<C>♣</C></>, desc: "9-high · paired · turn check · 88 · 45bb", verdict: "agree", verdictText: "System agrees", system: "Villain's check after your turn check-back = weakness. Your pair beats almost everything. Bet 6–8bb (~pot).", solver: "No quarter-pot option. Minimum viable = half-pot (A8). Most strong hands bet larger." },
  { tag: "Overbet or check", tagVariant: "risk", board: <>K<S>♠</S> K<H>♥</H> 7<C>♣</C></>, desc: "K-high · paired · quads possible · J10 · 50bb", verdict: "agree", verdictText: "System agrees", system: "J-x can't value bet (splits all jacks, loses to Kx/quads). Check. Would bet Queens (merge) ~¾ pot.", solver: "Overbet or check. Quarter-pot never chosen. Jx never bets." },
  { tag: "Overbet (~pot)", tagVariant: "default", board: <>J<S>♠</S> 7<H>♥</H> 2<C>♣</C></>, desc: "J-high · KQ / strong Q · 50bb", verdict: "agree", verdictText: "System agrees", system: "Villain nut ratio very low (no straights/flushes, few sets). Geometric: ~11bb turn → ~34bb river shove.", solver: "Both sizings ~pot. Never bets small. Checks Q-x without kicker; barrels KJ/AJ/strong Qx." },
]

export function S8Page() {
  return (
    <>
      <Section title="System 8 — Bet Sizing In Position">
        <p>Sizing decisions for IP player on turn/river. Core mistake: betting too small.</p>
        <h3>IP advantage</h3>
        <ul><li>IP checks → range uncaps on next card (turn improves hands).</li><li>OOP checks → IP punishes immediately.</li><li>IP can polarize more → <strong>IP bets larger on average</strong>.</li></ul>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Villain capped (low nut ratio)", "Villain has nuts possible"]} intro="Hand strength (row) x villain nut ratio (column). Green = bet big, orange = check/merge, red = check."
          rows={[
            { label: "Strong value", cells: [{ action: "Overbet / pot", sub: "Geometric to get stacks in. Fold% rises slower than bet size.", color: "green" }, { action: "~70% pot", sub: "Large but not overbet. Nuts frequency constrains sizing.", color: "green" }] },
            { label: "Thin value", cells: [{ action: "CHECK", sub: "Don't bet thin hands small. &lt;50% pot is almost never correct IP.", color: "red" }, { action: "CHECK", sub: "Small bets don't justify the CR risk.", color: "red" }] },
            { label: "Medium-strong", labelSub: "merge candidate", cells: [{ action: "Bet pot (merge)", sub: "If: folds better AND called by worse. e.g. pocket Queens.", color: "orange" }, { action: "Check", sub: "Can't merge when villain has nuts.", color: "red" }] },
          ]}
        />
      </Section>
      <Section title="Sizing heuristic">
        <table>
          <tr><th>Situation</th><th>Sizing</th></tr>
          <tr><td>Villain capped (low nut ratio)</td><td><Tag variant="default">Overbet / pot</Tag> (geometric)</td></tr>
          <tr><td>Both have nuts possible</td><td>~70% pot (large, not overbet)</td></tr>
          <tr><td>Flush/straight fills (nut ratio rises)</td><td>Medium-large reasonable</td></tr>
          <tr><td>Thin value hand</td><td><Tag variant="risk">Check</Tag> (don't bet thin small)</td></tr>
          <tr><td>&lt; 50% pot IP</td><td><Tag variant="fold">Almost NEVER correct</Tag></td></tr>
        </table>
        <h3>Geometric betting</h3>
        <p>To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn → ~34bb river shove.</p>
        <Callout variant="bad">Reopening action risks being check-raised off equity. Small bets don't justify that risk. Fold% rises slower than bet size → bigger bets profit more.</Callout>
      </Section>
      <Section title="Risk Factors">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Villain uncapped (can have nuts)</strong></td><td>Don't overbet — ~70% pot</td></tr>
          <tr><td><strong>Paired boards / trips possible</strong></td><td>Caution — villain can have traps</td></tr>
          <tr><td><strong>Quads risk</strong></td><td>~48 combos (similar to ~45 flush on 3-flush). Don't assume villain can't have quads.</td></tr>
          <tr><td><strong>Turn check-back inflection</strong></td><td>If you checked turn, villain's river check = weakness → bet big</td></tr>
          <tr><td><strong>Merge bets</strong></td><td>Pot with medium-strong (pocket Queens) folds better + called by worse</td></tr>
        </table>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S8Page
