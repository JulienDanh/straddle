import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getSolver,
  deleteSolver,
  getStrategy,
  getEquity,
  getEV,
  getRange,
  playAction,
  backToRoot,
  backOneStep,
  gotoStep,
  getHistory,
  getPossibleCards,
  lockStrategy,
  unlockStrategy,
  solve,
  createSSE,
} from "../api";
import { HandGrid, actionColor, getActionShortLabel } from "./HandGrid";
import PlayingCard, { CardPlaceholder, getStreetLabel } from "./PlayingCard";

export default function SolverView({ id, onExit }: { id: string; onExit: () => void }) {
  const [solver, setSolver] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [actionPath, setActionPath] = useState<string[]>([]);
  const [view, setView] = useState<"strategy" | "equity" | "ev" | "range">("strategy");
  const [strategy, setStrategy] = useState<any>(null);
  const [equity, setEquity] = useState<any>(null);
  const [ev, setEv] = useState<any>(null);
  const [range, setRange] = useState<any>(null);
  const [possibleCards, setPossibleCards] = useState<string[]>([]);
  const [iterations, setIterations] = useState(1000);
  const [lockInput, setLockInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [player, setPlayer] = useState<"oop" | "ip">("oop");

  const fetchSolver = useCallback(async () => {
    try {
      const data = await getSolver(id);
      setSolver(data);
      setPlayer(data.player);
      
      const historyData = await getHistory(id);
      setHistory(historyData);
      
      if (data.node_type === "chance") {
        const possibleCardsData = await getPossibleCards(id);
        setPossibleCards(possibleCardsData.cards);
      } else {
        setPossibleCards([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [id]);

  const fetchData = useCallback(
    async (targetPlayer?: string) => {
      if (!solver) return;
      
      try {
        const actualPlayer = targetPlayer && targetPlayer !== solver.player ? targetPlayer : undefined;
        
        if (view === "strategy") {
          const data = await getStrategy(id, actualPlayer);
          setStrategy(data);
        } else if (view === "equity") {
          const data = await getEquity(id, actualPlayer);
          setEquity(data);
        } else if (view === "ev") {
          const data = await getEV(id, actualPlayer);
          setEv(data);
        } else if (view === "range") {
          const data = await getRange(id, actualPlayer);
          setRange(data);
        }
      } catch {
        // Ignore errors for individual data fetches
      }
    },
    [id, view, solver]
  );

  useEffect(() => {
    fetchSolver();
  }, [fetchSolver]);

  useEffect(() => {
    if (solver) {
      fetchData();
    }
  }, [solver, fetchData]);

  useEffect(() => {
    if (solver) {
      fetchData(player === solver.player ? undefined : player);
    }
  }, [player, solver, fetchData]);

  const handleBackOne = async () => {
    setIsLoading(true);
    try {
      const data = await backOneStep(id);
      setSolver({ ...data, task: null });
      
      const historyData = await getHistory(id);
      setHistory(historyData);
      
      if (data.node_type === "chance") {
        const possibleCardsData = await getPossibleCards(id);
        setPossibleCards(possibleCardsData.cards);
      } else {
        setPossibleCards([]);
      }
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGotoStep = async (step: number) => {
    setIsLoading(true);
    try {
      const data = await gotoStep(id, step);
      setSolver({ ...data, task: null });
      
      const historyData = await getHistory(id);
      setHistory(historyData);
      
      if (data.node_type === "chance") {
        const possibleCardsData = await getPossibleCards(id);
        setPossibleCards(possibleCardsData.cards);
      } else {
        setPossibleCards([]);
      }
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRoot = async () => {
    setIsLoading(true);
    try {
      const data = await backToRoot(id);
      setSolver({ ...data, task: null });
      
      const historyData = await getHistory(id);
      setHistory(historyData);
      
      setPossibleCards([]);
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataAfterAction = useCallback(async () => {
    await fetchSolver();
    await fetchData();
  }, [fetchSolver, fetchData]);

  const handlePlayAction = async (action: string) => {
    setIsLoading(true);
    try {
      const data = await playAction(id, action);
      setSolver({ ...data, task: null });
      
      const historyData = await getHistory(id);
      setHistory(historyData);
      
      if (data.node_type === "chance") {
        const possibleCardsData = await getPossibleCards(id);
        setPossibleCards(possibleCardsData.cards);
      } else {
        setPossibleCards([]);
      }
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolve = async () => {
    setProgress([]);
    try {
      await solve(id, { iterations });
      const eventSource = createSSE(id, {
        onProgress: (data) => setProgress((prev) => [...prev, data]),
        onDone: () => {
          fetchSolver();
          fetchData();
        },
        onError: (error) => {
          setError(error.detail);
        },
      });
      return () => eventSource.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleLock = async () => {
    try {
      await lockStrategy(id, { strategy: JSON.parse(lockInput) });
      setIsLocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleUnlock = async () => {
    try {
      await unlockStrategy(id);
      setIsLocked(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFillCurrent = () => {
    if (strategy) {
      setLockInput(JSON.stringify(strategy, null, 2));
    }
  };

  const handlePlayerChange = (newPlayer: "oop" | "ip") => {
    setPlayer(newPlayer);
  };

  if (!solver) {
    return <div className="loading">Loading...</div>;
  }

  const street = getStreetLabel(solver.board);
  const nodeType = solver.node_type === "terminal" ? "terminal" : solver.node_type === "decision" ? "decision" : "chance";
  const actionPathItems: string[] = history?.path || [];
  const isRoot = actionPathItems.length === 0;

  const actionStats = useMemo(() => {
    if (!strategy) return [];
    
    const stats: { action: string; total: number; color: string }[] = [];
    const totals: Record<string, number> = {};
    
    for (const handActions of Object.values(strategy) as Record<string, number>[]) {
      for (const [action, freq] of Object.entries(handActions)) {
        totals[action] = (totals[action] || 0) + freq;
      }
    }
    
    const availableActions = Object.keys(strategy).flatMap(h => Object.keys(strategy[h]));
    
    for (const [action, total] of Object.entries(totals)) {
      stats.push({
        action,
        total,
        color: actionColor(action, availableActions),
      });
    }
    
    return stats.sort((a, b) => b.total - a.total);
  }, [strategy]);

  return (
    <div className="solver-view">
      {error && <div className="error">{error}</div>}
      <div className="top-bar">
        <div className="board-area">
          <div className="board-cards">
            {solver.board.match(/.{1,2}/g)?.map((card: string, i: number) => (
              <PlayingCard key={i} card={card} />
            ))}
            {Array.from({ length: Math.max(0, 5 - (solver.board.length / 2)) }).map((_, i) => (
              <CardPlaceholder key={`ph-${i}`} />
            ))}
          </div>
          <span className="street-label">{street}</span>
        </div>
        <div className="pot-info">
          <span>Pot:</span>
          <span className="pot-value">N/A</span>
        </div>
        <div className="top-bar-right">
          {solver.is_solved && <span className="badge solved">Solved</span>}
          <span className={`badge ${nodeType}`}>{solver.node_type}</span>
          <button className="exit-btn" onClick={onExit} disabled={isLoading}>
            Exit
          </button>
        </div>
      </div>

      <div className="action-path">
        <div className="nav-buttons">
          <button onClick={handleBackOne} disabled={isRoot || isLoading} title="Back one step">
            ◀
          </button>
          <button onClick={handleBackToRoot} disabled={isRoot || isLoading} title="Back to root">
            ⌂
          </button>
        </div>
        <div className="path-pills">
          <button
            className={`path-pill${isRoot ? " current" : ""}`}
            onClick={() => handleGotoStep(0)}
            disabled={isLoading}
          >
            Root
          </button>
          {actionPathItems.map((action, i) => {
            const step = i + 1;
            const isCurrent = step === actionPathItems.length;
            const isCard = action.length === 2;
            const color = isCard ? undefined : actionColor(action, actionPathItems.filter(a => a.length !== 2));
            
            return (
              <React.Fragment key={`step-${i}`}>
                <span className="path-arrow">▸</span>
                <button
                  className={`path-pill${isCard ? " path-card" : ""}${isCurrent ? " current" : ""}`}
                  onClick={() => handleGotoStep(step)}
                  disabled={isLoading}
                  style={{ backgroundColor: color }}
                >
                  {isCard ? (
                    <PlayingCard card={action} size="mini" />
                  ) : (
                    getActionShortLabel(action)
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="solver-container">
        <div className="main-area">
          <div className="left-column">
            <div className="panel">
              <div className="player-toggle">
                <button
                  className={player === "oop" ? "active" : ""}
                  onClick={() => handlePlayerChange("oop")}
                  disabled={isLoading}
                >
                  OOP
                </button>
                <button
                  className={player === "ip" ? "active" : ""}
                  onClick={() => handlePlayerChange("ip")}
                  disabled={isLoading}
                >
                  IP
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="view-tabs">
                <button
                  className={view === "strategy" ? "active" : ""}
                  onClick={() => setView("strategy")}
                >
                  Strategy
                </button>
                <button
                  className={view === "equity" ? "active" : ""}
                  onClick={() => setView("equity")}
                >
                  Equity
                </button>
                <button
                  className={view === "ev" ? "active" : ""}
                  onClick={() => setView("ev")}
                >
                  EV
                </button>
                <button
                  className={view === "range" ? "active" : ""}
                  onClick={() => setView("range")}
                >
                  Range
                </button>
              </div>
            </div>

            {view === "strategy" && strategy && actionStats.length > 0 && (
              <div className="action-legend">
                {actionStats.map((stat) => (
                  <div key={stat.action} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: stat.color }} />
                    <span>
                      {getActionShortLabel(stat.action)} {(stat.total / (actionStats.reduce((s, a) => s + a.total, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {view === "strategy" && !strategy && !solver.is_solved && (
              <div className="hint">Solve first to see strategy</div>
            )}
            {view === "equity" && !equity && !solver.is_solved && (
              <div className="hint">Solve first to see equity</div>
            )}
            {view === "ev" && !ev && !solver.is_solved && (
              <div className="hint">Solve first to see EV</div>
            )}

            <HandGrid
              data={{ strategy, equity, ev, range }}
              view={view}
              player={player}
            />

            <div className="action-area">
              {solver.node_type === "terminal" ? (
                <span className="terminal-message">Hand complete</span>
              ) : solver.node_type === "chance" ? (
                <>
                  <span className="chance-label">Deal a card:</span>
                  <div className="chance-cards">
                    {possibleCards.map((card) => (
                      <button key={card} onClick={() => handlePlayAction(card)} disabled={isLoading}>
                        <PlayingCard card={card} size="small" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                solver.available_actions.map((action: string) => {
                  const color = actionColor(action, solver.available_actions);
                  return (
                    <button
                      key={action}
                      onClick={() => handlePlayAction(action)}
                      disabled={isLoading}
                      style={{ backgroundColor: color }}
                    >
                      {action}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="panel node-info">
              <div className="node-info-row">
                <span className="node-info-label">Player</span>
                <span className="node-info-value">{solver.player.toUpperCase()}</span>
              </div>
              <div className="node-info-row">
                <span className="node-info-label">Node Type</span>
                <span className="node-info-value">{solver.node_type}</span>
              </div>
              {solver.task?.exploitability !== null && solver.task?.exploitability !== undefined && (
                <div className="exploitability-display">
                  <div className="exploitability-value">
                    {solver.task.exploitability.toFixed(2)} chips
                  </div>
                  <div className="exploitability-label">Exploitability</div>
                </div>
              )}
            </div>

            <div className="panel">
              <div className="solve-bar">
                <input
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  disabled={isLoading}
                  min="100"
                  step="100"
                />
                <button className="primary" onClick={handleSolve} disabled={isLoading}>
                  Solve
                </button>
                <button onClick={() => setProgress([])} disabled={isLoading}>
                  Clear
                </button>
                {solver.task && <span>Status: {solver.task.status}</span>}
                {progress.length > 0 && (
                  <svg className="progress-chart" width="120" height="40" viewBox="0 0 120 40">
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      points={progress.map((p, i) => {
                        const x = (i / (progress.length - 1)) * 100 + 10;
                        const maxExploitability = Math.max(...progress.map(p => p.exploitability), solver.task?.exploitability ?? 1);
                        return `${x},${30 - (p.exploitability / (maxExploitability || 1)) * 25}`;
                      }).join(" ")}
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className="panel lock-panel">
              <details>
                <summary>Lock Strategy</summary>
                <p style={{ margin: "8px 0", color: "#8a8aa0", fontSize: "13px" }}>
                  After locking, click Solve to re-solve against the locked strategy.
                </p>
                <textarea
                  value={lockInput}
                  onChange={(e) => setLockInput(e.target.value)}
                  placeholder="Paste strategy JSON here"
                />
                <div className="lock-buttons">
                  <button onClick={handleFillCurrent} disabled={!strategy}>
                    Fill Current
                  </button>
                  <button onClick={handleLock} disabled={isLocked || !lockInput.trim()}>
                    Lock
                  </button>
                  <button onClick={handleUnlock} disabled={!isLocked}>
                    Unlock
                  </button>
                </div>
                {isLocked && <div className="locked-indicator">Locked</div>}
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
