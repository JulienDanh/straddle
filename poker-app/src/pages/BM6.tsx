import { Section, Callout, Code, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection } from '../components/ui'
import { flashcards, quizzes } from '../data/content'
import type { HandExample } from '../components/ui'

const examples: HandExample[] = [
  { tag: "Cover the 3-bettor — call", tagVariant: "default", board: <>UTG 50bb · BTN 51bb 3-bets</>, desc: "You cover the 3-bettor", verdict: "agree", verdictText: "System agrees", system: "Cold call ~24% of range. You cover them (50v51 'chicken').", solver: "Contrast: UTG at 25bb vs 50bb 3-bet → ~0% calls (raise/fold)." },
  { tag: "Covering UTG — call wide", tagVariant: "default", board: <>CO 32bb · UTG 17bb · BB short</>, desc: "Covering + short BB = protected", verdict: "agree", verdictText: "System agrees", system: "Cold call wider than chips. 54s, 65s, A4s become calls.", solver: "ICM protection (BB short) enables this. In chips these fold vs UTG 17bb." },
  { tag: "Short stack — raise/fold", tagVariant: "fold", board: <>UTG+1 17bb · all short · vs UTG open</>, desc: "Short stacks vs opens AND vs 3-bets", verdict: "agree", verdictText: "System agrees", system: "No cold calls; raise/fold. 3-bet: Jax+, AQ, Tens ~0 EV.", solver: "Short stacks → raise/fold vs opens AND vs 3-bets. Consistent theme." },
  { tag: "SB protected vs UTG", tagVariant: "risk", board: <>SB 17bb · UTG open · BB 10bb</>, desc: "SB cold calls (protected)", verdict: "agree", verdictText: "System agrees", system: "Narrow cold-call range — KQs, A9s, some mid pairs. UTG too tight for BB to squeeze.", solver: "BB can't squeeze much. SB cold calls a narrow value range." },
  { tag: "LJ covering UTG — small 3-bet", tagVariant: "default", board: <>LJ 32bb · UTG 17bb · LJ covers</>, desc: "Aggressive small 3-bet", verdict: "agree", verdictText: "System agrees", system: "Aggressive small 3-bet (~4bb); A9o 3-bets. LJ covers UTG ~2x.", solver: "People likely miss this. Feels loose but LJ covers and isn't deeply covered behind." },
  { tag: "7.9bb leaving 0.1 — leak", tagVariant: "fold", board: <>Raise to 7.9bb · 8bb stack</>, desc: "Leaving 0.1bb behind", verdict: "agree", verdictText: "System agrees", system: "Leak. Raise to ~5bb to fold to jam+call behind (caller shows QQ+). Or shove.", solver: "Leaving 0.1bb behind is a leak — no fold option preserved." },
]

export function BM6Page() {
  return (
    <>
      <Section title="Dealing With 3-Bets & Misc Preflop">
        <p>UTG opens versus each position's defense, dealing with 3-bets, and open-vs-defense from each seat. The directional-shift framework: who covers whom, how deep, and opener's range tightness determine your defense. Short stacks lean raise/fold versus 3-bets; covering stacks can cold call.</p>
        <Callout variant="bad"><strong>When covering the 3-bettor, you can cold call; when covered by the 3-bettor, you can't.</strong> Same hand, different stack dynamic. 50bb vs 25bb 3-bet → 24% calls. 25bb vs 50bb 3-bet → 0% calls. Stack relationship to the 3-bettor, not absolute depth, is the key variable.</Callout>
      </Section>

      <Section title="Decision Matrix">
        <DecisionMatrix
          columns={["Cover the 3-bettor", "Covered by the 3-bettor"]}
          intro="Your stack vs the 3-bettor (row) × cover relationship (column)."
          rows={[
            { label: "Deep (45-50bb)", cells: [
              { action: "Cold call ~24%", sub: "Can call; cover the 3-bettor.", color: "green" },
              { action: "~0% calls; raise/fold", sub: "Covered by the 3-bettor.", color: "red" },
            ]},
            { label: "Mid (30-37bb)", cells: [
              { action: "Cold call ~16-22%", sub: "Covering less but still can call.", color: "orange" },
              { action: "Raise/fold", sub: "Covered → raise/fold only.", color: "red" },
            ]},
            { label: "Short (≤25bb)", cells: [
              { action: "Some calls if cover", sub: "Rare; mostly raise/fold.", color: "orange" },
              { action: "~0% calls; raise/fold", sub: "Short + covered = pure raise/fold.", color: "red" },
            ]},
          ]}
        />
      </Section>

      <Section title="Core Rules">
        <table>
          <tr><th>Rule</th><th>Detail</th></tr>
          <tr><td><strong>BB stack dictates opener width</strong></td><td>UTG opens wider when BB short/covered; tighter when BB has big covering stack.</td></tr>
          <tr><td><strong>SB cold call vs UTG when BB very short (10bb)</strong></td><td>SB is 'protected' — UTG's tight range + short BB = can't squeeze. Narrow value range.</td></tr>
          <tr><td><strong>3-bet sizing by depth</strong></td><td>~6-6.5bb mid; ~8-8.5bb at 45+bb. Matching range to size matters more than number.</td></tr>
          <tr><td><strong>Zero-EV fringe hands</strong></td><td>Let FGS (other-table stacks) and tendencies decide. Short stack elsewhere = lean fold.</td></tr>
          <tr><td><strong>Exploits happen at the fringes</strong></td><td>Over-exploiting forces opponents to adjust; in ICM, stolen equity spreads to ALL players.</td></tr>
        </table>
      </Section>

      <Section title="Risk Factors / Exceptions">
        <table>
          <tr><th>Factor</th><th>Effect</th></tr>
          <tr><td><strong>Who 3-bets you matters</strong></td><td>Short 3-bettor (~25bb) → raise/fold. You cover them (50v25) → cold-call range exists.</td></tr>
          <tr><td><strong>UTG+1 3-bet vs UTG deep (50bb)</strong></td><td>Jax+, AQ; Tens ~0 EV. Very thin bluffs only.</td></tr>
          <tr><td><strong>Raise to 7.9bb leaving 0.1 behind</strong></td><td>Leak. Raise to <Code>~5bb</Code> to fold to jam+call behind (caller shows QQ+). Or shove.</td></tr>
          <tr><td><strong>4-bet noise</strong></td><td>Some solver 4-bet ranges (CO 4-betting Jacks) appear too loose — likely zero-EV noise. Author wouldn't get Jacks in.</td></tr>
        </table>
        <Callout variant="warn"><strong>Over-exploiting on the bubble is doubly costly.</strong> In ICM, equity stolen from you spreads to ALL players, not just the exploiter. Exploits happen at the fringes, not the core.</Callout>
      </Section>

      <Section title="Sizing">
        <p>3-bet sizing varies by stack depth (~5-8.5bb) but matters less than matching range construction to size. Larger 3-bet = more polar value. UTG+1 3-bet vs UTG deep: <Code>Jax+, AQ</Code> (Tens ~0 EV). Raise to <Code>~5bb</Code> (not 7.9bb) so you can fold to a jam + call behind.</p>
      </Section>

      <Section title="Hand Examples">
        {examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}
      </Section>

      <FlashcardsSection cards={flashcards['bm6']} />
      <QuizSection questions={quizzes['bm6']} />
    </>
  )
}

export default BM6Page
