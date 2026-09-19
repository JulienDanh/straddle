import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import ReactFlow, {
  type Node,
  type Edge,
  type NodeTypes,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'

export interface DecisionBranch {
  /** Edge label, e.g. "A-HIGH" */
  label: string
  /** Edge color; defaults to the accent */
  color?: string
  node: DecisionNode | DecisionLeaf
}

export interface DecisionNode {
  question: string
  hint?: string
  yes?: DecisionNode | DecisionLeaf
  no?: DecisionNode | DecisionLeaf
  /** override the default YES / NO edge labels (e.g. frequency tags) */
  yesLabel?: string
  noLabel?: string
  /** N-way branch; replaces yes/no when present */
  branches?: DecisionBranch[]
}

export interface DecisionLeaf {
  action: ReactNode
  actionVariant: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
  reason: string
  /** sizing chip rendered beside the action, e.g. "20% pot · 1.1bb at 40bb" */
  size?: string
  /** compact extra lines carried on the leaf (sizing, factor responses);
   *  "key → response" renders the key emphasized, the response muted;
   *  **text** inside a line renders emphasized */
  detail?: string[]
  boards?: ReactNode[]
}

const LEAF_COLOR: Record<string, string> = {
  bet: '#ff5470', check: '#39ff88', fold: '#8080a4', call: '#00f0ff', raise: '#ff5470', allIn: '#b44cff',
}

// --- Custom nodes ---

/** render **text** spans emphasized */
function renderEmphasis(text: string, key: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={`${key}-${i}`} className="text-txt font-semibold">{part}</strong> : part,
  )
}

function QuestionNode({ data }: { data: { question: string; hint?: string; handles: string[] } }) {
  return (
    <div className="bg-panel rounded-lg px-3.5 py-2.5 text-center min-w-[160px] max-w-[220px] shadow-lg" style={{ border: '1.5px solid rgba(255,46,196,0.45)', boxShadow: '0 0 18px rgba(255,46,196,0.15)' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#2a2a44', width: 8, height: 8, border: 'none' }} />
      <span className="text-[13px] font-semibold text-txt">{data.question}</span>
      {data.hint && (
        <span className="block mt-1 leading-tight">
          {data.hint.split('·').map((seg, i) => (
            <span key={i} className="block text-[11px] text-muted">{renderEmphasis(seg.trim(), `h${i}`)}</span>
          ))}
        </span>
      )}
      {data.handles.map((id, i) => (
        <Handle
          key={id}
          type="source"
          id={id}
          position={Position.Right}
          style={{ background: '#2a2a44', width: 8, height: 8, border: 'none', top: `${Math.round(((i + 1) / (data.handles.length + 1)) * 100)}%` }}
        />
      ))}
    </div>
  )
}

function LeafNode({ data }: { data: { action: ReactNode; reason: string; size?: string; detail?: string[]; variant: string; boards?: ReactNode[]; leafId: string; onBoards: (id: string) => void; boardsOpen: boolean } }) {
  const color = LEAF_COLOR[data.variant] || '#8080a4'
  return (
    <div
      className="bg-panel rounded-lg px-3.5 py-2.5 min-w-[170px] max-w-[220px] shadow-lg"
      style={{ border: `1px solid ${data.boardsOpen ? 'var(--color-accent)' : '#2a2a44'}`, borderLeft: `3px solid ${color}`, boxShadow: `0 0 14px ${color}29` }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#2a2a44', width: 8, height: 8, border: 'none' }} />
      <div className="flex flex-wrap items-center gap-1.5">
        {data.action}
        {data.size && (
          <span className="text-[10px] font-semibold text-muted bg-panel2 border border-line rounded px-1.5 py-px whitespace-nowrap">{data.size}</span>
        )}
      </div>
      <span className="text-[12px] font-medium text-txt leading-snug block mt-0.5">{data.reason}</span>
      {data.detail && data.detail.length > 0 && (
        <div className="mt-1">
          {data.detail.map((d, i) => {
            const arrow = d.indexOf('→')
            return arrow === -1 ? (
              <span key={i} className="block text-[11px] text-muted leading-tight">{renderEmphasis(d, `d${i}`)}</span>
            ) : (
              <span key={i} className="block text-[11px] leading-tight">
                <span className="text-txt font-medium">{renderEmphasis(d.slice(0, arrow).trim(), `d${i}k`)}</span>
                <span className="text-muted"> → {d.slice(arrow + 1).trim()}</span>
              </span>
            )
          })}
        </div>
      )}
      {data.boards && data.boards.length > 0 && (
        // toggling renders the leaf's boards in the strip BELOW the tree —
        // never in a popover, which the scroll-clipped canvas would crop
        <button
          onClick={() => data.onBoards(data.leafId)}
          className={`nodrag mt-1 block text-[10px] font-bold uppercase tracking-wider hover:underline ${
            data.boardsOpen ? 'text-accent' : 'text-muted hover:text-txt'
          }`}
        >
          {data.boardsOpen ? 'Hide boards' : `${data.boards.length} example boards`}
        </button>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = { question: QuestionNode, leaf: LeafNode }

// --- Tree → flat nodes, then dagre auto-layout ---

const isLeaf = (x: any): x is DecisionLeaf => 'action' in x

interface ChildEdge {
  handle: string
  label: string
  color: string
  child: DecisionNode | DecisionLeaf
}

const BRANCH_COLOR = '#00f0ff'

function childrenOf(node: DecisionNode): ChildEdge[] {
  if (node.branches && node.branches.length > 0) {
    return node.branches.map((b, i) => ({
      handle: `b${i}`,
      label: b.label.toUpperCase(),
      color: b.color || BRANCH_COLOR,
      child: b.node,
    }))
  }
  const out: ChildEdge[] = []
  if (node.yes) out.push({ handle: 'yes', label: (node.yesLabel ?? 'YES').toUpperCase(), color: '#39ff88', child: node.yes })
  if (node.no) out.push({ handle: 'no', label: (node.noLabel ?? 'NO').toUpperCase(), color: '#ff5470', child: node.no })
  return out
}

let idCounter = 0

interface FlatEntry {
  id: string
  node: DecisionNode | DecisionLeaf
  parentId?: string
  edge?: ChildEdge
  handles: string[]
}

function flatten(node: DecisionNode | DecisionLeaf, parentId?: string, edge?: ChildEdge): FlatEntry[] {
  const children = isLeaf(node) ? [] : childrenOf(node)
  const id = `n${idCounter++}`
  const entry: FlatEntry = {
    id, node, parentId, edge,
    handles: children.map(c => c.handle),
  }
  return [entry, ...children.flatMap(c => flatten(c.child, id, c))]
}

function layoutTree(root: DecisionNode, onBoards: (id: string) => void, openLeaf: string | null): { nodes: Node[]; edges: Edge[]; height: number; width: number } {
  idCounter = 0
  const flat = flatten(root)

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', ranksep: 80, nodesep: 50, marginx: 20, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes with estimated sizes
  for (const f of flat) {
    const w = 220
    // ~34 chars fit on one small line (11px) in the 220px node
    const detailLines = isLeaf(f.node)
      ? (f.node.detail ?? []).reduce((n, d) => n + Math.max(1, Math.ceil(d.length / 34)), 0)
      : 0
    // hints render as stacked '·'-separated lines
    const hintLines = !isLeaf(f.node) && f.node.hint
      ? f.node.hint.split('·').reduce((n, s) => n + Math.max(1, Math.ceil(s.trim().length / 34)), 0)
      : 0
    const h = isLeaf(f.node)
      ? 62 + detailLines * 15 + (f.node.size ? 20 : 0) + (f.node.boards?.length ? 46 : 0)
      : 44 + hintLines * 15
    g.setNode(f.id, { width: w, height: h })
  }

  // Add edges
  for (const f of flat) {
    if (f.parentId && f.edge) {
      g.setEdge(f.parentId, f.id)
    }
  }

  dagre.layout(g)

  // content bounds — the canvas sizes itself to this plus a small pad,
  // so the tree renders at natural size with no slack
  let maxX = 0
  let maxY = 0
  for (const f of flat) {
    const pos = g.node(f.id)
    maxX = Math.max(maxX, pos.x + pos.width / 2)
    maxY = Math.max(maxY, pos.y + pos.height / 2)
  }

  const nodes: Node[] = flat.map(f => {
    const pos = g.node(f.id)
    const x = isLeaf(f.node)
      ? {
          type: 'leaf' as const,
          data: { action: f.node.action, reason: f.node.reason, size: f.node.size, detail: f.node.detail, variant: f.node.actionVariant, boards: f.node.boards, leafId: f.id, onBoards, boardsOpen: openLeaf === f.id },
        }
      : {
          type: 'question' as const,
          data: { question: (f.node as DecisionNode).question, hint: (f.node as DecisionNode).hint, handles: f.handles },
        }
    return { id: f.id, position: { x: pos.x - pos.width / 2, y: pos.y - pos.height / 2 }, ...x }
  })

  const edges: Edge[] = flat.filter(f => f.parentId && f.edge).map(f => ({
    id: `e${f.parentId}-${f.id}`,
    source: f.parentId!,
    target: f.id,
    sourceHandle: f.edge!.handle,
    label: f.edge!.label,
    labelStyle: { fontSize: 11, fontWeight: 700, fill: f.edge!.color },
    labelBgStyle: { fill: '#0a0a14' },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
    style: { stroke: f.edge!.color, strokeWidth: 2 },
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: f.edge!.color },
  }))

  return { nodes, edges, height: Math.ceil(maxY) + 36, width: Math.ceil(maxX) + 32 }
}

export function DecisionTree({ root }: { root: DecisionNode }) {
  // which leaf's boards are shown in the strip below the tree (null = none)
  const [openLeaf, setOpenLeaf] = useState<string | null>(null)
  const onBoards = (id: string) => setOpenLeaf(cur => (cur === id ? null : id))
  const { nodes, edges, height, width } = useMemo(
    () => layoutTree(root, onBoards, openLeaf), [root, openLeaf])
  const openBoards = openLeaf
    ? (nodes.find(n => n.id === openLeaf)?.data as { boards?: ReactNode[] } | undefined)?.boards
    : undefined

  // fit-to-width, deterministically: the tree renders at natural size and
  // the wrapper is CSS-scaled down to the measured column width (React
  // Flow's fitView is timing-dependent on node measurement — this is not)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const compute = () => {
      const s = Math.min(1, (el.clientWidth - 4) / width)
      setScale(Math.max(0.3, s))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div className="my-3 border border-line rounded-xl relative bg-bg overflow-hidden">
      <div ref={scrollRef} className="overflow-x-auto">
        {/* outer box = scaled size (transform doesn't shrink the layout
            box, which would leave a phantom scrollbar); inner box = the
            tree at natural size, CSS-scaled to fit the column */}
        <div style={{ width: Math.ceil(width * scale), height: Math.ceil(height * scale) }}>
          <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            // controlled: keeps `nodes` the source of truth so the leaf
            // toggle state (boardsOpen) re-renders the nodes
            onNodesChange={() => {}}
            nodeTypes={nodeTypes}
            defaultViewport={{ x: 16, y: 12, zoom: 1 }}
            nodesDraggable={false}
            nodesConnectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            preventScrolling={false}
            minZoom={0.2}
            maxZoom={1}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} color="#2a2a44" gap={20} size={2} />
          </ReactFlow>
          </div>
        </div>
      </div>
      {openBoards && openBoards.length > 0 && (
        <div className="px-3.5 py-2.5 bg-panel2 border-t border-line flex flex-wrap gap-2 items-center">
          {openBoards.map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>
      )}
    </div>
  )
}
