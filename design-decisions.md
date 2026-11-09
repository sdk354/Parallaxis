# Design Decisions & Rationale

## Platform Type: Web App
**Decision:** Web application, not native mobile app.
**Rationale:**
- Rich data visualisations (network graphs, narrative maps, timelines) are better suited to web
- No install barrier — accessible instantly via link, easy to demo to instructors
- News aggregation and NLP processing is server-side — a native app would just be a thin client
- A responsive web app works on mobile anyway
- Easier to deploy, iterate, and share

---

## Map: Globe-to-Mercator Projection
**Decision:** MapLibre GL JS with globe projection that transitions to Mercator on zoom.
**Rationale:**
- Mirrors the Google Maps interaction model users already understand
- Globe view is more viscerally impactful for geopolitical context — seeing conflicts on a sphere feels more real
- MapLibre is fully open source (fork of Mapbox GL JS), no API cost concerns
- Supports the `projection: 'globe'` setting natively with smooth zoom transition
- Highly customisable for custom styling, overlays, and hotspot markers

---

## Map as Central Hub
**Decision:** The map is the home screen and primary navigation — not a feature within a list of features.
**Rationale:**
- Organising news geographically rather than chronologically is the primary UX differentiator
- Every other feature becomes contextual: drill into a conflict on the map, all tools load for that specific event
- Creates a unified platform feel rather than a disconnected toolkit
- The conflict map immediately communicates the platform's purpose to a new visitor

---

## Perspective Layers
**Decision:** 5 perspective layers on the map — Western, Russian, Chinese, Indian, Arabic.
**Rationale:**
- The insight isn't the hotspots themselves — it's what disappears when you switch perspective
- No existing tool shows media attention as a geographic layer by geopolitical worldview
- Directly differentiates from WorldMonitor which shows one global view
- Sources are clearly labelled per layer — transparent about methodology
- Includes blindspot detection, consensus layer, and divergence mode

---

## News Feed Approach
**Decision:** Geo-tagged article feed surfaced through the map, not a traditional reverse-chronological list.
**Rationale:**
- Every news aggregator uses chronological lists — geographic navigation is genuinely novel
- Articles are always contextually relevant to where the user is looking on the map
- Integrates naturally with perspective layers — same region, different outlet sets

**Paywalled content approach:**
- Show headline + snippet + link only for paywalled outlets (NYT, WaPo, FT, WSJ)
- Use open-access sources (Guardian, GDELT, VOA, DW) for full NLP analysis
- This is legally sound and sufficient — platform value is the analytical layer, not article reproduction

---

## Verification & Context Engine: Automated Pipeline
**Decision:** Automated multi-source pipeline rather than community/user-driven notes.
**Rationale:**
- Community notes require a critical mass of users (cold start problem)
- Open community notes on a geopolitics platform are a high-value target for state actor manipulation — ironic given the platform's purpose
- Automated pipeline is more reliable: every conclusion is traceable to a primary source
- Verified contributor layer (credentialed journalists/researchers) provides human judgment on hard cases without the open community risks

**Verified contributor model:**
- Closed application process — journalists, academics, researchers with verifiable credentials
- Contributors are accountable by identity
- Their notes are clearly labelled separately from automated findings
- Much easier to seed than open community (partner with university journalism departments)

---

## AI Outputs: Epistemic Humility by Design
**Decision:** All AI outputs show confidence scores and reasoning, never binary verdicts.
**Rationale:**
- AI inherits biases from training data — models trained on Western data are better at detecting manipulation in Russian/Chinese media than Western outlets
- The "propaganda" label is itself a political act — presenting it as objective fact is misleading
- False positives at scale can suppress legitimate speech
- Platform is positioned as a tool for critical thinking, not an oracle
- Every flagged annotation shows: what triggered it, why, confidence level, and ability to dispute

**Implementation:**
- "This phrase has characteristics consistent with loaded language (72% confidence)" not "PROPAGANDA DETECTED"
- Show model disagreement when multiple models diverge — that divergence is itself meaningful
- Users can flag when the model is wrong — feedback loop for improvement

---

## Features Deliberately Excluded

### Coordinated Inauthentic Behavior Detector (removed)
- Twitter/X API severely restricted and expensive post-2023
- Meta API similarly locked down
- No reliable social media data access makes this feature unfeasible
- Covered partially by the Narrative Mutation Tracker

### Sanctions Network Knowledge Graph (removed)
- Very high technical complexity (knowledge graph + entity resolution)
- Out of scope for a final year project timeline
- Commercially available (Sayari Analytics) — not a clear differentiating feature

### LLM Geopolitical Bias Auditor (removed as standalone feature)
- The core insight (AI models reflect their training data's geopolitical biases) is embedded into the Verification & Context Engine's multi-source approach instead
- Avoids scope creep

### Personal Information Diet Analyzer (removed)
- Inward-facing (about the user's habits) vs. the platform's outward-facing intelligence focus
- Covered adequately by existing tools (Ground News, Nobias)
- Slight tonal mismatch with the rest of the platform

---

## Scope Management: Gray Zone Tracker & Diplomatic Signaling Decoder
**Note:** These two features are the most data-pipeline-intensive. Both require ongoing monitoring of official sources across many countries in multiple languages.
**Decision:** Design as semi-static databases that update periodically (daily/weekly) rather than truly real-time. This is still valuable and far more achievable within a final year project timeline.
