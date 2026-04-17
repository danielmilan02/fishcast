export default function BuoyTile({ rangeConfig, buoyData }) {
  const buoyIds = rangeConfig.buoys || [rangeConfig.buoy]

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2">BUOY DATA</div>
      <div className="space-y-2">
        {buoyIds.map(id => (
          <div
            key={id}
            className="flex items-center justify-between bg-navy-light/40 rounded-lg px-3 py-2.5"
          >
            <div>
              <div className="text-white text-sm font-medium">Buoy {id}</div>
              <div className="text-white/30 text-xs font-mono">ndbc.noaa.gov · {id}</div>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-xs text-white/30">Waves</div>
                <div className="text-sm font-mono text-white">{buoyData?.waveHeight || '—'} ft</div>
              </div>
              <div>
                <div className="text-xs text-white/30">Wind</div>
                <div className="text-sm font-mono text-white">{buoyData?.windSpeed || '—'} mph</div>
              </div>
              <div>
                <div className="text-xs text-white/30">Temp</div>
                <div className="text-sm font-mono text-white">{buoyData?.waterTemp || '—'}°F</div>
              </div>
              <a
                href={`https://www.ndbc.noaa.gov/station_page.php?station=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foam/50 text-xs hover:text-foam self-center"
              >
                View →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
