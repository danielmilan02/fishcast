// ─────────────────────────────────────────────────────────────────
// LOCATION CONFIG
// Each location defines the data sources for every trip range.
// To add a new location, copy an existing entry and update the IDs.
// ─────────────────────────────────────────────────────────────────

export const LOCATIONS = {
  tampa: {
    id: 'tampa',
    name: 'Tampa Bay · Johns Pass',
    shortName: 'Tampa',
    lat: 27.77,
    lon: -82.80,
    timezone: 'America/New_York',
    fishRulesUrl: 'https://app.fishrulesapp.com/?lat=27.77&lng=-82.80',

    // Windfinder deep-links per trip range (open in new tab)
    windfinder: {
      inshore:  'https://www.windfinder.com/forecast/madeira_beach',
      offshore: 'https://www.windfinder.com/forecast/egmont-channel-entrance',
      midrange: 'https://www.windfinder.com/forecast/west-florida-central-buoy',
      deepDrop: 'https://www.windfinder.com/forecast/st_petersburg_offshore_buoy',
    },

    // Windy.com embed coordinates per range
    windy: {
      inshore:  { lat: 27.77, lon: -82.80, zoom: 9 },
      offshore: { lat: 27.59, lon: -82.93, zoom: 8 },
      midrange: { lat: 27.50, lon: -83.74, zoom: 7 },
      deepDrop: { lat: 27.35, lon: -84.28, zoom: 6 },
    },

    ranges: {
      inshore: {
        label: 'Inshore',
        sublabel: '0–12 mi',
        description: 'Local bay, passes, and nearshore reefs',
        tidesStation: '8726520',       // Old Port Tampa
        buoy: '42099',                 // Egmont Channel entrance
        weatherGrid: 'TBW/52,74',     // NWS Tampa Bay grid
        marineZone: 'GMZ532',          // Nearshore Tampa Bay
        species: ['Snook', 'Redfish', 'Flounder', 'Cobia', 'Tarpon', 'Pompano'],
      },
      offshore: {
        label: 'Offshore',
        sublabel: '9–25 mi',
        description: '5–10 hr trips, Egmont to mid-shelf',
        tidesStation: '8726520',
        buoy: '42099',                 // Egmont Channel / CDIP 214
        weatherGrid: 'TBW/48,68',
        marineZone: 'GMZ630',          // Offshore Tampa Bay
        species: ['Red Snapper', 'Grouper', 'King Mackerel', 'Amberjack', 'Cobia', 'Mahi-Mahi'],
      },
      midrange: {
        label: 'Mid-Range',
        sublabel: '25–60 mi',
        description: '10–12 hr trips, West Florida shelf',
        tidesStation: '8726520',
        buoy: '42036',                 // West Florida Central Buoy
        weatherGrid: 'TBW/40,55',
        marineZone: 'GMZ650',          // Outer shelf
        species: ['Red Snapper', 'Grouper', 'Amberjack', 'King Mackerel', 'Mahi-Mahi', 'Wahoo'],
      },
      deepDrop: {
        label: 'Deep Drop',
        sublabel: '60–150 mi',
        description: '12 hr extreme / 39–44 hr trips, Middle Grounds',
        tidesStation: '8726520',
        buoys: ['42099', '42036'],     // Both Middle Grounds buoys
        weatherGrid: 'TBW/30,40',
        marineZone: 'GMZ656',          // Extreme offshore
        species: ['Mahi-Mahi', 'Wahoo', 'Amberjack', 'Tuna', 'Sailfish', 'Swordfish'],
      },
    },
  },

  pensacola: {
    id: 'pensacola',
    name: 'Pensacola · Panhandle',
    shortName: 'Pensacola',
    lat: 30.40,
    lon: -87.20,
    timezone: 'America/Chicago',
    fishRulesUrl: 'https://app.fishrulesapp.com/?lat=30.40&lng=-87.20',

    windfinder: {
      inshore:  'https://www.windfinder.com/forecast/pensacola_beach',
      offshore: 'https://www.windfinder.com/forecast/pensacola_pass',
      midrange: 'https://www.windfinder.com/forecast/gulf_of_mexico_central',
      deepDrop: 'https://www.windfinder.com/forecast/gulf_of_mexico_deep',
    },

    windy: {
      inshore:  { lat: 30.40, lon: -87.20, zoom: 9 },
      offshore: { lat: 30.10, lon: -87.20, zoom: 8 },
      midrange: { lat: 29.50, lon: -87.20, zoom: 7 },
      deepDrop: { lat: 28.80, lon: -87.20, zoom: 6 },
    },

    ranges: {
      inshore: {
        label: 'Inshore',
        sublabel: '0–12 mi',
        description: 'Pensacola Bay, pass, and nearshore',
        tidesStation: '8729840',       // Pensacola
        buoy: '42012',                 // Orange Beach buoy
        weatherGrid: 'MOB/64,67',
        marineZone: 'GMZ432',
        species: ['Redfish', 'Flounder', 'Speckled Trout', 'Cobia', 'Sheepshead', 'Pompano'],
      },
      offshore: {
        label: 'Offshore',
        sublabel: '9–25 mi',
        description: '5–10 hr trips, nearshore reefs',
        tidesStation: '8729840',
        buoy: '42012',
        weatherGrid: 'MOB/60,60',
        marineZone: 'GMZ432',
        species: ['Red Snapper', 'Grouper', 'King Mackerel', 'Amberjack', 'Cobia', 'Triggerfish'],
      },
      midrange: {
        label: 'Mid-Range',
        sublabel: '25–60 mi',
        description: '10–12 hr trips, offshore reefs',
        tidesStation: '8729840',
        buoy: '42039',                 // Gulf of Mexico buoy
        weatherGrid: 'MOB/55,50',
        marineZone: 'GMZ450',
        species: ['Red Snapper', 'Amberjack', 'King Mackerel', 'Mahi-Mahi', 'Wahoo', 'Grouper'],
      },
      deepDrop: {
        label: 'Deep Drop',
        sublabel: '60–150 mi',
        description: 'Extreme offshore, canyon fishing',
        tidesStation: '8729840',
        buoys: ['42039', '42040'],
        weatherGrid: 'MOB/50,40',
        marineZone: 'GMZ456',
        species: ['Mahi-Mahi', 'Wahoo', 'Tuna', 'Marlin', 'Sailfish', 'Swordfish'],
      },
    },
  },

  keys: {
    id: 'keys',
    name: 'Florida Keys · Islamorada',
    shortName: 'Keys',
    lat: 24.93,
    lon: -80.65,
    timezone: 'America/New_York',
    fishRulesUrl: 'https://app.fishrulesapp.com/?lat=24.93&lng=-80.65',

    windfinder: {
      inshore:  'https://www.windfinder.com/forecast/islamorada',
      offshore: 'https://www.windfinder.com/forecast/hawk_channel',
      midrange: 'https://www.windfinder.com/forecast/florida_straits',
      deepDrop: 'https://www.windfinder.com/forecast/gulfstream',
    },

    windy: {
      inshore:  { lat: 24.93, lon: -80.65, zoom: 9 },
      offshore: { lat: 24.70, lon: -80.65, zoom: 8 },
      midrange: { lat: 24.40, lon: -80.65, zoom: 7 },
      deepDrop: { lat: 24.00, lon: -80.65, zoom: 6 },
    },

    ranges: {
      inshore: {
        label: 'Flats',
        sublabel: '0–5 mi',
        description: 'Backcountry flats and nearshore',
        tidesStation: '8723970',       // Vaca Key
        buoy: '41047',
        weatherGrid: 'KEY/26,18',
        marineZone: 'GMZ830',
        species: ['Bonefish', 'Permit', 'Tarpon', 'Redfish', 'Snook', 'Barracuda'],
      },
      offshore: {
        label: 'Nearshore',
        sublabel: '5–20 mi',
        description: 'Hawk Channel and reef line',
        tidesStation: '8723970',
        buoy: '41047',
        weatherGrid: 'KEY/22,14',
        marineZone: 'AMZ630',
        species: ['Mahi-Mahi', 'King Mackerel', 'Sailfish', 'Grouper', 'Snapper', 'Cobia'],
      },
      midrange: {
        label: 'Offshore',
        sublabel: '20–60 mi',
        description: 'Gulf Stream edge and humps',
        tidesStation: '8723970',
        buoy: '41047',
        weatherGrid: 'KEY/18,10',
        marineZone: 'AMZ650',
        species: ['Sailfish', 'Mahi-Mahi', 'Wahoo', 'Tuna', 'Marlin', 'Swordfish'],
      },
      deepDrop: {
        label: 'Deep Water',
        sublabel: '60+ mi',
        description: 'Deep Gulf Stream, tournament fishing',
        tidesStation: '8723970',
        buoys: ['41047', '41043'],
        weatherGrid: 'KEY/14,6',
        marineZone: 'AMZ656',
        species: ['Blue Marlin', 'Swordfish', 'Wahoo', 'Tuna (BFT)', 'Sailfish', 'Mahi-Mahi'],
      },
    },
  },
}

export const LOCATION_LIST = Object.values(LOCATIONS)

export const DEFAULT_LOCATION = 'tampa'
export const DEFAULT_RANGE = 'offshore'
