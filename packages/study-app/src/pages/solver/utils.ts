// Solver utils: range text parsing, UPI bridge client, made-hand
// classification on a board, and the demo solution data.
import { UPI_HANDS } from "@poker/design-system/src/components/RangeGrid";

export const SUITS = ["s", "h", "d", "c"];
const RANKS = "AKQJT98765432";

// ---- ranges ----
export function combosOfClass(cls: string): string[] {
  if (cls.length === 2) {
    const out: string[] = [];
    for (let i = 0; i < 4; i++)
      for (let j = i + 1; j < 4; j++) out.push(cls[0] + SUITS[i] + cls[0] + SUITS[j]);
    return out;
  }
  const hi = cls[0], lo = cls[1];
  if (cls[2] === "s") return SUITS.map((s) => hi + s + lo + s);
  const out: string[] = [];
  for (const a of SUITS) for (const b of SUITS) if (a !== b) out.push(hi + a + lo + b);
  return out;
}

const CLS_RE = /^[AKQJT2-9]{2}[so]?$/;

/** Validate class:freq text; returns the share of 1326 combos, or null. */
export function rangeShare(raw: string): number | null {
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
export function toUpiWeights(raw: string): string | null {
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

/** one 1326-float UPI line -> combo:freq string for a RangeGrid action. */
export function lineToCombos(line: string): string {
  const w = line.trim().split(/\s+/).map(Number);
  const out: string[] = [];
  for (let i = 0; i < UPI_HANDS.length; i++) {
    const f = Math.round((w[i] ?? 0) * 10000) / 10000;
    if (f > 0.00005) out.push(`${UPI_HANDS[i]}:${f}`);
  }
  return out.join(",");
}

/** total share (0-1) of a 1326-float UPI line. */
export const lineShare = (line: string) =>
  line.trim().split(/\s+/).reduce((s, x) => s + (parseFloat(x) || 0), 0) / 1326;

// ---- UPI bridge client (contract documented in Solver.tsx) ----
export async function upi(url: string, commands: string[]): Promise<string[]> {
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

// ---- made-hand categories on a 3-card board ----
export const CATEGORY_ORDER = [
  "Set", "Two Pair", "Overpair", "Top Pair", "2nd Pair", "3rd Pair",
  "Pocket Pair", "A-High", "Flush Draw", "OESD", "Gutshot", "Air",
] as const;

const runsOf = (ranks: number[]): number[][] => {
  // all 5-card windows containing the given ranks within AK..2 span
  const uniq = [...new Set(ranks)].sort((a, b) => b - a);
  const windows: number[][] = [];
  for (let top = 14; top >= 5; top--) {
    const w = [top, top - 1, top - 2, top - 3, top - 4];
    if (uniq.every((r) => w.includes(r))) windows.push(w);
  }
  return windows;
};

/** Classify a hand class on an unpaired 3-card board (flop). */
export function categorize(cls: string, board: string): string {
  const bRanks = [board[0], board[2], board[4]].map((r) => RANKS.indexOf(r));
  const bSuits = [board[1], board[3], board[5]];
  const sorted = [...bRanks].sort((a, b) => b - a);
  const top = sorted[0], second = sorted[1];

  if (cls.length === 2) {
    const r = RANKS.indexOf(cls[0]);
    if (bRanks.includes(r)) return "Set";
    return r > top ? "Overpair" : "Pocket Pair";
  }
  const hi = RANKS.indexOf(cls[0]), lo = RANKS.indexOf(cls[1]);
  const suited = cls[2] === "s";
  const matchesHi = bRanks.includes(hi);
  const matchesLo = bRanks.includes(lo);
  if (matchesHi && matchesLo) return "Two Pair";
  if (matchesHi) return hi === top ? "Top Pair" : hi === second ? "2nd Pair" : "3rd Pair";
  if (matchesLo) return lo === top ? "Top Pair" : lo === second ? "2nd Pair" : "3rd Pair";
  if (hi !== RANKS.indexOf("A")) {
    // draw check: straight draws with both hole cards live
    const windows = runsOf([hi, lo, ...bRanks]);
    if (windows.length >= 2) return "OESD";
    if (windows.length === 1) return "Gutshot";
  }
  if (suited && bSuits.includes(cls[1]) && bSuits.filter((s) => s === cls[1]).length >= 2)
    return "Flush Draw";
  if (hi === RANKS.indexOf("A")) return "A-High";
  return "Air";
}

/** Class -> all 169 class names (for strategy generation). */
export const ALL_CLASSES: string[] = (() => {
  const out: string[] = [];
  for (let i = 0; i < 13; i++)
    for (let j = 0; j < 13; j++) {
      if (i === j) out.push(RANKS[i] + RANKS[i]);
      else if (j > i) out.push(RANKS[i] + RANKS[j] + "s");
      else out.push(RANKS[j] + RANKS[i] + "o");
    }
  return out;
})();

// deterministic per-class jitter so demo grids look organic
const jitter = (cls: string) => {
  let h = 0;
  for (const c of cls) h = (h * 31 + c.charCodeAt(0)) % 1000;
  return ((h % 20) - 10) / 100; // -0.1..0.1
};

const cap = (x: number) => Math.max(0, Math.min(1, Math.round(x * 1000) / 1000));

/** category -> action frequencies for the demo solution (heuristic). */
const DEMO_ACTIONS: Record<string, Record<string, Record<string, number>>> = {
  // OOP (BB) c-bet frequencies on AsJd5c
  cbet: {
    Set: { bet: 0.9, check: 0.1 }, "Two Pair": { bet: 0.85, check: 0.15 },
    Overpair: { bet: 0.9, check: 0.1 }, "Top Pair": { bet: 0.7, check: 0.3 },
    "2nd Pair": { bet: 0.45, check: 0.55 }, "3rd Pair": { bet: 0.15, check: 0.85 },
    "Pocket Pair": { bet: 0.2, check: 0.8 }, "A-High": { bet: 0.6, check: 0.4 },
    "Flush Draw": { bet: 0.75, check: 0.25 }, OESD: { bet: 0.6, check: 0.4 },
    Gutshot: { bet: 0.5, check: 0.5 }, Air: { bet: 0.12, check: 0.88 },
  },
  // IP (UTG) vs a 75% pot bet on AsJd5c
  vsBet: {
    Set: { raise: 0.3, call: 0.7, fold: 0 }, "Two Pair": { raise: 0.25, call: 0.75, fold: 0 },
    Overpair: { raise: 0.2, call: 0.8, fold: 0 }, "Top Pair": { raise: 0.12, call: 0.85, fold: 0.03 },
    "2nd Pair": { raise: 0.04, call: 0.9, fold: 0.06 }, "3rd Pair": { raise: 0, call: 0.55, fold: 0.45 },
    "Pocket Pair": { raise: 0, call: 0.3, fold: 0.7 }, "A-High": { raise: 0.02, call: 0.33, fold: 0.65 },
    "Flush Draw": { raise: 0.15, call: 0.8, fold: 0.05 }, OESD: { raise: 0.1, call: 0.8, fold: 0.1 },
    Gutshot: { raise: 0.05, call: 0.65, fold: 0.3 }, Air: { raise: 0, call: 0.03, fold: 0.97 },
  },
};

/** Build the demo solution's strategy strings from category heuristics. */
export function demoStrategy(board: string, kind: "cbet" | "vsBet") {
  const out: Record<string, string> = {};
  for (const cls of ALL_CLASSES) {
    const cat = categorize(cls, board);
    const acts = DEMO_ACTIONS[kind][cat] ?? DEMO_ACTIONS[kind].Air;
    const j = jitter(cls);
    for (const [a, f] of Object.entries(acts)) {
      const v = cap(f + (a === "fold" ? 0 : j));
      if (v <= 0) continue;
      // expand to concrete combos — RangeGrid parses 4-char combo:freq
      for (const combo of combosOfClass(cls))
        out[a] = out[a] ? `${out[a]},${combo}:${v}` : `${combo}:${v}`;
    }
  }
  return out;
}
