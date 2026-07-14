import React, { useMemo } from "react";

const RANKS = "AKQJT98765432";

const getHandCombination = (r1: string, r2: string, suited: boolean): string => {
  if (r1 === r2) return r1 + r2;
  const [rank1, rank2] = [r1, r2].sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b));
  return rank1 + rank2 + (suited ? "s" : "o");
};

const average = (values: number[]): number => {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
};

const getColorForEquity = (equity: number): string => {
  return `rgb(${Math.floor((1 - equity) * 255)}, ${Math.floor(equity * 255)}, 0)`;
};

const getColorForEV = (ev: number): string => {
  const normalized = Math.max(-1, Math.min(1, ev));
  return `rgb(${Math.floor((normalized + 1) / 2 * 255)}, ${Math.floor((1 - Math.abs(normalized)) / 2 * 255)}, ${Math.floor((1 - normalized) / 2 * 255)})`;
};

const getColorForRange = (percentage: number): string => {
  return `rgba(59, 130, 246, ${percentage / 100})`;
};

export const actionColor = (action: string, availableActions: string[]): string => {
  if (action === "Fold") return "#6b6b7a";
  if (action === "Check") return "#22c55e";
  if (action === "Call") return "#14b8a6";
  if (action.includes("AllIn")) return "#7c3aed";

  const betActions = availableActions.filter(a => a.startsWith("Bet(") || a.startsWith("Raise("));
  if (betActions.length === 0) return "#60a5fa";

  const getSize = (action: string): number => {
    const match = action.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sizes = betActions.map(getSize).sort((a, b) => a - b);
  const actionSize = getSize(action);
  const index = sizes.indexOf(actionSize);

  if (betActions.length === 1) return "#60a5fa";
  if (betActions.length === 2) return index === 0 ? "#60a5fa" : "#3b82f6";
  if (betActions.length >= 3) {
    if (index === 0) return "#60a5fa";
    if (index === betActions.length - 1) return "#1d4ed8";
    return "#3b82f6";
  }

  return "#60a5fa";
};

export const getActionShortLabel = (action: string): string => {
  if (action === "Fold") return "Fold";
  if (action === "Check") return "Check";
  if (action === "Call") return "Call";
  if (action.includes("AllIn")) return "AllIn";

  const match = action.match(/(\w+)\d+/);
  return match ? match[1] : action;
};

export const HandGrid = ({
  data,
  view,
  player,
}: {
  data: {
    strategy?: Record<string, Record<string, number>>;
    equity?: Record<string, number>;
    ev?: Record<string, number>;
    range?: Record<string, number>;
  };
  view: "strategy" | "equity" | "ev" | "range";
  player?: string;
}) => {
  const grid = useMemo(() => {
    const result: Record<string, {
      hands: string[];
      values: number[];
      actions?: Record<string, number>;
    }> = {};

    if (view === "strategy" && data.strategy) {
      for (const [hand, actions] of Object.entries(data.strategy)) {
        const r1 = hand[0];
        const r2 = hand[2];
        const suited = hand[1] === hand[3];
        const combo = getHandCombination(r1, r2, suited);
        
        if (!result[combo]) {
          result[combo] = { hands: [], values: [], actions: {} };
        }
        result[combo].hands.push(hand);
        
        for (const [action, freq] of Object.entries(actions)) {
          result[combo].actions![action] = (result[combo].actions![action] || 0) + freq;
        }
      }
    } else if (view === "equity" && data.equity) {
      for (const [hand, equity] of Object.entries(data.equity)) {
        const r1 = hand[0];
        const r2 = hand[2];
        const suited = hand[1] === hand[3];
        const combo = getHandCombination(r1, r2, suited);
        
        if (!result[combo]) {
          result[combo] = { hands: [], values: [] };
        }
        result[combo].hands.push(hand);
        result[combo].values.push(equity);
      }
    } else if (view === "ev" && data.ev) {
      for (const [hand, ev] of Object.entries(data.ev)) {
        const r1 = hand[0];
        const r2 = hand[2];
        const suited = hand[1] === hand[3];
        const combo = getHandCombination(r1, r2, suited);
        
        if (!result[combo]) {
          result[combo] = { hands: [], values: [] };
        }
        result[combo].hands.push(hand);
        result[combo].values.push(ev);
      }
    } else if (view === "range" && data.range) {
      for (const [hand, percentage] of Object.entries(data.range)) {
        const r1 = hand[0];
        const r2 = hand[2];
        const suited = hand[1] === hand[3];
        const combo = getHandCombination(r1, r2, suited);
        
        if (!result[combo]) {
          result[combo] = { hands: [], values: [] };
        }
        result[combo].hands.push(hand);
        result[combo].values.push(percentage);
      }
    }

    const cells = [];
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 13; j++) {
        const r1 = RANKS[i];
        const r2 = RANKS[j];
        const combo = getHandCombination(r1, r2, i <= j);
        const cellData = result[combo];
        const isEmpty = !cellData;

        let content;
        let title = combo;

        if (cellData) {
          if (view === "strategy" && cellData.actions) {
            const total = Object.values(cellData.actions).reduce((a, b) => a + b, 0);
            const actions = Object.entries(cellData.actions);
            const availableActions = Object.keys(data.strategy || {}).flatMap(h => Object.keys(data.strategy![h]));

            if (total > 0) {
              const segments = actions.map(([action, freq]) => ({
                action,
                freq,
                percentage: (freq / total) * 100,
                color: actionColor(action, availableActions),
              }));

              const dominantAction = actions.sort((a, b) => b[1] - a[1])[0];
              const dominantPercentage = (dominantAction[1] / total) * 100;

              title = `${combo}: ${actions.map(([a, f]) => `${a}: ${((f / total) * 100).toFixed(1)}%`).join(", ")}`;

              content = (
                <>
                  <span className="hand-label">{combo}</span>
                  <div className="bar-container">
                    {segments.map((segment, i) => (
                      <div
                        key={i}
                        className="bar-segment"
                        style={{ backgroundColor: segment.color, flex: segment.percentage }}
                        title={`${segment.action}: ${segment.percentage.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  {dominantPercentage > 50 && (
                    <span className="dominant-pct">{dominantPercentage.toFixed(0)}%</span>
                  )}
                </>
              );
            } else {
              content = <span className="hand-label">{combo}</span>;
            }
          } else if (view === "equity") {
            const avgEquity = average(cellData.values);
            const color = getColorForEquity(avgEquity);
            const equityText = `${(avgEquity * 100).toFixed(1)}%`;
            
            title = `${combo}: ${cellData.hands.map(h => `${h}: ${((data.equity?.[h] ?? 0) * 100).toFixed(1)}%`).join(", ")}`;
            
            content = (
              <div className="value-cell" style={{ backgroundColor: color, color: avgEquity > 0.5 ? "#000" : "#fff" }}>
                {equityText}
              </div>
            );
          } else if (view === "ev") {
            const avgEV = average(cellData.values);
            const color = getColorForEV(avgEV);
            const evText = avgEV >= 0 ? `+${avgEV.toFixed(1)}` : avgEV.toFixed(1);
            
            title = `${combo}: ${cellData.hands.map(h => `${h}: ${(data.ev?.[h] ?? 0).toFixed(3)}`).join(", ")}`;
            
            content = (
              <div className="value-cell" style={{ backgroundColor: color }}>
                {evText}
              </div>
            );
          } else if (view === "range") {
            const avgPercentage = average(cellData.values);
            const color = getColorForRange(avgPercentage);
            const percentageText = `${avgPercentage.toFixed(1)}%`;
            
            title = `${combo}: ${cellData.hands.map(h => `${h}: ${(data.range?.[h] ?? 0).toFixed(1)}%`).join(", ")}`;
            
            content = (
              <div className="value-cell" style={{ backgroundColor: color }}>
                {percentageText}
              </div>
            );
          }
        } else {
          content = <span className="hand-label">{combo}</span>;
        }

        cells.push(
          <div key={`${i}-${j}`} className={`cell ${isEmpty ? "empty" : ""}`} title={title}>
            {content}
          </div>
        );
      }
    }

    return cells;
  }, [data, view, player]);

  return (
    <div className="hand-grid-container">
      <div className="grid-wrapper">
        <div className="grid">{grid}</div>
        <div className="y-labels">
          {RANKS.split("").map((rank, i) => (
            <div key={i} className="label">{rank}</div>
          ))}
        </div>
        <div className="x-labels">
          {RANKS.split("").map((rank, i) => (
            <div key={i} className="label">{rank}</div>
          ))}
        </div>
      </div>
    </div>
  );
};