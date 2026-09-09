import { useState, type ReactNode } from 'react'

export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="my-3.5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[13px] font-semibold text-accent2 cursor-pointer hover:text-txt transition-colors w-full text-left"
      >
        <span className={`text-[10px] transition-transform inline-block ${open ? 'rotate-90' : ''}`}>▶</span>
        {title}
      </button>
      {open && <div className="mt-2 pl-4">{children}</div>}
    </div>
  )
}
