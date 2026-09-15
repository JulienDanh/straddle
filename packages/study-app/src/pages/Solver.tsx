// Solver — a GTO solver workbench against a UPI (PioSOLVER Universal Poker
// Interface) bridge.
//
// ASSUMED API CONTRACT (the bridge is a thin HTTP wrapper around a
// persistent PioSOLVER process speaking standard UPI):
//   POST {url}/upi   {"commands": ["set_range OOP ...", "build_tree", ...]}
//     ->  {"responses": ["set_range ok!", ...]}
// Commands run sequentially against the same solver process; responses are
// the raw UPI output bodies in order (END markers stripped, ERROR lines
// preserved as "ERROR ..." entries). `go` blocks until the solver stops.
// The bridge normalizes `show_children_actions` to one action token per
// line ("c", "b 50", "b 100") and `show_strategy` to one 1326-float line
// per child, in child order.
//
// Mixed-content note: an https page may fetch http://localhost / 127.0.0.1
// (potentially-trustworthy origins), so the deployed site can drive a
// local bridge.
import { useEffect, useMemo, useState } from "react";
import { RangeGrid, UPI_HANDS } from "@poker/design-system/src/components/RangeGrid";

const SUITS = ["s", "h", "d", "c"];

// ---- range text helpers (class:freq <-> combos <-> UPI) ----
function combosOfClass(cls: string): string[] {
  if (cls.length === 2) {
    const out: string[] = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++)
      out.push(cls[0] + SUITS[i] + cls[0] + SUITS[j]);
    return out;
  }
  const hi = cls[0], lo = cls[1];
  if (cls[2] === "s") return SUITS.map((s) => hi + s + lo + s);
  const out: string[] = [];
  for (const a of SUITS) for (const b of SUITS) if (a !== b) out.push(hi + a + lo + b);
  return out;
}
const CLS_RE = /^[AKQJT2-9]{2}[so]?$|^[AKQJT2-9]{2}$/;

/** Validate a class:freq text ("AA:1,AKs:0.5"). Returns share of 1326, or null. */
function rangeShare(raw: string): number | null {
  let sum = 0;
  for (const entry of raw.split(/[,\s]+/).filter(Boolean)) {
    const [cls, f] = entry.split(":");
    if (!CLS_RE.test(cls)) return null;
    const w = f === undefined ? 1 : parseFloat(f);
    if (isNaN(w) || w < 0 || w > 1) return null;
    sum += w * combosOfClass(cls).length;
  }
  return sum / 1326;
}
/** class:freq text -> 1326 space-separated UPI weights (null if invalid). */
function toUpiWeights(raw: string): string | null {
  const freqs: Record<string, number> = {};
  for (const entry of raw.split(/[,\s]+/).filter(Boolean)) {
    const [cls, f] = entry.split(":");
    if (!CLS_RE.test(cls)) return null;
    const w = f === undefined ? 1 : parseFloat(f);
    if (isNaN(w) || w < 0 || w > 1) return null;
    for (const combo of combosOfClass(cls)) freqs[combo] = w;
  }
  return UPI_HANDS.map((h) => Math.round((freqs[h] ?? 0) * 10000) / 10000).join(" ");
}
/** one 1326-float line -> combo:freq string for a RangeGrid action. */
function lineToCombos(line: string): string {
  const w = line.trim().split(/\s+/).map(Number);
  const out: string[] = [];
  for (let i = 0; i < UPI_HANDS.length; i++) {
    const f = Math.round((w[i] ?? 0) * 10000) / 10000;
    if (f > 0.00005) out.push(`${UPI_HANDS[i]}:${f}`);
  }
  return out.join(",");
}

// ---- UPI bridge client ----
async function upi(url: string, commands: string[]): Promise<string[]> {
  const r = await fetch(`${url.replace(/\/+$/, "")}/upi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  if (!Array.isArray(d.responses)) throw new Error("malformed bridge response");
  return d.responses;
}

const label = "block text-[10px] uppercase tracking-widest text-muted/60 pb-1";
const input =
  "w-full bg-panel2/60 border border-line rounded-md px-2 py-1.5 text-[12.5px] text-txt outline-none focus:border-accent/60";

export function SolverPage() {
  const [apiUrl, setApiUrl] = useState(
    () => localStorage.getItem("solver-api") ?? "http://127.0.0.1:8500",
  );
  const [status, setStatus] = useState<"idle" | "connected" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);
  const append = (line: string) => setLog((l) => [...l.slice(-80), line]);

  // spot setup
  const [board, setBoard] = useState("AsKd5c");
  const [pot, setPot] = useState("3.5");
  const [stack, setStack] = useState("37.5");
  const [sizes, setSizes] = useState("33,60,100,150");
  const [seconds, setSeconds] = useState("30");
  const [oopRange, setOopRange] = useState("");
  const [ipRange, setIpRange] = useState("");
  const [busy, setBusy] = useState(false);

  // results
  const [results, setResults] = useState<string[] | null>(null);
  const [node, setNode] = useState("r:0");
  const [strategy, setStrategy] = useState<{ actions: string[]; lines: string[] } | null>(null);

  useEffect(() => localStorage.setItem("solver-api", apiUrl), [apiUrl]);

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

  const solve = async () => {
    setBusy(true);
    setResults(null);
    setStrategy(null);
    try {
      const oop = toUpiWeights(oopRange);
      const ip = toUpiWeights(ipRange);
      if (!oop || !ip) throw new Error("invalid range text");
      const responses = await upi(apiUrl, [
        "free_tree",
        `set_range OOP ${oop}`,
        `set_range IP ${ip}`,
        `set_board ${board}`,
        `set_pot 0 0 ${pot}`,
        `set_eff_stack ${stack}`,
        `set_bet_sizes ${sizes}`,
        "build_tree",
        `go ${seconds}`,
        "calc_results",
      ]);
      const errs = responses.filter((r) => r.includes("ERROR"));
      if (errs.length) throw new Error(errs[0]);
      setResults(responses.slice(-1)[0].split("\n").filter(Boolean));
      append(`solved board ${board} (${seconds}s)`);
    } catch (e) {
      append(`solve failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const showNode = async () => {
    setStrategy(null);
    try {
      const [actionsR, stratR] = await upi(apiUrl, [
        `show_children_actions ${node}`,
        `show_strategy ${node}`,
      ]);
      const actions = actionsR.split(/\n+/).map((s) => s.trim()).filter(Boolean);
      const lines = stratR.split(/\n+/).filter((l) => l.trim().split(/\s+/).length > 100);
      setStrategy({ actions, lines });
    } catch (e) {
      append(`show failed: ${(e as Error).message}`);
    }
  };

  // render the node strategy as RangeGrid actions
  const gridActions = useMemo(() => {
    if (!strategy) return null;
    const out: Record<"check" | "bet", string> = { check: "", bet: "" };
    let betSize = 0;
    strategy.actions.forEach((a, i) => {
      const line = strategy.lines[i];
      if (!line) return;
      if (a === "c") out.check = lineToCombos(line);
      else if (a.startsWith("b")) {
        out.bet = out.bet ? `${out.bet},${lineToCombos(line)}` : lineToCombos(line);
        const n = parseFloat(a.split(/\s+/)[1]);
        if (!isNaN(n)) betSize = betSize || n;
      }
    });
    return { ...out, betSize };
  }, [strategy]);

  const shareOf = (raw: string) => (raw.trim() ? rangeShare(raw) : null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl border border-line bg-panel px-4 py-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={label + " pb-0"}>UPI bridge</span>
          <input
            className={input + " max-w-[280px]"}
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://127.0.0.1:8500"
          />
          <button
            onClick={connect}
            className="px-2.5 py-1 rounded-md bg-panel2/60 border border-line text-[11px] font-semibold text-txt hover:border-accent/60 cursor-pointer"
          >
            Connect
          </button>
          <span
            className={
              "text-[11px] font-semibold " +
              (status === "connected" ? "text-accent" : status === "error" ? "text-red-400" : "text-muted")
            }
          >
            {status === "connected" ? "connected" : status === "error" ? "unreachable" : "not connected"}
          </span>
          <span className="text-[11px] text-muted/50 ml-auto">
            POST /upi {"{"}commands[]{"}"} → {"{"}responses[]{"}"} — see page docs for the contract
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-line bg-panel px-4 py-3">
          <div className={label}>Spot</div>
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-[10px] text-muted/60">Board</span>
              <input className={input} value={board} onChange={(e) => setBoard(e.target.value)} /></div>
            <div><span className="text-[10px] text-muted/60">Pot (bb)</span>
              <input className={input} value={pot} onChange={(e) => setPot(e.target.value)} /></div>
            <div><span className="text-[10px] text-muted/60">Effective stack (bb)</span>
              <input className={input} value={stack} onChange={(e) => setStack(e.target.value)} /></div>
            <div><span className="text-[10px] text-muted/60">Bet sizes (bb, comma-sep)</span>
              <input className={input} value={sizes} onChange={(e) => setSizes(e.target.value)} /></div>
          </div>

          <div className="pt-3">
            <div className={label}>OOP range (class:freq)</div>
            <textarea
              className={input + " h-24 font-mono text-[11px]"}
              value={oopRange}
              onChange={(e) => setOopRange(e.target.value)}
              placeholder="AA:1,AKs:0.5,... — paste from any grid's copy button, or load from the BBZ store below"
            />
            <div className="text-[10.5px] pt-0.5 text-muted">
              {shareOf(oopRange) === null ? "invalid or empty" : `${(shareOf(oopRange)! * 100).toFixed(1)}% of hands`}
            </div>
          </div>
          <div className="pt-2">
            <div className={label}>IP range (class:freq)</div>
            <textarea
              className={input + " h-24 font-mono text-[11px]"}
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="AA:1,AKs:0.5,..."
            />
            <div className="text-[10.5px] pt-0.5 text-muted">
              {shareOf(ipRange) === null ? "invalid or empty" : `${(shareOf(ipRange)! * 100).toFixed(1)}% of hands`}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3">
            <input
              className={input + " w-20"}
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              title="seconds"
            />
            <span className="text-[11px] text-muted/60">s solve time</span>
            <button
              onClick={solve}
              disabled={busy || status !== "connected"}
              className="ml-auto px-3 py-1.5 rounded-md bg-accent text-dark text-[12px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              {busy ? "solving…" : "Build tree & solve"}
            </button>
          </div>
          {results && (
            <div className="mt-3 rounded-lg border border-line bg-panel2/50 px-3 py-2 font-mono text-[11px] text-muted whitespace-pre-wrap">
              {results.join("\n")}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-panel px-4 py-3">
          <div className={label}>Node explorer</div>
          <div className="flex items-center gap-2">
            <input className={input} value={node} onChange={(e) => setNode(e.target.value)} />
            <button
              onClick={showNode}
              disabled={status !== "connected"}
              className="px-2.5 py-1.5 rounded-md bg-panel2/60 border border-line text-[11px] font-semibold text-txt hover:border-accent/60 cursor-pointer disabled:opacity-40"
            >
              Show strategy
            </button>
          </div>
          <div className="text-[10.5px] text-muted/60 pt-1">
            nodeID per UPI: actions separated by “:”, b = cumulative bet, c = check/call
          </div>
          {strategy && (
            <div className="pt-2 text-[11px] text-muted">
              actions: {strategy.actions.join(" · ")}
            </div>
          )}
          {gridActions && (
            <div className="pt-3">
              <RangeGrid
                title={`Node ${node}`}
                subtitle={gridActions.betSize ? `bet ${gridActions.betSize}` : "check"}
                check={gridActions.check}
                bet={gridActions.bet}
                sizings={gridActions.betSize ? { bet: gridActions.betSize } : undefined}
              />
            </div>
          )}
          {strategy && !gridActions?.check && !gridActions?.bet && (
            <div className="pt-3 text-[12px] text-muted">No check/bet children at this node.</div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-panel px-4 py-3 mt-4">
        <div className={label}>Bridge log</div>
        <div className="font-mono text-[11px] text-muted/80 max-h-40 overflow-y-auto whitespace-pre-wrap">
          {log.length === 0 ? "— no calls yet —" : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

export default SolverPage;
