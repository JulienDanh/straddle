import { useState, type ReactNode } from 'react'
import { Leak, Subhead } from './primitives'
import type { DecisionNode, DecisionLeaf } from './decision-tree'

// StudyNote — the daily-read format for one system (phone-first):
// spot → leaks → flow → recall → why → notes. The flow renders the SAME
// DecisionNode tree as the canvas, vertically; recall is tap-to-reveal.

export interface StudyRecallItem {
  prompt: ReactNode
  answer: ReactNode
}

export interface StudyNoteData {
  spot: ReactNode
  leaks: [ReactNode, ReactNode?][]
  flow: DecisionNode
  recall: StudyRecallItem[]
  why: ReactNode
  notes?: ReactNode
}

/** render **text** spans emphasized */
function renderEmphasis(text: string, key: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={`${key}-${i}`} className="text-txt font-semibold">{part}</strong> : part,
  )
}

const isLeaf = (x: DecisionNode | DecisionLeaf): x is DecisionLeaf => 'action' in x

function FlowLeaf({ leaf }: { leaf: DecisionLeaf }) {
  return (
    <div className="bg-panel border border-line rounded-lg px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {leaf.action}
        {leaf.size && (
          <span className="text-[10px] font-semibold text-muted bg-panel2 border border-line rounded px-1.5 py-px whitespace-nowrap">{leaf.size}</span>
        )}
      </div>
      <div className="text-[13px] font-medium text-txt leading-snug mt-0.5">{leaf.reason}</div>
      {leaf.detail && leaf.detail.length > 0 && (
        <div className="mt-1">
          {leaf.detail.map((d, i) => {
            const arrow = d.indexOf('→')
            return arrow === -1 ? (
              <div key={i} className="text-[12px] text-muted leading-tight">{renderEmphasis(d, `d${i}`)}</div>
            ) : (
              <div key={i} className="text-[12px] leading-tight">
                <span className="text-txt font-medium">{renderEmphasis(d.slice(0, arrow).trim(), `d${i}k`)}</span>
                <span className="text-muted"> → {d.slice(arrow + 1).trim()}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface FlowEdge {
  label: string
  color: string
  child: DecisionNode | DecisionLeaf
}

function flowEdges(node: DecisionNode): FlowEdge[] {
  if (node.branches && node.branches.length > 0) {
    return node.branches.map((b) => ({ label: b.label, color: b.color || '#00f0ff', child: b.node }))
  }
  const out: FlowEdge[] = []
  if (node.yes) out.push({ label: (node.yesLabel ?? 'Yes').toUpperCase(), color: '#39ff88', child: node.yes })
  if (node.no) out.push({ label: (node.noLabel ?? 'No').toUpperCase(), color: '#ff5470', child: node.no })
  return out
}

function FlowQuestion({ node }: { node: DecisionNode }) {
  return (
    <div className="bg-panel border-[1.5px] border-accent/45 rounded-lg px-3 py-2">
      <div className="text-[13.5px] font-semibold text-txt leading-snug">{node.question}</div>
      {node.hint && (
        <div className="mt-1">
          {node.hint.split('·').map((seg, i) => (
            <div key={i} className="text-[11.5px] text-muted leading-tight">{renderEmphasis(seg.trim(), `h${i}`)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function FlowNode({ node }: { node: DecisionNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FlowQuestion node={node} />
      {flowEdges(node).map((e, i) => (
        <div key={i} className="ml-1.5 pl-3 flex flex-col gap-1" style={{ borderLeft: `2px solid ${e.color}55` }}>
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none" style={{ color: e.color }}>{e.label}</span>
          {isLeaf(e.child) ? <FlowLeaf leaf={e.child} /> : <FlowNode node={e.child} />}
        </div>
      ))}
    </div>
  )
}

function RecallCard({ item, index: _index }: { item: StudyRecallItem; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-panel border border-line rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:border-accent/50"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">{item.prompt}</div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border whitespace-nowrap ${open ? 'text-accent border-accent/50' : 'text-muted border-line'}`}>
          {open ? 'hide' : 'reveal'}
        </span>
      </div>
      {open && (
        <div className="mt-2 pt-2 border-t border-line flex flex-wrap items-center gap-1.5 text-[12.5px] text-txt">
          {item.answer}
        </div>
      )}
    </button>
  )
}

export function StudyNote({ note }: { note: StudyNoteData }) {
  return (
    <div className="max-w-[560px]">
      <p className="text-[14px] text-txt font-medium">{note.spot}</p>

      <Leak items={note.leaks} />

      <Subhead>Flow</Subhead>
      <FlowNode node={note.flow} />

      <Subhead>Recall</Subhead>
      <p className="text-[11px] text-muted mb-1.5">Say the action + size out loud, then tap to check.</p>
      <div className="flex flex-col gap-1.5">
        {note.recall.map((item, i) => (
          <RecallCard key={i} item={item} index={i} />
        ))}
      </div>

      <Subhead>Why</Subhead>
      <p className="text-[13px] text-muted leading-snug">{note.why}</p>

      {note.notes && (
        <>
          <Subhead>Notes</Subhead>
          <p className="text-[12px] text-muted leading-snug">{note.notes}</p>
        </>
      )}
    </div>
  )
}
