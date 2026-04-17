export default function SolunarTile({ moon }) {
  const display = moon || { name: 'Full Moon', icon: '🌕', illumination: 96 }

  const bars = [
    { label: 'Major feed', pct: 85, window: '9:40–11:40 AM' },
    { label: 'Minor feed', pct: 42, window: '3:52–4:52 PM' },
  ]

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2">SOLUNAR ACTIVITY</div>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{display.icon}</div>
        <div>
          <div className="text-white font-medium text-sm">{display.name}</div>
          <div className="text-white/40 text-xs">{display.illumination}% illuminated</div>
        </div>
      </div>
      <div className="space-y-2">
        {bars.map(({ label, pct, window }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">{label}</span>
              <span className="text-foam/70 font-mono">{window}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-foam/60 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
