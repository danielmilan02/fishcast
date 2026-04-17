function rateSpecies(name, conditions) {
  const { wind, waves, temp } = conditions
  const calm = waves <= 2.5 && wind <= 18
  const warm = temp >= 72

  const rules = {
    'Snook':        calm && warm ? 5 : 3,
    'Redfish':      calm ? 4 : 2,
    'Flounder':     calm ? 4 : 2,
    'Cobia':        warm ? 5 : 2,
    'Tarpon':       warm && calm ? 3 : 1,
    'Pompano':      3,
    'Red Snapper':  calm ? 4 : 2,
    'Grouper':      calm ? 4 : 2,
    'King Mackerel': warm ? 3 : 1,
    'Amberjack':    calm ? 4 : 3,
    'Mahi-Mahi':    temp >= 75 ? 3 : 1,
    'Wahoo':        temp >= 74 ? 3 : 2,
    'Bonefish':     calm ? 4 : 2,
    'Permit':       calm ? 3 : 1,
    'Sailfish':     temp >= 76 ? 3 : 1,
    'Tuna':         2,
    'Swordfish':    2,
    'Triggerfish':  4,
    'Sheepshead':   3,
    'Barracuda':    3,
    'Blue Marlin':  2,
    'Tuna (BFT)':   2,
  }
  return rules[name] || 2
}

export default function SpeciesPanel({ species, conditions, range }) {
  return (
    <div className="bg-navy-mid border border-white/10 rounded-xl p-3">
      <div className="text-xs text-white/30 tracking-widest mb-3">SPECIES OUTLOOK</div>
      <div className="space-y-1.5">
        {species.map(name => {
          const rating = rateSpecies(name, conditions)
          const color = rating >= 4 ? 'text-go' : rating >= 3 ? 'text-caution' : 'text-stop'
          const label = rating >= 4 ? 'Active' : rating >= 3 ? 'Fair' : 'Slow'
          return (
            <div
              key={name}
              className="flex items-center justify-between bg-navy-light/40 rounded-lg px-3 py-2"
            >
              <span className="text-white text-sm">{name}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full
                        ${i <= rating
                          ? rating >= 4 ? 'bg-go' : rating >= 3 ? 'bg-caution' : 'bg-stop'
                          : 'bg-white/10'}`}
                    />
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
