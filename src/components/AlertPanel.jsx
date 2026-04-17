export default function AlertPanel({ conditions, scoreResult, range, rangeConfig }) {
  const alerts = []

  if (conditions.waves > 3 && range !== 'deepDrop') {
    alerts.push({ type: 'warn', text: 'Seas building this afternoon — plan to head in early.' })
  }
  if (scoreResult.score >= 75) {
    alerts.push({ type: 'good', text: `Strong ${rangeConfig.label.toLowerCase()} conditions today. Morning window is best.` })
  }
  if (conditions.moonPhase === 4 || conditions.moonPhase === 0) {
    alerts.push({ type: 'info', text: 'Full moon — major solunar window active. Expect strong morning bite.' })
  }
  if (conditions.rain > 50) {
    alerts.push({ type: 'warn', text: 'Afternoon storm risk. Lightning possible — watch the radar.' })
  }
  alerts.push({ type: 'info', text: 'No active tropical systems. Storm tracker quiet.' })

  const icon = { good: '✓', warn: '!', info: 'i' }
  const cls = {
    good: 'bg-go/10 border-go/20 text-go',
    warn: 'bg-caution/10 border-caution/20 text-caution',
    info: 'bg-white/5 border-white/10 text-white/40',
  }

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-3">ALERTS</div>
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className={`flex gap-2 items-start p-2.5 rounded-lg border ${cls[a.type]}`}>
            <div className="text-xs font-bold mt-0.5 w-4 shrink-0">{icon[a.type]}</div>
            <div className="text-xs text-white/60 leading-relaxed">{a.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
