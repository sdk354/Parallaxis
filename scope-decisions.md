# Scope Decisions — August 2026

Answers to the open questions from the ideation review (2026-08-07). These close the gaps left after the April planning docs.

## Project context
- **Team:** Solo final-year project
- **Timeline:** Due early–mid 2027 (full academic year: proposal → build over both semesters → submission around March–May 2027)

## Product shape

### Event/conflict model: Automatic event clustering
Articles are grouped into events automatically via cross-lingual NLP, rather than a hand-curated conflict list. **This is the hardest single component in the platform** — it becomes the technical centerpiece and the biggest risk item. Mitigation to design for: a curated-list fallback must remain possible if clustering quality is insufficient by mid-build.

### MVP scope: Everything is in
All four feature groups are must-haves:
1. Rhetoric & Debate Analyser
2. Narrative comparison suite (Cross-Lingual Comparator + State Media Dashboard)
3. Verification & Context Engine
4. Alignment & diplomacy trackers (UN Voting, Diplomatic Decoder, Gray Zone)

⚠️ Full scope + solo + auto-clustering is more than one person typically ships in an academic year. A phased build order with internal cut-lines is required so that whatever is done by deadline is coherent (see risk register, to be written).

### Severity scoring: Own composite score
Design a documented, transparent formula (e.g. fatalities + event frequency + displacement + escalation trend). Must be defensible in the viva — write the methodology chapter alongside the formula, and validate against external ratings (CrisisWatch) as a sanity check.

### Perspective layers: Rethink the set
The Western/Russian/Chinese/Indian/Arabic five-set is NOT final. Reconsider which perspectives to include (candidates: African, Iranian, Turkish, Latin American; or bloc-based organisation). Decision criteria: source availability (full-text, scrapable/RSS), language coverage of the NLP models, and genuine narrative distinctiveness. **Open task: source audit per candidate perspective.**

## Data & pipeline

### Verification Engine: Full media verification
Committed to real reverse image search, not just link-outs. Accept paid APIs (Google Vision web detection is the realistic option; TinEye API is commercial) and/or scraping risk for Yandex. **Open task: cost estimate and API feasibility spike — budget per 1,000 lookups.** EXIF, Wayback, and GeoConfirmed remain in scope as the free tier of the pipeline.

### Ingestion scale: UNDECIDED
Curated outlet set vs GDELT firehose vs hybrid — blocked on a compute/cost estimation. **Open task: estimate articles/day for candidate outlet sets and NLP inference cost, then decide.** (Note: the hybrid — full NLP on curated outlets, GDELT precomputed fields for breadth/blindspot stats — was the natural candidate.)

### Historical data: Backfill archives
Time-depth features (Mutation Tracker, Diplomatic Decoder) get history via backfill: GDELT back-data, UN General Debate corpus, diplomatic-website dataset, Wayback. Backfill volume interacts with the ingestion-scale decision above.

## Academic wrapper — PARTLY RESOLVED 2026-09-03

**→ See `module-requirements.md`.** The module documents (PUSL3190, 40 credits,
~7 months, working prototype) resolved most of this:

- **Evaluation methodology** — no longer open in principle: "test and evaluate
  thoroughly" is an explicit grade requirement. The *form* still needs the
  supervisor's steer.
- **Publication is compulsory and was missed entirely.** Research Paper
  Acceptance is 10 marks and Research Abstract is a tracked deliverable. Needs a
  venue and a backwards-planned submission date.
- **Ethics** — still unresolved. The lecture names ethics as a roadmap stage but
  does not say whether a formal submission is required. Ask the supervisor.
- **User validation** — still unresolved; not addressed in the extracted slides.

### Original entry, kept for the record — blocked on module requirements
- **User validation** (interviews/surveys): unknown — check what the module requires; NSBM students/lecturers are the accessible pool if required.
- **Evaluation methodology**: unknown — likely benchmarks (SemEval test sets) + usability study, but confirm with supervisor.
- **Ethics/legal process**: unknown — find out whether NSBM requires formal ethics approval; regardless, a risk section (defamation surface, sanctioned-media redistribution, scraping ToS) should be written.

**→ Single blocking action for all three: read the module handbook / ask the supervisor.**

## Open tasks emerging from these decisions
1. Feasibility spike: cross-lingual event clustering approach (candidate methods, quality bar, fallback trigger)
2. Source audit for the perspective-layer rethink
3. Severity composite formula draft + validation plan
4. Reverse-image-search API cost/feasibility estimate
5. Ingestion volume + NLP compute estimation → ingestion-scale decision
6. Module requirements check (validation, evaluation, ethics)
7. Phased build plan with explicit internal cut-lines (solo-scope risk management)

---

# Scope Decisions — November 2026 (proposal lock)

Taken 2026-11-02, eight days before the project proposal is due. These supersede
the August entries where they conflict. Rationale for the shape of this section is
in `defensibility.md` §5.6 ("breadth is the enemy of a contribution claim").

## Decisions

1. **All nine features stay in, phased, with hard cut-lines.** Chosen deliberately
   over a narrow core. The cut-lines below are what makes it defensible: each phase
   ends in a coherent, demonstrable system, so whatever is finished at the deadline
   stands on its own.
2. **Curated event list first; auto-clustering is a stretch goal.** Reverses the
   August decision that made cross-lingual clustering the centerpiece. The pipeline
   is proven end-to-end against a hand-curated list of events, and auto-clustering
   is attempted only once that works. Rationale: clustering was the single largest
   risk to the deadline, and a working system with one manual step is defensible in
   a viva where an unfinished clustering engine is not.
3. **Zero budget.** Free API tiers and local open-weight models only.
   - **Consequence:** the Verification Engine (#5) ships as its *free tier* only —
     EXIF extraction, Wayback earliest-appearance, GeoConfirmed matching, and
     fact-checker aggregation. **Reverse image search (Google Vision, TinEye,
     Yandex) moves to Future Work.** This reverses the August commitment to "full
     media verification"; the commitment was made assuming a budget that does not
     exist.
   - **Consequence:** the council runs on free tiers plus local models via Ollama.
     Origin diversity must be preserved — it is the project's central methodological
     claim — so the target set is a US-origin model, a Chinese-origin model (Qwen),
     and a European-origin model (Mistral), at least two of them local.
     **Confirmed 2026-11-02: 32 GB RAM available** — comfortable for 7B inference
     and headroom for 14B or quantised larger models. Local-model origin diversity
     is therefore unconstrained by hardware.
4. **Annotator availability unresolved.** Blocks the gold set (Objective 4). To be
   asked alongside the deadline and ethics questions. Fallback if solo: benchmark
   the council against an existing human-labelled dataset (BorderLines, BABE)
   instead of producing original annotations.

## Aim

To design, build and evaluate an open web platform that makes cross-national
divergence in geopolitical news framing visible at the level of the individual
article, using a council of origin-diverse language models to mitigate the
single-model origin bias that published evidence identifies.

## Objectives

1. **Establish the research position.** Verify the literature base manually,
   document the gap, and define "geopolitical" as a written inclusion/exclusion
   codebook adapted from a published taxonomy (GDELT CAMEO or IPTC Media Topics)
   rather than invented. *Measure: codebook written; every cited work verified.*
2. **Build a permission-compliant ingestion pipeline.** RSS and licensed APIs over a
   curated multi-perspective outlet set, normalised into a single schema, with the
   collection asymmetry recorded in `data-sources-compliance.md` measured and
   reported. *Measure: articles/day ingested per perspective layer.*
3. **Implement the council.** Three or more origin-diverse models scoring
   article-level framing via forced-choice probes (per Kim & Kim's finding that
   open-ended prompts yield evasion), reporting inter-model disagreement as
   confidence rather than collapsing it to a mean. *Measure: inter-model agreement
   reported per dispute and per model origin.*
4. **Validate against human judgement.** Construct an annotated gold set and report
   inter-annotator agreement (Krippendorff's α or Cohen's κ) and model–human
   agreement. *Measure: agreement coefficients reported.* Fallback: benchmark
   against BorderLines/BABE.
5. **Deliver the map-first interface.** Divergence encoded on the marker, never by
   position; confidence as stroke continuity; perspectives never permanently
   colour-coded — per the recorded decisions in `ui-design.md`.
   *Measure: working prototype demonstrating all phase-1 features.*
6. **Evaluate and publish.** Evaluate the system, and submit a research paper on
   model-origin effects in article-level framing analysis. *Measure: paper submitted
   to a named venue by a backwards-planned date.*

## Phased build plan and cut-lines

Build window: mid-November 2026 → submission March–May 2027.

### Phase 0 — Foundation (Nov–Dec)
Stack decision, git repository, database schema, RSS ingestion over the curated
outlet set, keyword + embedding relevance filter, curated event list (10–30 events),
map rendering real ingested data.

> **Cut-line:** if Phase 0 is not complete by end of December, the project is behind
> and Phases 2–3 are abandoned without further deliberation.

### Phase 1 — Core and research contribution (Jan)
Council implementation; article-level framing scores; Cross-Lingual Narrative
Comparator (#2) and State Media Narrative Dashboard (#3) surfaced through the
Live Conflict Map (#6); gold-set annotation and agreement measures.

> **This phase is the minimum viable thesis.** It satisfies the aim, all six
> objectives, and the research paper on its own. Everything after it is additive.
> **Cut-line:** nothing in Phase 2 or 3 starts until Phase 1 is demonstrable.

### Phase 2 — Cheap breadth (Feb)
Rhetoric & Debate Analyser (#1) — reuses the council, needs no ingestion, strong
30-second demo hook. UN Voting Alignment Tracker (#9) — existing Bailey et al.
dataset, visualisation only, no NLP.

> Chosen as Phase 2 because both are near-zero marginal cost: #1 adds no pipeline
> and #9 adds no model.
> **Cut-line:** stop here if the Interim submission shows slippage.

### Phase 3 — Data trackers (Mar)
Diplomatic Signaling Decoder (#7) — existing corpora. Gray Zone Operations Tracker
(#8) — semi-static database. Verification & Context Engine (#5) — free tier only.
Narrative Mutation Tracker (#4).

> Ordered last because these are largely visualisation over existing datasets and
> are the least connected to the research question. #4 and #5 are last within the
> phase as the most expensive and least load-bearing.

### Stretch — Auto-clustering
Swap the curated event list for cross-lingual automatic clustering. Attempted only
if Phases 0–1 are complete and on schedule. A successful swap is a second
contribution; an unsuccessful attempt costs nothing because the curated list
remains in place.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Nine features, solo, ~5 months | Incomplete system at deadline | Phase cut-lines above; each phase ends demonstrable |
| Cross-lingual clustering unsolved | Loss of the "parallax" premise | Demoted to stretch; curated list is the shipped path |
| Zero budget constrains the council | Weakens the central methodological claim | Resolved: 32 GB RAM runs local open-weight models, preserving origin diversity at no cost |
| No annotators available | Loses strongest contribution | Fallback to BorderLines/BABE benchmarking |
| Collection permission asymmetry | Corpus skewed toward state media | Measured and reported; RSS/API for restricted outlets (`data-sources-compliance.md` §3) |
| Publication timeline | 10 marks at risk | Backwards-plan from a named venue; ACL SRW tier is the realistic target |
| Deadlines still unknown | Cannot plan | Blocking email to coordinator — send immediately |

## Open tasks (revised)

1. **Email the coordinator today:** all deliverable deadlines, FYP Handbook, whether
   formal ethics approval is required, whether annotation by coursemates needs
   clearance, and what the proposal template and rubric are.
2. Stack decision (one hour, blocks all code).
3. `git init` and commit the existing documents.
4. Geopolitics inclusion/exclusion codebook, adapted from CAMEO or IPTC.
5. Verify the 15–20 citations the proposal will actually use.
6. Name a publication venue and backwards-plan the submission date.
7. Post-May-2026 literature sweep — **after** the proposal.
