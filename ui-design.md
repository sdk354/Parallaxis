# UI Design Decisions

Visual and interaction design direction for Parallaxis. Companion to `design-decisions.md`, which covers product and architecture decisions.

**Working prototype:** `prototype/index.html` — open it directly, no build step. It carries a **design lab** (flask icon, bottom of the rail) where the four still-open design axes — map treatment, type pairing, marker encoding and density — can be switched live and scored out of 100, with notes and export. Several decisions recorded below are therefore provisional until those scores come back.

The decisions below are implemented there; `prototype/css/tokens.css` is the machine-readable copy of the colour and type values in this document. Every decision here is downstream of two things: the parallax concept, and the epistemic humility principle from the design principles list.

---

## Aesthetic Direction: Optical Instrument, Not Command Centre

**Decision:** The visual language is drawn from optical survey and stereoscopic instruments — theodolites, rangefinders, astronomical plate comparators — rather than from military dashboards or newspaper broadsheets.

**Rationale:**
- Parallax is literally an instrument concept: you measure the distance to something you cannot reach by observing it from two known positions. That is exactly what the platform does with contested events, so the instrument vernacular is honest rather than decorative
- WorldMonitor already owns the dark tactical dashboard look — competing there means losing on their terms
- The obvious alternative, "editorial," collapses into a well-worn template (cream background, high-contrast serif, terracotta accent, hairline broadsheet rules). Editorial *restraint* is right; editorial *pastiche* is not
- Intelligence-agency cosplay (threat levels, target language, radar sweeps) actively undermines the positioning — this is a tool for journalists and students, not a LARP of the institutions the platform exists to democratise access away from

**The reference instrument — the blink comparator:** the device astronomers used to discover Pluto. Two photographic plates of the same star field, taken at different times, flipped rapidly back and forth. Distant stars hold still; Pluto, being close, jumps between exposures. The discovery *was* the movement.

⚠️ **Useful for the instrument vocabulary, misleading as a mechanism.** Taken literally it produced the displacement encoding rejected below, because a photographic plate is *about* position and can spend it freely, while a map cannot. It is also not user-facing copy: it needs a paragraph of astronomy history before it explains anything. The instrument the platform should actually behave like is a **surveying station** — a fixed target, two bearings, and a measured difference. Keep the blink comparator for the methodology chapter, where the question is *why this design*.

---

## Layout Model: Instrument Gives Way to Document

**Decision:** Two surfaces — a dark "instrument" field (the map) and a light "document" field (analysis, articles, reports). The ratio between them shifts with depth of engagement rather than the two being fixed panels.

| View | Instrument | Document |
|------|-----------|----------|
| Observation (home) | 100% | — |
| Event opened | ~60% | ~40% |
| Reading an analysis | ~25% strip | ~75% |
| Rhetoric Analyser (pasted text) | — | 100% |

**Rationale:**
- Encodes something true about the user's activity: you move from *looking* to *reading*, and the interface proportions follow that shift. Structure carries information rather than decorating it
- Resolves the tension between the map (which needs a dark ground — conflict markers, heat layers, and overlays all read poorly on light basemaps) and long-form analysis (which needs light ground for sustained reading)
- The map never fully disappears while you are working with an event, preserving the "map is the hub" principle from `design-decisions.md`
- Gives the app a distinct silhouette at every depth, so screenshots in the dissertation are legible as different states

---

## Signature Encoding: Two Bearings on a Fixed Event

**Decision:** Each event marker carries **both perspectives' readings at once**. The disc is split vertically — the left half fills to perspective A's coverage of that event, the right half to perspective B's. Both halves stay in the severity colour. A level disc means the two agree; a lopsided one is a coverage dispute; an empty half is a blindspot. A dashed halo marks gaps wider than 25 points.

**Rationale:**
- Divergence is legible without switching anything — the comparison *is* the marker, so consensus and dispute can be scanned across the whole map in one look
- It is the strongest possible form of the "perspectives are never colour-coded" decision: here they carry no hue at all, only a side. Left is A, right is B, and the swap control still makes that assignment visibly arbitrary
- Severity keeps both of its channels, hue and disc size, so nothing relies on colour alone
- Faithful to what parallax actually is: two bearings taken on a stationary target from different stations, where the *difference between the readings* is the measurement

**Superseded pages.** `ui-design-spec.html` and `ui-encoding-study.html` in the repo root are the earlier single-file design studies. They still open in a browser and are kept for the record, but `prototype/` is now the live artefact.

**Open decision.** Five encodings were built and compared on the same map and data — split disc (severity-coloured), split disc (channel-coloured), fill level, concentric bearings, and radial sweep. The severity-coloured split is the recommendation, but the choice is not final. Interactive comparison: https://claude.ai/code/artifact/7e09c42d-ab19-48f1-a666-c5228e50d8c5

**Known cost:** the left/right convention has to be learned, where two differently tinted halves would be self-evident; and at severity 1–2 the disc is small enough that the split is hard to judge. A channel-coloured variant that trades severity hue for immediate legibility is documented in the encoding study and remains a live alternative.

### Rejected: encoding divergence as displacement

The first draft moved the markers — events both perspectives covered stayed put, contested ones slid laterally, with the distance set by the coverage gap. It was rejected for two reasons.

**It made the map assert something false.** Position on a map already means geography; it is the one channel a map has permanently spent. A marker nudged 26 pixels east is a marker in a different country — Sahel drifted into Chad, Xinjiang into Mongolia. No amount of legend fixes a display whose primary encoding contradicts its own basemap.

**It had the physics backwards.** In real parallax measurement the target never moves. The observer changes station, two bearings are taken, and the difference between them is the measurement. Moving the object inverts the thing the platform is named after. The blink comparator analogy held only because a photographic plate is *about* position and is therefore free to spend it; a map is not.

Recorded here rather than deleted because the reasoning generalises: **before assigning meaning to a visual channel, check what that channel already means in the medium.**

### Blindspots must be conspicuous, not faded

**Decision:** an unreported event is never dimmed. In the split-disc encoding it appears as an **empty half** with the other half filled, tagged `left/right half unreported`. In single-perspective views it renders as a **hollow ring, dashed, in its own severity colour, at full opacity**, with a `not reported` tag.

**Rationale:**
- The instinct is to fade out what isn't covered, since that is what "absent" looks like everywhere else in interface design. On this platform that instinct is exactly backwards: an under-reported high-severity event is the single most valuable thing the map produces. Fading it makes the most important finding the least visible element on screen
- Keeping the severity hue in the ring stroke preserves the reading "we know how serious this is" while the missing fill carries "this perspective isn't covering it" — absence and magnitude stay independently legible
- First prototype got this wrong: unreported events were rendered at 10% opacity and read as a rendering fault rather than a finding

---

## Colour: Semantic Reservation

**Decision:** Hue is a scarce resource with strictly reserved meanings. No colour is used decoratively.

| Role | Meaning | Values |
|------|---------|--------|
| Instrument | The interface itself, selection, active measurement | Survey teal — `#2E7D8F` on light, `#4FB3C7` on dark |
| Severity | Magnitude of human harm, sequential | Sand → ember: `#F0D9B5` `#E3AE73` `#D07C43` `#B24A2A` `#7E2818` |
| Divergence channels | Two perspectives under comparison — **only in the channel-coloured variant**; the recommended split-disc encoding spends no hue on perspective identity | Cyan `#4FB3C7` / violet `#9B8CD9` — arbitrary and swappable |
| Ground (instrument) | Map field, dark panels | `#0C121A` base, `#16202C` raised, `#24313F` hairline |
| Ground (document) | Reading surfaces | `#F6F8FA` base, `#ECEFF3` sunk, `#D3DAE2` rule |
| Ink | Text | `#121A23` primary, `#5A6673` muted; `#E8EDF2` / `#8C9AA8` inverted |

**Rationale:**
- **Cool is the interface, warm is harm.** Reserving the entire warm range for the severity ramp means no interface furniture can ever be mistaken for an escalation signal, and severity is readable without consulting a legend
- The severity ramp is single-hue sequential and monotonic in lightness, so it survives greyscale printing (dissertation figures) and all forms of colour vision deficiency. A red-to-green ramp would fail both, and additionally imports a moral valence that the composite severity score does not claim
- The document ground is cool near-white rather than cream. This is a deliberate rejection of the warm-paper editorial default: Parallaxis is a scientific instrument's output, not a literary magazine
- The base is deep blue-slate rather than true black, which reads as observation rather than as tactical display

---

## Perspective Layers Are Never Permanently Colour-Coded

**Decision:** No perspective is assigned a fixed, persistent colour anywhere in the platform. In divergence mode, the two compared perspectives are assigned to channels A and B, and the user can swap them with one control.

**Rationale:**
- **This is a methodological decision, not an aesthetic one.** Assigning Russian media red and Western media blue is an editorial claim made through CSS. It is exactly the kind of unstated judgement the platform's design principles commit to avoiding, and it would be indefensible in a viva that scrutinises the methodology chapter
- Fixed hue assignment also implies the perspective set is closed and canonical, which contradicts the open scope decision to rethink the layer set entirely (see `scope-decisions.md`)
- Making the channel assignment visibly arbitrary — a swap control, right there in the UI — demonstrates to the user that the colours carry no meaning, which is more honest than merely intending them not to

**Divergence is encoded by displacement direction first, hue second.** Channel A displaces left, channel B displaces right. Hue reinforces but never carries the encoding alone. This is both more faithful to the parallax metaphor and the accessible answer, since it does not depend on distinguishing cyan from violet.

---

## Typography

**Decision:** Three roles, three faces, all open source.

| Role | Face | Use |
|------|------|-----|
| Titling | **Archivo Condensed** | Headings, map labels, section eyebrows, navigation |
| Reading | **Newsreader** | Article text, analysis prose, annotation explanations |
| Data | **IBM Plex Mono** | Confidence values, coordinates, timestamps, source IDs, vote tallies |

**Rationale:**
- **Condensed grotesque for titling** comes from cartographic vernacular — map sheets, survey drawings, and legends are set in condensed sans, and it puts the display face in the subject's own world rather than in magazine territory. It also inverts the expected serif-display/sans-body pairing
- **Newsreader for reading** was designed specifically for on-screen news consumption, which is the platform's dominant reading task. It supplies editorial character without the broadsheet-revival cliché
- **Plex Mono for data** is justified by genuine measurement content — the platform displays confidence figures, coordinates, and identifiers throughout, and survey/instrument annotation is historically monospaced. It has more warmth than the usual terminal defaults
- All three are freely licensed, consistent with the platform's open, no-budget, no-paywall positioning and the open-source-first data stack

**Scale:** 16px UI base at a 1.25 ratio. Reading text sets larger, at 18–19px with a measure capped around 68 characters — analysis prose is meant to be read at length, not scanned.

---

## Uncertainty Made Visible

**Decision:** Confidence is encoded by **stroke continuity**, never by colour or by alarm styling.

- Annotated spans in analysed text are marked with an underline beneath the text
- Solid rule = high confidence; progressively gapped, then dotted = decreasing confidence
- The numeric value appears in the margin in mono, never as a coloured badge

**Rationale:**
- Colour-coding confidence implies a judgement has been reached, which is the exact thing `design-decisions.md` forbids. A red highlight *is* a verdict regardless of the tooltip text
- Stroke continuity is intuitively legible as hesitancy — a broken line reads as tentative without needing a legend
- It leaves hue free for severity, and keeps the analysed text readable as text rather than as a heat map
- The competing academic tool (prta.eu) uses saturated inline highlighting, which is both visually hostile and epistemically overconfident. Diverging from it is a differentiator

---

## Annotation Layout: Marginalia, Not Highlighting

**Decision:** In the Rhetoric & Debate Analyser and all text-analysis surfaces, findings appear as margin notes alongside the text, not as inline colour overlays on it.

**Rationale:**
- Supports design principle 3 (develop critical thinking, don't replace it): the user reads the source text first, on its own terms, with commentary sitting beside it rather than pre-judging it before it is read
- Marginalia is the native vernacular of close reading and editorial markup — it is what critical readers actually do
- Inline highlighting at density turns an article into an unreadable patchwork, which is a practical failure as much as a philosophical one
- The margin has room for what a highlight cannot hold: the technique name, the reasoning, the confidence value, and the dispute control

**Model disagreement:** where two models diverge on the same span, both readings stack in the margin, each with its own confidence rule. Disagreement is displayed, not resolved — per the design principle that divergence is itself meaningful.

---

## Provenance Display

**Decision:** Every automated finding carries a persistent, visible source trail — never a disclosure that must be opened to exist.

- Source attribution is set in mono at small size directly beneath each finding
- Outlet, publication date, and retrieval date are always shown together
- Verified contributor notes sit in a visually distinct block — a different ground tone and an explicit byline — never interleaved with automated findings

**Rationale:**
- Design principle 1 requires every conclusion be traceable to a primary source. Sources hidden behind a disclosure triangle satisfy this only technically
- The contributor layer's value depends entirely on it being unmistakably separable from machine output; if the boundary is subtle, the accountability model collapses
- Retrieval date matters specifically for a platform tracking narrative mutation over time, where the same URL may say different things on different dates

---

## Interface Voice

**Decision:** Analytical register. Findings are stated as observations with stated limits, never as verdicts or alerts.

| Never | Instead |
|-------|---------|
| `PROPAGANDA DETECTED` | `Consistent with loaded language` |
| `VERIFIED ✓` | `Earliest known appearance: 12 Mar 2024, AFP` |
| `FALSE` | `Three fact-checkers rated this false; one rated it partly true` |
| `THREAT LEVEL: HIGH` | `Severity 4 of 5 — see methodology` |
| `No results` | `No independent confirmation found` |

**Rationale:**
- The interface voice is where epistemic humility either holds or leaks. A carefully hedged model output presented under an alarming label has been un-hedged by the interface
- Sentence case throughout, no uppercase alarm styling, no exclamatory microcopy
- Empty states describe what is absent and what to do about it, since absence of coverage is frequently a *finding* on this platform rather than an error — a blindspot is an empty state that means something

---

## Accessibility Floor

**Decision:** Non-negotiable baseline, treated as a design constraint rather than a retrofit.

- No information conveyed by hue alone anywhere in the platform — severity carries lightness, divergence carries displacement, confidence carries stroke pattern
- All text meets WCAG AA against its ground; interface teal is specified at two luminance values so it passes on both dark and light surfaces
- Full keyboard navigation of the map, including hotspot traversal and perspective switching, since map interfaces are a common keyboard dead end
- `prefers-reduced-motion` preserves informational motion in static form rather than removing it (see the Parallax Shift decision)

**Rationale:**
- The target audience explicitly includes academic and journalistic users working under institutional accessibility requirements
- The colour system was designed around these constraints from the start, which is why the severity ramp is single-hue sequential rather than the conventional traffic-light scheme

---

## Directions Deliberately Rejected

### Dark tactical dashboard
Owned by WorldMonitor, and it dresses the platform as the institutions it exists to provide an alternative to. Rejected in `competitive-landscape.md` and reaffirmed here.

### Warm editorial / broadsheet revival
Cream ground, high-contrast serif display, hairline rules, terracotta accent. The most common current default for "serious analysis" interfaces, and it appears regardless of subject. Adjacent to what the brief asked for, which is why it needs explicit exclusion rather than passive avoidance.

### Traffic-light severity
Red/amber/green fails colour vision deficiency, fails greyscale print, and imports moral valence into a composite score that does not claim it.

### Inline highlight annotation
Visually hostile at density, epistemically overconfident, and already the approach of the weaker academic tools in the space.

### Fixed per-perspective colours
An editorial claim made through CSS. See the perspective layer decision above — this is the most consequential rejection in the document.
