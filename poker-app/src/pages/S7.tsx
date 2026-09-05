import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["MDF formula?","Fold% = Risk / (Pot + Risk). But villain bluffs have real equity → actual fold% is LOWER."],["How much defend vs CR?","Most of range (65–80%+). Focus on the small folding range."],["Organize around which card?","Highest unpaired card. Two overs = pure call. Double unders = fold candidates."],["Defend priority for trash?","1) Direct equity (A-high). 2) BDFD (high card). 3) 3-straight. 4) BD straight. 5) Blockers."],["Paired board (K55)?","Organize around unpaired card. Ace + BDFD = pure call."],["Blocker suits on two-tone?","Avoid suit villain bluffs with — blocks their bluff frequency."],["Naked BDFD (no straight, no high)?","Worst defendable — may fold (T9 with only BDFD)."],["HUD exploit risk?","If fold-to-CR too high, regulars exploit you."]]
const quizzes: QuizQuestion[] = [{q:"MDF formula for fold %?",o:["Pot / Risk","Risk / (Pot + Risk)","Risk / Pot","Pot / (Pot + Risk)"],a:1,why:"Makes zero-equity bluffs indifferent. But villain bluffs have real equity → actual fold% LOWER."},{q:"How much defend vs check-raise?",o:["~25%","Most of range (65–80%+)","Exactly MDF","50%"],a:1,why:"Focus on identifying the small folding range (worst hands)."},{q:"K55 two-tone. How do you organize?",o:["Around the 5","Around the king (unpaired)","Fold everything","Call everything"],a:1,why:"Can't use paired card for overcard logic. Organize around unpaired card. Ace + BDFD = pure call."},{q:"T9o on K55 two-tone, ~4.5bb raise. Action?",o:["Pure call","Pure fold (close, −0.06bb)","Check-raise","Mix"],a:1,why:"MDF ~43%, actual ~34%. T9 pure fold. QJ with ♦ = pure call; 76s = mix."},{q:"Defend priority for trash?",o:["BDFD first","1) Direct equity (A-high). 2) BDFD. 3) 3-straight. 4) BD straight. 5) Blockers.","Kicker first","None — fold all"],a:1,why:"Overcards to top pair first (ace-high), then BDFD (high card of suit), then 3-straight."}]

const examples: HandExample[] = [
  { tag: "Defend trash", tagVariant: "call", board: <>J<S>♠</S> 3<H>♥</H> 3<H>♥</H></>, desc: "J-high · paired · two-tone · min-raise", verdict: "agree", verdictText: "System agrees", system: "MDF ~38%, actual ~18%. Defend trash like 54♥. Only pure garbage (84♠, T6♥) folds.", solver: "Folds only 18%. Calls K-T, K-9, Q-9, 54♥." },
  { tag: "Fold (close)", tagVariant: "fold", board: <>K<S>♠</S> 5<H>♥</H> 5<H>♥</H></>, desc: "K-high · paired · two-tone · T9o", verdict: "agree", verdictText: "System agrees", system: "MDF ~43%, actual ~34%. T9 pure fold (−0.06bb). QJ with ♦ = pure call; 76s = mix; Ax+♦ = pure call.", solver: "T9 pure fold; J9 mix; JT pure call with J♦. Ax without ♦ needs high (AQ, AJ, AT)." },
  { tag: "Snap call", tagVariant: "call", board: <>5<S>♠</S> 3<H>♥</H> 3<C>♣</C></>, desc: "5-high · paired · AJ · ~7.3bb", verdict: "agree", verdictText: "System agrees", system: "MDF 51%, actual 42%. Villain bluffs have huge equity. AJ near top of range → call.", solver: "42% fold. AJ mixes (author pure calls). KJ offsuit = fold. Worst BDFDs without straights fold." },
]

export function S7Page() {
  return (
    <>
      <Section title="System 7 — C-bet Folding Flops (vs Check-Raises)">
        <p>You c-bet the flop as preflop raiser and face a CR. Which hands defend vs fold?</p>
        <h3>MDF calculation</h3>
        <Callout><strong>Fold% = Risk / (Pot + Risk)</strong> — makes zero-equity bluffs indifferent. But villain's bluffs have real equity → <strong>actual fold% is LOWER</strong>. Defend more than MDF.</Callout>
        <p>Example: raise to 4 into pot of 10.56 → 38% MDF → actual ~18–25% fold.</p>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["No draws", "With draws (BDFD, 3-straight, BD straight)"]} intro="Organize around highest unpaired card. Find your hand position (row) x draws (column)."
          rows={[
            { label: "Two overcards", labelSub: "to key card", cells: [{ action: "Pure call", sub: "Ace-high first in defend priority.", color: "green" }, { action: "Pure call", sub: "Draws make it even stronger.", color: "green" }] },
            { label: "One over, one under", cells: [{ action: "Fold candidate", sub: "No redeeming equity.", color: "red" }, { action: "Call", sub: "See defend priority below.", color: "green" }] },
            { label: "Double undercards", labelSub: "worst hands", cells: [{ action: "Fold", sub: "Naked, no equity. These are the folds.", color: "red" }, { action: "Call", sub: "High in defend priority: ace-high, BDFD, 3-straight.", color: "green" }] },
          ]}
        />
      </Section>
      <Section title="Defending framework">
        <p>Defend most of range (65–80%+). Focus on the small <strong>folding range</strong> (worst hands).</p>
        <h3>Organize around the highest unpaired card</h3>
        <table><tr><th>Hand type</th><th>Action</th></tr><tr><td><strong>Two overcards</strong> to key card</td><td><Tag variant="call">Pure call</Tag></td></tr><tr><td><strong>One over, one under</strong></td><td>Mix — depends on draws</td></tr><tr><td><strong>Double undercards</strong></td><td><Tag variant="fold">Fold candidates</Tag></td></tr></table>
        <h3>Defend priority (for trash)</h3>
        <ol><li>Direct equity (overcards to top pair) — Ace-high first</li><li>Backdoor flush draw (high card of suit &gt; low)</li><li>Three to a straight</li><li>Backdoor straight draws</li><li>Blocker effects (avoid suit that blocks villain's bluffs)</li></ol>
      </Section>
      <Section title="Risk Factors">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Villain bluffs have high equity</strong></td><td>Defend even more than MDF</td></tr>
          <tr><td><strong>Paired boards (K55)</strong></td><td>Organize around unpaired card. Ace + BDFD = pure call</td></tr>
          <tr><td><strong>Small raise sizes</strong></td><td>Defend almost everything; pot odds may prevent any fold</td></tr>
          <tr><td><strong>Blocker suits</strong></td><td>On two-tone, avoid suit villain bluffs with</td></tr>
          <tr><td><strong>Naked BDFD (no straight, no high card)</strong></td><td>Worst defendable — may fold</td></tr>
          <tr><td><strong>HUD exploit risk</strong></td><td>If fold-to-CR too high, regulars exploit you</td></tr>
        </table>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S7Page
