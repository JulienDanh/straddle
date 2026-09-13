import { Section, Callout, Action, Collapsible, DataTable } from '@poker/design-system/src/components/ui'

export function BM9Page() {
  return (
    <Section title="BB Covers BTN — Postflop">
      <p>BB is the big/covering stack, BTN is the shorter/covered stack. Two sides: BB defense (module 13) and BTN c-betting (modules 13-14). The dynamic flips from BTN-covers-BB: BB donk-leads low and paired boards; BTN c-bets far less and develops real check-back ranges.</p>

      <>
              <Callout variant="warn"><strong>Stacks reversed, actions reversed.</strong> Boards that are range-bet for BTN when BTN covers become range-CHECK when BB covers BTN. The side with the connecting hands flips.</Callout>

                      <h3>Board class × side</h3>
<DataTable columns={[{ header: 'Board class' }, { header: 'BB defense (covering)' }, { header: 'BTN c-bet (covered)' }]} rows={[[<><strong>Low / paired (5-5-4, 6-6-2)</strong></>, <><Action variant="bet">Lead near-range</Action> — Covering by ~1.5-2x+. Doesn't exist in chip-EV.</>, <><Action variant="check">Check back high freq (&gt;50%)</Action> — BB has the low cards; BTN lacks backup.</>],
                  [<><strong>High paired (J-J-2 / A-K-K)</strong></>, <><Action variant="raise">Check-raise heavy</Action> — Minimal check-call. Near CR-or-fold.</>, <><Action variant="check">Check back ~70%</Action> — BB check-raises ~10.5% aggressively.</>],
                  [<><strong>Ace-Broadway-Broadway (A-K-Q)</strong></>, <><Action variant="call">Defend normally</Action> — BB doesn't have the connecting hands.</>, <><Action variant="bet">Range bet / near-range</Action> — A-K-Q, A-K-J, A-K-T, A-Q-T, A-J-T.</>],
                  [<><strong>A-Q-2 (no OESD, no FD)</strong></>, <><Action variant="call">Check-call mostly</Action> — BTN polar overbet.</>, <><Action variant="bet">Polar ~105% overbet + check</Action> — Front-load: fold out gutters. No small bet.</>],
                  [<><strong>Monotone</strong></>, <><Action variant="raise">Lead / check-raise</Action> — BB can have any flush.</>, <><Action variant="check">~50% check</Action> — BTN lacks flushes (shoves suited pre).</>]]} /><Collapsible title="Core Rules — BB Defense (covering)">
              <DataTable columns={[{ header: 'Board type' }, { header: 'BB action' }]} rows={[[<><strong>Low boards (5-5-4, 6-6-4, 7-7-2, 8-high)</strong></>, <>Lead near-range / pure when covering by ~1.5-2x+.</>],
                  [<><strong>Mid-low disconnected (J-6-4, J-7-5, Q-7-6)</strong></>, <>Small lead (~13-22%) — not pure, but exists (not in chip-EV).</>],
                  [<><strong>High paired (J-J-2)</strong></>, <>Check-raise heavy, minimal check-call. Near CR-or-fold.</>],
                  [<><strong>Boards BTN smashed (BTN covers BB)</strong></>, <>No leads — BB doesn't have the connecting hands.</>]]} />
                      <Callout variant="bad"><strong>Never all-in on the river when you can avoid it.</strong> Polar river spots → raise non-all-in, leave chips behind. You're maximizing tournament equity, not chips. Losing your stack on a thin value raise is a disproportionate ICM error.</Callout>
              </Collapsible><Collapsible title="Core Rules — BTN C-bet (covered)">
              <p><strong>Still range-bet:</strong> Ace-Broadway-Broadway: A-K-Q, A-K-J, A-K-T, A-Q-T, A-J-T.</p>
                      <p><strong>Develop check-back range:</strong> Low boards, low-paired (5-5-4, 6-6-2, 3-3-K) → check back high freq (&gt;50%). Monotone → ~50% check. K-6-2 → check back a lot (BB has low cards; BTN lacks backup). A-J-8 and below → check-back range incl. some top pair.</p>
                      <p><strong>Front-load overbet:</strong> A-Q-2-type disconnected boards with gutshots but no open-enders and no flush draw: polar ~105% overbet + check (no small bet). Folds out 5-4/4-3 so turns are clean value bets.</p>
              </Collapsible><Collapsible title="Risk factors">
              <DataTable columns={[{ header: 'Risk factor' }, { header: 'Effect' }]} rows={[[<><strong>Open-ended straight draws on board</strong></>, <>Kills the front-loading overbet (can't fold out open-enders).</>],
                  [<><strong>Flush draw / two-tone board</strong></>, <>Kills the front-load (don't want bet-call vs FD stacks-in).</>],
                  [<><strong>BB leading the open-ender combos</strong></>, <>Can restore the overbet (those combos removed from BB's check-call).</>],
                  [<><strong>Opponent under-leads low boards</strong></>, <>BTN checks back range (pure) — exploit, not GTO mix.</>],
                  [<><strong>Blocker sensitivity in bluff-catching</strong></>, <>Narrow opponent ranges (ICM-tight) → suit of bluff-catcher matters enormously (~17bb EV swing).</>],
                  [<><strong>Thin river value</strong></>, <>If it feels thin, lean to check over raise — getting called and losing burns disproportionate equity.</>]]} />
                      <Callout variant="warn"><strong>Bet BIGGER to fold out gutters, not smaller.</strong> The ~105% front-load on A-Q-2 removes 5-4/4-3 from BB's range so turns are clean value bets. Counter-intuitive vs the chip-EV "small range-bet."</Callout>
              </Collapsible><Collapsible title="Sizing">
              <p>BB donk lead ~50% pot (can go range on extreme low boards). BB lead turn: ~50%. BB value bet river: block ~25%, never shove. BTN c-bet default ~B40 / small. BTN front-load overbet ~105% pot. BTN protection shove ~4x pot on low disconnected. River raise (value or bluff): non-all-in (~50% of remaining).</p>
              </Collapsible>
            </>
    </Section>
  )
}

export default BM9Page
