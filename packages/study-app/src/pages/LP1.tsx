import type { ReactNode } from 'react'
import { Section, Callout, Leak, Subhead, DataTable, Action } from '@poker/design-system/src/components/ui'

export const LP1_LEAKS: [ReactNode, ReactNode?][] = [
  ['Over-folding the SB', 'playing 50–60% instead of ~85% surrenders the dead money every orbit'],
  ['Limping with no plan', 'a limp that folds to every BB raise is a fold with extra steps'],
  ['Raising at 10bb', 'the small raise that has to fold to a shove wastes chips and equity'],
  ['Guessing the structure', 'shoving premiums at 30bb or raising them at 10bb inverts the plan at both depths'],
]

export function LP1Page() {
  return (
    <Section title="LP1 — SB Limp Raise or Fold">
      <p>Action folds to the SB against the BB only. The question is not <em>whether</em> to enter — the solver plays 79–89% of hands at every depth — but <em>how</em>: which hands limp, which raise, which shove. That structure rotates as stacks deepen, and guessing the rotation is one of the biggest silent leaks in tournament poker.</p>

      <Leak items={LP1_LEAKS} />

      <DataTable
        columns={[{ header: 'Depth' }, { header: 'Structure' }, { header: 'Premiums (AA–QQ)' }]}
        rows={[
          [
            <><strong>A · 10bb</strong><br /><span className="text-muted text-xs">polarized · ~79% played</span></>,
            <>Limp strongest + weakest, <strong>shove the middle</strong> (Ax, Kx, low pairs, the C-shaped suited curve)</>,
            <><Action variant="check">Limp</Action> — limp-shove plan</>,
          ],
          [
            <><strong>B · 15–20bb</strong><br /><span className="text-muted text-xs">transitional · ~85% played</span></>,
            <>Limp most; raise grows ~7% → ~18% (raise-fold two cards above a 7), shove shrinks</>,
            <>Raise JJ+ at 20bb, <strong>limp-shove AQ/AK</strong></>,
          ],
          [
            <><strong>C · 30bb</strong><br /><span className="text-muted text-xs">linear raise · ~86% played</span></>,
            <>Limp 62% / raise 24% (4bb, blocker-value offsuit + suited playables) / fold 13.8%</>,
            <><Action variant="raise">Pure raise 4bb</Action> — the only depth where that's true</>,
          ],
          [
            <><strong>D · 60bb+</strong><br /><span className="text-muted text-xs">trap and attack · ~89% played</span></>,
            <>Limp ~77% of played hands; raise 11.6% linearly (Ax-suited, suited broadway, high connectors)</>,
            <><Action variant="check">Limp again</Action> — the limp-raise is the weapon vs a BB iso</>,
          ],
        ]}
      />

      <Callout variant="good"><strong>"Big pairs shove at 10, raise at 30, trap at 60."</strong> The SB is never passive — limping, raising and shoving all sit behind an aggressive plan (limp-shove, limp-raise, iso-fold logic). "Limp" is an action with a follow-up, not a surrender: every limp needs a defined response to a BB raise.</Callout>

      <Subhead>Sizing</Subhead>
      <DataTable
        compact
        columns={[{ header: 'Action' }, { header: 'Depth → size' }]}
        rows={[
          ['Raise (non-all-in)', '15bb → 2.5bb · 20bb → 3bb · 30–60bb → 4bb'],
          ['Shove', '10bb: all-in · 15bb: ~25% of hands · 20bb: ~11% · 30bb: ~0'],
        ]}
      />
      <p className="text-[13px] text-muted leading-snug">At 10bb there is no small raise — a standard raise commits too much to fold after. Bluff-raise hands need blockers/playability, not 54s/43s. ICM shifts the mix away from limping toward aggression (BM4 is the bubble version of this node).</p>

      <Callout><strong>Population read:</strong> most low/mid-stakes BBs don't raise limps enough — limp wider and shove wider than baseline (apestyles' labeled exploit).</Callout>
    </Section>
  )
}

export default LP1Page
