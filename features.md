# Parallaxis — Feature List

## Category 1: Rhetorical Analysis

### 1. Rhetoric & Debate Analyser
Paste any article, speech, debate transcript, or social media post and get sentence-level annotation of:
- **Propaganda techniques**: loaded language, appeal to fear, bandwagon, appeal to authority, transfer, glittering generalities, card stacking, plain folks, testimonial
- **Logical fallacies**: ad hominem, straw man, slippery slope, false equivalence, false dilemma, Gish gallop, moving the goalposts, appeal to authority, cherry picking, post hoc, circular reasoning
- **Debate etiquette violations**: deflection, topic shifting, bad faith argumentation, whataboutism

Every annotation includes an explanation of why the technique was flagged, with a confidence score rather than a binary verdict. Designed to prompt critical thinking, not replace it.

---

## Category 2: Media & Narrative Analysis

### 2. Cross-Lingual Narrative Comparator
Input any news event and see how media across 5+ countries frames it differently:
- Who is portrayed as the hero/villain
- What causes are attributed
- What solutions are proposed
- What facts appear in one ecosystem but not another

Uses multilingual NLP (mBERT / XLM-RoBERTa). Output is a visual narrative comparison map.

### 3. State Media Narrative Dashboard
Real-time tracking of what specific narratives major state and international media outlets are currently pushing:
- Outlets tracked: RT, CGTN, VOA, Al Jazeera, BBC World Service, France 24, Deutsche Welle, Xinhua, TASS
- Shows where narratives converge or diverge across outlets
- Detects when previously divergent outlets suddenly align (coordinated messaging signal)
- Updated on a rolling daily basis

---

## Category 3: Misinformation & Verification

### 4. Narrative Mutation Tracker
Traces how a specific claim changes as it spreads across the information ecosystem:
- Where context is stripped
- Where exaggeration is added
- When it crosses from fringe forums to mainstream outlets
- Timeline visualisation of claim evolution

Input: a claim or keyword. Output: a genealogy tree of the claim across time and platforms.

### 5. Verification & Context Engine
Submit any image, video, or text claim and receive an automated sourced verification report.

**For media (images/video):**
- Reverse image search across multiple engines (Google, TinEye, Yandex)
- EXIF metadata extraction (GPS coordinates, device, timestamp)
- Cross-reference against Internet Archive / Wayback Machine for earliest known appearance
- Match against GeoConfirmed database (71,000+ verified conflict geolocations)
- Satellite imagery comparison for location verification

**For text claims:**
- Aggregates findings from all major global fact-checkers (Snopes, PolitiFact, AFP Fact Check, BBC Reality Check, Full Fact, Lead Stories, Africa Check, etc.)
- Surfaces where fact-checkers from different countries disagree with each other
- Builds a citation graph showing which credible outlets have addressed the claim and when

**Output:** A sourced verification report — not "true/false" but "here is the full evidence trail, here is where sources agree, here is where they diverge."

**Verified contributor layer:** Credentialed journalists and researchers can append additional findings or dispute automated results, clearly labelled separately from the automated report.

---

## Category 4: Geopolitical Intelligence

### 6. Live Geopolitical Conflict Map (Central Hub)
An interactive globe-to-Mercator map (MapLibre GL JS) that serves as the home screen and entry point for the entire platform.

**Core map features:**
- Active armed conflicts, political crises, territorial disputes, proxy wars, civil unrest
- Severity indicators (local vs. global impact, escalating vs. de-escalating)
- Hotspot clustering with drill-down into individual conflicts
- Clicking a hotspot surfaces: relevant news articles, cross-lingual narrative comparison, diplomatic signals, gray zone activity — all other features are accessible from the map

**Perspective layers:**
Toggle between 5 geopolitical perspectives to see how each world view perceives global hotspots:
| Layer | Key sources |
|-------|-------------|
| Western | Reuters, AP, BBC, Guardian, NYT |
| Russian | RT, TASS, Sputnik |
| Chinese | CGTN, Xinhua, Global Times |
| Indian | NDTV, The Hindu, Indian Express |
| Arabic | Al Jazeera, Arab News, Asharq Al-Awsat |

- **Blindspot overlay**: highlights conflicts that are high severity but low coverage from the selected perspective
- **Consensus layer**: shows only what all 5 perspectives agree is a crisis
- **Divergence mode**: side-by-side view showing where two perspectives disagree on severity

**Coverage heat layer:**
Shows where media attention is concentrated vs. actual conflict severity — revealing over and undercovered conflicts.

**Geo-tagged article feed:**
News organised by geography rather than chronology. Articles are surfaced contextually as you navigate the map — not a traditional reverse-chronological list.

### 7. Diplomatic Signaling Decoder
Monitors official government statements, foreign ministry releases, and UN speeches over time, detecting language drift around specific issues as early warning signals.

- Tracks subtle word-level changes in official statements (e.g. "oppose" → "do not support")
- Flags escalation or de-escalation patterns in diplomatic language
- Cross-references against known historical precedents for similar language shifts
- Data: 156-country diplomatic website dataset (1.16M articles), UN General Debate corpus (every country's speeches since 1970)

### 8. Gray Zone Operations Tracker
Structured taxonomy and visualization of below-threshold conflict actions by actor, type, target, and intensity.

**Operation types tracked:**
- Cyberattacks and digital sabotage
- Economic coercion and sanctions pressure
- Information operations and disinformation campaigns
- Lawfare (using legal systems as geopolitical weapons)
- Proxy support and irregular warfare
- Maritime and airspace harassment

Updated periodically (daily/weekly) from news, government reports, and think tank publications. Presented as a semi-static database rather than real-time to ensure accuracy.

### 9. UN Voting Alignment Tracker
Tracks geopolitical alignment drift over time using UN General Assembly and Security Council voting data.

- Visualises which countries are moving toward or away from US, China, or Russia orbit
- Identifies genuine swing states ahead of key votes
- Correlates alignment shifts with economic events, aid flows, and diplomatic visits
- Data: Bailey et al. dataset (ideal point estimates 1946–2024), UN voting records
- Updated as new votes are recorded

---

## The News Feed
The map IS the news feed. Articles are not organised chronologically — they are spatially anchored to the events they describe. Navigating the map surfaces relevant articles from multiple perspectives for any region or conflict.

**News sources (open-access, no paywall required for full text):**
| Source | Coverage |
|--------|----------|
| The Guardian | Global, full API |
| VOA | US foreign policy, public domain |
| Deutsche Welle | European/global |
| France 24 | Global |
| Al Jazeera | Middle East/global |
| BBC News | Global (snippets) |
| GDELT Project | 65+ languages, global, free |

For paywalled outlets (NYT, WaPo, FT): headline + snippet + link only. Users click through to the original source.
