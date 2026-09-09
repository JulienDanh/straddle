import { Section, Callout, Small } from '@poker/design-system/src/components/ui'

export function ConclusionPage() {
  return (
    <>
      <Section title="Cross-System Principles">
        <span className="muted">The recurring themes across all 12 systems. Internalize these and most decisions follow.</span>
        <table>
          <tr><th>#</th><th>Principle</th></tr>
          <tr><td>1</td><td><strong>Know preflop ranges</strong> (memorize perimeters) — foundation for all postflop decisions</td></tr>
          <tr><td>2</td><td><strong>Relative &gt; absolute hand strength</strong> — opponent's range determines your hand's value</td></tr>
          <tr><td>3</td><td><strong>Inflection points</strong> — villain checks, small bets, lack of raising = range weakness</td></tr>
          <tr><td>4</td><td><strong>Block value, unblock bluffs</strong> — blocker effects differentiate similar-looking hands</td></tr>
          <tr><td>5</td><td><strong>Bet sizing sensitivity</strong> — small bets = wide defense; large bets = tight defense</td></tr>
          <tr><td>6</td><td><strong>Board texture buckets</strong> — high vs low; paired/disconnected; rainbow vs two-tone</td></tr>
          <tr><td>7</td><td><strong>Can't CR but called by worse → bet for value</strong></td></tr>
          <tr><td>8</td><td><strong>Don't let IP auto-polarize</strong> by checking when you have medium-strength hands</td></tr>
        </table>
        <Callout>Use a <strong>small number of repeatable principles</strong> applied systematically rather than memorizing solver outputs. Use solvers to <em>stress test</em> your hypotheses, not to copy answers.</Callout>
      </Section>
      <Section title="The pyramid (appears everywhere)">
        <div className="flow">
          <div className="node yes">BET — very strong (value)</div>
          <div className="conn cont"></div>
          <div className="node no">CHECK — medium strength</div>
          <div className="conn cont"></div>
          <div className="node yes">BET — very weak (bluff, selective)</div>
        </div>
        <Small>This "bet top, bet bottom, check middle" structure recurs in Systems 2, 3, 4, 5, and beyond. The medium-strength hands are the most over-played category in the game.</Small>
      </Section>
    </>
  )
}
export default ConclusionPage
