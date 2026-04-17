import { useSearchParams, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { DEFAULT_LOCATION, DEFAULT_RANGE } from './config/locations'

// ─────────────────────────────────────────────────────────────────
// App.jsx — handles URL-based state
//
// URL structure:  fishcast.io/?loc=tampa&range=offshore&tab=dashboard
//
// This means every dashboard state is shareable by copying the URL.
// Example shareable links:
//   ?loc=tampa&range=deepdrop          → Tampa deep drop today
//   ?loc=pensacola&range=offshore      → Pensacola offshore
//   ?loc=keys&range=inshore&tab=score  → Keys inshore, score tab
// ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardWithParams />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function DashboardWithParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const loc   = searchParams.get('loc')   || DEFAULT_LOCATION
  const range = searchParams.get('range') || DEFAULT_RANGE
  const tab   = searchParams.get('tab')   || 'dashboard'

  function setLoc(newLoc) {
    setSearchParams(prev => { prev.set('loc', newLoc); return prev })
  }

  function setRange(newRange) {
    setSearchParams(prev => { prev.set('range', newRange); return prev })
  }

  function setTab(newTab) {
    setSearchParams(prev => { prev.set('tab', newTab); return prev })
  }

  // Build a shareable URL for the current state
  function getShareUrl() {
    return window.location.href
  }

  return (
    <Dashboard
      locId={loc}
      range={range}
      tab={tab}
      onLocChange={setLoc}
      onRangeChange={setRange}
      onTabChange={setTab}
      getShareUrl={getShareUrl}
    />
  )
}
