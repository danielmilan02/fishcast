export default function WindyEmbed({ coords, rangeConfig }) {
  const { lat, lon, zoom } = coords
  const src = [
    'https://embed.windy.com/embed2.html',
    `?lat=${lat}&lon=${lon}`,
    `&detailLat=${lat}&detailLon=${lon}`,
    `&zoom=${zoom}`,
    '&level=surface&overlay=wind&product=ecmwf',
    '&menu=&message=true&marker=&calendar=12',
    '&pressure=&type=map&location=coordinates&detail=',
    '&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1',
  ].join('')

  return (
    <div>
      <div className="text-xs text-white/30 tracking-widest mb-3 pl-2 border-l-2 border-white/20">
        WIND & WAVE MODEL · {rangeConfig.label.toUpperCase()} {rangeConfig.sublabel}
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 500 }}>
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Windy forecast map"
        />
      </div>
      <div className="text-xs text-white/30 font-mono mt-2 text-center">
        Powered by Windy.com · ECMWF model · {rangeConfig.description}
      </div>
    </div>
  )
}
