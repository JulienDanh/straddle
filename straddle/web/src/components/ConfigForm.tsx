import React, { useState, useMemo } from "react";
import { createSolver } from "../api";
import PlayingCard from "./PlayingCard";

const suitSymbols = {
  c: { symbol: "♣", color: "#1a1a1a" },
  d: { symbol: "♦", color: "#e63946" },
  h: { symbol: "♥", color: "#e63946" },
  s: { symbol: "♠", color: "#1a1a1a" },
};

const PlayingCardMini = ({ card }: { card: string }) => {
  const rank = card[0];
  const suit = suitSymbols[card[1].toLowerCase() as keyof typeof suitSymbols] || suitSymbols.s;
  return (
    <div
      style={
        {
          width: "28px",
          height: "38px",
          background: "#ffffff",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }
      }
    >
      <span style={{ position: "absolute", top: 2, left: 2, fontSize: 10, fontWeight: "bold", color: "#171723" }}>
        {rank}
      </span>
      <span style={{ fontSize: 14, color: suit.color }}>{suit.symbol}</span>
    </div>
  );
};

const parseBoardInput = (input: string): { cards: string[]; error: string | null } => {
  const cleaned = input.replace(/\s+/g, "");
  const cards = [];
  const seen = new Set();
  const validRanks = "23456789TJQKA";
  const validSuits = "cdhs";

  if (cleaned.length % 2 !== 0) {
    return { cards: [], error: "Invalid input: Must be pairs of rank and suit (e.g., Td9d6h)." };
  }

  for (let i = 0; i < cleaned.length; i += 2) {
    if (i + 1 >= cleaned.length) break;
    const card = cleaned.slice(i, i + 2);
    const rank = card[0].toUpperCase();
    const suit = card[1].toLowerCase();

    if (!validRanks.includes(rank)) {
      return { cards: [], error: `Invalid rank: '${card[0]}'. Must be one of 2-9, T, J, Q, K, A.` };
    }
    if (!validSuits.includes(suit)) {
      return { cards: [], error: `Invalid suit: '${card[1]}'. Must be one of c, d, h, s.` };
    }
    if (seen.has(card)) {
      return { cards: [], error: `Duplicate card: '${card}'.` };
    }
    seen.add(card);
    cards.push(card);
  }

  if (cards.length > 5) {
    return { cards: cards.slice(0, 5), error: "Too many cards: Maximum 5 cards allowed." };
  }

  return { cards, error: null };
};

export const ConfigForm = ({ onCreated }: { onCreated: (id: string) => void }) => {
  const [oopRange, setOopRange] = useState("66+,A8s+");
  const [ipRange, setIpRange] = useState("QQ-22,ATo+");
  const [board, setBoard] = useState("Td9d6h");
  const [startingPot, setStartingPot] = useState(200);
  const [effectiveStack, setEffectiveStack] = useState(900);
  const [betSizes, setBetSizes] = useState("60%, e, a");
  const [raiseSizes, setRaiseSizes] = useState("2.5x");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { cards: boardCards, error: boardError } = useMemo(() => parseBoardInput(board), [board]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (boardError) {
      setError(boardError);
      return;
    }
    setIsCreating(true);
    try {
      const id = await createSolver({
        oop_range: oopRange,
        ip_range: ipRange,
        board,
        starting_pot: startingPot,
        effective_stack: effectiveStack,
        bet_sizes: betSizes || undefined,
        raise_sizes: raiseSizes || undefined,
      });
      onCreated(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form className="config-form" onSubmit={handleSubmit}>
      <h2>New Spot</h2>
      {error && <div className="error">{error}</div>}
      <div className="section">
        <div className="section-title">Ranges</div>
        <div className="row">
          <label>
            <span>OOP Range</span>
            <input
              type="text"
              value={oopRange}
              onChange={(e) => setOopRange(e.target.value)}
              placeholder="e.g. 66+,A8s+"
            />
          </label>
          <label>
            <span>IP Range</span>
            <input
              type="text"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="e.g. QQ-22,ATo+"
            />
          </label>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Board</div>
        <label>
          <span>Board Cards</span>
          <input
            type="text"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            placeholder="e.g. Td9d6h"
          />
          {boardCards.length > 0 && (
            <div className="card-preview">
              {boardCards.map((card, i) => (
                <PlayingCardMini key={i} card={card} />
              ))}
              {Array.from({ length: Math.max(0, 5 - boardCards.length) }).map((_, i) => (
                <div key={`ph-${i}`} style={{ width: 28, height: 38, background: "rgba(255,255,255,0.1)", borderRadius: 4, border: "1px dashed #444" }} />
              ))}
            </div>
          )}
        </label>
      </div>
      <div className="section">
        <div className="section-title">Stacks & Pot</div>
        <div className="row">
          <label>
            <span>Starting Pot</span>
            <input
              type="number"
              value={startingPot}
              onChange={(e) => setStartingPot(Number(e.target.value))}
              min="1"
            />
          </label>
          <label>
            <span>Effective Stack</span>
            <input
              type="number"
              value={effectiveStack}
              onChange={(e) => setEffectiveStack(Number(e.target.value))}
              min="1"
            />
          </label>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Bet Sizing</div>
        <div className="row">
          <label>
            <span>Bet Sizes</span>
            <input
              type="text"
              value={betSizes}
              onChange={(e) => setBetSizes(e.target.value)}
              placeholder="e.g. 60%, e, a"
            />
          </label>
          <label>
            <span>Raise Sizes</span>
            <input
              type="text"
              value={raiseSizes}
              onChange={(e) => setRaiseSizes(e.target.value)}
              placeholder="e.g. 2.5x"
            />
          </label>
        </div>
      </div>
      <button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Solver"}
      </button>
    </form>
  );
};