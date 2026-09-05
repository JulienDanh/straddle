import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D, C } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Default c-bet freq on monotone, 12bb polar?","Range check (65-82%+). BTN lacks flushes — open-shoves suited pre."],["BTN range vs 53bb BB vs 16bb BB?","Tighter (every tier shifts up). But BB defends wider (less ICM risk for deep stack)."],["Sizing on two-tone vs rainbow?","Two-tone adds flop jam (~2x pot) to deny FD equity and stop check-shoves."],["A77 vs A99 — which checks more?","A99 — higher paired card = more BB 9x combos (J9, T9). More coverage = more checking."],["Standard vs dry ace-high c-bet size?","Quarter pot (~25%) standard; ~40% on dry ace-high (AQ4) to deny gutshots."],["J-5-4 dry vs 53bb BB — bet or check?","Range bet. Tighter range = more top pair/overpair, less air."],["6-6-2 rainbow vs 6-6-5 — strategy?","6-6-2: range bet (BB underrepresented, no draws). 6-6-5: check ~40% (draws flip it)."],["J-10-7 two-tone — which overpair jams most?","Queens jam most, Kings less, Aces pure check. Nut traps; weaker protects."],["BB under-leads monotone (<20%) — exploit?","Check back range. No betting range needed."],["Worst Axo shove vs 53bb BB?","A8o (vs A4o at 16bb). Value-jam threshold moves up as covering stack deepens."],["BB small-3-bet AJ offsuit in high ICM — why?","BTN can't cold-call wide; small 3-bet folds more of BTN's range."],["Q10 — the universal flop shove?","Yes. Q10 jams across many textures at 10-12bb post polar open. One combo to remember."]]
const quizzes: QuizQuestion[] = [{q:"BTN 12bb polar, BB 16bb, K♠5♠4♥ (two-tone). vs K5-4 rainbow?",o:["Range bet — same as rainbow","Check slightly more + add flop jams","Check less","Pure check"],a:1,why:"Two-tone increases checking (~57%) and introduces flop jams to stop check-shoves with bare FDs."},{q:"BTN 12bb vs BB 53bb, J♣5♦4♠ (dry). BB checks. BTN?",o:["Check ~50% (same as 16bb)","Range bet — tighter range = more value, less air","Pure check","Small bet sets only"],a:1,why:"Tighter preflop range has more top pair/overpair/set, less air → range-bet dry board."},{q:"Flop A♥9♥9♦ (two-tone, paired), 12bb vs 16bb. Key risk?",o:["BTN has too much air","BB has 9x coverage + will check-raise; BTN lacks 9x","Range-bet — BTN has aces","Jam any ace"],a:1,why:"Mid-pair boards with draws invite BB aggression; BTN lacks 9x → check back, don't over-c-bet."},{q:"6♦6♠2♣ (rainbow, low paired, dry), 12bb vs 16bb. Strategy?",o:["Check back — BB has trips","Range bet — BB underrepresented on the deuce","67% check","Small bet only"],a:1,why:"BB has few 6x/2x, underrepresented. Range bet. Contrast 6-6-5 (draws) which checks ~40%."},{q:"Q♠7♥4♦ (monotone), BB under-leads (<20%). Exploit?",o:["Range bet to deny flush equity","Check back range — no betting range needed","Jam all air","Small bet FDs"],a:1,why:"If BB under-leads monotone, BTN checks back range. Monotone heavily checked in ICM regardless."},{q:"BTN 12bb vs 53bb BB. Preflop adjustment vs 16bb?",o:["Open wider — BB has more chips","Open tighter; BB defends wider","Same range","Open tighter; BB defends tighter"],a:1,why:"Every tier shifts up (tighter), but deep BB has less ICM risk → defends wider, 3-bets blocker-heavy."}]

const examples: HandExample[] = [
  { tag: "Monotone — range check", tagVariant: "risk", board: <>7<H>♥</H> 6<H>♥</H> 5<H>♥</H></>, holeCards: <>BTN 12bb polar · BB 16bb</>, desc: "Monotone, BTN lacks flushes", verdict: "agree", verdictText: "System agrees", system: "Check back (hearts mandatory). BTN open-shoves suited pre → lacks flushes.", solver: "Range check (65-82%+). BB can have any flush." },
  { tag: "Two-tone adds jam", tagVariant: "risk", board: <>K<S>♠</S> 5<S>♠</S> 4<H>♥</H></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Two-tone vs rainbow", verdict: "agree", verdictText: "System agrees", system: "Check slightly more (~57%) + add flop jams. Stop check-shoves with bare FDs.", solver: "Rainbow ~50% check. Two-tone ~57% check + jam sizing." },
  { tag: "Dry ace-high — 40%", tagVariant: "default", board: <>A<S>♠</S> Q<D>♦</D> 4<C>♣</C></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Dry ace-high", verdict: "agree", verdictText: "System agrees", system: "Bet 40% (not quarter pot). Deny gutshot equity. If check-raise → jam over.", solver: "Larger size on dry ace-high than standard." },
  { tag: "Tighter range → range bet (deep BB)", tagVariant: "default", board: <>J<C>♣</C> 5<D>♦</D> 4<S>♠</S></>, holeCards: <>BTN 12bb · BB 53bb (dry)</>, desc: "Dry board vs deep BB", verdict: "agree", verdictText: "System agrees", system: "Range bet. Tighter range = more top pair/overpair/set, less air.", solver: "vs 16bb: check ~50%. vs 53bb: range bet (BB checks pure)." },
  { tag: "6-6-2 range bet vs 6-6-5 check", tagVariant: "risk", board: <>6<D>♦</D> 6<S>♠</S> 2<C>♣</C></>, holeCards: <>BTN 12bb · BB 16bb</>, desc: "Low paired dry vs low paired + draws", verdict: "agree", verdictText: "System agrees", system: "6-6-2: range bet (BB underrepresented, no draws). 6-6-5: check ~40% (draws flip it).", solver: "Draws flip the strategy on paired boards." },
  { tag: "J-10-7 two-tone — overpair jam", tagVariant: "risk", board: <>J<S>♠</S> 10<H>♥</H> 7<H>♥</H></>, holeCards: <>Q<D>♦</D> 10<D>♦</D> vs A<C>♣</C> 10<S>♠</S></>, desc: "Overpair hierarchy on two-tone", verdict: "agree", verdictText: "System agrees", system: "Queens jam most, Kings less, Aces pure check. Nut traps; weaker protects.", solver: "Aces almost pure-check; Queens jam the most. Inverted from 'bet your strong hands.'" },
  { tag: "Q10 — universal flop shove", tagVariant: "default", board: <>Various textures</>, holeCards: <>Q<D>♦</D> 10<C>♣</C> · 10-12bb</>, desc: "The universal flop-shove hand", verdict: "agree", verdictText: "System agrees", system: "Q10 jams across many textures at 10-12bb post polar open.", solver: "Recurring pattern. If you remember one bluff combo, remember Q10." },
]

export function BM11Page() {
  return (
    <>
      <Section title="Polar Opens & Split-Range C-Betting (Short Stacks)">
        <p>BTN opens a polar split range (min-raise + open-jam) at ~12bb effective on the direct bubble. Postflop strategy is dominated by checking far more than in chip models, with flop jams appearing on draw-heavy textures. When BB covers by heaps (53bb), BTN opens tighter/stronger, which paradoxically allows more c-betting on dry boards.</p>
        <Callout variant="warn"><strong>You check MORE when covered in ICM, not less.</strong> The instinct to "bet to protect your hand" is backwards — you protect your tournament equity by checking. Chip model range-bets become check-backs.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["vs shallow BB (16bb)", "vs deeper BB (53bb)"]}
          intro="Board class (row) × BB depth (column). Green = bet, red = check."
          rows={[
            { label: "Monotone", cells: [
              { action: "Range check (65-82%+)", sub: "BTN lacks flushes (shoves suited pre).", color: "red" },
              { action: "Range check", sub: "Same. If BB under-leads: range check.", color: "red" },
            ]},
            { label: "Dry ace-high (AQ4)", cells: [
              { action: "Bet 40%", sub: "Deny gutshots. Not quarter pot.", color: "green" },
              { action: "Bet 40%", sub: "Same; BTN has Ax.", color: "green" },
            ]},
            { label: "Dry board (J-5-4)", cells: [
              { action: "Check ~50%", sub: "BB leads 40%; game of chicken.", color: "orange" },
              { action: "Range bet", sub: "Tighter range = more value, less air.", color: "green" },
            ]},
            { label: "Two-tone", cells: [
              { action: "Check more + add jams", sub: "Stop check-shoves with bare FDs.", color: "orange" },
              { action: "Check more + add jams", sub: "Same # jam combos, larger share of tighter range.", color: "orange" },
            ]},
            { label: "Low paired dry (6-6-2)", cells: [
              { action: "Range bet", sub: "BB underrepresented on the deuce.", color: "green" },
              { action: "Range bet", sub: "Same.", color: "green" },
            ]},
            { label: "Low paired + draws (6-6-5)", cells: [
              { action: "Check ~40%", sub: "Draws flip the strategy.", color: "red" },
              { action: "Check", sub: "Same.", color: "red" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <h3>Preflop range tiers (12bb BTN polar open)</h3>
        <table>
          <tr><th>Tier</th><th>Action</th><th>Shift vs deeper BB (53bb)</th></tr>
          <tr><td><strong>Value jam</strong></td><td>Open shove JJ+, AQs, some AKo</td><td>AK pure shove; AQ, AJ, A9s join</td></tr>
          <tr><td><strong>Semi-value min-raise</strong></td><td>A10s–A8s, suited Broadway, offsuit Broadway</td><td>Bluffs shift up: QJ, K10 raise-folds</td></tr>
          <tr><td><strong>Raise-fold Ax</strong></td><td>A4o–A8o, some suited aces</td><td>Worst Axo shove = A8o (vs A4o)</td></tr>
          <tr><td><strong>Folds</strong></td><td>Weak suited connectors, low offsuit</td><td>J9s, T9s barely make the cut</td></tr>
        </table>
        <Callout variant="good"><strong>Open TIGHTER into the deeper stack, but the BB defends WIDER.</strong> Tighter range + wider defender. The 53bb BB has less ICM risk and can get out of line. BB 3-bets blocker-heavy (Kxs, Axs, Axo) and small-3-bets AJ offsuit.</Callout>
        <h3>C-bet defaults (vs shallow BB, 16bb)</h3>
        <ul>
          <li><strong>Ace-high dry (AQ4):</strong> bet 40% (deny gutshots).</li>
          <li><strong>A-high two-tone (AK5tt, AQ2tt):</strong> jam (~2x pot) + check to deny flush-draw equity.</li>
          <li><strong>Monotone:</strong> range check (65-82%+) — BTN lacks flushes.</li>
          <li><strong>Low paired dry (6-6-2):</strong> range bet (BB underrepresented).</li>
          <li><strong>Low paired + draws (6-6-5):</strong> check ~40% (draws flip it).</li>
          <li><strong>Connected mid (10-9-8):</strong> heavy check, jam-or-check (75-80%).</li>
        </ul>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Risk factor</th><th>Effect</th></tr>
          <tr><td><strong>Paired boards (non-connected)</strong></td><td>BB check-raises more; over-c-betting is a leak. Amplified in ICM.</td></tr>
          <tr><td><strong>Monotone flops</strong></td><td>BTN's preflop suited shoves → limited flushes; BB has every flush. Ace-high monotone worst.</td></tr>
          <tr><td><strong>Two-tone flops</strong></td><td>Check-raise + flip vs flush draw is an ICM disaster. Check more; use jams to deny equity.</td></tr>
          <tr><td><strong>Draws present generally</strong></td><td>Open-enders, gutshots for BB → more checking, more jam sizing.</td></tr>
          <tr><td><strong>Higher paired card (A99 vs A77)</strong></td><td>Higher paired card = more BB coverage (J9, T9 vs J7) = more checking.</td></tr>
        </table>
        <Callout variant="warn"><strong>Weaker aces jam as semi-bluffs; stronger aces check.</strong> A4s/A5s shove the flop; A7 (can make a good pair) checks back. The hand with less showdown value is the bluff.</Callout>
      </Section>

      <Section title="Sizing">
        <p>Standard c-bet <Code>~25% pot</Code> (quarter pot). Dry ace-high (AQ4-type): <Code>~40%</Code> to deny gutshots. Flop jam: <Code>~10bb into ~5.5bb</Code> (~1.8x pot, slightly less than 2x). Jams appear on two-tone, connected, flush-draw boards. Open-jam threshold (Axo) shifts up: <Code>A4o</Code> (16bb) → <Code>A8o</Code> (53bb).</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}

export default BM11Page
