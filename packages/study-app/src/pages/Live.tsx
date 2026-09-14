// Live — a four-row cascading navigation that mirrors the decision flow at
// the table: position -> line -> solution type -> stack depth. Each row
// only shows what exists for the selections above it. The stack depth
// lives inside the RangeBrowser's own ladder — not duplicated here.
import { useEffect, useMemo, useState } from "react";
import { RangeBrowser } from "@poker/design-system/src/components/RangeBrowser";
import type { StoredRange } from "@poker/design-system/src/data/ranges";
import { ALL_ITEMS } from "../data/library";

// ---- derive position and line label from a NavItem's id ----
// id patterns: 'utg' (RFI), 'utg-vs-3bet-hj' (opener facing 3-bet),
// 'sb-vs-btn' (defender), 'bb-vs-sb-limp', 'bb-vs-sb-raise'
const SEATS = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"] as const;
const short = (s: string) => s.replace("UTG+1", "UTG1");

function heroOf(id: string): string {
  // hero is the prefix before the first '-vs-'
  const hero = id.split("-vs-")[0];
  if (hero === "utg1") return "UTG+1";
  if (hero === "sb-rfi") return "SB";
  return hero.toUpperCase();
}

function lineLabelOf(id: string): string {
  const rest = id.split("-vs-")[1] ?? "";
  if (!rest) return "RFI";
  if (rest === "sb-limp") return "vs limp";
  if (rest === "sb-raise") return "vs raise";
  if (rest.startsWith("3bet-")) {
    const villain = rest.slice("3bet-".length);
    return `vs ${short(villain.toUpperCase())} 3bet`;
  }
  return `vs ${short(rest.toUpperCase())}`;
}

// ---- line groups: every line classifies into exactly one of the three
// tables you can face — your own open, someone else's open, or a 3-bet
const lineGroupOf = (id: string): "rfi" | "vs-open" | "vs-3bet" =>
  id.includes("-vs-3bet-")
    ? "vs-3bet"
    : id.includes("-vs-")
      ? "vs-open"
      : "rfi";

const LINE_GROUPS: { id: ReturnType<typeof lineGroupOf>; label: string }[] = [
  { id: "rfi", label: "RFI" },
  { id: "vs-open", label: "vs open" },
  { id: "vs-3bet", label: "vs 3bet" },
];

// ---- level 2: group items by hero position ----
const BY_POSITION: Record<string, typeof ALL_ITEMS> = (() => {
  const map: Record<string, typeof ALL_ITEMS> = {};
  for (const it of ALL_ITEMS) {
    const h = heroOf(it.id);
    if (!map[h]) map[h] = [];
    map[h].push(it);
  }
  return map;
})();

const POSITIONS = SEATS.filter((p) => BY_POSITION[p]);

// ---- level 3: solution types available for an item ----
const typesOf = (ranges: StoredRange[]): string[] => [
  ...new Set(ranges.map((r) => r.type)),
];

const typeLabel = (t: string): string => {
  if (t === "cEV") return "ChipEV";
  if (t === "ICM") return "ICM";
  if (t.startsWith("ICM-FT")) return "FT";
  if (t === "ICM-covering") return "covering";
  if (t === "ICM-covered-deep") return "covered";
  if (t === "ICM-covered-similar") return "covered~";
  return t.replace(/^ICM-/, "");
};

// the covered/covering definition, shown as the chip tooltip — mirrors
// the SolutionType union spec and the pipeline's derive_type rule
const typeHelp = (t: string): string => {
  const ft = t.startsWith("ICM-FT") ? " Final-table payouts." : "";
  if (t === "cEV") return "Chip-EV — no tournament pressure.";
  if (t === "ICM" || t === "ICM-FT") return "Equal stacks — bubble pressure." + ft;
  const cov = t.endsWith("covering");
  if (cov)
    return (
      "You cover them — no stack still in the hand (the villain and anyone behind you) is bigger than yours." +
      ft
    );
  const deep = t.endsWith("covered-deep");
  return deep
    ? "They cover you (deep) — the biggest stack in the hand over yours is at least 1.75x yours (3x+ is \"by heaps\")." + ft
    : "They cover you (similar) — the biggest stack in the hand over yours is under 1.75x yours: close enough to fight." + ft;
};

// ---- hash type slugs — same convention as RangeBrowser's hash writes
// (lowercase, spaces as dashes), so either control's hash restores in both
const typeSlug = (t: string) => t.toLowerCase().replace(/\s+/g, "-");
const typeFromSlug = (ts: string[], slug: string): string | null =>
  slug ? (ts.find((t) => typeSlug(t) === slug) ?? null) : null;

// ---- styling ----
const chip = (active: boolean, dim?: boolean) =>
  `px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer border transition-colors select-none whitespace-nowrap ${
    active
      ? "bg-accent text-dark border-accent"
      : dim
        ? "text-muted/50 border-transparent cursor-default"
        : "text-txt/80 bg-panel2/60 border-transparent hover:bg-panel2 hover:text-txt"
  }`;

export function LivePage() {
  // four-level state, each derived from the level above
  const [position, setPosition] = useState<string>(() => {
    const h = window.location.hash.split("/")[2];
    if (h && ALL_ITEMS.some((i) => i.id === h)) return heroOf(h);
    return "BB";
  });
  const items = BY_POSITION[position] ?? [];

  const [lineId, setLineId] = useState<string>(() => {
    const h = window.location.hash.split("/")[2];
    if (h) {
      const it = ALL_ITEMS.find((i) => i.id === h);
      if (it) return it.id;
    }
    return "bb-vs-btn";
  });

  const item =
    ALL_ITEMS.find((i) => i.id === lineId) ?? items[0] ?? ALL_ITEMS[0];
  const types = useMemo(() => typesOf(item.ranges), [item]);
  const [type, setType] = useState<string>(
    () =>
      typeFromSlug(types, window.location.hash.split("/")[4] ?? "") ??
      (types.includes("cEV") ? "cEV" : types[0]),
  );
  const activeType = types.includes(type)
    ? type
    : types.includes("cEV")
      ? "cEV"
      : types[0];
  // hash persistence: #live/<lineId>/0/<type>
  const writeHash = (line: string, st: number, ty: string) => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#live/${line}/${st}/${typeSlug(ty)}`,
    );
  };

  const pickPosition = (p: string) => {
    setPosition(p);
    const first = BY_POSITION[p]?.[0];
    if (first) {
      setLineId(first.id);
      const ts = typesOf(first.ranges);
      const t = ts.includes("cEV") ? "cEV" : ts[0];
      setType(t);
      writeHash(first.id, 0, t);
    }
  };

  const pickLine = (id: string) => {
    setLineId(id);
    const it = ALL_ITEMS.find((i) => i.id === id);
    if (it) {
      const ts = typesOf(it.ranges);
      const t = ts.includes(activeType)
        ? activeType
        : ts.includes("cEV")
          ? "cEV"
          : ts[0];
      setType(t);
      writeHash(id, 0, t);
    }
  };

  const pickType = (t: string) => {
    setType(t);
    writeHash(item.id, 0, t);
  };

  // restore from hash on mount
  useEffect(() => {
    const onHash = () => {
      if (!window.location.hash.startsWith("#live/")) return;
      const [, , line, , ty] = window.location.hash.split("/");
      if (!line || !ALL_ITEMS.some((i) => i.id === line)) return;
      setLineId(line);
      setPosition(heroOf(line));
      const it = ALL_ITEMS.find((i) => i.id === line)!;
      const t = typeFromSlug(typesOf(it.ranges), ty ?? "");
      if (t) setType(t);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="flex gap-5 items-stretch h-full min-h-0">
      <nav className="w-52 shrink-0 rounded-xl border border-line bg-panel pb-3 overflow-y-auto">
        <div className="px-2.5 pt-3 pb-1">
          <div className="text-[9.5px] uppercase tracking-widest text-muted/60 pb-1">
            Seat
          </div>
          <div className="flex flex-wrap gap-0.5">
            {POSITIONS.map((p) => (
              <button
                key={p}
                onClick={() => pickPosition(p)}
                className={chip(position === p)}
              >
                {short(p)}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2.5 pt-3 pb-1">
          <div className="text-[9.5px] uppercase tracking-widest text-muted/60 pb-1">
            Line
          </div>
          {LINE_GROUPS.map((g) => {
            const its = items.filter((it) => lineGroupOf(it.id) === g.id);
            if (its.length === 0) return null;
            return (
              <div key={g.id} className="pb-1.5">
                <div className="text-[9px] uppercase tracking-wider text-muted/40 pb-0.5">
                  {g.label}
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {its.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => pickLine(it.id)}
                      className={chip(item.id === it.id)}
                    >
                      {lineLabelOf(it.id).replace(" 3bet", "")}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-2.5 pt-3 pb-1">
          <div className="text-[9.5px] uppercase tracking-widest text-muted/60 pb-1">
            Model
          </div>
          <div className="flex flex-wrap gap-0.5">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => pickType(t)}
                className={chip(activeType === t)}
                title={typeHelp(t)}
              >
                {typeLabel(t)}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="min-w-0 flex-1 flex flex-col min-h-0">
        <RangeBrowser
          key={`${item.id}-${activeType}`}
          ranges={item.ranges.filter((r) => r.type === activeType)}
          hashPrefix={`#live/${item.id}`}
          postflop={false}
          fill
        />
      </div>
    </div>
  );
}
