import { useState, type ReactNode } from 'react'
import ReactFlow, {
  type Node,
  type Edge,
  type NodeTypes,
  Background,
  Handle,
  Position,
} from 'reactflow'
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

const LEAF_BORDER: Record<string, string> = {
  bet: '#ef6f6f', check: '#5fd0a8', fold: '#2e3a4d', call: '#6aa6ff', raise: '#ef6f6f', allIn: '#c83838',
}

// --- Custom node components ---

function QuestionNode({ data }: { data: { question: string; hint?: string } }) {
  return (
    <div className="bg-panel border border-[#6aa6ff]/40 rounded-lg px-3 py-2 text-center min-w-[150px] max-w-[220px] shadow-md">
      <Handle type="target" position={Position.Left} style={{ background: '#2e3a4d' }} />
      <span className="text-[13px] font-semibold text-[#d8e2ee]">{data.question}</span>
      {data.hint && <span className="text-[11px] text-[#8499b5] block mt-0.5 leading-tight">{data.hint}</span>}
      <Handle type="source" id="yes" position={Position.Right} style={{ background: '#5fd0a8', right: '-4px' }} />
      <Handle type="source" id="no" position={Position.Right} style={{ background: '#ef6f6f', right: '-4px', top: '70%' }} />
    </div>
  )
}

function LeafNode({ data }: { data: { action: ReactNode; reason: string; variant: string; boards?: ReactNode[] } }) {
  const [open, setOpen] = useState(false)
  const borderColor = LEAF_BORDER[data.variant] || '#2e3a4d'
  return (
    <div
      className="bg-panel rounded-lg px-3 py-2 min-w-[170px] max-w-[220px] shadow-md"
      style={{ borderLeft: `3px solid ${borderColor}`, border: `1px solid #2e3a4d`, borderLeftWidth: '3px', borderLeftColor: borderColor }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#2e3a4d' }} />
      <div className="flex items-center gap-2">
        {data.action}
      </div>
      <span className="text-[12px] font-medium text-[#d8e2ee] leading-snug block mt-0.5">{data.reason}</span>
      {data.boards && data.boards.length > 0 && (
        <>
          <button onClick={() => setOpen(!open)} className="text-[10px] text-[#8499b5] hover:text-[#d8e2ee] cursor-pointer mt-1.5">
            {open ? '− Hide' : `+ ${data.boards.length} examples`}
          </button>
          {open && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {data.boards.map((b, i) => <div key={i}>{b}</div>)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  question: QuestionNode,
  leaf: LeafNode,
}

// --- Tree → nodes/edges conversion ---

let nodeId = 0

function buildGraph(node: DecisionNode | DecisionLeaf, x: number, y: number, parentId?: string, branch?: 'yes' | 'no'): { nodes: Node[]; edges: Edge[] } {
  const id = `n${nodeId++}`
  const nodes: Node[] = []
  const edges: Edge[] = []

  const isLeaf = (n: any): n is DecisionLeaf => 'action' in n

  if (isLeaf(node)) {
    nodes.push({
      id,
      type: 'leaf',
      position: { x, y },
      data: { action: node.action, reason: node.reason, variant: node.actionVariant, boards: node.boards },
    })
  } else {
    nodes.push({
      id,
      type: 'question',
      position: { x, y },
      data: { question: node.question, hint: node.hint },
    })
  }

  if (parentId && branch) {
    edges.push({
      id: `e${parentId}-${id}`,
      source: parentId,
      target: id,
      sourceHandle: branch,
      label: branch === 'yes' ? 'YES' : 'NO',
      labelStyle: { fontSize: 10, fontWeight: 700, fill: branch === 'yes' ? '#5fd0a8' : '#ef6f6f' },
      labelBgStyle: { fill: '#1a2230' },
      style: { stroke: branch === 'yes' ? '#5fd0a8' : '#ef6f6f', strokeWidth: 1.5 },
      type: 'smoothstep',
    })
  }

  if (!isLeaf(node)) {
    const childX = x + 300
    const offsetY = 140
    const yesResult = node.yes ? buildGraph(node.yes, childX, y - offsetY, id, 'yes') : { nodes: [], edges: [] }
    const noResult = node.no ? buildGraph(node.no, childX, y + offsetY, id, 'no') : { nodes: [], edges: [] }
    nodes.push(...yesResult.nodes, ...noResult.nodes)
    edges.push(...yesResult.edges, ...noResult.edges)
  }

  return { nodes, edges }
}

export function DecisionTree({ root }: { root: DecisionNode }) {
  nodeId = 0
  const { nodes, edges } = buildGraph(root, 400, 0)

  return (
    <div className="my-4 border border-[#2e3a4d] rounded-xl overflow-hidden relative" style={{ height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        minZoom={0.5}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2e3a4d" gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}
