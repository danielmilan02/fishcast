import { computeGoScore } from '../config/scoring'

export default function TimelineTile({ range, conditions }) {
  const windows = [
    { label: 'Morning',   time: '6–11 AM',     wind: conditions.wind - 4, waves: conditions.waves - 0.3, rain: 5  },
    { label: 'Midday',    time: '11 AM–3 PM',  wind: conditions.wind + 2, waves: conditions.waves + 0.3, rain: 20 },
    { label: 'Afternoon', time: '3–7 PM',      wind: conditions.wind + 6, waves: conditions.waves + 1.0, rain: 40 },
  ]

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3 mb-2.5">
      <div className="text-xs text-white/30 tracking-widest mb-3">TODAY'S WINDOWS</div>
      <div className="grid grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden">
        {windows.map((w, i) => {
          const s = computeGoScore(
            { ...conditions, wind: Math.max(0, w.wind), waves: Math.max(0, w.waves), rain: w.rain },
            range
          )
          const c = s.color === 'go' ? 'text-go' : s.color === 'caution' ? 'text-caution' : 'text-stop'
          return (
            <div key={i} className="bg-navy-mid p-3">
              <div className="text-xs text-white/30 mb-0.5">{w.label}</div>
              <div className="text-xs text-white/20 mb-2">{w.time}</div>
              <div className={`text-2xl font-mono font-bold ${c} mb-2`}>{s.score}</div>
              <div className="space-y-1 text-xs text-white/40">
                <div className="flex justify-between">
                  <span>Wind</span>
                  <span className="text-white/60">{Math.round(Math.max(0, w.wind))} mph</span>
                </div>
                <div className="flex justify-between">
                  <span>Waves</span>
                  <span className="text-white/60">{Math.max(0, w.waves).toFixed(1)} ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Rain</span>
                  <span className="text-white/60">{w.rain}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
