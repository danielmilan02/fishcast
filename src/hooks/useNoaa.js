// ─────────────────────────────────────────────────────────────────
// useNoaa.js — Custom hook for fetching all NOAA data
//
// Data sources:
//   Tides:   api.tidesandcurrents.noaa.gov
//   Weather: api.weather.gov
//   Buoys:   ndbc.noaa.gov (plain text, parsed here)
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

const TIDES_BASE = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'
const WEATHER_BASE = 'https://api.weather.gov'
const BUOY_BASE = 'https://www.ndbc.noaa.gov/data/realtime2'

// ── TIDES ─────────────────────────────────────────────────────
export async function fetchTides(stationId) {
  const params = new URLSearchParams({
    date: 'today',
    station: stationId,
    product: 'predictions',
    datum: 'MLLW',
    time_zone: 'lst_ldt',
    interval: 'hilo',
    units: 'english',
    application: 'fishcast_dashboard',
    format: 'json',
  })
  const res = await fetch(`${TIDES_BASE}?${params}`)
  const data = await res.json()
  // Returns array of { t: "2026-04-01 02:14", v: "-0.016", type: "L" }
  return data.predictions || []
}

export async function fetchWaterTemp(stationId) {
  const params = new URLSearchParams({
    date: 'latest',
    station: stationId,
    product: 'water_temperature',
    units: 'english',
    time_zone: 'lst_ldt',
    application: 'fishcast_dashboard',
    format: 'json',
  })
  const res = await fetch(`${TIDES_BASE}?${params}`)
  const data = await res.json()
  return data.data?.[0]?.v ? parseFloat(data.data[0].v) : null
}

// ── WEATHER.GOV ──────────────────────────────────────────────
// Step 1: Get the forecast grid for a lat/lon (call once, cache result)
export async function fetchWeatherGrid(lat, lon) {
  const res = await fetch(`${WEATHER_BASE}/points/${lat},${lon}`)
  const data = await res.json()
  return {
    gridId: data.properties.gridId,
    gridX:  data.properties.gridX,
    gridY:  data.properties.gridY,
    forecastUrl:       data.properties.forecast,
    forecastHourlyUrl: data.properties.forecastHourly,
    forecastOffshoreUrl: data.properties.forecastZoneForecast,
  }
}

// Step 2: Get the forecast periods
export async function fetchForecast(forecastUrl) {
  const res = await fetch(forecastUrl)
  const data = await res.json()
  return data.properties.periods || []
}

// Step 3: Get hourly forecast (useful for timeline tiles)
export async function fetchHourlyForecast(forecastHourlyUrl) {
  const res = await fetch(forecastHourlyUrl)
  const data = await res.json()
  return data.properties.periods || []
}

// ── NDBC BUOY ────────────────────────────────────────────────
// NDBC returns plain text — we parse it here so the rest of the
// app can work with clean objects.
export async function fetchBuoy(stationId) {
  // Use a CORS proxy for browser requests — in production use a
  // Cloudflare Worker or Vercel edge function to proxy this
  const url = `${BUOY_BASE}/${stationId}.txt`

  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`)
    const text = await res.text()
    return parseBuoyText(text)
  } catch (err) {
    console.error(`Buoy ${stationId} fetch failed:`, err)
    return null
  }
}

function parseBuoyText(text) {
  const lines = text.trim().split('\n')
  // Skip the two header lines (start with #)
  const dataLines = lines.filter(l => !l.startsWith('#'))
  if (!dataLines.length) return null

  // Most recent reading is first data line
  const cols = dataLines[0].trim().split(/\s+/)
  // Column order: YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
  const [YY, MM, DD, hh, mm, WDIR, WSPD, GST, WVHT, DPD, APD, MWD, PRES, ATMP, WTMP] = cols

  const safe = (v) => (v === '999' || v === '99.0' || v === '9999.0' || v === 'MM') ? null : parseFloat(v)

  return {
    timestamp: `${YY}-${MM}-${DD} ${hh}:${mm} UTC`,
    windDir:   safe(WDIR),                          // degrees
    windSpeed: safe(WSPD) ? Math.round(safe(WSPD) * 2.237) : null,  // m/s → mph
    windGust:  safe(GST)  ? Math.round(safe(GST)  * 2.237) : null,
    waveHeight: safe(WVHT) ? Math.round(safe(WVHT) * 3.281 * 10) / 10 : null, // m → ft
    wavePeriod: safe(DPD),                          // seconds
    waterTemp:  safe(WTMP) ? Math.round((safe(WTMP) * 9/5 + 32) * 10) / 10 : null, // °C → °F
    airTemp:    safe(ATMP) ? Math.round((safe(ATMP) * 9/5 + 32) * 10) / 10 : null,
    pressure:   safe(PRES),                         // hPa
  }
}

// ── MOON PHASE ───────────────────────────────────────────────
// Uses SunCalc library (installed as dependency)
export function getMoonPhase() {
  try {
    const SunCalc = window.SunCalc
    if (!SunCalc) return { index: 4, name: 'Full Moon', icon: '🌕' }
    const moon = SunCalc.getMoonIllumination(new Date())
    // phase is 0–1, convert to 0–7 index
    const index = Math.round(moon.phase * 8) % 8
    const phases = [
      { name: 'New Moon',        icon: '🌑' },
      { name: 'Waxing Crescent', icon: '🌒' },
      { name: 'First Quarter',   icon: '🌓' },
      { name: 'Waxing Gibbous',  icon: '🌔' },
      { name: 'Full Moon',       icon: '🌕' },
      { name: 'Waning Gibbous',  icon: '🌖' },
      { name: 'Last Quarter',    icon: '🌗' },
      { name: 'Waning Crescent', icon: '🌘' },
    ]
    return { index, ...phases[index], illumination: Math.round(moon.fraction * 100) }
  } catch {
    return { index: 0, name: 'Unknown', icon: '🌑', illumination: 0 }
  }
}

// ── MAIN HOOK ────────────────────────────────────────────────
/**
 * useNoaaData — fetches all data for a location + range combination
 *
 * Usage:
 *   const { data, loading, error } = useNoaaData(location, range)
 */
export function useNoaaData(location, range) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location || !range) return
    setLoading(true)
    setError(null)

    const rangeConfig = location.ranges[range]

    async function loadAll() {
      try {
        const buoyId = Array.isArray(rangeConfig.buoys)
          ? rangeConfig.buoys[0]
          : rangeConfig.buoy

        const [tides, buoy, gridInfo] = await Promise.allSettled([
          fetchTides(rangeConfig.tidesStation),
          fetchBuoy(buoyId),
          fetchWeatherGrid(location.lat, location.lon),
        ])

        let forecast = []
        let hourly = []
        if (gridInfo.status === 'fulfilled' && gridInfo.value?.forecastUrl) {
          const [f, h] = await Promise.allSettled([
            fetchForecast(gridInfo.value.forecastUrl),
            fetchHourlyForecast(gridInfo.value.forecastHourlyUrl),
          ])
          forecast = f.status === 'fulfilled' ? f.value : []
          hourly   = h.status === 'fulfilled' ? h.value : []
        }

        const buoyData = buoy.status === 'fulfilled' ? buoy.value : null

        setData({
          tides:    tides.status === 'fulfilled' ? tides.value : [],
          buoy:     buoyData,
          forecast,
          hourly,
          moon:     getMoonPhase(),
          // Derived conditions object for the scoring engine
          conditions: {
            wind:      buoyData?.windSpeed   || extractWindFromForecast(forecast),
            waves:     buoyData?.waveHeight  || 2.0,
            period:    buoyData?.wavePeriod  || 8,
            temp:      buoyData?.waterTemp   || 74,
            rain:      extractRainFromForecast(hourly),
            moonPhase: getMoonPhase().index,
          },
          fetchedAt: new Date(),
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [location?.id, range])

  return { data, loading, error }
}

// ── HELPERS ──────────────────────────────────────────────────

function extractWindFromForecast(periods) {
  if (!periods.length) return 12
  const first = periods[0]
  const match = first.windSpeed?.match(/(\d+)/)
  return match ? parseInt(match[1]) : 12
}

function extractRainFromForecast(hourly) {
  if (!hourly.length) return 10
  // Average rain chance over next 6 hours
  const next6 = hourly.slice(0, 6)
  const avg = next6.reduce((sum, p) =>
    sum + (p.probabilityOfPrecipitation?.value || 0), 0) / next6.length
  return Math.round(avg)
}
