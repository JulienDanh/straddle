import { Section, Callout, Code, Action, Collapsible, DataTable } from '@poker/design-system/src/components/ui'
import { RangeBrowser } from '@poker/design-system/src/components/RangeBrowser'
import { UTG_RFI, BTN_RFI } from '@poker/design-system/src/data/ranges'

export function BM1Page() {
  return (
    <Section title="ICM vs ChipEV — Preflop Adjustments">
      <p>Equal stacks on the bubble. We compare ICM-adjusted preflop ranges to ChipEV to identify the repeating shifts: blockers gain value, speculative hands and cold calls drop, value thresholds tighten, shoves fade.</p>

      <>
              <h3>ChipEV vs ICM-Adjusted</h3>
              <DataTable columns={[{ header: 'Category' }, { header: 'ChipEV' }, { header: 'ICM-Adjusted' }]} rows={[[<><strong>Opens</strong></>, <>Wide; suited connectors, low pairs, offsuit broadways</>, <><Action variant="bet">Tighter; drop speculative, add Ace-X blockers</Action> — A2s, A9o in; 76s, 55 out</>],
                  [<><strong>3-bet bluffs</strong></>, <>Board-coverage (suited connectors, gappers)</>, <><Action variant="bet">Blocker-heavy (Ace-X suited, King-X suited)</Action> — block their 3-bet bluffs</>],
                  [<><strong>3-bet value</strong></>, <>AK, QQ, JJ, TT all mixing</>, <><Action variant="bet">Kings+; Queens flat; AKo barely 3-bets</Action></>],
                  [<><strong>Cold calling</strong></>, <>Wide; speculative hands, suited aces, mid pairs</>, <><Action variant="call">Narrower; cold-call strong (AQo, AJs, KQ)</Action></>],
                  [<><strong>Shoving (mid stacks)</strong></>, <>Common for AK, QQ/JJ</>, <><Action variant="fold">Shoves fade; min-raise or non-all-in 3-bet</Action> — preserve tournament life</>]]} />

              <Callout variant="warn"><strong>Blockers become MORE valuable than playability in ICM.</strong>

<p className="mt-6 mb-1 text-sm text-muted">Solver versions of the shift — each panel carries both solutions; toggle cEV / ICM to see the bubble tighten the open (UTG drops suited connectors and low pairs for ace blockers; BTN opens 49% under ICM vs wider in chips):</p>
              <RangeBrowser ranges={UTG_RFI} />
              <RangeBrowser ranges={BTN_RFI} /> A2s opens where Q9s folds. A9o opens where T9s folds. You're blocking 3-bet bluffs, not playing postflop — because opponents 3-bet/fold, not cold call.</Callout>

              <Collapsible title="The five shifts">
                <DataTable columns={[{ header: 'Shift' }, { header: 'Rule' }]} rows={[[<><strong>1. Blockers up, playability down</strong></>, <>Ace-X blockers gain value; suited connectors and low pairs lose it.</>],
                  [<><strong>2. Cold-call stronger = less capped</strong></>, <>Calling AQo/AJs/KQ means high-card board coverage — opponent can't barrel you off.</>],
                  [<><strong>3. Value threshold tightens</strong></>, <>Queens often flat, AKo barely 3-bets, Kings+ becomes default.</>],
                  [<><strong>4. Shoves fade</strong></>, <>Min-raise or non-all-in 3-bet replaces open shoves on direct bubble.</>],
                  [<><strong>5. Smaller sizing (SB vs BTN), tighter defense</strong></>, <>ICM SB 3-bet vs BTN 7.35bb vs 8.6bb ChipEV — yet defense is still tighter (risk premium &gt; price). Note: BB 3-bets vs opens trend larger (see BM5).</>]]} />
              </Collapsible>

              <Collapsible title="Risk factors">
                <DataTable columns={[{ header: 'Factor' }, { header: 'Effect' }]} rows={[[<><strong>Opponent behind overfolds</strong></>, <>Keep zero-EV fringe opens — worth more than sim says.</>],
                  [<><strong>Opponent behind too loose</strong></>, <>Drop zero-EV fringe opens — they won't fold enough for blockers to work.</>],
                  [<><strong>You're very deep (35-40bb+) in BB</strong></>, <>Cold calling less risky — opponent needs full stack to move you off equity.</>],
                  [<><strong>You're short (20bb) cold calling</strong></>, <>Cold calling fades aggressively — calling 2bb off 20bb is too large a % of stack.</>],
                  [<><strong>FGS: short stacks at other tables</strong></>, <>Tighten further — folding has positive $EV.</>]]} />
              </Collapsible>

              <Collapsible title="Sizing">
                <p>BTN open <Code>2.1x</Code> (ICM) vs <Code>2.3x</Code> (ChipEV). SB 3-bet vs BTN <Code>7.35bb</Code> (ICM) vs <Code>8.6bb</Code> (ChipEV). Smaller sizing in ICM, yet defense plays a narrower, more polar range — the risk premium overwhelms the price.</p>
              </Collapsible>
            </>
    </Section>
  )
}

export default BM1Page
