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
// `set_bet_sizes <street> <OOP|IP> bets=<csv> raises=<csv>` (percent-of-pot,
// bets and raises keyed because a bare csv cannot be split). Node ids are
// action paths: "r:0" is the root, a child is "<parent>:<token>" — chance
// deals are transparent (the bridge follows one representative runout).
// The reference bridge is cuda-poker-solver/python/upi_bridge.py (the pps
// GPU solver as backend); https pages may call http://localhost
// (potentially-trustworthy origin), so the deployed site can drive a local
// bridge. There is no connect flow: CALCULATE tries the bridge and falls
// back to the demo solution when it is unreachable.
import { useEffect, useRef, useState } from "react";
import { SetupView, type SpotSetup } from "./solver/SetupView";
import { SolutionView, type Solution, type SolutionNode } from "./solver/SolutionView";
import { upi, toUpiWeights, lineToCombos, lineShare, demoStrategy, combosOfClass, liveUrl } from "./solver/utils";

const label = "block text-[10px] uppercase tracking-widest text-muted/60 pb-1";
const input =
  "w-full bg-panel2/60 border border-line rounded-md px-2 py-1.5 text-[12.5px] text-txt outline-none focus:border-accent/60";

// Default spot: UTG opens 40bb, BB calls — the System 1 scenario. Ranges
// are the real ChipEV solutions from the range store (combo:freq), so
// CALCULATE works out of the box; the board is the mockup's AsJd5c.
import { UTG_RFI_CEV, BB_VS_UTG_CEV } from "@poker/design-system/src/data/ranges";

const UTG_OPEN_40 = UTG_RFI_CEV.find((r) => r.stack === 40)?.actions.raise ?? "";
const BB_CALL_40 = BB_VS_UTG_CEV.find((r) => r.stack === 40)?.actions.call ?? "";

const DEFAULT_SETUP: SpotSetup = {
  board: "AsJd5c", pot: "6.7", stack: "37.5",
  oopRange: BB_CALL_40, ipRange: UTG_OPEN_40,
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

/** Demo solution: a complete three-street runout of BB vs UTG on AsJd5c,
 * turn 2h, river 3c — flop c-bet, call, turn probe, river navigation. */
function demoSolution(setup: SpotSetup): Solution {
  const flop = setup.board || "AsJd5c";
  const boardT = flop + "2h";
  const boardR = boardT + "3c";

  const mk = (
    id: string, street: "flop" | "turn" | "river", board: string, depth: number,
    player: "OOP" | "IP", vsAction: SolutionNode["vsAction"],
    acts: { token: string; label: string; kind: SolutionNode["actions"][0]["kind"] }[],
    strat: Record<string, string>,
  ): SolutionNode => ({
    id, street, board, depth, player, vsAction,
    actions: acts.map((a) => ({ ...a, pct: pctOf(strat[a.kind === "check" ? "check" : a.kind]) })),
    strategy: strat,
  });

  const fCbet = demoStrategy(flop, "cbet");
  const fStab = demoStrategy(flop, "cbet");
  const fVsBet = demoStrategy(flop, "vsBet");
  const tProbe = demoStrategy(boardT, "cbet", "turn");
  const tStab = demoStrategy(boardT, "cbet", "turn");
  const tVsBet = demoStrategy(boardT, "vsBet", "turn");
  const rProbe = demoStrategy(boardR, "cbet", "river");
  const rStab = demoStrategy(boardR, "cbet", "river");
  const rVsBet = demoStrategy(boardR, "vsBet", "river");

  const nodes: Record<string, SolutionNode> = {
    // flop
    cbet: mk("cbet", "flop", flop, 0, "OOP", null,
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b75", label: "BET 75%", kind: "bet" }],
      { check: fCbet.check ?? "", bet: fCbet.bet ?? "" }),
    "cbet:c": mk("cbet:c", "flop", flop, 1, "IP", { label: "CHECK", kind: "check" },
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b75", label: "BET 75%", kind: "bet" }],
      { check: fStab.check ?? "", bet: fStab.bet ?? "" }),
    "cbet:b75": mk("cbet:b75", "flop", flop, 1, "IP", { label: "BET 75%", kind: "bet" },
      [{ token: "r60", label: "RAISE 60%", kind: "raise" }, { token: "c", label: "CALL", kind: "call" }, { token: "f", label: "FOLD", kind: "fold" }],
      { raise: fVsBet.raise ?? "", call: fVsBet.call ?? "", fold: fVsBet.fold ?? "" }),
    // turn (after UTG calls the flop bet)
    "cbet:b75:c": mk("cbet:b75:c", "turn", boardT, 0, "OOP", null,
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b60", label: "BET 60%", kind: "bet" }],
      { check: tProbe.check ?? "", bet: tProbe.bet ?? "" }),
    "cbet:b75:c:c": mk("cbet:b75:c:c", "turn", boardT, 1, "IP", { label: "CHECK", kind: "check" },
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b75", label: "BET 75%", kind: "bet" }],
      { check: tStab.check ?? "", bet: tStab.bet ?? "" }),
    "cbet:b75:c:b60": mk("cbet:b75:c:b60", "turn", boardT, 1, "IP", { label: "BET 60%", kind: "bet" },
      [{ token: "r60", label: "RAISE 60%", kind: "raise" }, { token: "c", label: "CALL", kind: "call" }, { token: "f", label: "FOLD", kind: "fold" }],
      { raise: tVsBet.raise ?? "", call: tVsBet.call ?? "", fold: tVsBet.fold ?? "" }),
    // river (after UTG calls the turn bet)
    "cbet:b75:c:b60:c": mk("cbet:b75:c:b60:c", "river", boardR, 0, "OOP", null,
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b60", label: "BET 60%", kind: "bet" }],
      { check: rProbe.check ?? "", bet: rProbe.bet ?? "" }),
    "cbet:b75:c:b60:c:c": mk("cbet:b75:c:b60:c:c", "river", boardR, 1, "IP", { label: "CHECK", kind: "check" },
      [{ token: "c", label: "CHECK", kind: "check" }, { token: "b75", label: "BET 75%", kind: "bet" }],
      { check: rStab.check ?? "", bet: rStab.bet ?? "" }),
    "cbet:b75:c:b60:c:b60": mk("cbet:b75:c:b60:c:b60", "river", boardR, 1, "IP", { label: "BET 60%", kind: "bet" },
      [{ token: "r60", label: "RAISE 60%", kind: "raise" }, { token: "c", label: "CALL", kind: "call" }, { token: "f", label: "FOLD", kind: "fold" }],
      { raise: rVsBet.raise ?? "", call: rVsBet.call ?? "", fold: rVsBet.fold ?? "" }),
  };
  return {
    demo: true, board: flop, pot: "11.7",
    elapsed: "02:13", exploit: "0.6%",
    evs: { oop: "0.23", ip: "0.04" },
    rootId: "cbet", nodes,
  };
}

/** Parse the UPI trio (node info / child actions / strategy) into a SolutionNode. */
function parseNode(id: string, nodeR: string, actionsR: string, stratR: string): SolutionNode {
  const player = nodeR.includes("OOP_DEC") ? "OOP" : "IP";
  // show_node: [nodeID, node type, board line, ...] — board cards drive street
  const boardLine = nodeR.split("\n")[2] ?? "";
  const cards = (boardLine.match(/[AKQJT2-9][shdc]/g) ?? []).join("");
  const street = cards.length >= 10 ? "river" : cards.length >= 8 ? "turn" : "flop";
  const tokens = actionsR.split(/\n+/).map((s2) => s2.trim()).filter(Boolean);
  const lines = stratR.split(/\n+/).filter((l) => l.trim().split(/\s+/).length > 100);
  // "c" is a call only when facing a bet (a fold option exists);
  // unopened it is a check.
  const facing = tokens.includes("f");
  // action shares of the node's acting range (not of all 1326 hands)
  const shares = tokens.map((_, i) => lineShare(lines[i] ?? ""));
  const total = shares.reduce((a, b) => a + b, 0) || 1;
  const actions: SolutionNode["actions"] = [];
  const strategy: Record<string, string> = {};
  tokens.forEach((t, i) => {
    const line = lines[i] ?? "";
    const kind: SolutionNode["actions"][0]["kind"] =
      t === "c" ? (facing ? "call" : "check")
      : t === "f" ? "fold"
      : t.startsWith("r") ? "raise" : "bet";
    const amount = t.replace(/^[br]\s?/, "");
    const label = kind === "check" ? "CHECK" : kind === "call" ? "CALL" : kind === "fold" ? "FOLD"
      : `${kind === "raise" ? "RAISE" : "BET"} ${amount}`;
    actions.push({ token: t, label, kind, pct: (shares[i] / total) * 100 });
    if (line) strategy[kind] = lineToCombos(line);
  });
  return {
    id, player, street, board: cards, depth: id.match(/:/g)?.length ?? 0,
    vsAction: null, actions, strategy,
  };
}

export function SolverPage() {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem("solver-api") ?? "http://127.0.0.1:8500");
  const [tab, setTab] = useState<"setup" | "solution">("setup");
  const [setup, setSetup] = useState<SpotSetup>(DEFAULT_SETUP);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<null | {
    phase: "compile" | "solve" | "results"; pct: number;
    iters: number; active: number; budget: number;
  }>(null);
  const [log, setLog] = useState<string[]>([]);
  const [wsLive, setWsLive] = useState(false);
  const append = (l: string) => setLog((x) => [...x.slice(-40), l]);
  const busyRef = useRef(false);

  // live progress socket: the bridge pushes per-iteration progress and
  // phase events; between solves it just keeps the liveness dot honest
  useEffect(() => {
    let closed = false;
    let sock: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout>;
    const open = () => {
      sock = new WebSocket(liveUrl(apiUrl));
      sock.onopen = () => !closed && setWsLive(true);
      sock.onclose = () => {
        setWsLive(false);
        if (!closed) retry = setTimeout(open, 3000);
      };
      sock.onmessage = (ev) => {
        if (!busyRef.current) return;
        try {
          const m = JSON.parse(ev.data);
          if (m.type === "progress" || m.type === "phase") {
            setProgress(m.type === "progress"
              ? { phase: "solve", iters: m.iters, active: m.active, budget: m.budget,
                  pct: Math.min(100, (m.active / m.budget) * 100) }
              : { phase: m.phase === "compile" ? "compile" : "solve",
                  pct: 0, iters: 0, active: 0, budget: 0 });
          }
        } catch { /* not a live frame */ }
      };
    };
    open();
    return () => { closed = true; clearTimeout(retry); sock?.close(); };
  }, [apiUrl]);

  const fetchNode = async (id: string): Promise<SolutionNode> => {
    const [nodeR, actionsR, stratR] = await upi(apiUrl, [
      `show_node ${id}`, `show_children_actions ${id}`, `show_strategy ${id}`,
    ], { timeoutMs: 30000, retries: 1 });
    return parseNode(id, nodeR, actionsR, stratR);
  };

  const solve = async () => {
    setBusy(true);
    busyRef.current = true;
    setProgress({ phase: "compile", pct: 0, iters: 0, active: 0, budget: 0 });
    let unreachable = false;
    try {
      const oop = toUpiWeights(setup.oopRange);
        const ip = toUpiWeights(setup.ipRange);
        if (!oop || !ip) throw new Error("paste valid starting ranges first");
        const sizeCmds = Object.entries(setup.sizings).flatMap(([k, v]) => {
          const [street, pos] = k.split("-");
          return [`set_bet_sizes ${street} ${pos.toUpperCase()} bets=${v.bet.join(",")} raises=${v.raise.join(",")}`];
        });
        // 1) setup + compile (the GPU tree build is one-shot; big trees
        //    can take tens of seconds — no partial progress exists yet)
        const buildResponses = await upi(apiUrl, [
          "free_tree",
          `set_range OOP ${oop}`,
          `set_range IP ${ip}`,
          `set_board ${setup.board}`,
          `set_pot 0 0 ${setup.pot}`,
          `set_eff_stack ${setup.stack}`,
          ...sizeCmds,
          "build_tree",
        ], { timeoutMs: 180000, retries: 1 });
        const buildErrs = buildResponses.filter((r) => r.includes("ERROR"));
        if (buildErrs.length) throw new Error(buildErrs[0]);

        // 2) chunked solve — each POST is a short go_chunk call, so the
        //    request can never hang and progress updates between calls;
        //    a dropped call retries (the engine warm-starts exactly)
        const budget = Math.max(1, parseFloat(setup.seconds) || 30);
        setProgress({ phase: "solve", pct: 0, iters: 0, active: 0, budget });
        let last: { iters: number; active: number; budget: number; done: boolean };
        for (let guard = 0; guard < 1000; guard++) {
          const [chunkR] = await upi(apiUrl, [`go_chunk 2 ${budget}`],
            { timeoutMs: 30000, retries: 2 });
          if (chunkR.includes("ERROR")) throw new Error(chunkR);
          let p: { iters?: number; active?: number; budget?: number; done?: boolean };
          try { p = JSON.parse(chunkR); } catch { throw new Error(chunkR); }
          last = { iters: p.iters ?? 0, active: p.active ?? 0,
                   budget: p.budget ?? budget, done: !!p.done };
          setProgress({ phase: "solve", iters: last.iters, active: last.active,
            budget: last.budget, pct: Math.min(100, (last.active / last.budget) * 100) });
          if (last.done) break;
        }
        if (!last!.done) throw new Error("solve did not finish");

        // 3) results + root node
        setProgress({ phase: "results", pct: 100, iters: last!.iters,
          active: last!.active, budget: last!.budget });
        const [results] = await upi(apiUrl, ["calc_results"], { timeoutMs: 60000 });
        if (results.includes("ERROR")) throw new Error(results);
        const ev = (re: RegExp) => results.match(re)?.[1] ?? "—";
        const root = await fetchNode("r:0");
        setSolution({
          demo: false, board: setup.board, pot: setup.pot,
          elapsed: `${setup.seconds}s`, exploit: ev(/exploitable for:\s*([\d.]+)/),
          evs: { oop: ev(/EV OOP:\s*(-?[\d.]+)/), ip: ev(/EV IP:\s*(-?[\d.]+)/) },
          rootId: "r:0", nodes: { "r:0": root },
        });
        append(`solved ${setup.board} — exploit ${results.match(/exploitable for:\s*([\d.]+)/)?.[1] ?? "?"}`);
      setSelected("");
      setTab("solution");
    } catch (e) {
      if ((e as Error).name === "AbortError" || e instanceof TypeError) {
        unreachable = true;          // network failure: fall back to demo
      } else {
        append(`solve failed: ${(e as Error).message}`);
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
      setProgress(null);
    }
    if (unreachable) {
      setSolution(demoSolution(setup));
      append("bridge unreachable — rendered demo solution");
      setSelected("");
      setTab("solution");
    }
  };

  const selectNode = async (id: string) => {
    setSelected(id);
    if (!solution || solution.nodes[id]) return;
    try {
      const node = await fetchNode(id);
      setSolution({ ...solution, nodes: { ...solution.nodes, [id]: node } });
    } catch (e) {
      append(`node fetch failed: ${(e as Error).message}`);
    }
  };

  // walk the tree: an action badge fetches its child node (id = parent:token)
  const walkChild = (id: string, token: string) => selectNode(`${id}:${token}`);

  const chip = (active: boolean) =>
    `px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer border transition-colors select-none ${
      active ? "bg-accent text-dark border-accent" : "text-txt/80 bg-panel2/60 border-transparent hover:bg-panel2 hover:text-txt"}`;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-3">
      {/* bridge bar */}
      <div className="rounded-xl border border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={label + " pb-0"}>UPI bridge</span>
          <input className={input + " max-w-[260px]"} value={apiUrl} title="UPI bridge endpoint"
            onChange={(e) => { setApiUrl(e.target.value); localStorage.setItem("solver-api", e.target.value); }} />
          <span title={wsLive ? "bridge live" : "bridge not reachable"}
            className={"w-2 h-2 rounded-full shrink-0 " + (wsLive ? "bg-accent animate-pulse" : "bg-muted/30")} />
          <div className="ml-auto flex gap-1">
            <button onClick={() => setTab("setup")} className={chip(tab === "setup")}>Setup</button>
            <button onClick={() => setTab("solution")} className={chip(tab === "solution")}
              disabled={!solution} title={solution ? "" : "hit CALCULATE first"}>Solution</button>
          </div>
        </div>
      </div>

      {tab === "setup" ? (
        <SetupView setup={setup} setSetup={setSetup} busy={busy} progress={progress} onSolve={solve} />
      ) : solution ? (
        <SolutionView solution={solution} selected={selected || solution.rootId} onSelect={selectNode} onAction={walkChild} />
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
