import { Section, StudyNote, type StudyNoteData } from '@poker/design-system/src/components/ui'
import { S1_NOTE } from '../notes/s1'

// Daily notes — the phone-first memorization format, one note per system.
// #notes/<id> selects the system; notes are added per system as they're built.

const NOTES: Record<string, { label: string; note: StudyNoteData }> = {
  s1: { label: 'S1 · UTG vs BB C-bet', note: S1_NOTE },
}

function noteFromHash(): string {
  const seg = window.location.hash.replace(/^#/, '').split('/')[1]
  return seg && NOTES[seg] ? seg : Object.keys(NOTES)[0]
}

export function NotesPage() {
  const id = noteFromHash()
  const active = NOTES[id]
  return (
    <Section title="Daily Notes">
      <p className="text-[13px] text-muted">The daily read: leaks, flow, recall. One system at a time — say the answers out loud.</p>
      <div className="flex flex-wrap gap-1.5 my-3">
        {Object.entries(NOTES).map(([key, n]) => (
          <a
            key={key}
            href={`#notes/${key}`}
            className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${
              key === id ? 'text-accent border-accent/50 bg-panel2' : 'text-muted border-line hover:text-txt'
            }`}
          >
            {n.label}
          </a>
        ))}
      </div>
      <StudyNote note={active.note} />
    </Section>
  )
}

export default NotesPage
