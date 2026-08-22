import { useCallback, useEffect, useState } from 'react'

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

interface EvaluateResponse {
  action: ActionResponse | null
  matched_rule: string | null
  has_decision: boolean
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

interface SystemSummary {
  name: string
  description: string
  rule_count: number
}

// --- Card display helpers ---------------------------------------------------

const RED_SUITS = new Set(['h', 'd'])

function CardToken({ card }: { card: string }) {
  const suit = card[1]?.toLowerCase() ?? ''
  const isRed = RED_SUITS.has(suit)
  return (
    <span className={`card-token ${isRed ? 'red' : 'black'}`}>
      {card}
    </span>
  )
}

function CardRow({ cards }: { cards: string }) {
  if (!cards) return <span className="no-action">—</span>
  const tokens = cards.match(/.{2}/g) ?? []
  return (
    <div className="card-display">
      {tokens.map((c, i) => (
        <CardToken key={i} card={c} />
      ))}
    </div>
  )
}

// --- Action display ---------------------------------------------------------

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

function ActionDisplay({ action }: { action: ActionResponse | null }) {
  if (!action) return <span className="no-action">No matching rule</span>
  return (
    <span className="action-display">
      {action.type}
      {action.size && <span className="size">({formatSize(action.size)})</span>}
    </span>
  )
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
  const [systemName, setSystemName] = useState('')
  const [systems, setSystems] = useState<SystemSummary[]>([])
  const [classification, setClassification] = useState<ClassifyResponse | null>(null)
  const [evaluation, setEvaluation] = useState<EvaluateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/systems')
      .then((res) => res.json())
      .then((data: SystemSummary[]) => {
        setSystems(data)
        setSystemName((prev) => (prev || data[0]?.name) ?? '')
      })
      .catch(() => setSystems([]))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      setClassification(null)
      setEvaluation(null)

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
            system_name: systemName || undefined,
          }),
        })
        if (!evalRes.ok) {
          const err = await evalRes.text()
          throw new Error(err || `Evaluate failed: ${evalRes.status}`)
        }
        const evalData: EvaluateResponse = await evalRes.json()
        setEvaluation(evalData)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [hand, board, position, pot, heroStack, villainStack, numPlayers, systemName],
  )

  return (
    <main>
      <h1>Straddle</h1>
      <p style={{ opacity: 0.6, marginTop: '-0.5rem' }}>
        Texas Hold'em Hand Trainer
      </p>

      {/* --- Input form --- */}
      <form onSubmit={handleSubmit} className="form-section" style={{ marginBottom: '2rem' }}>
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
              placeholder="AhKdQs (or empty for preflop)"
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
            <label htmlFor="system">System</label>
            <select
              id="system"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
            >
              {systems.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="players">Players</label>
            <select
              id="players"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="pot">Pot</label>
            <input
              id="pot"
              type="number"
              value={pot}
              onChange={(e) => setPot(e.target.value)}
              min="0"
              step="0.5"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="heroStack">Hero Stack</label>
            <input
              id="heroStack"
              type="number"
              value={heroStack}
              onChange={(e) => setHeroStack(e.target.value)}
              min="0"
              step="0.5"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="villainStack">Villain Stack</label>
            <input
              id="villainStack"
              type="number"
              value={villainStack}
              onChange={(e) => setVillainStack(e.target.value)}
              min="0"
              step="0.5"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {/* --- Cards display --- */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.6 }}>HAND</h3>
          <CardRow cards={hand} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.6 }}>BOARD</h3>
          <CardRow cards={board} />
        </div>
      </div>

      {/* --- Error --- */}
      {error && <p className="error-msg">Error: {error}</p>}

      {/* --- Results --- */}
      {(classification || evaluation) && (
        <div className="results">
          {classification && (
            <div className="result-card">
              <h3>Hand Classification</h3>
              <div className="tag-list" style={{ marginBottom: '0.75rem' }}>
                <span className="tag">{classification.made_hand.replace(/-/g, ' ')}</span>
                {classification.is_top_pair && <span className="tag">top pair</span>}
                {classification.is_overpair && <span className="tag">overpair</span>}
                {classification.pair_rank && (
                  <span className="tag">pair: {classification.pair_rank}</span>
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
            <div className="result-card">
              <h3>Board Texture</h3>
              <div className="info-row">
                <span className="label">High card</span>
                <span>{classification.board_texture.high_card}</span>
              </div>
              <div className="info-row">
                <span className="label">Suit texture</span>
                <span>{classification.board_texture.suit_texture}</span>
              </div>
              <div className="info-row">
                <span className="label">Paired</span>
                <span>{classification.board_texture.is_paired ? 'yes' : 'no'}</span>
              </div>
              <div className="info-row">
                <span className="label">Trips on board</span>
                <span>{classification.board_texture.is_trips ? 'yes' : 'no'}</span>
              </div>
              <div className="info-row">
                <span className="label">Flush draw possible</span>
                <span>{classification.board_texture.has_flush_draw ? 'yes' : 'no'}</span>
              </div>
            </div>
          )}

          {evaluation && (
            <div className="result-card">
              <h3>Recommended Action</h3>
              <ActionDisplay action={evaluation.action} />
              {evaluation.matched_rule && (
                <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.9rem' }}>
                  Rule: {evaluation.matched_rule}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
