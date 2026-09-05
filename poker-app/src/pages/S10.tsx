import { Section, Callout, Tag, DecisionMatrix, HandExampleCard, FlashcardsSection, QuizSection, S, H, D } from '../components/ui'
import type { HandExample, QuizQuestion } from '../components/ui'

const flashcards: [string, string][] = [["Central thesis?","Absolute strength irrelevant. Relative strength (vs opponent's range) determines value."],["Inflection points weakening villain?","Checks turn/river, no raising, small bets → subtract strong hands."],["Can't CR but called by worse?","Bet. Don't let opponent polarize by checking."],["Opponent checked turn, medium hand?","Block bet small (25–33%) — forces them to defend 75%+."],["Opponent capped?","Bet large / overbet. Large vs capped ranges."],["Short SPR (<2x pot)?","Prefer jamming. Checking loses optionality."],["What does checking do?","Converts strong hands to bluff catchers. IP auto-polarizes (bets better, checks worse)."],["Multi-way IP checked flop?","Extremely capped (no sets, no TPTK). Largely ignore them."]]
const quizzes: QuizQuestion[] = [{q:"Central thesis of river value betting?",o:["Absolute strength determines value","Relative strength (vs opponent's range) determines value","Bet only the nuts","Always check strong hands"],a:1,why:"Absolute strength irrelevant. When villain's range weakens, medium hands become relative nuts."},{q:"Villain checked turn, no raising. Your medium hand?",o:["Check — let them bet","Block bet small (25–33%) — forces them to defend 75%+","Check-raise","Fold"],a:1,why:"Lack of raising = villain range weak. Your medium hand likely best. Bet small to extract."},{q:"What does checking do to strong hands?",o:["Preserves value","Converts them to bluff catchers — IP auto-polarizes","Improves them","No effect"],a:1,why:"IP bets hands that beat you and checks hands you beat. You lose value."},{q:"Short SPR (<2x pot) with strong hand?",o:["Check — let them bluff","Prefer jamming — checking loses optionality","Check-raise","Small bet"],a:1,why:"Short SPR: jamming gets value now. Checking loses the optionality of getting stacks in."},{q:"AK on K4x → 2♠ (4-straight). BB checked to you?",o:["Check — scary card","Jam (pure) — checking costs ~270bb/100","Small bet","Check-raise"],a:1,why:"Pure jam. Opponent must call ~45% of range. Checking is a massive EV loss."}]

const examples: HandExample[] = [
  { tag: "Triple barrel", tagVariant: "default", board: <>Q<S>♠</S>7<S>♠</S>4<S>♠</S> → J<S>♠</S>T<S>♠</S> → blank</>, holeCards: <>AQ · EP 4-way</>, desc: "Q-high · monotone · AQ · EP 4-way", verdict: "agree", verdictText: "System agrees", system: "BB called flop+turn, no raise → lack of raising = bet for value.", solver: "Triple barrel confirmed." },
  { tag: "Block bet", tagVariant: "default", board: <>Q<H>♥</H> 5<H>♥</H> 6<H>♥</H> → 5<D>♦</D> → blank</>, holeCards: <>JJ · IP checked turn</>, desc: "Q-high · monotone · JJ · IP checked turn", verdict: "agree", verdictText: "System agrees", system: "Block ~15–33%. Checking lets IP polarize. Even 3♦ flush should bet (EV bet >> check).", solver: "Blocking viable. Checking loses value." },
  { tag: "Jam", tagVariant: "default", board: <>K<S>♠</S> 4<H>♥</H> x<D>♦</D> → blank → 2<S>♠</S> (4-straight)</>, holeCards: <>AK · BB checked to hero</>, desc: "K-high · two-tone · AK · 4-straight river", verdict: "agree", verdictText: "System agrees", system: "Pure jam. Checking costs ~270bb/100. Opp must call ~45% of range.", solver: "Pure jam confirmed." },
  { tag: "Bet (can't CR)", tagVariant: "default", board: <>Q<S>♠</S> 9<H>♥</H> 6<D>♦</D> → 8<D>♦</D> → T<H>♥</H></>, holeCards: <>A7 (straight) · IP checked turn</>, desc: "Q-high · two-tone · A7 straight · IP checked turn", verdict: "agree", verdictText: "System agrees", system: "Can't CR → bet to get value from medium hands. Use K-T/A-T as bluff catcher instead.", solver: "7x pure bet. Small bet, not check." },
]

export function S10Page() {
  return (
    <>
      <Section title="System 10 — River Value Betting">
        <p><strong>Central thesis: absolute strength is irrelevant. Relative strength (vs opponent's range) determines value.</strong></p>
        <h3>Inflection points weakening villain's range</h3>
        <ul><li>Villain checks turn or river → subtracts strong hands</li><li>No flop or turn raising → subtracts sets/2-pair/flushes</li><li>Very small bet sizes → thin value, not nuts</li></ul>
        <Callout variant="good">When villain's range weakens, your medium-strength hands become the <em>relative nuts</em> → bet for value.</Callout>
      </Section>
      <Section title="Decision Matrix">
        <DecisionMatrix columns={["Can't CR", "Can CR", "Short SPR (<2x pot)"]} intro="Villain's range (row) x your options (column). Green = bet, orange = sizing-dependent."
          rows={[
            { label: "Villain capped", labelSub: "checked turn, no raising", cells: [{ action: "BET for value", sub: "Don't let IP polarize by checking. Your medium hand = relative nuts.", color: "green" }, { action: "Check-raise", sub: "If CR available, use it.", color: "green" }, { action: "Prefer jamming", sub: "Checking loses optionality.", color: "green" }] },
            { label: "Villain strong", labelSub: "high nut ratio", cells: [{ action: "Bet small", sub: "Block bet 25-33%. Nuts frequency constrains sizing.", color: "orange" }, { action: "Bet small / mix", sub: "CR competitive with optionality.", color: "orange" }, { action: "Prefer jamming", sub: "Get value now before villain improves.", color: "green" }] },
          ]}
        />
      </Section>
      <Section title="Decision framework">
        <table>
          <tr><th>Situation</th><th>Action</th><th>Sizing</th></tr>
          <tr><td>Can't CR but called by worse</td><td><Tag variant="default">Bet</Tag></td><td>Don't let opponent polarize by checking</td></tr>
          <tr><td>Opponent checked turn, medium hand</td><td><Tag variant="default">Bet (block)</Tag></td><td>Small (25–33%) forces them to defend 75%+</td></tr>
          <tr><td>Opponent capped (no nuts)</td><td><Tag variant="default">Bet large / overbet</Tag></td><td>Large vs capped ranges</td></tr>
          <tr><td>Opponent has high nut ratio</td><td>Bet small</td><td>Nuts frequency constrains sizing</td></tr>
          <tr><td>Short SPR (&lt;2x pot)</td><td><Tag variant="default">Prefer jamming</Tag></td><td>Checking loses optionality</td></tr>
          <tr><td>Deep SPR</td><td>Checking competitive</td><td>Check-raise optionality adds value</td></tr>
        </table>
        <h3>Geometric sizing</h3>
        <p>Bet similar fractions each street (pot-pot-pot) to get stacks in with strong hands.</p>
      </Section>
      <Section title="Key principles">
        <Callout variant="bad"><strong>Checking converts strong hands into bluff catchers.</strong> IP auto-polarizes — bets hands that beat you, checks hands you beat. You lose value against the entire medium-strength region.</Callout>
        <h3>Risk factors</h3>
        <ul><li><strong>River cards that reintroduce strength:</strong> fills straights/flushes → re-uncaps villain → smaller sizing.</li><li><strong>Multi-way:</strong> IP checking back flop in multi-way = extremely capped (no sets, no TPTK). Largely ignore them.</li><li><strong>Donk bets:</strong> strip from solver — most players miss them in metagame.</li></ul>
      </Section>
      <Section title="Hand Examples">{examples.map((ex, i) => <HandExampleCard key={i} ex={ex} />)}</Section>
      <FlashcardsSection cards={flashcards} />
      <QuizSection questions={quizzes} />
    </>
  )
}
export default S10Page
