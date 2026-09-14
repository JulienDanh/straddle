import { Section, Callout, Leak, Code, Action, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export function BM10Page() {
  return (
    <Section title="UTG Covers BB — Postflop">
      <p className="mb-1"><strong className="text-good">UTG covers BB</strong> — the UTG can bust the BB, never the reverse.</p>
      <p>UTG covers BB on the bubble. Two sides: BB defense (module 15) and UTG c-betting (module 16). UTG c-bets at very high frequency (~90%+) when covering by 2x+, because BB's tight defense range lacks low-board coverage. Checking ranges develop as stacks get deeper or closer.</p>

      <Leak items={[
        ['BB check-raising too wide for value', 'KT on K84 is pure check-call'],
        ['Not recognizing that tighter EP ranges reduce check-shove frequency on low boards'],
        ['Playing to maximize chips instead of balancing protection with tournament life'],
        ['Not implementing non-all-in river sizings on the bubble'],
      ]} />

      <>
              <Callout variant="warn"><strong>The stack gap matters more than the fact that you cover.</strong> Covering by 2x+ → range bet. Stacks within ~8-10bb → check 50% on mid connected boards. "I cover" is not enough information.</Callout>

                      <Subhead>Board class × side</Subhead>
<DataTable columns={[{ header: 'Board class' }, { header: 'BB defense (covered)' }, { header: 'UTG c-bet (covering)' }]} rows={[[<><strong>Low disconnected (854, 752, A44)</strong></>, <><Action variant="call">Mostly check-call</Action> — Tight range lacks connection.</>, <><Action variant="bet">Range bet</Action> — BB folds offsuit connectors — can't connect.</>],
                  [<><strong>Mid connected (977, 764, J97)</strong></>, <><Action variant="call">Check-call / check-raise (deep)</Action> — Range composition overrides texture.</>, <><Action variant="check">Range bet (2x+); ~50% (close)</Action> — Stack gap determines.</>],
                  [<><strong>AK7, AQ2 (high)</strong></>, <><Action variant="call">Tight check-call</Action> — KQ only check-raise (short).</>, <><Action variant="check">Big bet/check split (40bb+ BB)</Action> — Check QQ/JJ/TT/weak Ax; bet large strong.</>],
                  [<><strong>Ace-low paired (A88, A77, A66)</strong></>, <><Action variant="call">Check-call mostly</Action> — Short: barely has the pair.</>, <><Action variant="bet">Range bet (short BB)</Action> — ICM pressure overrides; checks develop deeper.</>]]} />

<Subhead>Core Rules — BB Defense (covered, short)</Subhead>
              <DataTable columns={[{ header: 'Rule' }, { header: 'Detail' }]} rows={[[<><strong>Check-shove is a mistake vs UTG</strong></>, <>IP folds only ~60%; need &gt;75% for check-jam. UTG range too strong (sets, overpairs, TPTK).</>],
                  [<><strong>Check-raise threshold (short, ICM)</strong></>, <>KQ only on K84. KJ/KT/K9 and below = pure check-call. Much stronger than chipEV.</>],
                  [<><strong>Range composition overrides board texture</strong></>, <>944 looks good for BB, but if BB's defense range doesn't include offsuit 9x/4x (short), check-raising is wrong.</>],
                  [<><strong>Flush turns favor the short stack</strong></>, <>Short BB: flushes 17.8% of range (suited-heavy). Deep: 12.5%. Short leads more on flush turns.</>],
                  [<><strong>A♠ turn &gt; 4♠ turn for BB</strong></>, <>A♠ removes IP's suited aces. BB leads 40% on A♠, 26% on 4♠.</>]]} />
                      <Callout variant="bad"><strong>Bet LESS when you have the nuts on the bubble — leave 1-3bb behind.</strong> Shoving all-in when called and losing means zero tournament equity. Leaving 2bb means you're still alive — those 2bb are worth ~$200 in a $100 tournament on the bubble vs ~$0 early game.</Callout>
              

<Subhead>Core Rules — UTG C-bet (covering)</Subhead>
              <p><strong>Covering by 2x+ (~90%+ c-bet):</strong> Range bet or near-range-bet almost all boards. Even boards that check in chipEV (854 two-tone, 752, A44) are range-bets because BB's tight defense range lacks coverage.</p>
                      <p><strong>Stacks close (game of chicken):</strong> ~50% c-bet on mid connected boards. BB leads some boards. UTG opens tighter (~27%). Board-dependent. The stack gap matters more than coverage.</p>
                      <p><strong>40bb+ BB covered:</strong> Big-bet/check split on AK7, AQ2: check back QQ/JJ/TT/weak Ax/Kx; bet very large (67-80%) with strong hands.</p>
              

<Subhead>Risk factors</Subhead>
              <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Tighter opener = stronger IP range</strong></>, <>UTG ~20-24% vs late position much wider. Kills check-shove profitability.</>],
                  [<><strong>Flush-completing turns favor short BB</strong></>, <>Short has 17.8% flushes (suited-heavy) vs deep 12.5%.</>],
                  [<><strong>A♠ vs low spade turn</strong></>, <>A♠ better for BB (removes IP suited aces). BB leads 40% on A♠, 26% on 4♠.</>],
                  [<><strong>BB's preflop range determines c-bet strategy</strong></>, <>Not just "I cover." If BB defends wider (deeper, closer), they have more low-mid coverage → check more.</>],
                  [<><strong>ICM pressure is directional</strong></>, <>Cover by heaps → range bet (losing still leaves working stack). Close → check more (losing is catastrophic).</>]]} />
              

<Subhead>Sizing</Subhead>
              <p>River polar bet: <Code>~13.5bb</Code> leaving 1-3bb behind — never shove. Block-bet thin value ~40% pot. Check-raise short: ~4.3bb (no leverage); deep: ~6.5bb (turn/river threat). Check-shove needs &gt;75% fold; UTG folds only ~60% → mistake.</p>
            </>
    </Section>
  )
}

export default BM10Page
