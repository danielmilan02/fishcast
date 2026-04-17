// ─────────────────────────────────────────────────────────────────
// GoScoreGauge.jsx
// ─────────────────────────────────────────────────────────────────
export function GoScoreGauge({ result, range, rangeConfig }) {
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

// ─────────────────────────────────────────────────────────────────
// TripToggle.jsx
// ─────────────────────────────────────────────────────────────────
export function TripToggle({ ranges, active, onChange }) {
  const order = ['inshore', 'offshore', 'midrange', 'deepDrop']
  return (
    <div className="flex gap-0 border border-white/15 rounded-xl overflow-hidden mb-4">
      {order.map((key, i) => {
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

// ─────────────────────────────────────────────────────────────────
// ConditionTile.jsx — with interpretation layer
// ─────────────────────────────────────────────────────────────────
import { interpretCondition } from '../config/scoring'

export function ConditionTile({ label, value, unit, sub, range, type, buoySource }) {
  const interp = interpretCondition(type, value, range)
  const colorClass = getInterpColor(interp)

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2">{label.toUpperCase()}</div>
      <div className="text-2xl font-mono font-bold text-white leading-none">
        {value}<span className="text-sm text-white/40 font-normal ml-1">{unit}</span>
      </div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
      {interp && (
        <div className={`inline-block text-xs px-2 py-0.5 rounded mt-2 font-medium ${colorClass}`}>
          {interp}
        </div>
      )}
      {buoySource && (
        <div className="text-xs text-white/20 font-mono mt-1">Buoy {buoySource}</div>
      )}
    </div>
  )
}

function getInterpColor(interp) {
  if (!interp) return ''
  const good = ['Flat','Comfortable','Light','Calm','Low','Excellent','Favorable']
  const bad  = ['Too rough','Rough','Too windy','Dangerous','Turn back']
  if (good.some(w => interp.includes(w))) return 'bg-go/15 text-go'
  if (bad.some(w => interp.includes(w)))  return 'bg-stop/15 text-stop'
  return 'bg-caution/15 text-caution'
}

// ─────────────────────────────────────────────────────────────────
// WeekStrip.jsx
// ─────────────────────────────────────────────────────────────────
import { computeGoScore } from '../config/scoring'

const DAYS = ['Today','Thu','Fri','Sat','Sun','Mon','Tue']
const DEMO_CONDITIONS = [
  { wind:12,waves:2.1,period:9,temp:74,rain:15,moonPhase:4 },
  { wind:8, waves:1.8,period:9,temp:74,rain:10,moonPhase:5 },
  { wind:18,waves:3.1,period:7,temp:73,rain:35,moonPhase:5 },
  { wind:28,waves:4.5,period:6,temp:72,rain:60,moonPhase:6 },
  { wind:32,waves:5.2,period:6,temp:72,rain:70,moonPhase:6 },
  { wind:15,waves:2.8,period:8,temp:73,rain:20,moonPhase:7 },
  { wind:10,waves:2.0,period:9,temp:74,rain:12,moonPhase:7 },
]

export function WeekStrip({ range }) {
  const scores = DEMO_CONDITIONS.map(c => computeGoScore(c, range).score)
  const winds = ['12 SE','8 S','18 SW','28 W','32 NW','15 N','10 SE']

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-2 font-mono">
        7-DAY GO SCORE · {range.toUpperCase()}
      </div>
      <div className="flex gap-2">
        {scores.map((s, i) => {
          const cls = s >= 70 ? 'bg-go/20 text-go' : s >= 45 ? 'bg-caution/20 text-caution' : 'bg-stop/20 text-stop'
          return (
            <div key={i} className={`flex-1 rounded-lg p-2 text-center ${i===0 ? 'bg-foam/10 border border-foam/20' : 'bg-navy-light/50'}`}>
              <div className={`text-xs mb-1 ${i===0 ? 'text-foam' : 'text-white/30'}`}>{DAYS[i]}</div>
              <div className={`text-base font-mono font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1 ${cls}`}>{s}</div>
              <div className="text-xs text-white/30">{winds[i]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// TideTile.jsx
// ─────────────────────────────────────────────────────────────────
export function TideTile({ tides, stationId }) {
  const demoTides = [
    { t: '3:47 AM',  v: '-0.1', type: 'L' },
    { t: '10:22 AM', v: '1.3',  type: 'H' },
    { t: '5:15 PM',  v: '0.2',  type: 'L' },
    { t: '11:48 PM', v: '1.1',  type: 'H' },
  ]
  const display = tides.length ? tides : demoTides

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/30 tracking-widest">TIDES</div>
        <div className="text-xs text-white/20 font-mono">STN {stationId}</div>
      </div>
      <div className="text-xl font-mono font-bold text-white">Rising</div>
      <div className="text-xs text-white/40 mb-3">Next high: {display.find(t=>t.type==='H')?.t || '—'}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {display.slice(0,4).map((t, i) => (
          <div key={i} className={`bg-navy-light/50 rounded-lg p-2 border-t-2
            ${t.type==='H' ? 'border-foam/50' : 'border-white/10'}`}>
            <div className="text-xs text-white/30">{t.type==='H' ? 'HIGH' : 'LOW'}</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              {t.t || t.time || '—'}
            </div>
            <div className="text-xs text-white/40">{parseFloat(t.v||0).toFixed(1)} ft</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SolunarTile.jsx
// ─────────────────────────────────────────────────────────────────
export function SolunarTile({ moon }) {
  const display = moon || { name: 'Full Moon', icon: '🌕', illumination: 96, index: 4 }
  const majorPct = 85
  const minorPct = 42

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
        {[['Major feed', majorPct, '9:40–11:40 AM'], ['Minor feed', minorPct, '3:52–4:52 PM']].map(([label, pct, window]) => (
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

// ─────────────────────────────────────────────────────────────────
// SpeciesPanel.jsx
// ─────────────────────────────────────────────────────────────────
function rateSpecies(name, conditions) {
  const { wind, waves, temp } = conditions
  const calm = waves <= 2.5 && wind <= 18
  const warm = temp >= 72

  const rules = {
    'Snook':       calm && warm ? 5 : 3,
    'Redfish':     calm ? 4 : 2,
    'Flounder':    calm ? 4 : 2,
    'Cobia':       warm ? 5 : 2,
    'Tarpon':      warm && calm ? 3 : 1,
    'Pompano':     3,
    'Red Snapper': calm ? 4 : 2,
    'Grouper':     calm ? 4 : 2,
    'King Mackerel': warm ? 3 : 1,
    'Amberjack':   calm ? 4 : 3,
    'Mahi-Mahi':   temp >= 75 ? 3 : 1,
    'Wahoo':       temp >= 74 ? 3 : 2,
    'Bonefish':    calm ? 4 : 2,
    'Permit':      calm ? 3 : 1,
    'Sailfish':    temp >= 76 ? 3 : 1,
    'Tuna':        2,
    'Swordfish':   2,
    'Triggerfish': 4,
    'Sheepshead':  3,
    'Barracuda':   3,
    'Blue Marlin': 2,
    'Tuna (BFT)':  2,
  }
  return rules[name] || 2
}

export function SpeciesPanel({ species, conditions, range }) {
  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-3">SPECIES OUTLOOK</div>
      <div className="space-y-1.5">
        {species.map(name => {
          const rating = rateSpecies(name, conditions)
          const color = rating >= 4 ? 'text-go' : rating >= 3 ? 'text-caution' : 'text-stop'
          const label = rating >= 4 ? 'Active' : rating >= 3 ? 'Fair' : 'Slow'
          return (
            <div key={name} className="flex items-center justify-between bg-navy-light/40 rounded-lg px-3 py-2">
              <span className="text-white text-sm">{name}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full
                      ${i <= rating
                        ? rating >= 4 ? 'bg-go' : rating >= 3 ? 'bg-caution' : 'bg-stop'
                        : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${color}`}>{label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// AlertPanel.jsx
// ─────────────────────────────────────────────────────────────────
export function AlertPanel({ conditions, scoreResult, range, rangeConfig }) {
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
  const cls  = {
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

// ─────────────────────────────────────────────────────────────────
// TimelineTile.jsx — Morning / Midday / Afternoon windows
// ─────────────────────────────────────────────────────────────────
export function TimelineTile({ range, conditions }) {
  const windows = [
    { label: 'Morning', time: '6–11 AM', wind: conditions.wind - 4, waves: conditions.waves - 0.3, rain: 5 },
    { label: 'Midday',  time: '11 AM–3 PM', wind: conditions.wind + 2, waves: conditions.waves + 0.3, rain: 20 },
    { label: 'Afternoon', time: '3–7 PM', wind: conditions.wind + 6, waves: conditions.waves + 1.0, rain: 40 },
  ]

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3 mb-2.5">
      <div className="text-xs text-white/30 tracking-widest mb-3">TODAY'S WINDOWS</div>
      <div className="grid grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden">
        {windows.map((w, i) => {
          const s = computeGoScore({...conditions, wind: w.wind, waves: w.waves, rain: w.rain}, range)
          const c = s.color === 'go' ? 'text-go' : s.color === 'caution' ? 'text-caution' : 'text-stop'
          return (
            <div key={i} className="bg-navy-mid p-3">
              <div className="text-xs text-white/30 mb-0.5">{w.label}</div>
              <div className="text-xs text-white/20 mb-2">{w.time}</div>
              <div className={`text-2xl font-mono font-bold ${c} mb-2`}>{s.score}</div>
              <div className="space-y-1 text-xs text-white/40">
                <div className="flex justify-between"><span>Wind</span><span className="text-white/60">{Math.round(w.wind)} mph</span></div>
                <div className="flex justify-between"><span>Waves</span><span className="text-white/60">{w.waves.toFixed(1)} ft</span></div>
                <div className="flex justify-between"><span>Rain</span><span className="text-white/60">{w.rain}%</span></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// BuoyTile.jsx
// ─────────────────────────────────────────────────────────────────
export function BuoyTile({ rangeConfig, buoyData, location }) {
  const buoyIds = rangeConfig.buoys || [rangeConfig.buoy]

  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="space-y-2">
        {buoyIds.map(id => (
          <div key={id} className="flex items-center justify-between bg-navy-light/40 rounded-lg px-3 py-2.5">
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

// ─────────────────────────────────────────────────────────────────
// WindyEmbed.jsx
// ─────────────────────────────────────────────────────────────────
export function WindyEmbed({ coords, range, rangeConfig }) {
  const { lat, lon, zoom } = coords
  const src = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=${zoom}&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=12&pressure=&type=map&location=coordinates&detail=&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1`

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
        Powered by Windy.com · ECMWF model · Centered on {rangeConfig.description}
      </div>
    </div>
  )
}
