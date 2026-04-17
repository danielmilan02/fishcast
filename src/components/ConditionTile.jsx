import { interpretCondition } from '../config/scoring'

function getInterpColor(interp) {
  if (!interp) return ''
  const good = ['Flat', 'Comfortable', 'Light', 'Calm', 'Low', 'Excellent', 'Favorable']
  const bad  = ['Too rough', 'Rough', 'Too windy', 'Dangerous', 'Turn back']
  if (good.some(w => interp.includes(w))) return 'bg-go/15 text-go'
  if (bad.some(w => interp.includes(w)))  return 'bg-stop/15 text-stop'
  return 'bg-caution/15 text-caution'
}

export default function ConditionTile({ label, value, unit, sub, range, type, buoySource }) {
  const interp = interpretCondition(type, value, range)
  const colorClass = getInterpColor(interp)

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2">{label.toUpperCase()}</div>
      <div className="text-2xl font-mono font-bold text-white leading-none">
        {value}<span className="text-sm text-white/40 font-normal ml-1">{unit}</span>
      </div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
      {interp && (
        <div className={`inline-block text-xs px-2 py-0.5 rounded mt-2 font-medium ${colorClass}`}>
          {interp}
        </div>
      )}
      {buoySource && (
        <div className="text-xs text-white/20 font-mono mt-1">Buoy {buoySource}</div>
      )}
    </div>
  )
}
