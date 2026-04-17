export default function TripToggle({ ranges, active, onChange }) {
  const order = ['inshore', 'offshore', 'midrange', 'deepDrop']
  return (
    <div className="flex gap-0 border border-white/15 rounded-xl overflow-hidden mb-4">
      {order.map((key) => {
        const r = ranges[key]
        if (!r) return null
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 py-2.5 px-3 text-center transition-colors border-r border-white/10 last:border-r-0
              ${active === key
                ? 'bg-foam/15 text-foam'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
          >
            <div className="text-xs font-condensed font-semibold tracking-wide">{r.label}</div>
            <div className="text-xs text-white/30 mt-0.5">{r.sublabel}</div>
          </button>
        )
      })}
    </div>
  )
}
