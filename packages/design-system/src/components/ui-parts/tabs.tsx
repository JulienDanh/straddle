import { useState, type ReactNode } from 'react'

interface Tab {
  label: string
  content: ReactNode
}

export function Tabs({ tabs, defaultIndex = 0 }: { tabs: Tab[]; defaultIndex?: number }) {
  const [active, setActive] = useState(defaultIndex)

  return (
    <div>
      <div className="flex gap-1 border-b border-line mb-4 sticky top-0 bg-bg/95 backdrop-blur-sm z-10 -mx-[22px] px-[22px] pt-1 pb-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-t-lg cursor-pointer transition-colors border-b-2 -mb-[9px] ${
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
