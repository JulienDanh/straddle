import { Section, Callout, Leak, Code, Action, Subhead, StackMatrix, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { SB_VS_UTG, SB_VS_BTN_BUBBLE, BB_VS_UTG_BUBBLE, BB_VS_BTN_BUBBLE } from '@poker/design-system/src/data/ranges'

export function BM5Page() {
  return (
    <Section title="Blinds Facing an Open on the Bubble">
      <p>Defense from SB and BB versus EP (UTG) and LP (BTN) opens. Short blind stacks (sub ~20bb) play almost pure raise/fold (no cold calls). Deeper stacks and covering stacks introduce cold calls. The BB re-steals aggressively when covered by a wide opener.</p>

      <Leak items={[
        ['Playing too passive when covered and short', '"feels terrible to bust" but reduces dollar EV'],
        ['Not re-stealing enough with Ax blockers when covered'],
        ['Cold calling too wide from the blinds at short stacks'],
        ['Not recognizing when BB is handcuffed (can\'t squeeze)', 'SB should cold call more'],
      ]} />

      <>
              <StackMatrix
                colAxisLabel="Opener position"
                rowAxisLabel="Defender"
                colLabels={['vs EP (UTG) open', 'vs BTN open']}
                rows={[
                  { label: 'SB short (≤20bb)', cells: [
                    { content: <><Action variant="fold">No cold calls; raise/fold</Action> — 3-bet value: Kings+, AQ (Queens mix).</>, variant: 'fold' },
                    { content: <><Action variant="fold">No cold calls; raise/fold</Action> — Re-steal with Ax blockers.</>, variant: 'fold' },
                  ]},
                  { label: 'SB deeper (25+bb)', cells: [
                    { content: <><Action variant="call">Some cold calls begin</Action> — especially if BB is short/handcuffed.</>, variant: 'call' },
                    { content: <><Action variant="bet">Cold calls expand</Action> — SB "almost in the BB" when BB is short.</>, variant: 'bet' },
                  ]},
                  { label: 'BB short (≤15bb)', cells: [
                    { content: <><Action variant="fold">Very tight defense</Action> — some cold calls. Fold dominated offsuit.</>, variant: 'fold' },
                    { content: <><Action variant="call">Tight; re-steal shoves</Action> — Ax blocker-heavy. Don't shy from bust risk.</>, variant: 'call' },
                  ]},
                  { label: 'BB covering opener', cells: [
                    { content: <><Action variant="bet">Defend wide; cold call looser</Action> — fold dominated offsuit. King-X offsuit ~0.</>, variant: 'bet' },
                    { content: <><Action variant="bet">Defend wide; re-steal aggressively</Action> — can donk-lead low/mid boards post.</>, variant: 'bet' },
                  ]},
                ]}
              />

              <Callout variant="warn"><strong>Re-steal MORE, not less, when covered and short.</strong>

<p className="mt-6 mb-1 text-sm text-muted">The four solved blind defenses the matrix describes — SB and BB versus an EP (UTG) and LP (BTN) open. Short stacks shift to pure raise/fold; toggle cEV / ICM and step the stack ladder to watch cold calls appear:</p>
              <RangeBrowser ranges={SB_VS_UTG} />
              <RangeBrowser ranges={SB_VS_BTN_BUBBLE} />
              <RangeBrowser ranges={BB_VS_UTG_BUBBLE} />
              <RangeBrowser ranges={BB_VS_BTN_BUBBLE} /> It feels terrible to shove A5s and bust on the bubble. But playing too passive reduces dollar EV — you cash slightly more often but never double. Think dollar EV, not binary cash/fail.</Callout>

              <Subhead>Core rules</Subhead>
              <DataTable columns={[{ header: 'Rule' }, { header: 'Detail' }]} rows={[[<><strong>SB cold-call threshold</strong></>, <>~20bb. Below: ~0% cold calls, raise/fold only.</>],
                [<><strong>SB cold calls wider when BB is short</strong></>, <>BB handcuffed (can't squeeze/lead). SB "almost in the BB" — realizes more equity.</>],
                [<><strong>Re-steal &gt; cold call when covered</strong></>, <>Win outright more often AND avoid losing postflop ~50%+ of the time.</>],
                [<><strong>3-bet sizing UP in ICM</strong></>, <>Larger 3-bets deny equity to speculative calls and lower SPR for narrow value.</>],
                [<><strong>BB defends wider than chips vs tight UTG</strong></>, <>UTG opens 8% on bubble. BB can donk-lead low/mid boards that miss UTG's range.</>]]} />

              <Subhead>Risk factors</Subhead>
              <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>BB covers both opener and SB</strong></>, <>SB cold calls shrink — BB can squeeze/lead post. SB plays raise/fold.</>],
                [<><strong>BB is short</strong></>, <>SB cold calls more — BB can't apply pressure (handcuffed).</>],
                [<><strong>BTN opens 70%+ (BB short)</strong></>, <>SB cold-call range widens more than expected — SB "almost in the BB."</>],
                [<><strong>Squeeze when SB can't cold call</strong></>, <>BB squeezes very liberally — cold calls don't exist, so squeeze jams print.</>]]} />

              <Subhead>Sizing</Subhead>
              <p>3-bet sizing increases in high ICM from the blinds. Size up — deny equity to speculative calls and lower SPR for your narrow value range. BTN open ~71% when BB is short (vs ~53% equal 50bb). BB 3-bet value threshold covered vs EP: <Code>Kings+, AK</Code> (Queens mix).</p>
            </>
    </Section>
  )
}

export default BM5Page
