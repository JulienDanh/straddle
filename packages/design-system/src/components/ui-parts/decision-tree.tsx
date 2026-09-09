import { useMemo, type ReactNode } from 'react'
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

export interface DecisionNode {
  question: string
  hint?: string
  yes?: DecisionNode | DecisionLeaf
  no?: DecisionNode | DecisionLeaf
}

export interface DecisionLeaf {
  action: ReactNode
  actionVariant: 'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'
  reason: string
  boards?: ReactNode[]
}

const LEAF_COLOR: Record<string, string> = {
  bet: '#ef6f6f', check: '#5fd0a8', fold: '#8499b5', call: '#6aa6ff', raise: '#ef6f6f', allIn: '#c83838',
}

// --- Custom nodes ---

function QuestionNode({ data }: { data: { question: string; hint?: string } }) {
  return (
    <div className="bg-[#1a2230] rounded-lg px-3.5 py-2.5 text-center min-w-[160px] max-w-[220px] shadow-lg" style={{ border: '1.5px solid rgba(106,166,255,0.4)' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#2e3a4d', width: 8, height: 8, border: 'none' }} />
      <span className="text-[13px] font-semibold text-[#d8e2ee]">{data.question}</span>
      {data.hint && <span className="text-[11px] text-[#8499b5] block mt-1 leading-tight">{data.hint}</span>}
      <Handle type="source" id="yes" position={Position.Right} style={{ background: '#5fd0a8', width: 8, height: 8, border: 'none', top: '35%' }} />
      <Handle type="source" id="no" position={Position.Right} style={{ background: '#ef6f6f', width: 8, height: 8, border: 'none', top: '65%' }} />
    </div>
  )
}

function LeafNode({ data }: { data: { action: ReactNode; reason: string; variant: string; boards?: ReactNode[] } }) {
  const color = LEAF_COLOR[data.variant] || '#8499b5'
  return (
    <div
      className="bg-[#1a2230] rounded-lg px-3.5 py-2.5 min-w-[170px] max-w-[220px] shadow-lg"
      style={{ border: `1px solid #2e3a4d`, borderLeft: `3px solid ${color}` }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#2e3a4d', width: 8, height: 8, border: 'none' }} />
      <div className="flex items-center gap-2">
        {data.action}
      </div>
      <span className="text-[12px] font-medium text-[#d8e2ee] leading-snug block mt-0.5">{data.reason}</span>
    </div>
  )
}

const nodeTypes: NodeTypes = { question: QuestionNode, leaf: LeafNode }

// --- Tree → flat nodes, then dagre auto-layout ---

const isLeaf = (x: any): x is DecisionLeaf => 'action' in x

let idCounter = 0

function flatten(node: DecisionNode | DecisionLeaf, parentId?: string, branch?: 'yes' | 'no'): { id: string; node: DecisionNode | DecisionLeaf; parentId?: string; branch?: 'yes' | 'no' }[] {
  const id = `n${idCounter++}`
  const result: { id: string; node: DecisionNode | DecisionLeaf; parentId?: string; branch?: 'yes' | 'no' }[] = [{ id, node, parentId, branch }]
  if (!isLeaf(node)) {
    if (node.yes) result.push(...flatten(node.yes, id, 'yes'))
    if (node.no) result.push(...flatten(node.no, id, 'no'))
  }
  return result
}

function layoutTree(root: DecisionNode): { nodes: Node[]; edges: Edge[] } {
  idCounter = 0
  const flat = flatten(root)

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', ranksep: 80, nodesep: 50, marginx: 20, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes with estimated sizes
  for (const f of flat) {
    const w = isLeaf(f.node) ? 190 : 200
    const h = isLeaf(f.node) ? 50 : (f.node.hint ? 60 : 40)
    g.setNode(f.id, { width: w, height: h })
  }

  // Add edges
  for (const f of flat) {
    if (f.parentId && f.branch) {
      g.setEdge(f.parentId, f.id)
    }
  }

  dagre.layout(g)

  const nodes: Node[] = flat.map(f => {
    const pos = g.node(f.id)
    const x = isLeaf(f.node)
      ? {
          type: 'leaf' as const,
          data: { action: f.node.action, reason: f.node.reason, variant: f.node.actionVariant, boards: f.node.boards },
        }
      : {
          type: 'question' as const,
          data: { question: (f.node as DecisionNode).question, hint: (f.node as DecisionNode).hint },
        }
    return { id: f.id, position: { x: pos.x - pos.width / 2, y: pos.y - pos.height / 2 }, ...x }
  })

  const edges: Edge[] = flat.filter(f => f.parentId && f.branch).map(f => ({
    id: `e${f.parentId}-${f.id}`,
    source: f.parentId!,
    target: f.id,
    sourceHandle: f.branch,
    label: f.branch === 'yes' ? 'YES' : 'NO',
    labelStyle: { fontSize: 11, fontWeight: 700, fill: f.branch === 'yes' ? '#5fd0a8' : '#ef6f6f' },
    labelBgStyle: { fill: '#0f1419' },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
    style: { stroke: f.branch === 'yes' ? '#5fd0a8' : '#ef6f6f', strokeWidth: 2 },
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: f.branch === 'yes' ? '#5fd0a8' : '#ef6f6f' },
  }))

  return { nodes, edges }
}

export function DecisionTree({ root }: { root: DecisionNode }) {
  const { nodes, edges } = useMemo(() => layoutTree(root), [root])

  return (
    <div className="my-4 border border-[#2e3a4d] rounded-xl overflow-hidden relative bg-[#0f1419]" style={{ height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, minZoom: 0.2, maxZoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        preventScrolling={false}
        minZoom={0.2}
        maxZoom={1}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} color="#2e3a4d" gap={20} size={2} />
      </ReactFlow>
    </div>
  )
}
