export default function GoScoreGauge({ result, range, rangeConfig }) {
  const { score, verdict, color, label } = result
  const colorClass = {
    go: 'text-go', caution: 'text-caution', stop: 'text-stop'
  }[color]
  const bgClass = {
    go: 'border-go/30', caution: 'border-caution/30', stop: 'border-stop/30'
  }[color]

  return (
    <div className={`bg-navy-mid border rounded-xl p-4 text-center flex flex-col items-center justify-center ${bgClass}`}>
      <div className={`text-xs font-mono tracking-widest mb-2 ${colorClass}`}>
        GO SCORE
      </div>
      <div className={`text-6xl font-mono font-bold leading-none mb-2 ${colorClass}`}>
        {score}
      </div>
      <div className={`text-sm font-condensed font-semibold mb-2 ${colorClass}`}>
        {verdict}
      </div>
      <div className="text-white/40 text-xs text-center leading-relaxed px-1">
        {label}
      </div>
    </div>
  )
}
