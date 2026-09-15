// Solver — a GTO solver workbench against a UPI (PioSOLVER Universal Poker
// Interface) bridge. Two views: Setup (spot configuration, the input
// mockup) and Solution (table visualizer, action tree, strategy matrix,
// made-hand breakdown — the solution mockup).
//
// ASSUMED API CONTRACT (the bridge is a thin HTTP wrapper around a
// persistent PioSOLVER process speaking standard UPI):
//   POST {url}/upi   {"commands": ["set_range OOP ...", "build_tree", ...]}
//     ->  {"responses": ["set_range ok!", ...]}
// Commands run sequentially against the same solver process; responses are
// the raw UPI output bodies in order (END markers stripped, ERROR lines
// preserved). The bridge normalizes `show_children_actions` to one action
// token per line ("c", "b50") and `show_strategy` to one 1326-float line
// per child, in child order; it answers CORS preflights; and it accepts
// `set_bet_sizes <street> <OOP|IP> <comma sizes>` (percent-of-pot) as a
// normalization of Pio's line-based tree config. https pages may call
// http://localhost (potentially-trustworthy origin), so the deployed site
// can drive a local bridge. With no bridge connected, CALCULATE renders
// the demo solution.
import { useState } from "react";
import { SetupView, type SpotSetup } from "./solver/SetupView";
import { SolutionView, type Solution, type SolutionNode } from "./solver/SolutionView";
import { upi, toUpiWeights, lineToCombos, lineShare, demoStrategy, combosOfClass } from "./solver/utils";

const label = "block text-[10px] uppercase tracking-widest text-muted/60 pb-1";
const input =
  "w-full bg-panel2/60 border border-line rounded-md px-2 py-1.5 text-[12.5px] text-txt outline-none focus:border-accent/60";

const DEFAULT_SETUP: SpotSetup = {
  board: "AsJd5c", pot: "6.7", stack: "37.5",
  oopRange: "", ipRange: "",
  sizings: {
    "flop-oop": { bet: ["75"], raise: ["60"] },
    "flop-ip": { bet: ["33", "60"], raise: ["60"] },
    "turn-oop": { bet: ["60"], raise: ["60"] },
    "turn-ip": { bet: ["60"], raise: ["60"] },
    "river-oop": { bet: ["60"], raise: ["60"] },
    "river-ip": { bet: ["60"], raise: ["60"] },
  },
  seconds: "30",
};

// share of 1326 carried by a class:freq strategy string
const pctOf = (raw: string | undefined) => {
  if (!raw) return 0;
  let sum = 0;
  for (const e of raw.split(",").filter(Boolean)) {
    const [tok, f] = e.split(":");
    // class:freq entries weigh by combo count; combo:freq by one combo
    sum += parseFloat(f) * (tok.length === 4 ? 1 : combosOfClass(tok).length);
  }
  return (sum / 1326) * 100;
};

/** Demo solution from the mockup's scenario (BB vs UTG, AsJd5c). */
function demoSolution(setup: SpotSetup): Solution {
  const board = setup.board || "AsJd5c";
  const cbet = demoStrategy(board, "cbet");
  const vsBet = demoStrategy(board, "vsBet");
  const nodes: Record<string, SolutionNode> = {
    cbet: {
      id: "cbet", player: "OOP", vsAction: null,
      actions: [
        { token: "c", label: "CHECK", kind: "check", pct: pctOf(cbet.check) },
        { token: "b75", label: "BET 75%", kind: "bet", pct: pctOf(cbet.bet) },
      ],
      strategy: { check: cbet.check ?? "", bet: cbet.bet ?? "" },
    },
    "cbet:b75": {
      id: "cbet:b75", player: "IP", vsAction: { label: "BET 75%", kind: "bet" },
      actions: [
        { token: "r60", label: "RAISE 60%", kind: "raise", pct: pctOf(vsBet.raise) },
        { token: "c", label: "CALL", kind: "call", pct: pctOf(vsBet.call) },
        { token: "f", label: "FOLD", kind: "fold", pct: pctOf(vsBet.fold) },
      ],
      strategy: { raise: vsBet.raise ?? "", call: vsBet.call ?? "", fold: vsBet.fold ?? "" },
    },
  };
  return {
    demo: true, board, pot: "11.7",
    elapsed: "02:13", exploit: "0.6%",
    evs: { oop: "0.23", ip: "0.04" },
    rootId: "cbet", nodes,
  };
}

/** Parse the UPI trio (node info / child actions / strategy) into a SolutionNode. */
function parseNode(id: string, nodeR: string, actionsR: string, stratR: string, parentNode?: SolutionNode): SolutionNode {
  const player = nodeR.includes("OOP_DEC") ? "OOP" : "IP";
  const tokens = actionsR.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const lines = stratR.split(/\n+/).filter((l) => l.trim().split(/\s+/).length > 100);
  const aggressive = tokens.some((t) => /^[br]/.test(t));
  const actions: SolutionNode["actions"] = [];
  const strategy: Record<string, string> = {};
  tokens.forEach((t, i) => {
    const line = lines[i] ?? "";
    const kind: SolutionNode["actions"][0]["kind"] =
      t === "c" ? (aggressive ? "call" : "check")
      : t === "f" ? "fold"
      : t.startsWith("r") ? "raise" : "bet";
    const amount = t.replace(/^[br]\s?/, "");
    const label = kind === "check" ? "CHECK" : kind === "call" ? "CALL" : kind === "fold" ? "FOLD"
      : `${kind === "raise" ? "RAISE" : "BET"} ${amount}`;
    actions.push({ token: t, label, kind, pct: lineShare(line) * 100 });
    if (line) strategy[kind === "check" || kind === "call" ? (aggressive ? "call" : "check") : kind] = lineToCombos(line);
  });
  return {
    id, player,
    vsAction: parentNode ? { label: parentNode.actions.find((a) => `${parentNode.id}:${a.token}` === id)?.label ?? "", kind: (["bet", "raise"] as const).includes((parentNode.actions.find((a) => `${parentNode.id}:${a.token}` === id)?.kind ?? "bet") as "bet" | "raise") ? (parentNode.actions.find((a) => `${parentNode.id}:${a.token}` === id)?.kind as "bet" | "raise") : "bet" } : null,
    actions, strategy,
  };
}

export function SolverPage() {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem("solver-api") ?? "http://127.0.0.1:8500");
  const [status, setStatus] = useState<"idle" | "connected" | "error">("idle");
  const [tab, setTab] = useState<"setup" | "solution">("setup");
  const [setup, setSetup] = useState<SpotSetup>(DEFAULT_SETUP);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const append = (l: string) => setLog((x) => [...x.slice(-40), l]);

  const connect = async () => {
    setStatus("idle");
    try {
      const [r] = await upi(apiUrl, ["is_ready"]);
      if (r.includes("ERROR")) throw new Error(r);
      setStatus("connected");
      append(`connected — ${r}`);
    } catch (e) {
      setStatus("error");
      append(`cannot reach ${apiUrl}: ${(e as Error).message}`);
    }
  };

  const fetchNode = async (id: string, parent?: SolutionNode): Promise<SolutionNode> => {
    const [nodeR, actionsR, stratR] = await upi(apiUrl, [
      `show_node ${id}`, `show_children_actions ${id}`, `show_strategy ${id}`,
    ]);
    return parseNode(id, nodeR, actionsR, stratR, parent);
  };

  const solve = async () => {
    setBusy(true);
    try {
      if (status === "connected") {
        const oop = toUpiWeights(setup.oopRange);
        const ip = toUpiWeights(setup.ipRange);
        if (!oop || !ip) throw new Error("paste valid starting ranges first");
        const sizeCmds = Object.entries(setup.sizings).flatMap(([k, v]) => {
          const [street, pos] = k.split("-");
          const s = `set_bet_sizes ${street} ${pos.toUpperCase()} ${[...v.bet, ...v.raise].join(",")}`;
          return [s];
        });
        const responses = await upi(apiUrl, [
          "free_tree",
          `set_range OOP ${oop}`,
          `set_range IP ${ip}`,
          `set_board ${setup.board}`,
          `set_pot 0 0 ${setup.pot}`,
          `set_eff_stack ${setup.stack}`,
          ...sizeCmds,
          "build_tree",
          `go ${setup.seconds}`,
          "calc_results",
        ]);
        const errs = responses.filter((r) => r.includes("ERROR"));
        if (errs.length) throw new Error(errs[0]);
        const results = responses[responses.length - 1];
        const ev = (re: RegExp) => results.match(re)?.[1] ?? "—";
        const root = await fetchNode("r:0");
        setSolution({
          demo: false, board: setup.board, pot: setup.pot,
          elapsed: `${setup.seconds}s`, exploit: ev(/exploitable for:\s*([\d.]+)/),
          evs: { oop: ev(/EV OOP:\s*(-?[\d.]+)/), ip: ev(/EV IP:\s*(-?[\d.]+)/) },
          rootId: "r:0", nodes: { "r:0": root },
        });
        append(`solved ${setup.board} — exploit ${results.match(/exploitable for:\s*([\d.]+)/)?.[1] ?? "?"}`);
      } else {
        setSolution(demoSolution(setup));
        append("no bridge connected — rendered demo solution");
      }
      setSelected("");
      setTab("solution");
    } catch (e) {
      append(`solve failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  // walk the tree: selecting an unfetched child node fetches its strategy
  const selectNode = async (id: string) => {
    setSelected(id);
    if (!solution || solution.nodes[id] || status !== "connected") return;
    try {
      const parent = Object.values(solution.nodes).find((n) =>
        n.actions.some((a) => `${n.id}:${a.token}` === id));
      const node = await fetchNode(id, parent);
      setSolution({ ...solution, nodes: { ...solution.nodes, [id]: node } });
    } catch (e) {
      append(`node fetch failed: ${(e as Error).message}`);
    }
  };

  const chip = (active: boolean) =>
    `px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer border transition-colors select-none ${
      active ? "bg-accent text-dark border-accent" : "text-txt/80 bg-panel2/60 border-transparent hover:bg-panel2 hover:text-txt"}`;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-3">
      {/* bridge bar */}
      <div className="rounded-xl border border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={label + " pb-0"}>UPI bridge</span>
          <input className={input + " max-w-[260px]"} value={apiUrl}
            onChange={(e) => { setApiUrl(e.target.value); localStorage.setItem("solver-api", e.target.value); }} />
          <button onClick={connect}
            className="px-2.5 py-1 rounded-md bg-panel2/60 border border-line text-[11px] font-semibold text-txt hover:border-accent/60 cursor-pointer">
            Connect
          </button>
          <span className={"text-[11px] font-semibold " + (status === "connected" ? "text-accent" : status === "error" ? "text-red-400" : "text-muted")}>
            {status === "connected" ? "connected" : status === "error" ? "unreachable" : "not connected"}
          </span>
          <div className="ml-auto flex gap-1">
            <button onClick={() => setTab("setup")} className={chip(tab === "setup")}>Setup</button>
            <button onClick={() => setTab("solution")} className={chip(tab === "solution")}
              disabled={!solution} title={solution ? "" : "hit CALCULATE first"}>Solution</button>
          </div>
        </div>
      </div>

      {tab === "setup" ? (
        <SetupView setup={setup} setSetup={setSetup} connected={status === "connected"} busy={busy} onSolve={solve} />
      ) : solution ? (
        <SolutionView solution={solution} selected={selected || solution.rootId} onSelect={selectNode} />
      ) : null}

      <div className="rounded-xl border border-line bg-panel px-4 py-3">
        <div className={label}>Bridge log</div>
        <div className="font-mono text-[11px] text-muted/80 max-h-28 overflow-y-auto whitespace-pre-wrap">
          {log.length === 0 ? "— no calls yet —" : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

export default SolverPage;
