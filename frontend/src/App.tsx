import { useCallback, useState } from 'react'
import { PokerTable, activePositions, dealerIndex, ringLabels, type SeatData } from './table'

// --- Types -----------------------------------------------------------------

interface SizingResponse {
  type: string
  fraction: number | null
  absolute: number | null
  is_all_in: boolean | null
}

interface ActionResponse {
  type: string
  size: SizingResponse | null
}

interface SystemDecision {
  system_name: string
  action: ActionResponse | null
  matched_rule: string | null
  has_decision: boolean
}

interface EvaluateAllResponse {
  decisions: SystemDecision[]
}

/** A single rule's condition map + action, from /systems/{name}. */
interface RuleData {
  name: string
  conditions: Record<string, unknown>
  action: { type: string; size?: number | string }
}

interface SystemDetail {
  name: string
  description: string
  rules: RuleData[]
}

interface BoardTextureResponse {
  high_card: string
  suit_texture: string
  is_paired: boolean
  is_trips: boolean
  has_flush_draw: boolean
}

interface ClassifyResponse {
  made_hand: string
  draws: string[]
  is_top_pair: boolean
  is_overpair: boolean
  pair_rank: string | null
  board_texture: BoardTextureResponse | null
}

// --- Action display ---------------------------------------------------------
// The action overlay is trainer-specific, so it stays in the app and is
// passed into <PokerTable> as children (placed on the felt by the table).
// formatAction is shared by the felt overlay and the per-system list.

function formatSize(size: SizingResponse): string {
  if (size.type === 'all_in') return 'all-in'
  if (size.type === 'fraction' && size.fraction !== null) {
    return `${size.fraction}× pot`
  }
  if (size.type === 'absolute' && size.absolute !== null) {
    return `${size.absolute} chips`
  }
  return ''
}

/** "bet 0.66× pot", "check", "raise all-in" — or '' for a null action. */
function formatAction(action: ActionResponse | null): string {
  if (!action) return ''
  return action.size ? `${action.type} ${formatSize(action.size)}` : action.type
}

/** Format a rule's raw action dict (from /systems/{name}) as a short label. */
function formatRuleAction(action: { type: string; size?: number | string }): string {
  if (action.size === undefined) return action.type
  const s = action.size
  if (typeof s === 'number') return `${action.type} ${s}× pot`
  if (s === 'all-in') return `${action.type} all-in`
  return `${action.type} ${s}`
}

/** Format a rule's conditions dict as "key: value, key: value, …". */
function formatConditions(conditions: Record<string, unknown>): string {
  return Object.entries(conditions)
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(' + ') : String(v)
      return `${k}: ${val}`
    })
    .join(', ')
}

function ActionOverlay({ label }: { label: string | null }) {
  if (!label) {
    return <div className="action-overlay no-action">No matching rule</div>
  }
  return <div className="action-overlay has-action">{label}</div>
}

// --- Main App ---------------------------------------------------------------

const POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']

export default function App() {
  const [hand, setHand] = useState('AhKd')
  const [board, setBoard] = useState('AhQs2c')
  const [position, setPosition] = useState('BTN')
  const [pot, setPot] = useState('10')
  const [heroStack, setHeroStack] = useState('90')
  const [villainStack, setVillainStack] = useState('90')
  const [numPlayers, setNumPlayers] = useState('2')
  const [villainPosition, setVillainPosition] = useState('BB')
  const [classification, setClassification] = useState<ClassifyResponse | null>(null)
  const [decisions, setDecisions] = useState<SystemDecision[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Rule visualization: which system's rules are expanded, and the fetched
  // rule detail (keyed by system name). Cleared on each new Analyze.
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null)
  const [ruleCache, setRuleCache] = useState<Record<string, SystemDetail>>({})

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      setClassification(null)
      setDecisions(null)
      setExpandedSystem(null)
      setRuleCache({})

      try {
        const classifyUrl = `/api/classify?hand=${encodeURIComponent(hand)}&board=${encodeURIComponent(board)}`
        const classifyRes = await fetch(classifyUrl)
        if (!classifyRes.ok) {
          const err = await classifyRes.text()
          throw new Error(err || `Classify failed: ${classifyRes.status}`)
        }
        const classifyData: ClassifyResponse = await classifyRes.json()
        setClassification(classifyData)

        const evalRes = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hand,
            board,
            position,
            pot: Number(pot),
            hero_stack: Number(heroStack),
            villain_stack: Number(villainStack),
            num_players: Number(numPlayers),
            pot_type: 'single-raised',
            villain_position: villainPosition,
            all_systems: true,
          }),
        })
        if (!evalRes.ok) {
          const err = await evalRes.text()
          throw new Error(err || `Evaluate failed: ${evalRes.status}`)
        }
        const evalData: EvaluateAllResponse = await evalRes.json()
        setDecisions(evalData.decisions)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [hand, board, position, pot, heroStack, villainStack, numPlayers, villainPosition],
  )

  /** Toggle a system's rule list open/closed, fetching detail on first open. */
  const toggleRules = useCallback(
    async (systemName: string) => {
      if (expandedSystem === systemName) {
        setExpandedSystem(null)
        return
      }
      setExpandedSystem(systemName)
      if (ruleCache[systemName]) return
      try {
        const res = await fetch(`/api/systems/${encodeURIComponent(systemName)}`)
        if (!res.ok) return
        const detail: SystemDetail = await res.json()
        setRuleCache((prev) => ({ ...prev, [systemName]: detail }))
      } catch {
        // Swallow: the row just won't expand.
      }
    },
    [expandedSystem, ruleCache],
  )

  const handCards = hand ? (hand.match(/.{2}/g) ?? []) : []
  const boardCards = board ? (board.match(/.{2}/g) ?? []) : []
  const showResult = classification || decisions
  // Only matching systems are shown in the Strategy list.
  const matchedDecisions = (decisions ?? []).filter((d) => d.has_decision)

  // Decide what the felt overlay shows. With multiple systems we only put a
  // single action on the felt when every matching system agrees on it; when
  // they disagree, show a neutral hint and let the side panel carry the
  // per-system breakdown.
  const matchedLabels = matchedDecisions.map((d) => formatAction(d.action))
  const allAgree =
    matchedDecisions.length > 0 && matchedLabels.every((l) => l === matchedLabels[0])
  const overlayLabel = allAgree ? matchedLabels[0] : null

  // The table always shows 8 fixed seats (a full ring). `numPlayers` (2-6,
  // the backend's strategic constraint) marks how many are *in* this hand.
  // Hero is always at seat 0 (bottom-center). Position labels are rotated
  // around the ring so hero's chosen position lands at seat 0, the dealer
  // button sits at the seat labeled BTN, and only the seats whose positions
  // are dealt in are active — the rest are empty chairs. With fewer players
  // the farthest-from-the-button seats drop out first, like a real short
  // game. See table/layout.ts.
  const labels = ringLabels(position)
  const active = new Set<string>(activePositions(Number(numPlayers) || 2))
  const dealerIdx = dealerIndex(position)
  const heroStackNum = Number(heroStack) || 0
  const villainStackNum = Number(villainStack) || 0

  const seats: SeatData[] = labels.map((pos, index) => {
    if (index === 0) {
      return {
        id: 'hero',
        label: 'Hero',
        position,
        stack: heroStackNum,
        holeCards: [handCards[0] ?? '', handCards[1] ?? ''],
        cardsVisible: true,
        isHero: true,
        isDealer: index === dealerIdx,
      }
    }
    if (active.has(pos)) {
      return {
        id: `opp-${index}`,
        label: index === 1 ? 'Villain' : `Opp ${index}`,
        // The primary villain (seat 1) shows the user-chosen villain position;
        // other active opponents keep their ring-derived labels.
        position: index === 1 ? villainPosition : pos,
        stack: villainStackNum,
        holeCards: ['', ''] as [string, string],
        cardsVisible: false,
        isDealer: index === dealerIdx,
      }
    }
    return {
      id: `empty-${index}`,
      label: 'Empty',
      position: pos,
      stack: 0,
      holeCards: ['', ''] as [string, string],
      cardsVisible: false,
      isEmpty: true,
    }
  })

  return (
    <>
      <div className="app-header">
        <h1>Straddle</h1>
        <p>Texas Hold'em Hand Trainer</p>
      </div>

      <div className="app-grid">
        {/* --- Poker Table --- */}
        <PokerTable
          seats={seats}
          board={boardCards}
          pot={Number(pot) || 0}
          potType="single-raised"
        >
          {decisions && (
            <ActionOverlay
              label={
                overlayLabel ??
                (matchedDecisions.length > 0
                  ? `${matchedDecisions.length} systems match`
                  : null)
              }
            />
          )}
        </PokerTable>

        {/* --- Side Panel --- */}
        <div className="side-panel">
          {/* Controls */}
          <div className="panel-card">
            <h3>Setup</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="hand">Hand</label>
                  <input
                    id="hand"
                    type="text"
                    value={hand}
                    onChange={(e) => setHand(e.target.value)}
                    placeholder="AhKd"
                    maxLength={4}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="board">Board</label>
                  <input
                    id="board"
                    type="text"
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    placeholder="empty = preflop"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="position">Position</label>
                  <select id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="villainPosition">Villain</label>
                  <select id="villainPosition" value={villainPosition} onChange={(e) => setVillainPosition(e.target.value)}>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="players">In hand</label>
                  <select id="players" value={numPlayers} onChange={(e) => setNumPlayers(e.target.value)}>
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="pot">Pot (bb)</label>
                  <input id="pot" type="number" value={pot} onChange={(e) => setPot(e.target.value)} min="0" step="0.5" required />
                </div>
                <div className="form-field">
                  <label htmlFor="heroStack">Hero (bb)</label>
                  <input id="heroStack" type="number" value={heroStack} onChange={(e) => setHeroStack(e.target.value)} min="0" step="0.5" required />
                </div>
                <div className="form-field">
                  <label htmlFor="villainStack">Villain (bb)</label>
                  <input id="villainStack" type="number" value={villainStack} onChange={(e) => setVillainStack(e.target.value)} min="0" step="0.5" required />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>
            </form>
          </div>

          {error && <p className="error-msg">Error: {error}</p>}

          {showResult && (
            <>
              {classification && (
                <div className="panel-card">
                  <h3>Hand Classification</h3>
                  <div className="tag-list" style={{ marginBottom: '0.5rem' }}>
                    <span className="tag made">{classification.made_hand.replace(/-/g, ' ')}</span>
                    {classification.is_top_pair && <span className="tag made">top pair</span>}
                    {classification.is_overpair && <span className="tag made">overpair</span>}
                    {classification.pair_rank && (
                      <span className="tag made">pair: {classification.pair_rank}</span>
                    )}
                  </div>
                  <div className="tag-list">
                    {classification.draws
                      .filter((d) => d !== 'no-draw')
                      .map((d) => (
                        <span key={d} className="tag draw">{d.replace(/-/g, ' ')}</span>
                      ))}
                  </div>
                </div>
              )}

              {classification?.board_texture && (
                <div className="panel-card">
                  <h3>Board Texture</h3>
                  <div className="info-row">
                    <span className="label">High card</span>
                    <span>{classification.board_texture.high_card}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Suits</span>
                    <span>{classification.board_texture.suit_texture}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Paired</span>
                    <span className={classification.board_texture.is_paired ? 'value-yes' : 'value-no'}>
                      {classification.board_texture.is_paired ? 'yes' : 'no'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Trips</span>
                    <span className={classification.board_texture.is_trips ? 'value-yes' : 'value-no'}>
                      {classification.board_texture.is_trips ? 'yes' : 'no'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Flush draw</span>
                    <span className={classification.board_texture.has_flush_draw ? 'value-yes' : 'value-no'}>
                      {classification.board_texture.has_flush_draw ? 'yes' : 'no'}
                    </span>
                  </div>
                </div>
              )}

              {decisions && (
                <div className="panel-card">
                  <h3>Strategy</h3>
                  {matchedDecisions.length === 0 ? (
                    <p className="strategy-empty">No matching systems for this spot.</p>
                  ) : (
                    <ul className="strategy-list">
                      {matchedDecisions.map((d) => {
                        const isOpen = expandedSystem === d.system_name
                        const detail = ruleCache[d.system_name]
                        return (
                          <li key={d.system_name} className="strategy-row">
                            <button
                              type="button"
                              className="strategy-row__head"
                              onClick={() => toggleRules(d.system_name)}
                              aria-expanded={isOpen}
                            >
                              <span className="strategy-row__name">{d.system_name}</span>
                              <span className="strategy-row__action">
                                {formatAction(d.action)}
                              </span>
                              <span className="strategy-row__chevron">
                                {isOpen ? '▾' : '▸'}
                              </span>
                            </button>
                            <span className="strategy-row__rule">{d.matched_rule}</span>
                            {isOpen && (
                              <ol className="rule-list">
                                {detail ? (
                                  detail.rules.map((r) => (
                                    <li
                                      key={r.name}
                                      className={`rule-item ${r.name === d.matched_rule ? 'rule-item--matched' : ''}`}
                                    >
                                      <div className="rule-item__head">
                                        <span className="rule-item__action">
                                          {formatRuleAction(r.action)}
                                        </span>
                                        <span className="rule-item__name">{r.name}</span>
                                      </div>
                                      <span className="rule-item__conditions">
                                        {formatConditions(r.conditions)}
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="rule-item rule-item--loading">Loading…</li>
                                )}
                              </ol>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
