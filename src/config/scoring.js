// ─────────────────────────────────────────────────────────────────
// GO SCORE ENGINE
//
// The Go Score is a 0–100 number representing how good conditions
// are for fishing today, weighted by trip range.
//
// HOW IT WORKS:
// 1. Each condition (wind, waves, etc.) is scored 0.0–1.0
// 2. Each condition has a different weight per trip range
// 3. The weighted scores are summed → multiplied by 100
// 4. The interpretation of "good" vs "bad" also shifts per range
// ─────────────────────────────────────────────────────────────────

// ── WEIGHTS ────────────────────────────────────────────────────
// How much each condition contributes to the final score.
// All weights in a range must sum to 1.0.
// Tweak these as you get feedback from captains.

export const WEIGHTS = {
  inshore: {
    wind:    0.35,   // Small boats feel wind most — highest weight
    waves:   0.18,
    rain:    0.22,   // Lightning risk close to shore matters more
    temp:    0.10,
    solunar: 0.10,
    period:  0.05,   // Wave period matters less inshore
  },
  offshore: {
    wind:    0.28,
    waves:   0.30,   // Waves become the dominant factor
    rain:    0.12,
    temp:    0.12,
    solunar: 0.10,
    period:  0.08,
  },
  midrange: {
    wind:    0.24,
    waves:   0.32,
    rain:    0.10,
    temp:    0.12,
    solunar: 0.10,
    period:  0.12,   // Period matters more — distinguishing swell from chop
  },
  deepDrop: {
    wind:    0.20,
    waves:   0.32,
    rain:    0.08,   // Rain barely matters if you're 100 miles out
    temp:    0.12,
    solunar: 0.10,
    period:  0.18,   // Wave period most important — swell period = comfort offshore
  },
}

// ── THRESHOLDS ─────────────────────────────────────────────────
// The conditions that define great / ok / bad per trip range.
// Offshore boats tolerate more — thresholds shift up as you go further.

export const THRESHOLDS = {
  wind: {
    // mph
    inshore:  { great: 10, ok: 15, bad: 20  },
    offshore: { great: 14, ok: 20, bad: 26  },
    midrange: { great: 16, ok: 23, bad: 30  },
    deepDrop: { great: 18, ok: 26, bad: 34  },
  },
  waves: {
    // feet
    inshore:  { great: 0.5, ok: 1.5, bad: 2.5 },
    offshore: { great: 1.5, ok: 3.0, bad: 4.5 },
    midrange: { great: 2.0, ok: 4.0, bad: 6.0 },
    deepDrop: { great: 3.0, ok: 5.0, bad: 8.0 },
  },
  rain: {
    // % probability
    inshore:  { great: 10, ok: 30, bad: 55 },
    offshore: { great: 15, ok: 35, bad: 60 },
    midrange: { great: 15, ok: 40, bad: 65 },
    deepDrop: { great: 20, ok: 45, bad: 70 },
  },
  temp: {
    // °F water temp — universal range, species-agnostic
    // All ranges use same water temp thresholds
    inshore:  { great: [68, 86], ok: [60, 90], bad: null },
    offshore: { great: [70, 86], ok: [62, 90], bad: null },
    midrange: { great: [72, 86], ok: [64, 90], bad: null },
    deepDrop: { great: [74, 84], ok: [68, 90], bad: null },
  },
  period: {
    // wave period in seconds — longer = smoother swell
    inshore:  { great: 8,  ok: 5,  bad: 3  },
    offshore: { great: 9,  ok: 6,  bad: 4  },
    midrange: { great: 10, ok: 7,  bad: 5  },
    deepDrop: { great: 11, ok: 8,  bad: 5  },
  },
}

// ── SCORING FUNCTIONS ──────────────────────────────────────────

/**
 * Score a single metric against its thresholds.
 * Returns 0.0 – 1.0
 * "higher is worse" = true for wind, waves, rain
 * "higher is worse" = false for period, temp
 */
function scoreSimple(value, thresholds) {
  if (value <= thresholds.great) return 1.0
  if (value <= thresholds.ok)    return 0.65
  if (value <= thresholds.bad)   return 0.25
  return 0.05
}

function scoreTemp(value, thresholds) {
  const [greatLow, greatHigh] = thresholds.great
  const [okLow, okHigh] = thresholds.ok
  if (value >= greatLow && value <= greatHigh) return 1.0
  if (value >= okLow    && value <= okHigh)    return 0.65
  return 0.25
}

function scorePeriod(value, thresholds) {
  // Higher period = better
  if (value >= thresholds.great) return 1.0
  if (value >= thresholds.ok)    return 0.65
  if (value >= thresholds.bad)   return 0.35
  return 0.10
}

function scoreSolunar(phase) {
  // Moon phase index 0-7 (0=new, 4=full)
  // Full moon and new moon = peak solunar activity
  const scores = [0.88, 0.72, 0.80, 0.88, 1.0, 0.88, 0.80, 0.72]
  return scores[phase] || 0.72
}

/**
 * Main Go Score function.
 *
 * @param {object} conditions - { wind, waves, rain, temp, period, moonPhase }
 * @param {string} range - 'inshore' | 'offshore' | 'midrange' | 'deepDrop'
 * @returns {object} - { score: 0-100, breakdown: {...}, verdict, label }
 */
export function computeGoScore(conditions, range) {
  const w = WEIGHTS[range]
  const t = THRESHOLDS

  const breakdown = {
    wind:    scoreSimple(conditions.wind,   t.wind[range]),
    waves:   scoreSimple(conditions.waves,  t.waves[range]),
    rain:    scoreSimple(conditions.rain,   t.rain[range]),
    temp:    scoreTemp(conditions.temp,     t.temp[range]),
    solunar: scoreSolunar(conditions.moonPhase || 0),
    period:  scorePeriod(conditions.period, t.period[range]),
  }

  const weighted = {
    wind:    breakdown.wind    * w.wind,
    waves:   breakdown.waves   * w.waves,
    rain:    breakdown.rain    * w.rain,
    temp:    breakdown.temp    * w.temp,
    solunar: breakdown.solunar * w.solunar,
    period:  breakdown.period  * w.period,
  }

  const raw = Object.values(weighted).reduce((a, b) => a + b, 0)
  const score = Math.round(raw * 100)

  return {
    score,
    breakdown,    // Raw 0-1 scores per condition (for the "how it works" tab)
    weighted,     // Weighted contributions (useful for bar chart)
    verdict:  scoreVerdict(score, range),
    color:    scoreColor(score),
    label:    scoreLabel(score, range),
  }
}

// ── VERDICT / DISPLAY HELPERS ──────────────────────────────────

export function scoreVerdict(score, range) {
  if (score >= 75) return 'Go Fish'
  if (score >= 50) return 'Proceed with Caution'
  return 'Stay Ashore'
}

export function scoreColor(score) {
  if (score >= 75) return 'go'
  if (score >= 50) return 'caution'
  return 'stop'
}

export function scoreLabel(score, range) {
  const rangeLabel = {
    inshore:  'inshore trips',
    offshore: 'offshore trips',
    midrange: 'mid-range trips',
    deepDrop: 'deep drop trips',
  }[range]

  if (score >= 80) return `Excellent conditions for ${rangeLabel}`
  if (score >= 65) return `Good conditions for ${rangeLabel}`
  if (score >= 50) return `Marginal — plan around the best window`
  if (score >= 35) return `Rough — experienced crews only`
  return `Not recommended for ${rangeLabel} today`
}

// ── CONDITION INTERPRETATION ───────────────────────────────────
// This is the "interpretation layer" — same number, different meaning
// depending on trip range. Used for the tile sub-labels.

export function interpretCondition(type, value, range) {
  const interps = {
    waves: {
      inshore:  [[0.5,'Flat — ideal'],[1.5,'Light chop'],[2.5,'Moderate'],[99,'Too rough']],
      offshore: [[1.5,'Comfortable'],[3.0,'Manageable'],[4.5,'Rough'],[99,'Dangerous']],
      midrange: [[2.0,'Comfortable'],[4.0,'Manageable'],[6.0,'Rough'],[99,'Turn back']],
      deepDrop: [[3.0,'Comfortable'],[5.0,'Moderate'],[8.0,'Rough'],[99,'Dangerous']],
    },
    wind: {
      inshore:  [[10,'Light & calm'],[15,'Breezy'],[20,'Choppy'],[99,'Too windy']],
      offshore: [[14,'Light'],[20,'Moderate'],[26,'Strong'],[99,'Too rough']],
      midrange: [[16,'Light'],[23,'Moderate'],[30,'Strong'],[99,'Dangerous']],
      deepDrop: [[18,'Light'],[26,'Moderate'],[34,'Strong'],[99,'Do not go']],
    },
  }

  const table = interps[type]?.[range]
  if (!table) return ''
  for (const [thresh, label] of table) {
    if (value <= thresh) return label
  }
  return ''
}

// ── SCORE EXPLANATION (for the How It Works tab) ───────────────

export const SCORE_EXPLANATION = {
  title: 'How the Go Score works',
  intro: `The Go Score is a single number from 0–100 that tells you how good today's conditions are for your specific trip. It's not a generic weather score — it's calculated differently depending on how far offshore you're running.`,

  keyIdea: `The same 18 mph wind means something completely different on a 22-foot center console heading 5 miles out versus a 42-foot sportfisher running 90 miles to the Middle Grounds. The score accounts for that.`,

  factors: [
    {
      name: 'Wind speed',
      weight: { inshore: '35%', offshore: '28%', midrange: '24%', deepDrop: '20%' },
      why: 'Wind is the biggest factor for smaller inshore boats. As your vessel size and trip distance increase, waves and period take over as the dominant concern.',
      source: 'NOAA Weather.gov marine forecast',
    },
    {
      name: 'Wave height',
      weight: { inshore: '18%', offshore: '30%', midrange: '32%', deepDrop: '32%' },
      why: 'Wave height becomes the most important offshore factor. A 3-foot sea is flat inshore but normal for a mid-range trip.',
      source: 'NDBC buoy (station varies by range)',
    },
    {
      name: 'Wave period',
      weight: { inshore: '5%', offshore: '8%', midrange: '12%', deepDrop: '18%' },
      why: 'Period separates swell from chop. A 10-second period at 4 feet is a smooth ride. A 4-second period at 4 feet is miserable. Period matters most for deep drop trips.',
      source: 'NDBC buoy',
    },
    {
      name: 'Rain / storm risk',
      weight: { inshore: '22%', offshore: '12%', midrange: '10%', deepDrop: '8%' },
      why: 'Lightning is a serious risk close to shore with no shelter. Inshore boats have nowhere to hide. Offshore, rain alone rarely stops a trip — thunderstorm risk is what matters.',
      source: 'NOAA Weather.gov hourly forecast',
    },
    {
      name: 'Water temperature',
      weight: { inshore: '10%', offshore: '12%', midrange: '12%', deepDrop: '12%' },
      why: 'Water temp drives fish activity and species location. Each species has a preferred temperature range — the score reflects how many target species are likely to be active.',
      source: 'NDBC buoy WTMP reading',
    },
    {
      name: 'Solunar activity',
      weight: { inshore: '10%', offshore: '10%', midrange: '10%', deepDrop: '10%' },
      why: 'Moon phase and position affect feeding activity. Full and new moons trigger the strongest solunar periods. Major feed windows are when the moon is directly overhead or underfoot.',
      source: 'Calculated from moon phase (SunCalc)',
    },
  ],

  verdicts: [
    { range: [75, 100], label: 'Go Fish',               color: 'go',      desc: 'Strong conditions across the board. This is what you book a trip for.' },
    { range: [50, 74],  label: 'Proceed with Caution',  color: 'caution', desc: 'One or more conditions are marginal. Check the timeline — there may be a good morning window.' },
    { range: [0,  49],  label: 'Stay Ashore',           color: 'stop',    desc: 'Conditions are poor or dangerous for this trip range. Consider inshore options or wait for a better day.' },
  ],

  note: `The Go Score is a decision support tool, not a replacement for captain judgment. Always check the raw NOAA marine forecast and buoy data before heading out. Conditions can change rapidly offshore.`,
}
