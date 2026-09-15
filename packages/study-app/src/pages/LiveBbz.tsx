// Live BBZ — browse the BBZ (Pio) range store with the same navigation as
// the Live page: seat -> line -> solution type -> depth ladder, all inside
// the standard RangeBrowser. The store is generated from the scraped BBZ
// solutions by straddle-solutions/scripts/bbz_to_store.py (wizard schema)
// and lives at straddle-solutions/bbz/store/, served by the dev-only
// bbz-data middleware. The deploy ships a copy mirrored by the root
// `npm run sync-bbz` script into public/bbz/ (vite copies public/ into
// the build) — the notice below only shows if the store is genuinely
// missing (bad checkout, stale mirror).
import { useEffect, useMemo, useState } from "react";
import { RangeBrowser } from "@poker/design-system/src/components/RangeBrowser";
import {
  materializeLine,
  type StoredRange,
} from "@poker/design-system/src/data/ranges";

type LineManifest = {
  title: string;
  types: { type: string; subtitle: string; stacks: number[] }[];
};

const bbzUrl = (rel: string) => new URL(`bbz/${rel}`, document.baseURI).toString();

const SEATS = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"] as const;
const SEAT_SLUG = {
  UTG: "utg", "UTG+1": "utg1", LJ: "lj", HJ: "hj",
  CO: "co", BTN: "btn", SB: "sb", BB: "bb",
} as const;

// line slugs group into the same three tables as the Live page, plus the
// limped line
const lineGroup = (line: string) =>
  line === "rfi"
    ? "RFI"
    : line.startsWith("vs-3bet-")
      ? "vs 3bet"
      : line === "vs-sb-limp"
        ? "limped"
        : "vs open";

const GROUP_ORDER = ["RFI", "vs open", "vs 3bet", "limped"];

const chip = (active: boolean) =>
  `px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer border transition-colors select-none whitespace-nowrap ${
    active
      ? "bg-accent text-dark border-accent"
      : "text-txt/80 bg-panel2/60 border-transparent hover:bg-panel2 hover:text-txt"
  }`;

export function LiveBbzPage() {
  const [manifest, setManifest] = useState<Record<string, Record<string, LineManifest>> | null>(null);
  const [failed, setFailed] = useState(false);

  const [seat, setSeat] = useState<string>(() => {
    const s = window.location.hash.split("/")[1];
    return s && SEATS.includes(s as (typeof SEATS)[number]) ? s : "BB";
  });
  const slug = SEAT_SLUG[seat as keyof typeof SEAT_SLUG] ?? "bb";
  const lines = manifest?.[slug] ?? {};

  const [line, setLine] = useState<string>(() => window.location.hash.split("/")[2] ?? "");

  const [loading, setLoading] = useState(false);
  // line-file cache — refetch on a fresh dev session, never during browsing
  const cache = useMemo(() => new Map<string, StoredRange[]>(), []);

  useEffect(() => {
    fetch(bbzUrl("store/index.json"))
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setManifest)
      .catch(() => setFailed(true));
  }, []);

  // keep the line valid for the seat
  useEffect(() => {
    if (!manifest) return;
    const ls = Object.keys(lines);
    if (!ls.length) return;
    if (!line || !(line in lines)) setLine(ls[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, slug]);

  // load the line file when the selection changes
  useEffect(() => {
    if (!line || !(line in lines)) return;
    if (cache.has(`${slug}/${line}`)) return;
    setLoading(true);
    fetch(bbzUrl(`store/${slug}/${line}.json`))
      .then((r) => r.json())
      .then((d) => {
        cache.set(`${slug}/${line}`, materializeLine(d, () => ""));
        setLoading(false);
      })
      .catch(() => {
        setFailed(true);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, slug, line]);

  const ranges = line ? cache.get(`${slug}/${line}`) : undefined;

  const pickSeat = (s: string) => {
    setSeat(s);
    const first = Object.keys(manifest?.[SEAT_SLUG[s as keyof typeof SEAT_SLUG]] ?? {})[0] ?? "";
    setLine(first);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#live/${encodeURIComponent(s)}/${first}`,
    );
  };

  const pickLine = (l: string) => {
    setLine(l);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#live/${encodeURIComponent(seat)}/${l}`,
    );
  };

  if (failed) {
    return (
      <div className="max-w-xl m-auto pt-16 text-center">
        <div className="text-lg font-bold text-txt pb-2">BBZ data not available</div>
        <div className="text-[13px] text-muted">
          The BBZ range store could not be loaded. Regenerate it with{" "}
          <code>straddle-solutions/scripts/bbz_to_store.py</code> and mirror it for the deploy
          with <code>npm run sync-bbz</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-5 items-stretch h-full min-h-0">
      <nav className="w-52 shrink-0 rounded-xl border border-line bg-panel pb-3 overflow-y-auto">
        <div className="px-2.5 pt-3 pb-1">
          <div className="text-[9.5px] uppercase tracking-widest text-muted/60 pb-1">Seat</div>
          <div className="flex flex-wrap gap-0.5">
            {SEATS.filter((s) => manifest && Object.keys(manifest[SEAT_SLUG[s]]).length).map((s) => (
              <button key={s} className={chip(seat === s)} onClick={() => pickSeat(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2.5 pt-3 pb-1">
          <div className="text-[9.5px] uppercase tracking-widest text-muted/60 pb-1">Line</div>
          {GROUP_ORDER.map((g) => {
            const ls = Object.keys(lines).filter((l) => lineGroup(l) === g);
            if (!ls.length) return null;
            return (
              <div key={g} className="pb-1.5">
                <div className="text-[9px] uppercase tracking-wider text-muted/40 pb-0.5">{g}</div>
                <div className="flex flex-wrap gap-0.5">
                  {ls.map((l) => (
                    <button key={l} className={chip(line === l)} onClick={() => pickLine(l)}>
                      {lines[l].title.replace(seat + " ", "")}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
      <div className="min-w-0 flex-1 flex flex-col min-h-0">
        {loading && !ranges && (
          <div className="text-[13px] text-muted pt-8 text-center">Loading range…</div>
        )}
        {ranges && (
          <RangeBrowser
            key={`${slug}-${line}`}
            ranges={ranges}
            hashPrefix={`#live/${encodeURIComponent(seat)}/${line}`}
            postflop={false}
            fill
          />
        )}
      </div>
    </div>
  );
}

export default LiveBbzPage;
