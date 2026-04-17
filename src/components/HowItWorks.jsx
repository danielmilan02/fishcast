import { SCORE_EXPLANATION, WEIGHTS } from '../config/scoring'

// ─────────────────────────────────────────────────────────────────
// HowItWorks.jsx
// The "How the score works" tab — explains the Go Score logic
// in plain language that a captain or crew member can understand.
// ─────────────────────────────────────────────────────────────────

export default function HowItWorks({ scoreResult, range }) {
  const ex = SCORE_EXPLANATION

  return (
    <div className="space-y-6 pb-8">

      {/* Intro */}
      <div className="bg-navy-mid border border-white/10 rounded-xl p-5">
        <h2 className="font-condensed text-xl font-semibold text-white mb-3">
          {ex.title}
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-3">{ex.intro}</p>
        <div className="border-l-2 border-foam/40 pl-4">
          <p className="text-foam/80 text-sm leading-relaxed italic">{ex.keyIdea}</p>
        </div>
      </div>

      {/* Score verdicts */}
      <div>
        <div className="text-xs font-mono text-white/30 tracking-widest mb-2 pl-2 border-l-2 border-white/20">
          WHAT THE NUMBER MEANS
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {ex.verdicts.map(v => (
            <div
              key={v.label}
              className={`bg-navy-mid border rounded-xl p-4
                ${v.color === 'go'      ? 'border-go/30' :
                  v.color === 'caution' ? 'border-caution/30' :
                                          'border-stop/30'}`}
            >
              <div className={`text-2xl font-mono font-bold mb-1
                ${v.color === 'go'      ? 'text-go' :
                  v.color === 'caution' ? 'text-caution' :
                                          'text-stop'}`}>
                {v.range[0]}–{v.range[1]}
              </div>
              <div className={`text-sm font-semibold font-condensed mb-2
                ${v.color === 'go'      ? 'text-go' :
                  v.color === 'caution' ? 'text-caution' :
                                          'text-stop'}`}>
                {v.label}
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Factor breakdown */}
      <div>
        <div className="text-xs font-mono text-white/30 tracking-widest mb-2 pl-2 border-l-2 border-white/20">
          THE 6 FACTORS
        </div>
        <div className="space-y-2">
          {ex.factors.map((factor, i) => {
            const conditionKey = ['wind','waves','period','rain','temp','solunar'][i]
            const rawScore = scoreResult?.breakdown?.[conditionKey]
            const weight = WEIGHTS[range]?.[conditionKey]
            const contribution = rawScore && weight ? Math.round(rawScore * weight * 100) : null
            const pct = weight ? Math.round(weight * 100) : 0

            return (
              <div key={factor.name}
                className="bg-navy-mid border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-condensed text-base font-semibold text-white">
                    {factor.name}
                  </div>
                  <div className="flex items-center gap-3">
                    {contribution !== null && (
                      <div className="text-xs text-white/40">
                        contributing <span className="text-foam font-mono">{contribution} pts</span>
                      </div>
                    )}
                    <div className="bg-foam/10 border border-foam/20 rounded px-2 py-0.5
                                    font-mono text-xs text-foam">
                      {pct}% weight today
                    </div>
                  </div>
                </div>

                {/* Weight bar across ranges */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {['inshore','offshore','midrange','deepDrop'].map(r => {
                    const w = Math.round((WEIGHTS[r]?.[conditionKey] || 0) * 100)
                    return (
                      <div key={r}>
                        <div className="text-xs text-white/30 mb-1 capitalize">
                          {r === 'deepDrop' ? 'Deep drop' :
                           r === 'midrange' ? 'Mid-range' : r}
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all
                              ${r === range ? 'bg-foam' : 'bg-white/20'}`}
                            style={{ width: `${w * 2}%` }}
                          />
                        </div>
                        <div className={`text-xs mt-1 font-mono
                          ${r === range ? 'text-foam' : 'text-white/30'}`}>
                          {w}%
                        </div>
                      </div>
                    )
                  })}
                </div>

                <p className="text-white/55 text-xs leading-relaxed mb-2">{factor.why}</p>
                <div className="text-xs text-white/30 font-mono">
                  Source: {factor.source}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-navy-mid border border-caution/20 rounded-xl p-4">
        <div className="text-caution text-xs font-mono tracking-widest mb-2">NOTE</div>
        <p className="text-white/50 text-sm leading-relaxed">{ex.note}</p>
      </div>

    </div>
  )
}
