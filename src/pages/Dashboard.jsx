import { useState } from 'react'
import { LOCATIONS, LOCATION_LIST } from '../config/locations'
import { computeGoScore } from '../config/scoring'
import { useNoaaData } from '../hooks/useNoaa'
import GoScoreGauge  from '../components/GoScoreGauge'
import TripToggle    from '../components/TripToggle'
import ConditionTile from '../components/ConditionTile'
import WeekStrip     from '../components/WeekStrip'
import TideTile      from '../components/TideTile'
import SolunarTile   from '../components/SolunarTile'
import SpeciesPanel  from '../components/SpeciesPanel'
import AlertPanel    from '../components/AlertPanel'
import TimelineTile  from '../components/TimelineTile'
import BuoyTile      from '../components/BuoyTile'
import WindyEmbed    from '../components/WindyEmbed'
import HowItWorks    from '../components/HowItWorks'

export default function Dashboard({
  locId, range, tab,
  onLocChange, onRangeChange, onTabChange,
  getShareUrl,
}) {
  const [copied, setCopied] = useState(false)
  const location = LOCATIONS[locId] || LOCATIONS.tampa
  const rangeConfig = location.ranges[range] || location.ranges.offshore

  const { data } = useNoaaData(location, range)

  const conditions = data?.conditions || {
    wind: 12, waves: 2.1, period: 9,
    temp: 74, rain: 15, moonPhase: 4,
  }
  const scoreResult = computeGoScore(conditions, range)

  function handleShare() {
    navigator.clipboard.writeText(getShareUrl()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3
                      bg-navy-mid border border-white/10 rounded-xl px-4 py-3">
        <div>
          <div className="text-white font-condensed text-lg font-semibold tracking-wide">
            {location.name}
          </div>
          <div className="text-foam/60 font-mono text-xs mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            })}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {LOCATION_LIST.map(loc => (
            <button
              key={loc.id}
              onClick={() => onLocChange(loc.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${locId === loc.id
                  ? 'bg-foam/20 text-foam border border-foam/30'
                  : 'text-white/50 border border-white/10 hover:border-white/20'}`}
            >
              {loc.shortName}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs text-white/30 border border-white/10">
            + Add
          </button>
        </div>

        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10
                     text-foam/70 hover:text-foam hover:border-foam/30 transition-colors"
        >
          {copied ? '✓ Copied!' : '⎘ Share link'}
        </button>
      </div>

      {/* TRIP RANGE TOGGLE */}
      <TripToggle ranges={location.ranges} active={range} onChange={onRangeChange} />

      {/* TAB BAR */}
      <div className="flex gap-1 mb-4 border-b border-white/10">
        {[
          { id: 'dashboard',   label: 'Conditions' },
          { id: 'score',       label: 'How the score works' },
          { id: 'map',         label: 'Windy map' },
          { id: 'regulations', label: 'Regulations ↗' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id === 'regulations') {
                window.open(location.fishRulesUrl || 'https://app.fishrulesapp.com/', '_blank')
              } else {
                onTabChange(t.id)
              }
            }}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
              ${tab === t.id
                ? 'border-foam text-foam'
                : t.id === 'regulations'
                ? 'border-transparent text-sand/60 hover:text-sand'
                : 'border-transparent text-white/40 hover:text-white/60'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONDITIONS TAB */}
      {tab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-[180px_1fr] gap-3 mb-3">
            <GoScoreGauge result={scoreResult} range={range} rangeConfig={rangeConfig} />
            <WeekStrip range={range} />
          </div>

          <div className="text-xs font-mono text-white/30 tracking-widest mb-2 mt-4 pl-2 border-l-2 border-white/20">
            CONDITIONS · {rangeConfig.label.toUpperCase()} {rangeConfig.sublabel}
          </div>
          <div className="grid grid-cols-4 gap-2.5 mb-2.5">
            <ConditionTile label="Wind"       value={conditions.wind}  unit="mph" sub={`Gusts ${Math.round(conditions.wind * 1.3)} mph`} range={range} type="wind"  buoySource={rangeConfig.buoy} />
            <ConditionTile label="Wave height" value={conditions.waves} unit="ft"  sub={`${conditions.period}s period`}                  range={range} type="waves" buoySource={rangeConfig.buoy} />
            <ConditionTile label="Water temp"  value={conditions.temp}  unit="°F"                                                         range={range} type="temp"  buoySource={rangeConfig.buoy} />
            <ConditionTile label="Rain chance" value={conditions.rain}  unit="%"                                                          range={range} type="rain" />
          </div>

          <TimelineTile range={range} conditions={conditions} />

          <div className="text-xs font-mono text-white/30 tracking-widest mb-2 mt-4 pl-2 border-l-2 border-white/20">
            TIDES + SOLUNAR
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <TideTile tides={data?.tides || []} stationId={rangeConfig.tidesStation} />
            <SolunarTile moon={data?.moon} />
          </div>

          <div className="text-xs font-mono text-white/30 tracking-widest mb-2 mt-4 pl-2 border-l-2 border-white/20">
            SPECIES OUTLOOK · {rangeConfig.label.toUpperCase()}
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <SpeciesPanel species={rangeConfig.species} conditions={conditions} range={range} />
            <AlertPanel   conditions={conditions} scoreResult={scoreResult} range={range} rangeConfig={rangeConfig} />
          </div>

          <div className="text-xs font-mono text-white/30 tracking-widest mb-2 mt-4 pl-2 border-l-2 border-white/20">
            RAW BUOY DATA
          </div>
          <BuoyTile rangeConfig={rangeConfig} buoyData={data?.buoy} />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {Object.entries(location.windfinder).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                className={`block text-center px-3 py-2 rounded-lg text-xs border transition-colors
                  ${key === range
                    ? 'border-foam/30 text-foam bg-foam/10'
                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                <div className="font-medium">Windfinder</div>
                <div className="text-white/40 mt-0.5">{location.ranges[key]?.sublabel}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === 'score' && <HowItWorks scoreResult={scoreResult} range={range} />}

      {tab === 'map' && (
        <WindyEmbed coords={location.windy[range]} range={range} rangeConfig={rangeConfig} />
      )}
    </div>
  )
}
