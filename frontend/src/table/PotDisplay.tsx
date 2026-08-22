// Center pot indicator: a pill with a coin glyph and the pot size,
// plus an optional pot-type subtitle.

interface PotDisplayProps {
  pot: number
  potType?: string
}

export function PotDisplay({ pot, potType }: PotDisplayProps) {
  return (
    <div className="pt-pot">
      <span className="pt-pot__chip">🪙</span>
      <span className="pt-pot__amount">{pot}bb</span>
      {potType && <span className="pt-pot__type">{potType}</span>}
    </div>
  )
}
