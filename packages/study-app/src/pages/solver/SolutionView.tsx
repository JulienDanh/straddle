// Solver solution view — follows the solution mockup: poker-table panel
// (elapsed/exploitability, pot + board, EVs), street action tree (click a
// node action to walk the tree), the strategy matrix with a "strategy vs"
// header, and the made-hand category breakdown computed on the board.
import { useMemo } from "react";
import { Board } from "@poker/design-system/src/components/ui-parts/cards";
import { RangeGrid } from "@poker/design-system/src/components/RangeGrid";
import { Action } from "@poker/design-system/src/components/ui";
import { ALL_CLASSES, CATEGORY_ORDER, categorize } from "./utils";

export type SolutionNode = {
  id: string;
  street: "flop" | "turn" | "river";
  board: string; // the board AT this node (flop / flop+turn / +river)
  depth: number; // indent within its street panel
  player: "OOP" | "IP";
  vsAction: { label: string; kind: "bet" | "raise" | "check" } | null;
  actions: { token: string; label: string; kind: "bet" | "raise" | "call" | "check" | "fold"; pct: number }[];
  strategy: Record<string, string>; // action name -> combo:freq
};
export type Solution = {
  demo: boolean;
  board: string; pot: string;
  elapsed: string; exploit: string;
  evs: { oop: string; ip: string };
  rootId: string;
  nodes: Record<string, SolutionNode>;
};

const ACTION_COLOR: Record<string, string> = {
  bet: "#ff5470", raise: "#ff5470", call: "#00f0ff", check: "#39ff88", fold: "#2f2f4a",
};

// ---- made-hand breakdown rows for the selected node's strategy ----
function categoryRows(node: SolutionNode, board: string) {
  // per-class reach weight + per-action weight at the node
  const clsW: Record<string, number> = {};
  const clsAct: Record<string, Record<string, number>> = {};
  for (const cls of ALL_CLASSES) clsW[cls] = 0;
  for (const [action, raw] of Object.entries(node.strategy)) {
    for (const entry of raw.split(",").filter(Boolean)) {
      const [combo, f] = entry.split(":");
      // map back to the class: expand via combo's class
      const cls = classOfCombo(combo);
      if (!cls) continue;
      clsW[cls] += parseFloat(f);
      clsAct[cls] = clsAct[cls] ?? {};
      clsAct[cls][action] = (clsAct[cls][action] ?? 0) + parseFloat(f);
    }
  }
  const total = ALL_CLASSES.reduce((s, c) => s + clsW[c], 0) || 1;
  return CATEGORY_ORDER.map((cat) => {
    let w = 0;
    const acts: Record<string, number> = {};
    for (const cls of ALL_CLASSES) {
      if (categorize(cls, board) !== cat) continue;
      w += clsW[cls];
      for (const [a, v] of Object.entries(clsAct[cls] ?? {})) acts[a] = (acts[a] ?? 0) + v;
    }
    const dominant = Object.entries(acts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "fold";
    return { cat, share: w / total, dominant };
  }).filter((r) => r.share > 0.001);
}

const RANKS = "AKQJT98765432";
function classOfCombo(combo: string): string | null {
  if (combo.length !== 4) return null;
  const r1 = combo[0], s1 = combo[1], r2 = combo[2], s2 = combo[3];
  if (r1 === r2) return r1 + r2;
  const hi = RANKS.indexOf(r1) < RANKS.indexOf(r2) ? r1 : r2;
  const lo = hi === r1 ? r2 : r1;
  return hi + lo + (s1 === s2 ? "s" : "o");
}

// ---- action tree: one panel per street, node rows grouped per street ----
function TreePanel({ title, streetNodes, selected, onSelect, onAction }: {
  title: string; streetNodes: SolutionNode[]; selected: string;
  onSelect: (id: string) => void; onAction: (id: string, token: string) => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-panel p-3 min-w-[150px] flex-1">
      <div className="text-[10px] uppercase tracking-widest text-muted/60 pb-2">{title}</div>
      {streetNodes.length === 0 && <div className="text-[11px] text-muted/40">—</div>}
      {streetNodes.map((n) => (
        <div key={n.id} className={n.depth ? "ml-4 pt-1 border-l border-line/60 pl-2" : "pt-0.5"}>
          <button onClick={() => onSelect(n.id)}
            className={`text-[11px] font-semibold cursor-pointer block text-left ${selected === n.id ? "text-accent" : "text-txt/80 hover:text-txt"}`}>
            {n.player === "OOP" ? "BB" : "UTG"}
            {n.vsAction ? <span className="text-muted/60"> vs </span> : " ·"}
            {n.actions.map((a, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); onAction(n.id, a.token); }}
                title="walk to this action's node"
                className="pl-1.5 pr-0.5 inline-flex items-center gap-0.5 cursor-pointer hover:opacity-80">
                {i > 0 && <span className="text-muted/40">/</span>}
                <span className="px-1 rounded font-bold"
                  style={{ background: ACTION_COLOR[a.kind], color: a.kind === "fold" ? "#9aa" : "#fff" }}>
                  {a.label}
                </span>
                <span className="text-muted/60">({a.pct.toFixed(1)}%)</span>
              </button>
            ))}
          </button>
        </div>
      ))}
    </div>
  );
}

export function SolutionView({
  solution, selected, onSelect, onAction,
}: {
  solution: Solution; selected: string; onSelect: (id: string) => void;
  onAction: (id: string, token: string) => void;
}) {
  const node = solution.nodes[selected] ?? solution.nodes[solution.rootId];
  const all = Object.values(solution.nodes);
  const byStreet = (st: string) => all.filter((n) => n.street === st);

  const rows = useMemo(() => categoryRows(node, node.board), [node]);

  const gridProps: Record<string, string> = {};
  for (const [k, v] of Object.entries(node.strategy)) gridProps[k] = v;

  return (
    <div className="flex flex-col gap-3">
      {/* top row: table + street trees */}
      <div className="flex gap-3 items-stretch">
        <div className="rounded-xl border border-line bg-panel p-3 w-[240px] shrink-0 flex flex-col justify-between">
          <div className="text-[9.5px] text-muted/60">
            Elapsed: {solution.elapsed} | Exploitability: {solution.exploit}
          </div>
          <div className="relative h-[75px] rounded-[40px] bg-[#1b5e20] border-4 border-[#3e2723] flex items-center justify-center">
            <span className="text-white font-bold text-[11px]">Pot: {solution.pot}</span>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded bg-panel border border-line px-1">
              <Board cards={node.board} size="sm" />
            </div>
          </div>
          <div className="text-[11px] font-bold text-txt pt-3">
            EV BB: {solution.evs.oop} | EV UTG: {solution.evs.ip}
          </div>
          {solution.demo && (
            <div className="text-[9px] text-orange-400/80">demo data — no bridge connected</div>
          )}
        </div>
        <TreePanel title="Flop actions" streetNodes={byStreet("flop")}
          selected={selected} onSelect={onSelect} onAction={onAction} />
        <TreePanel title="Turn actions" streetNodes={byStreet("turn")}
          selected={selected} onSelect={onSelect} onAction={onAction} />
        <TreePanel title="River actions" streetNodes={byStreet("river")}
          selected={selected} onSelect={onSelect} onAction={onAction} />
      </div>

      {/* tabs row (visual parity with the mockup) */}
      <div className="flex gap-1.5">
        <span className="px-2.5 py-1 rounded text-[11px] font-bold text-accent border border-accent/40 cursor-default">Strategy</span>
        {["Hole cards", "Made hand matrix", "Train this spot"].map((t) => (
          <span key={t} title="coming"
            className="px-2.5 py-1 rounded text-[11px] text-muted/50 border border-transparent cursor-not-allowed">{t}</span>
        ))}
      </div>

      {/* workspace: matrix + made-hand bars */}
      <div className="flex gap-3 items-start">
        <div className="rounded-xl border border-line bg-panel p-3">
          <div className="text-[12px] font-bold pb-2">
            <span className="text-red-400">{node.player === "OOP" ? "BB" : "UTG"} STRATEGY</span>
            {node.vsAction && (
              <span className="pl-1.5 text-muted/70">
                VS <Action variant={node.vsAction.kind ?? "bet"}>{node.vsAction.label}</Action>
              </span>
            )}
          </div>
          <RangeGrid
            title={`${node.player === "OOP" ? "BB" : "UTG"} · ${node.actions.map((a) => a.label).join("/")}`}
            subtitle={solution.demo ? "demo solution" : "UPI bridge solution"}
            {...gridProps}
          />
        </div>

        <div className="rounded-xl border border-line bg-panel p-3 w-[290px] shrink-0">
          <div className="text-[11px] font-bold text-txt pb-2">Made hand strategy</div>
          {rows.length === 0 && <div className="text-[11px] text-muted/50">—</div>}
          {rows.map((r) => (
            <div key={r.cat} className="flex items-center gap-2 pb-1.5">
              <span className="w-[70px] text-[10px] text-muted">{r.cat}</span>
              <div className="flex-1 h-2.5 rounded bg-panel2/60 overflow-hidden border border-line/50">
                <div className="h-full rounded"
                  style={{ width: `${Math.min(100, r.share * 100)}%`, background: ACTION_COLOR[r.dominant] }} />
              </div>
              <span className="w-[38px] text-right text-[10px] font-bold tabular-nums text-txt">
                {(r.share * 100).toFixed(1)}%
              </span>
            </div>
          ))}
          <div className="text-[9px] text-muted/40 pt-2">
            category share of the acting range; bar color = dominant action
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionView;
