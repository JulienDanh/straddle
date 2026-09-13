import { useState, type ReactNode } from 'react'

interface Tab {
  label: string
  content: ReactNode
}

const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function Tabs({ tabs, defaultIndex = 0 }: { tabs: Tab[]; defaultIndex?: number }) {
  // The active tab persists in the hash suffix (#s1/practice): bookmarkable,
  // shareable, survives reloads. replaceState keeps tab clicks out of the
  // back-button history — the router only cares about the first segment.
  const [active, setActive] = useState(() => {
    const fromHash = window.location.hash.split('/')[1]
    const i = fromHash ? tabs.findIndex(t => slug(t.label) === fromHash) : -1
    return i >= 0 ? i : defaultIndex
  })

  const select = (i: number) => {
    setActive(i)
    const root = window.location.hash.split('/')[0] || '#s1'
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${root}/${slug(tabs[i].label)}`)
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-line mb-4 sticky top-0 bg-bg/95 backdrop-blur-sm z-10 -mx-8 px-8 pt-2 pb-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-t-lg cursor-pointer transition-colors border-b-2 -mb-[9px] whitespace-nowrap ${
              active === i
                ? 'text-accent border-accent'
                : 'text-muted border-transparent hover:text-txt'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  )
}
