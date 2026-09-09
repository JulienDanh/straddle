import { Section, Callout, Small, DataTable } from '@poker/design-system/src/components/ui'

export function ConclusionPage() {
  return (
    <>
      <Section title="Cross-System Principles">
        <span className="muted">The recurring themes across all 12 systems. Internalize these and most decisions follow.</span>
        <DataTable columns={[{ header: '#' }, { header: 'Principle' }]} rows={[[<>1</>, <><strong>Know preflop ranges</strong> (memorize perimeters) — foundation for all postflop decisions</>],
                  [<>2</>, <><strong>Relative &gt; absolute hand strength</strong> — opponent's range determines your hand's value</>],
                  [<>3</>, <><strong>Inflection points</strong> — villain checks, small bets, lack of raising = range weakness</>],
                  [<>4</>, <><strong>Block value, unblock bluffs</strong> — blocker effects differentiate similar-looking hands</>],
                  [<>5</>, <><strong>Bet sizing sensitivity</strong> — small bets = wide defense; large bets = tight defense</>],
                  [<>6</>, <><strong>Board texture buckets</strong> — high vs low; paired/disconnected; rainbow vs two-tone</>],
                  [<>7</>, <><strong>Can't CR but called by worse → bet for value</strong></>],
                  [<>8</>, <><strong>Don't let IP auto-polarize</strong> by checking when you have medium-strength hands</>]]} />
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
