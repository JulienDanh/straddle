import { useState, type ReactNode } from 'react'

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

function Leaf({ leaf }: { leaf: DecisionLeaf }) {
  const [showBoards, setShowBoards] = useState(false)
  const colorClass = {
    bet: 'border-bad bg-[rgba(239,111,111,0.06)]',
    check: 'border-good bg-[rgba(95,208,168,0.06)]',
    fold: 'border-line bg-[rgba(58,68,83,0.4)]',
    call: 'border-accent2 bg-[rgba(106,166,255,0.06)]',
    raise: 'border-bad bg-[rgba(239,111,111,0.06)]',
    allIn: 'border-bad bg-[rgba(200,56,56,0.08)]',
  }[leaf.actionVariant]

  return (
    <div className={`border rounded-lg p-3 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-1">
        {leaf.action}
        <span className="text-[13px] font-semibold text-txt">{leaf.reason}</span>
      </div>
      {leaf.boards && leaf.boards.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowBoards(!showBoards)}
            className="text-[11px] text-muted hover:text-txt cursor-pointer"
          >
            {showBoards ? 'Hide examples' : `Show ${leaf.boards.length} examples`}
          </button>
          {showBoards && (
            <div className="flex flex-wrap gap-2 mt-2">
              {leaf.boards.map((board, i) => (
                <div key={i}>{board}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TreeNode({ node }: { node: DecisionNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-panel2 border border-line rounded-lg px-3 py-2 text-center">
        <span className="text-[13px] font-semibold text-txt">{node.question}</span>
        {node.hint && <span className="text-[11px] text-muted block mt-0.5">{node.hint}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-good bg-[rgba(95,208,168,0.15)] border border-good/30 rounded px-1.5 py-0.5">YES</span>
          </div>
          {node.yes && ('question' in node.yes
            ? <TreeNode node={node.yes as DecisionNode} />
            : <Leaf leaf={node.yes as DecisionLeaf} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-bad bg-[rgba(239,111,111,0.15)] border border-bad/30 rounded px-1.5 py-0.5">NO</span>
          </div>
          {node.no && ('question' in node.no
            ? <TreeNode node={node.no as DecisionNode} />
            : <Leaf leaf={node.no as DecisionLeaf} />
          )}
        </div>
      </div>
    </div>
  )
}

export function DecisionTree({ root }: { root: DecisionNode }) {
  return (
    <div className="my-4">
      <TreeNode node={root} />
    </div>
  )
}
