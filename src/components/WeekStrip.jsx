import { computeGoScore } from '../config/scoring'

const DAYS = ['Today', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']
const DEMO_CONDITIONS = [
  { wind: 12, waves: 2.1, period: 9, temp: 74, rain: 15, moonPhase: 4 },
  { wind: 8,  waves: 1.8, period: 9, temp: 74, rain: 10, moonPhase: 5 },
  { wind: 18, waves: 3.1, period: 7, temp: 73, rain: 35, moonPhase: 5 },
  { wind: 28, waves: 4.5, period: 6, temp: 72, rain: 60, moonPhase: 6 },
  { wind: 32, waves: 5.2, period: 6, temp: 72, rain: 70, moonPhase: 6 },
  { wind: 15, waves: 2.8, period: 8, temp: 73, rain: 20, moonPhase: 7 },
  { wind: 10, waves: 2.0, period: 9, temp: 74, rain: 12, moonPhase: 7 },
]
const WINDS = ['12 SE', '8 S', '18 SW', '28 W', '32 NW', '15 N', '10 SE']

export default function WeekStrip({ range }) {
  const scores = DEMO_CONDITIONS.map(c => computeGoScore(c, range).score)

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2 font-mono">
        7-DAY GO SCORE · {range.toUpperCase()}
      </div>
      <div className="flex gap-2">
        {scores.map((s, i) => {
          const cls = s >= 70
            ? 'bg-go/20 text-go'
            : s >= 45
            ? 'bg-caution/20 text-caution'
            : 'bg-stop/20 text-stop'
          return (
            <div
              key={i}
              className={`flex-1 rounded-lg p-2 text-center
                ${i === 0 ? 'bg-foam/10 border border-foam/20' : 'bg-navy-light/50'}`}
            >
              <div className={`text-xs mb-1 ${i === 0 ? 'text-foam' : 'text-white/30'}`}>
                {DAYS[i]}
              </div>
              <div className={`text-base font-mono font-bold rounded-full w-8 h-8
                flex items-center justify-center mx-auto mb-1 ${cls}`}>
                {s}
              </div>
              <div className="text-xs text-white/30">{WINDS[i]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
