import { Section, Callout, Leak, Action, Subhead, DataTable } from '@poker/design-system/src/components/ui'

export function S8Page() {
  return (
    <Section title="System 8 — Bet Sizing In Position">
      <p>IP player deciding bet sizing on flop/turn/river. Core mistake: betting too small.</p>

      <Leak items={[
      ['Betting too small in position', 'reopening action with thin value, risking CR by worse hands'],
      ['Not accounting for compounding', 'small flop bets → small turn bets → small river bets = not enough money invested'],
      ['Overbetting into high nut ratios', 'villain has too many strong hands'],
      ['Not recognizing when villain is capped (checked back)', 'should bet large, not small'],
      ]} />

      
      <Subhead>Sizing by nut ratio</Subhead>
      <DataTable columns={[{ header: 'Situation' }, { header: 'Sizing' }, { header: 'Why' }]} rows={[[<>Villain capped (low nut ratio)</>, <><Action variant="bet">Overbet / pot</Action></>, <>Geometric to get stacks in. Fold% rises slower than bet size.</>],
          [<>Both have nuts possible</>, <><Action variant="bet">~70% pot</Action></>, <>Large but not overbet. Nuts frequency constrains sizing.</>],
          [<>Thin value hand</>, <><Action variant="check">Check</Action></>, <>Don't bet thin hands small. &lt;50% pot almost never correct IP.</>],
          [<>&lt; 50% pot IP</>, <><Action variant="fold">Almost NEVER</Action></>, <>Small bets don't justify the CR risk.</>],
          [<>Medium-strong (merge)</>, <><Action variant="bet">Bet pot (merge)</Action></>, <>If folds better AND called by worse (e.g. pocket Queens).</>]]} />

      <Callout variant="bad">Reopening action risks being check-raised off equity. Small bets don't justify that risk. Fold% rises slower than bet size → bigger bets profit more.</Callout>

                    <Subhead>Heuristics</Subhead>
      <ul>
        <li>"IP polarizes → bet bigger"</li>
        <li>"Risk must be worth the reward"</li>
        <li>"Nut ratio high = bet small; nut ratio low = bet large"</li>
        <li>"If villain checks back, they're capped — bet big"</li>
        <li>"Small bets in position suck"</li>
      </ul>

      <Subhead>IP advantage</Subhead>
      <ul>
        <li>IP checks → range uncaps on next card (turn improves hands).</li>
        <li>OOP checks → IP punishes immediately.</li>
        <li>IP can polarize more → <strong>IP bets larger on average</strong>.</li>
      </ul>

      <Subhead>Geometric betting</Subhead>
      <p>To get stack in over 2 streets: ~pot on both (equal fractions). E.g. 50bb: ~11bb turn → ~34bb river shove.</p>

      <Subhead>Risk factors</Subhead>
      <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Villain uncapped (can have nuts)</strong></>, <>Don't overbet — ~70% pot</>],
        [<><strong>Quads risk</strong></>, <>~48 combos. Don't assume villain can't have quads.</>],
        [<><strong>Turn check-back inflection</strong></>, <>If you checked turn, villain's river check = weakness → bet big</>]]} />

      <Subhead>Sizing</Subhead>
      <p>Default pot-sized or slightly over; <strong>never sub-half-pot IP</strong>.</p>


    </Section>
  )
}

export default S8Page
