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

const LEAF_STYLES: Record<string, string> = {
  bet: 'border-l-[3px] border-bad bg-[rgba(239,111,111,0.06)]',
  check: 'border-l-[3px] border-good bg-[rgba(95,208,168,0.06)]',
  fold: 'border-l-[3px] border-line bg-[rgba(58,68,83,0.4)]',
  call: 'border-l-[3px] border-accent2 bg-[rgba(106,166,255,0.06)]',
  raise: 'border-l-[3px] border-bad bg-[rgba(239,111,111,0.06)]',
  allIn: 'border-l-[3px] border-bad bg-[rgba(200,56,56,0.1)]',
}

function Leaf({ leaf }: { leaf: DecisionLeaf }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-line border-l-[3px] rounded-lg p-2.5 ${LEAF_STYLES[leaf.actionVariant]}`}>
      <div className="flex items-center gap-2">
        {leaf.action}
        <span className="text-[12px] font-medium text-txt leading-snug">{leaf.reason}</span>
      </div>
      {leaf.boards && leaf.boards.length > 0 && (
        <>
          <button onClick={() => setOpen(!open)} className="text-[10px] text-muted hover:text-txt cursor-pointer mt-1.5">
            {open ? '− Hide' : `+ ${leaf.boards.length} examples`}
          </button>
          {open && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {leaf.boards.map((b, i) => <div key={i}>{b}</div>)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const isLeaf = (x: any): x is DecisionLeaf => 'action' in x

function Branch({ node }: { node: DecisionNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Question row: badge + question in one line */}
      <div className="flex items-start gap-0">
        <div className="bg-panel border border-accent2/40 rounded-lg px-3 py-2 flex-1">
          <span className="text-[13px] font-semibold text-txt">{node.question}</span>
          {node.hint && <span className="text-[11px] text-muted block mt-0.5">{node.hint}</span>}
        </div>
      </div>
      {/* Branches */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pl-4 sm:pl-6">
        {/* YES */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[10px] font-bold text-good bg-[rgba(95,208,168,0.12)] border border-good/30 rounded px-1.5 py-px w-fit">YES</span>
          {node.yes && (isLeaf(node.yes)
            ? <Leaf leaf={node.yes} />
            : <Branch node={node.yes} />
          )}
        </div>
        {/* NO */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <span className="text-[10px] font-bold text-bad bg-[rgba(239,111,111,0.12)] border border-bad/30 rounded px-1.5 py-px w-fit">NO</span>
          {node.no && (isLeaf(node.no)
            ? <Leaf leaf={node.no} />
            : <Branch node={node.no} />
          )}
        </div>
      </div>
    </div>
  )
}

export function DecisionTree({ root }: { root: DecisionNode }) {
  return (
    <div className="my-4 border border-line rounded-xl p-4 bg-panel/50">
      <Branch node={root} />
    </div>
  )
}
