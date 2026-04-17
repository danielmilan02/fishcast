const DEMO_TIDES = [
  { t: '3:47 AM',  v: '-0.1', type: 'L' },
  { t: '10:22 AM', v: '1.3',  type: 'H' },
  { t: '5:15 PM',  v: '0.2',  type: 'L' },
  { t: '11:48 PM', v: '1.1',  type: 'H' },
]

export default function TideTile({ tides, stationId }) {
  const display = tides && tides.length ? tides : DEMO_TIDES
  const nextHigh = display.find(t => t.type === 'H')

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/30 tracking-widest">TIDES</div>
        <div className="text-xs text-white/20 font-mono">STN {stationId}</div>
      </div>
      <div className="text-xl font-mono font-bold text-white">Rising</div>
      <div className="text-xs text-white/40 mb-3">
        Next high: {nextHigh?.t || '—'}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {display.slice(0, 4).map((t, i) => (
          <div
            key={i}
            className={`bg-navy-light/50 rounded-lg p-2 border-t-2
              ${t.type === 'H' ? 'border-foam/50' : 'border-white/10'}`}
          >
            <div className="text-xs text-white/30">{t.type === 'H' ? 'HIGH' : 'LOW'}</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              {t.t || t.time || '—'}
            </div>
            <div className="text-xs text-white/40">
              {parseFloat(t.v || 0).toFixed(1)} ft
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
