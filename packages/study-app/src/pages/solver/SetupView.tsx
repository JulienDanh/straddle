// Solver setup — the spot configuration view (board, ranges, stacks, per
// street/position sizings, presets, calculate). Layout follows the setup
// mockup: top row (flop / starting ranges / stacks & table), tree
// settings grid, preview, sidebar (modes, presets, calculate).
import { useState } from "react";
import { Board } from "@poker/design-system/src/components/ui-parts/cards";
import { rangeShare, ALL_CLASSES } from "./utils";

export type StreetSizings = Record<string, { bet: string[]; raise: string[] }>;
export type SpotSetup = {
  board: string; pot: string; stack: string;
  oopRange: string; ipRange: string;
  sizings: StreetSizings; seconds: string;
};

const SIZING_BOXES: { key: string; label: string }[] = [
  { key: "flop-oop", label: "FLOP OOP" }, { key: "turn-oop", label: "TURN OOP" },
  { key: "river-oop", label: "RIVER OOP" }, { key: "flop-ip", label: "FLOP IP" },
  { key: "turn-ip", label: "TURN IP" }, { key: "river-ip", label: "RIVER IP" },
];

const label = "block text-[10px] uppercase tracking-widest text-muted/60 pb-1";
const input =
  "w-full bg-panel2/60 border border-line rounded-md px-2 py-1.5 text-[12.5px] text-txt outline-none focus:border-accent/60";

const RANKS = "AKQJT98765432";
const SUITS = "shdc";

// ---- range thumbnail: 13x13 heat map of class/combo:freq text ----
function RangeThumb({ raw }: { raw: string }) {
  const w: Record<string, number> = {};
  let ok = false;
  for (const entry of raw.split(/[,\s]+/).filter(Boolean)) {
    const [cls, f] = entry.split(":");
    if (!cls) continue;
    let c = cls;
    if (cls.length === 4) {
      // raw combo -> its class cell
      const hi = cls[0] < cls[2] ? cls : cls.slice(2) + cls.slice(0, 2);
      const r1 = hi[0], r2 = hi[2];
      const suited = hi[1] === hi[3];
      c = r1 === r2 ? r1 + r2 : r1 + r2 + (suited ? "s" : "o");
    }
    if (ALL_CLASSES.includes(c)) { w[c] = Math.max(w[c] ?? 0, f === undefined ? 1 : parseFloat(f) || 0); ok = true; }
  }
  if (!ok) return <div className="w-[60px] h-[60px] rounded border border-line bg-panel2/40" />;
  return (
    <div className="w-[60px] h-[60px] grid grid-cols-13 gap-px rounded border border-line overflow-hidden"
      style={{ gridTemplateColumns: "repeat(13, 1fr)" }}>
      {ALL_CLASSES.map((cls) => {
        const v = w[cls] ?? 0;
        return (
          <div key={cls} style={{ background: v > 0 ? `rgba(0,240,255,${0.15 + v * 0.85})` : undefined }}
            className="bg-panel2/60" />
        );
      })}
    </div>
  );
}

function SizingBox({ title, box, onChange }: {
  title: string; box: { bet: string[]; raise: string[] };
  onChange: (b: { bet: string[]; raise: string[] }) => void;
}) {
  const [kind, setKind] = useState<"bet" | "raise" | null>(null);
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim().replace(/%$/, "");
    if (!v) { setKind(null); return; }
    onChange({ ...box, [kind!]: [...box[kind!], v] });
    setDraft(""); setKind(null);
  };
  const remove = (k: "bet" | "raise", i: number) =>
    onChange({ ...box, [k]: box[k].filter((_, x) => x !== i) });
  const clone = () =>
    onChange({ bet: [...box.bet], raise: [...box.raise] });

  const row = (k: "bet" | "raise", title2: string, red: boolean) => (
    <div className="pb-1.5">
      <span className="block text-[9px] text-muted/60 pb-0.5">{title2} size</span>
      <div className="flex gap-1 items-center flex-wrap">
        {box[k].map((s, i) => (
          <span key={i}
            className={`px-1.5 py-px rounded text-[9.5px] font-bold text-white/90 cursor-pointer ${red ? "bg-red-500/80" : "bg-accent/80"}`}
            onClick={() => remove(k, i)} title="remove">
            {s}% ✕
          </span>
        ))}
        <button onClick={() => { setKind(k); setDraft(""); }}
          className="px-1.5 py-px border border-line rounded text-[9.5px] text-muted hover:text-txt cursor-pointer">+ Add</button>
      </div>
      {kind === k && (
        <div className="flex gap-1 pt-1">
          <input autoFocus className={input + " py-0.5 text-[11px]"} value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()} placeholder="e.g. 60" />
          <button onClick={add}
            className="px-2 border border-line rounded text-[10px] text-txt cursor-pointer">add</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="border border-line rounded-lg p-2 bg-panel2/30">
      <div className="flex items-center justify-between pb-1.5">
        <span className="text-[11px] font-bold text-txt">{title}</span>
        <button onClick={clone} title="duplicate to the IP/OOP counterpart"
          className="text-[9px] text-muted hover:text-txt cursor-pointer border border-line rounded px-1.5 py-px">clone</button>
      </div>
      {row("bet", "Bet", false)}
      {row("raise", "Raise", true)}
    </div>
  );
}

export function SetupView({
  setup, setSetup, connected, busy, progress, onSolve,
}: {
  setup: SpotSetup; setSetup: (s: SpotSetup) => void;
  connected: boolean; busy: boolean;
  progress: null | { phase: "compile" | "solve" | "results"; pct: number;
    iters: number; active: number; budget: number };
  onSolve: () => void;
}) {
  const [pasteSide, setPasteSide] = useState<"oop" | "ip" | null>(null);
  const [editBoard, setEditBoard] = useState(false);
  const [slot, setSlot] = useState(0);
  const [pasteBuf, setPasteBuf] = useState("");
  const [tab, setTab] = useState<"tree" | "advanced">("tree");
  const [mode, setMode] = useState({ quick: false, tournament: true });
  const [presets, setPresets] = useState<{ name: string; setup: SpotSetup }[]>(() => {
    try { return JSON.parse(localStorage.getItem("solver-presets") ?? "[]"); } catch { return []; }
  });

  const setBoardCard = (card: string) => {
    const cards = setup.board.match(/.{2}/g) ?? [];
    cards[slot] = card;
    setSetup({ ...setup, board: cards.slice(0, 3).join("") });
    setSlot((s) => (s + 1) % 3);
  };

  const applyPaste = () => {
    const v = pasteBuf.trim();
    if (rangeShare(v) === null) return;
    setSetup({ ...setup, [pasteSide === "oop" ? "oopRange" : "ipRange"]: v });
    setPasteSide(null);
  };

  const savePreset = () => {
    const name = `${setup.stack}bb · ${setup.board}`;
    const next = [...presets.filter((p) => p.name !== name), { name, setup }];
    setPresets(next);
    localStorage.setItem("solver-presets", JSON.stringify(next));
  };

  const oopShare = setup.oopRange.trim() ? rangeShare(setup.oopRange) : null;
  const ipShare = setup.ipRange.trim() ? rangeShare(setup.ipRange) : null;

  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* top row: flop / ranges / stacks & table */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line bg-panel p-3">
            <div className={label}>Flop</div>
            <div className="flex justify-center pb-2"><Board cards={setup.board} size="sm" /></div>
            <button onClick={() => setEditBoard(!editBoard)}
              className="w-full py-1 bg-panel2/60 border border-line rounded text-[10.5px] text-muted hover:text-txt cursor-pointer">
              {editBoard ? "done" : "Edit flop"}
            </button>
            {editBoard && (
              <div className="pt-2 grid grid-cols-4 gap-0.5">
                {[0, 1, 2].map((i) => (
                  <button key={i} onClick={() => setSlot(i)}
                    className={`py-1 rounded text-[10px] cursor-pointer border ${slot === i ? "border-accent text-accent" : "border-line text-muted"}`}>
                    {setup.board.slice(i * 2, i * 2 + 2) || "—"}
                  </button>
                ))}
                {RANKS.split("").flatMap((r) =>
                  SUITS.split("").map((s) => {
                    const card = r + s;
                    const used = setup.board.includes(card);
                    return (
                      <button key={card} disabled={used} onClick={() => setBoardCard(card)}
                        className={`py-0.5 rounded text-[9px] font-mono cursor-pointer ${used ? "text-muted/30" : "text-txt hover:bg-panel2"}`}>
                        {card}
                      </button>
                    );
                  }),
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-panel p-3">
            <div className={label}>Starting ranges</div>
            <div className="flex justify-around pt-1">
              {(["oop", "ip"] as const).map((side) => {
                const share = side === "oop" ? oopShare : ipShare;
                return (
                  <div key={side} className="text-center">
                    <RangeThumb raw={side === "oop" ? setup.oopRange : setup.ipRange} />
                    <div className="text-[9.5px] font-bold text-muted pt-1">
                      {side.toUpperCase()} {share === null ? "—" : `${(share * 100).toFixed(0)}%`}
                    </div>
                    <button onClick={() => { setPasteSide(side); setPasteBuf(side === "oop" ? setup.oopRange : setup.ipRange); }}
                      className="w-full mt-1 py-0.5 bg-panel2/60 border border-line rounded text-[9.5px] text-muted hover:text-txt cursor-pointer">
                      Paste
                    </button>
                  </div>
                );
              })}
            </div>
            {pasteSide && (
              <div className="pt-2">
                <textarea value={pasteBuf} onChange={(e) => setPasteBuf(e.target.value)}
                  className={input + " h-16 font-mono text-[10.5px]"}
                  placeholder="class or combo weights — AA:1, AKs:0.5, AsKd:0.25 — the copy button output from any range grid" />
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9.5px] text-muted">
                    {rangeShare(pasteBuf) === null ? "invalid" : `${(rangeShare(pasteBuf)! * 100).toFixed(1)}% of hands`}
                  </span>
                  <button onClick={applyPaste}
                    className="ml-auto px-2 py-0.5 border border-line rounded text-[10px] text-txt hover:border-accent/60 cursor-pointer">apply</button>
                  <button onClick={() => setPasteSide(null)}
                    className="px-2 py-0.5 border border-line rounded text-[10px] text-muted cursor-pointer">cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-panel p-3">
            <div className={label}>Stacks &amp; table</div>
            <div className="flex gap-2">
              <div className="w-24 flex flex-col gap-1">
                {["25", "50", "100"].map((bb) => (
                  <button key={bb} onClick={() => setSetup({ ...setup, stack: bb })}
                    className={`py-1 rounded text-[10px] cursor-pointer border ${setup.stack === bb ? "border-accent text-accent" : "border-line text-muted hover:text-txt"}`}>
                    {bb}BB
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <div className="relative h-[75px] rounded-[40px] bg-[#1b5e20] border-4 border-[#3e2723] flex items-center justify-center">
                  <span className="text-white font-bold text-[11px]">Pot: {setup.pot}</span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 px-1.5 py-px rounded bg-panel2 text-[8.5px] text-txt border border-line">
                    OOP<br />{setup.stack}
                  </span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-px rounded bg-panel2 text-[8.5px] text-txt border border-line">
                    IP<br />{setup.stack}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                  <input className={input + " py-1 text-[11px]"} value={setup.pot}
                    onChange={(e) => setSetup({ ...setup, pot: e.target.value })} title="pot (bb)" />
                  <input className={input + " py-1 text-[11px]"} value={setup.stack}
                    onChange={(e) => setSetup({ ...setup, stack: e.target.value })} title="effective stack (bb)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* tree settings */}
        <div className="rounded-xl border border-line bg-panel p-3">
          <div className="flex gap-1.5 pb-2 border-b border-line">
            {(["tree", "advanced"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer border ${tab === t ? "text-accent border-accent/50" : "text-muted border-transparent hover:text-txt"}`}>
                {t === "tree" ? "Tree settings" : "Advanced"}
              </button>
            ))}
          </div>
          {tab === "tree" ? (
            <div className="grid grid-cols-3 gap-2 pt-2">
              {SIZING_BOXES.map(({ key, label: l }) => (
                <SizingBox key={key} title={l} box={setup.sizings[key]}
                  onChange={(b) => setSetup({ ...setup, sizings: { ...setup.sizings, [key]: b } })} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 max-w-md">
              <div>
                <span className="text-[10px] text-muted/60">Solve time (s)</span>
                <input className={input} value={setup.seconds}
                  onChange={(e) => setSetup({ ...setup, seconds: e.target.value })} />
              </div>
              <div className="text-[10.5px] text-muted/60 pt-4">
                Accuracy, rake and queueing land here when the bridge grows them.
              </div>
            </div>
          )}
        </div>

        {/* tree preview placeholder (matches the mockup) */}
        <div className="rounded-xl border border-line bg-panel p-3">
          <div className={label}>Tree preview &amp; editor</div>
          <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-line text-[11px] text-muted/50">
            The tree preview is not available with automatic betting settings enabled.
          </div>
        </div>
      </div>

      {/* sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-3">
        <div className="rounded-xl border border-line bg-panel p-2.5">
          <div className="flex border border-line rounded overflow-hidden mb-1.5">
            {["Quick", "Advanced"].map((m, i) => (
              <button key={m} onClick={() => setMode({ ...mode, quick: i === 0 })}
                className={`flex-1 py-1 text-[10px] font-semibold cursor-pointer ${mode.quick === (i === 0) ? "bg-accent text-dark" : "text-muted hover:text-txt"}`}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex border border-line rounded overflow-hidden">
            {["Cash", "Tournament"].map((m, i) => (
              <button key={m} onClick={() => setMode({ ...mode, tournament: i === 1 })}
                className={`flex-1 py-1 text-[10px] font-semibold cursor-pointer ${mode.tournament === (i === 1) ? "bg-orange-500/90 text-white" : "text-muted hover:text-txt"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-2.5">
          <button disabled title="import a played hand — coming"
            className="w-full py-1.5 bg-panel2/60 border border-line rounded text-[11px] font-bold text-muted/60 cursor-not-allowed">
            Paste hand
          </button>
        </div>

        <div className="rounded-xl border border-line bg-panel p-2.5 flex-1">
          <div className="flex items-center justify-between pb-1.5">
            <span className={label + " pb-0"}>Saved presets</span>
            <button onClick={savePreset}
              className="text-[9.5px] text-muted hover:text-txt cursor-pointer border border-line rounded px-1.5 py-px">+ save</button>
          </div>
          <div className="flex gap-1 pb-2">
            {["25BB", "50BB", "100BB"].map((bb) => (
              <button key={bb} onClick={() => setSetup({ ...setup, stack: bb.replace("BB", "") })}
                className="px-1.5 py-px rounded bg-accent/15 text-accent text-[9px] font-bold cursor-pointer">
                {bb}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {presets.length === 0 && (
              <div className="text-[10px] text-muted/50">No presets yet — configure a spot and hit save.</div>
            )}
            {presets.map((p) => (
              <button key={p.name} onClick={() => setSetup(p.setup)}
                className="text-left border border-line rounded px-1.5 py-1 text-[10px] text-txt hover:border-accent/60 cursor-pointer bg-panel2/40 truncate">
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-2.5 text-center">
          <div className="text-[9.5px] text-muted/60 pb-1.5">
            {connected ? "bridge connected" : "bridge not connected — demo data"}
          </div>
          <button onClick={onSolve} disabled={busy}
            className="w-full py-2 rounded bg-green-600 text-white text-[13px] font-bold cursor-pointer hover:bg-green-500 disabled:opacity-50">
            {busy ? "CALCULATING" : "CALCULATE"}
          </button>
          {busy && (
            <div className="pt-2" data-testid="solve-progress">
              <div className="flex justify-between text-[9px] text-muted/70 pb-1">
                <span>
                  {progress?.phase === "compile" ? "compiling tree…"
                    : progress?.phase === "results" ? "loading results…"
                    : `solving · ${progress?.iters ?? 0} iters`}
                </span>
                <span>
                  {progress?.phase === "solve"
                    ? `${(progress.active).toFixed(0)}s / ${progress.budget}s`
                    : ""}
                </span>
              </div>
              <div className="h-1.5 rounded bg-panel2 border border-line overflow-hidden">
                <div data-testid="solve-progress-fill"
                  className={`h-full rounded ${progress?.phase === "solve" ? "bg-accent" : "bg-accent/40 animate-pulse"}`}
                  style={{ width: `${progress?.phase === "solve" ? Math.min(100, progress.pct) : 100}%` }} />
              </div>
            </div>
          )}
          <button disabled title="queueing — coming"
            className="w-full mt-1 py-1 bg-panel2/60 border border-line rounded text-[10px] text-muted/60 cursor-not-allowed">
            Add to queue
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupView;
