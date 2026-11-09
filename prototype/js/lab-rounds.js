/* Round 1 baseline — the scores and notes given on 2026-08-23, kept verbatim so
   later rounds have something honest to measure against.

   Option keys here are the ones that existed in round 1. Some no longer exist:
   `map:d` was Region first, which scored highest and was promoted from an option
   to the default behaviour of every treatment. Current options declare what they
   descend from in js/lab.js, so a delta is only ever shown where the same design
   was actually carried forward and refined. */

window.PX_ROUND1 = {
  at: '2026-08-23 04:44',
  score: {
    'map:a': 75, 'map:b': 60, 'map:c': 70, 'map:d': 80,
    'type:a': 60, 'type:b': 80, 'type:c': 70,
    'encoding:split': 76, 'encoding:fill': 75, 'encoding:rings': 50,
    'density:comfortable': 90, 'density:compact': 90
  },
  note: {
    'map:a': 'Still generic a bit, but has a charm to it.',
    'map:b': 'Too generic, just seems like any other Wikipedia Commons map.',
    'map:c': 'I like the direction, but not executed well I don’t think.',
    'map:d': 'Better than A, but borders are way too imprecise, same with coastlines.',
    'encoding:split': 'I like this design, but its a bit hard to understand what exactly the fill bars mean or anything.',
    'encoding:fill': 'I do like these regular fills as well, but I do like the above option as well. This one is a bit more generic obviously.',
    'density:comfortable': 'Both options are good to have.',
    'density:compact': 'Both options are good to have.'
  },
  // names as they were, so the history reads correctly even where an option changed
  names: {
    'map:a': 'High contrast', 'map:b': 'Atlas', 'map:c': 'Terrain depth', 'map:d': 'Region first',
    'type:a': 'Cartographic', 'type:b': 'Editorial', 'type:c': 'Technical',
    'encoding:split': 'Split disc', 'encoding:fill': 'Fill level', 'encoding:rings': 'Concentric',
    'density:comfortable': 'Comfortable', 'density:compact': 'Compact'
  },
  // options that existed then and do not now, with the reason
  retired: [
    {
      name: 'Region first',
      score: 80,
      why: 'Scored highest, but it was a behaviour rather than a palette — it borrowed ' +
           'treatment A’s colours. Promoted to the default for every treatment instead of ' +
           'staying an option, which freed its slot for Survey blueprint.'
    }
  ]

};

/* Round 2 baseline — scored 2026-08-23 05:17. */
window.PX_ROUND2 = {
  at: '2026-08-23 05:17',
  score: {
    'map:a': 85, 'map:b': 80, 'map:c': 90, 'map:d': 60,
    'type:a': 60, 'type:b': 80, 'type:c': 75,
    'encoding:split': 80, 'encoding:fill': 75, 'encoding:rings': 40
  },
  note: {
    'map:a': 'Better than before. Don’t really like the lat/long lines, don’t think they’re necessary (or at the very least should be toggleable).',
    'map:b': 'Better, but maybe make the stuff in the ocean more faint? It’s way too eye-catching at the moment. Also the lines mess up a buncha stuff here as well.',
    'map:c': 'Really nice, although I don’t know how consistent the sea elevations/colors are, there seems to be many inconsistencies.',
    'map:d': 'Not that good, maybe with improvement it could be a mapmode but it looks way too visually cluttered plus there are so many lines and hard to distinguish stuff.',
    'type:b': 'Editorial still fits the best, but I can see an argument being made to have the option to switch between this and technical though.',
    'encoding:split': 'I think the argument to be made is that both split and fill could be used, for each respective mode (split view vs one view).'
  },
  retired: [
    {
      name: 'Marker encoding (whole axis)',
      score: 80,
      why: 'Closed by round 2: “both split and fill could be used, for each respective mode”. ' +
           'The encoding now follows the mode — split disc when comparing two perspectives, ' +
           'fill level when viewing one — so it is no longer a choice to make. Concentric ' +
           'fell 50 → 40 and is cut.'
    }
  ]
};

/* Round 3 baseline — scored 2026-08-23 05:49. */
window.PX_ROUND3 = {
  at: '2026-08-23 05:49',
  score: {
    'map:a': 85, 'map:b': 85, 'map:c': 90, 'map:d': 75
  },
  note: {
    'map:c': 'My favourite, but I think all four map modes should be interchangeable and the user can choose the theme they like the most anyways.',
    'map:d': 'Rest are fine, but for this one just don’t have any ocean depth stuff in this mode, since it ruins it. Also, there’s still so many random lines.'
  },
  retired: [
    {
      name: 'Map treatment (whole axis)',
      score: 90,
      why: 'Closed by round 3: “all four map modes should be interchangeable and the user ' +
           'can choose the theme they like”. All four now ship as user-selectable themes ' +
           'under Display, with Bathymetric (90) as the default. The remaining question was ' +
           'never which to keep, only which to open on.'
    },
    {
      name: 'Graticule',
      score: 0,
      why: 'Removed entirely, not just defaulted off. The line running through India was a ' +
           'stale constant drawing at 20.2°N under a “equator” label — a leftover from an ' +
           'earlier viewBox. Lat/long can return later as a proper, correctly projected layer.'
    }
  ]
};
