import React from "react";

const suitSymbols = {
  c: { symbol: "♣", color: "#1a1a1a" },
  d: { symbol: "♦", color: "#e63946" },
  h: { symbol: "♥", color: "#e63946" },
  s: { symbol: "♠", color: "#1a1a1a" },
};

type PlayingCardProps = {
  card: string;
  size?: "normal" | "small" | "mini";
};

const PlayingCard = ({ card, size = "normal" }: PlayingCardProps) => {
  const rank = card[0];
  const suit = suitSymbols[card[1].toLowerCase() as keyof typeof suitSymbols] || suitSymbols.s;

  const sizes = {
    normal: { width: 38, height: 52, rankSize: 12, suitSize: 20 },
    small: { width: 28, height: 36, rankSize: 10, suitSize: 16 },
    mini: { width: 20, height: 28, rankSize: 8, suitSize: 12 },
  };

  const { width, height, rankSize, suitSize } = sizes[size] || sizes.normal;

  return (
    <div className={`playing-card playing-card-${size}`} style={{ width, height }}>
      <span className="card-rank" style={{ fontSize: rankSize }}>
        {rank}
      </span>
      <span
        className={`card-suit ${card[1].toLowerCase()}`}
        style={{ fontSize: suitSize, color: suit.color }}
      >
        {suit.symbol}
      </span>
    </div>
  );
};

export const CardPlaceholder = () => {
  return <div className="card-placeholder" />;
};

export const getStreetLabel = (board: string): string => {
  const cardCount = board.length / 2;
  if (cardCount >= 5) return "River";
  if (cardCount >= 4) return "Turn";
  if (cardCount >= 3) return "Flop";
  return "Preflop";
};

export default PlayingCard;