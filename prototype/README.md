# Parallaxis — interface prototype

A working shell for the map-first interface, with a built-in **design lab** for
comparing and scoring the open design decisions. No framework, no build step, no
dependencies.

```
open index.html
```

Or serve it, which you'll want once real data arrives:

```
python3 -m http.server 8000     # then localhost:8000/prototype/
```

## Design lab — score the options

Open it with the flask icon at the bottom of the left rail.

Four axes are still undecided, and each one is switchable. Pick an option to see
it applied live, give it a score out of 100, and add a note. Everything saves to
`localStorage` as you type.

**It runs in rounds.** Round 1 is baked in from the first scoring pass, so the lab
opens on round 2 with every previous score visible. Each option shows a tag —
`R1 75` with a `▲ +13` delta once you score it, or `NEW`, or `R1 60 replaced` —
followed by a line saying exactly what changed since you last looked at it. The
note field shows your previous note as its placeholder.

`‹ ›` moves between rounds. **New round** closes the current one and opens the
next, keeping everything before it. **Copy** exports a Markdown table with every
round side by side and a Δ column.

Deltas only appear where a design was genuinely carried forward and refined. A
score in parentheses belonged to a different option that previously held the
slot, and a dash means the option did not exist that round — so an improvement
is never claimed by comparing two unrelated designs that share a letter.

| Axis | Options |
|---|---|
| Map treatment | A High contrast · B Nautical chart · C Bathymetric · D Survey blueprint |
| Type pairing | A Cartographic · B Editorial · C Technical |
| Contested boundaries | Rose dashed · Neutral dashed · Strong rose |

Marker encoding and density are no longer scored — see the round 2 notes below.
Type is still scored because the question is which should be the *default*; it is
switchable at runtime either way.

### What round 3 changed

- **Graticule removed entirely.** The line through India was a stale constant
  drawing at 20.2°N under an "equator" label, left over from an earlier viewBox.
  Lat/long can return later as a properly projected layer.
- **Map treatment closed as a question.** All four ship as user-selectable themes
  under `Display`, with Bathymetric as the default.
- **Contested boundaries** from Natural Earth's own classification: dashed for
  disputed claims, dotted for lines of control. Deliberately secondary to settled
  borders — drawing a line where one state says there is a border and another
  says there is not is itself a claim.
- **Survey blueprint has no ocean depth at all** and no rivers.

### What round 2 changed

- **Place labels.** Country names appear once zoomed past a threshold, cities and
  capitals deeper in. Long names use a conventional short form at low zoom — UAE,
  DRC, AFGH., BANGL. — and expand to the full name once there is room. Only real
  abbreviations are in the table; inventing one would teach a name that does not
  exist. `Labels` toggles the whole layer.
- Placement is greedy: candidates are walked in priority order (polygon area for
  countries, label rank for cities) and any whose box overlaps one already placed
  is dropped. Tracked events claim their space first, so a label can never cover
  a marker or a selected event's name.

- **Graticule off by default**, with a `Grid` toggle. It was disliked on three of
  the four treatments, so it stopped being scenery and became an option.
- **The bathymetry inconsistency was a real bug.** A whole depth layer was drawn
  as one path with `fill-rule: evenodd`, so overlapping features cancelled each
  other out — the 2000 m layer alone has 202 features and 3839 interior rings.
  It is now one path per sounding, and five depth bands instead of three.
- **Marker encoding is closed as a question.** "Both split and fill could be used,
  for each respective mode" is right: split disc when comparing two perspectives,
  fill level when viewing one. The mode picks it. Concentric fell 50 → 40, cut.
- **Type and density are runtime settings** under `Display`, not lab-only.
- **Nautical chart's ocean pulled right back**, contours cut from five levels to
  three. **Survey blueprint decluttered**: two contours instead of five, rivers
  dropped, coastlines muted.

### What the first scoring round changed

- **Geometry went from 110m to 50m.** "Borders are way too imprecise, same with
  coastlines" was a data problem, not a styling one. Coastlines, lakes and rivers
  now resolve when zoomed, which is most of what made the old map look generic.
- **Region-first stopped being an option.** It scored highest (80) but it is a
  behaviour, not a palette — it borrowed treatment A's colours. Every treatment
  now opens zoomed into a region, and `World view` zooms out.
- **That freed the fourth slot** for Survey blueprint, which is the direct answer
  to "generic" appearing twice in the notes.
- **Terrain depth became Bathymetric.** "I like the direction, but not executed
  well" was right: it was fabricated turbulence noise, which washed the land out
  at zoom. It now uses Natural Earth's real 10m bathymetry — three measured depth
  bands stepping off the shelf. Land relief would need raster elevation data and
  is not attempted rather than faked.
- **The marker key is open by default and names the actual perspectives**, after
  "a bit hard to understand what exactly the fill bars mean".
- **Density stays a user setting.** Both options scored 90 with "both are good to
  have", so it is a preference to ship, not a decision to close.

**JSON** downloads the full round history, which is the file to keep if you want
the scoring trail in the dissertation appendix.

The severity ramp changes with the map treatment on purpose: the pale end of the
dark-ground ramp is close to invisible against the Nautical chart's light land.
The palette is not ground-agnostic, and that is worth keeping as a finding.

## What the interface demonstrates

The map is full-bleed and everything else floats over it. Detail arrives as a
drawer that dismisses, so the map is never permanently boxed in.

- **Perspective picker** (top left) — collapsed to a summary; click to expand the
  five perspectives. In compare mode, clicking an already-selected perspective
  swaps which side of the marker it occupies, which is how the interface shows
  that the left/right assignment carries no meaning.
- **Events** (top right) — opens the ranked list. Default sort is how much the
  perspectives disagree, not reverse chronology.
- **Blindspots** — filters to events some perspective is ignoring. First-class
  control, because that is the platform's actual thesis.
- **Hover any marker** for a tooltip with all five coverage figures, so the
  encoding explains itself without consulting the legend.
- **Labels / Grid** (top right) toggle place names and the graticule.
- **Display** (top right) switches type pairing and density at runtime.
- **Marker key** (bottom left) is open by default and names the two perspectives
  currently on the map, with a worked example of the encoding. `Hide key`
  collapses it once you no longer need it.
- **Event dossier** — coverage bars, an explicit blindspot callout, how each
  perspective frames the event, and recent articles with outlet and date.
- Opens zoomed into a region; `World view` zooms out and back. Drag to pan, wheel to zoom. Selecting an event flies to
  it, lights its country, and biases the framing left so the drawer doesn't
  cover it. Tab moves between events, Enter opens, Escape closes.

## Structure

```
index.html              markup and page shell
css/tokens.css          colour, type and space tokens (mirrors ui-design.md)
css/type.css            the three type pairings
css/app.css             layout and components
css/fonts.css           @font-face declarations
fonts/                  self-hosted woff2, latin subset
js/geo.js               Natural Earth geometry, generated: 50m admin-0 borders,
                        50m lakes and rivers, 10m bathymetry in five depth bands
js/labels.js            label anchors, cities, and conventional short forms
js/disputed.js          contested boundary segments, classed by Natural Earth
js/map-treatments.js    the four map treatments
js/data.js              event fixtures — the only file with invented content
js/lab-rounds.js        round 1 and 2 baselines, kept verbatim
js/lab.js               design lab: options, rounds, scoring, export
js/app.js               rendering and interaction
```

Change a colour or type size in `tokens.css` or `type.css`, not in `app.css`.
Map colours live in `map-treatments.js` and are written onto the document as
custom properties at runtime.

## What is real and what is not

**Real:** map geometry (Natural Earth 50m admin-0 boundaries, 50m lakes and
rivers, 10m bathymetry, projected equirectangular into a 1000×372 viewBox and
simplified with Ramer–Douglas–Peucker), the interaction model, the visual system.

**Invented:** every coverage figure, framing summary and article headline in
`js/data.js`. Hand-written stand-ins shaped like eventual pipeline output.
Nothing is measured, and the UI says so in both drawer states — don't screenshot
it as a result.

## Not built yet

Only the map section works; the rhetoric analyser, verification engine and
trackers are greyed stubs in the rail. There is no backend, no clustering, no
NLP. This is the interface layer, built so the design decisions can be judged
before any pipeline exists.

## Known gaps

- Perspective set is the provisional five from the April planning docs, which the
  scope review flagged as not final.
- Severity is a fixture integer, not the composite score in `../scope-decisions.md`.
- Framing summaries carry no confidence values yet; the design requires them.
- Marker collision is unhandled — events closer than roughly 40px will overlap.
- No land relief. Doing it honestly needs raster elevation data; the previous
  procedural-noise version is removed rather than tuned.
- The rail keeps the document theme even under the Nautical chart treatment, so a
  light map can sit beside dark chrome. Deliberate, but worth scoring.
- Survey blueprint has no land fill, so land and sea are told apart only by
  coastline. Authentic to the reference, but scores will show if it costs too
  much legibility.
