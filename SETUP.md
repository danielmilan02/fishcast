# FishCast — Setup & Next Steps

## What's in this scaffold

```
fishcast/
├── src/
│   ├── config/
│   │   ├── locations.js     ← All Florida locations, buoy IDs, station IDs
│   │   └── scoring.js       ← Go Score engine — weights, thresholds, logic
│   ├── hooks/
│   │   └── useNoaa.js       ← All NOAA API fetching (tides, weather, buoys)
│   ├── pages/
│   │   └── Dashboard.jsx    ← Main layout, tab routing, URL state
│   ├── components/
│   │   ├── index.jsx        ← All UI components
│   │   └── HowItWorks.jsx   ← Score explanation tab
│   ├── App.jsx              ← URL params → shareable links
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

---

## Step 1 — Install Node.js

Download from https://nodejs.org — get the LTS version (v20+).
Verify it installed: open Terminal and run `node --version`

---

## Step 2 — Set up the project

Open Terminal, navigate to where you want the project, then:

```bash
# Move into the fishcast folder
cd fishcast

# Install all dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser. You should see the dashboard.

---

## Step 3 — Fix the component imports

The components are currently all in one file (`src/components/index.jsx`).
In Dashboard.jsx, update the imports to:

```jsx
import {
  GoScoreGauge,
  TripToggle,
  ConditionTile,
  WeekStrip,
  TideTile,
  SolunarTile,
  SpeciesPanel,
  AlertPanel,
  TimelineTile,
  BuoyTile,
  WindyEmbed,
} from '../components/index'
import HowItWorks from '../components/HowItWorks'
```

---

## Step 4 — Get the live data working

The app currently uses demo/fallback data. To get real NOAA data:

### Tides & Water Temp
These work directly in the browser. No key needed.
The `fetchTides()` and `fetchWaterTemp()` functions in `useNoaa.js` are ready to go.

### Weather.gov forecasts
Also works directly. No key needed.
`fetchWeatherGrid()` → `fetchForecast()` → done.

### NDBC Buoys (the tricky one)
NDBC doesn't allow direct browser requests (CORS issue).
Two options:

**Option A — Easiest: Use allorigins proxy (already in the code)**
Already wired up in `fetchBuoy()`. Works immediately but depends on a third-party proxy.

**Option B — Best for production: Vercel Edge Function**
Create `api/buoy.js` in your project:

```js
export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { id } = new URL(req.url, 'http://x').searchParams
  const res = await fetch(`https://www.ndbc.noaa.gov/data/realtime2/${id}.txt`)
  const text = await res.text()
  return new Response(text, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  })
}
```

Then in `useNoaa.js`, change the buoy fetch URL to `/api/buoy?id=${stationId}`.

---

## Step 5 — Deploy to Vercel (free)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial fishcast scaffold"
   ```
   Create a repo on github.com, then push to it.

2. Go to vercel.com → New Project → Import your GitHub repo
3. Vercel auto-detects Vite. Hit Deploy.
4. Your app is live at `yourproject.vercel.app`

From here, every `git push` auto-deploys. Zero config.

---

## Step 6 — Shareable links (already works)

The URL state is already wired up in `App.jsx`.
When someone changes the location or trip range, the URL updates automatically.

Examples:
- `fishcast.vercel.app/?loc=tampa&range=offshore`
- `fishcast.vercel.app/?loc=pensacola&range=deepDrop`
- `fishcast.vercel.app/?loc=keys&range=inshore&tab=score`

The "Share link" button in the top bar copies the current URL to clipboard.

---

## What to work on next (in order)

1. **Get the buoy data working** — biggest impact, most real data
2. **Tune the Go Score weights** — show it to someone who fishes and ask if the score feels right
3. **Add the Florida map view** — a map with color-coded dots per location
4. **Mobile layout** — most anglers will use this on their phone
5. **Add more locations** — the config structure is ready, just add entries to `locations.js`

---

## Adding a new location

Open `src/config/locations.js` and copy an existing location block.
You need:
- NOAA Tides station ID → tidesandcurrents.noaa.gov/map
- NDBC buoy IDs → ndbc.noaa.gov (find the nearest buoys)
- Weather.gov grid → hit `api.weather.gov/points/{lat},{lon}` in your browser
- Windfinder URLs → find the nearest stations on windfinder.com

That's it. The rest of the app picks it up automatically.

---

## The Go Score — tuning guide

The weights and thresholds live in `src/config/scoring.js`.
Everything is commented. To adjust:

- **Make wind matter more inshore**: increase `WEIGHTS.inshore.wind`, decrease something else to keep the sum at 1.0
- **Raise the wave tolerance for deep drop**: increase `THRESHOLDS.waves.deepDrop.bad`
- **Add a new condition** (e.g. visibility, current speed): add it to WEIGHTS, THRESHOLDS, and the `computeGoScore()` function

The `HowItWorks` tab in the dashboard automatically reflects any changes you make here.
