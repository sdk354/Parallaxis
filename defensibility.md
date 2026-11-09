# Defensibility

Why Parallaxis is worth building, stated so it survives a panel.

Written 2026-09-10, after supervisory feedback. The supervisor's central question was
not "is this a bad idea" but **"why?"** — what makes this worth pursuing and
investing in, in terms defensible to an examining panel. This document is the
answer, and it is the source text for the PID introduction, the Final Report's
problem statement, and the opening two minutes of the presentation.

Panel Q&A is 25 marks — the largest single presentation criterion. Everything here
is written to be said out loud under questioning.

---

## 1. The gap statement

> Deployed media-bias tools rate the **outlet**, statically, on a **US left/right
> axis** that does not exist in geopolitics. The nearest academic system is
> single-model, English-only, four outlets, and evaluated by the same class of
> model that produced its output. And a single LLM cannot serve as a neutral
> adjudicator of geopolitical framing at all, because its stance on a territorial
> dispute is a function of its training origin and the language it is asked in.
>
> **Parallaxis is therefore article-level rather than outlet-level, cross-lingual
> rather than English-only, adjudicated by a multi-model council rather than one
> model, and validated against a human-annotated gold set rather than by an LLM
> scoring itself.**

Each clause is a citation, not an opinion. That is the point of this document.

---

## 2. The three legs

### Leg 1 — Deployed tools label sources, not stories, on the wrong axis

Ground News, AllSides and Media Bias/Fact Check all assign a bias rating to an
**outlet**, then apply it to every article that outlet publishes. Two problems:

1. **Granularity.** An outlet's individual articles vary enormously. A static
   outlet label cannot represent how a specific story was framed.
2. **The axis is wrong for the domain.** "Left / centre / right" is a US domestic
   partisan axis. There is no left and right in how Indian, Pakistani and Chinese
   outlets frame the same border incident. Applying that scale to geopolitics does
   not produce a weak answer — it produces a category error.

Source: `competitive-landscape.md`, which already records Ground News as
"snapshot not longitudinal, outlet-level not story-level, no geopolitical analysis
layer". That observation, made in April 2026, is the first leg of the justification.

**Verified directly against Ground News' own methodology page
(<https://ground.news/rating-system>, retrieved 2026-11-03).** Their documentation
concedes both halves of this leg in their own words:

> "The Ground News bias ratings assess the political bias of news publications. They
> are based on the average rating of three independent news monitoring
> organizations: AllSides, Ad Fontes Media, and Media Bias Fact Check. **The analysis
> is done in the context of the U.S. political system.** […] **This rating does not
> measure the bias of specific news articles. The analysis is done at the
> publication level.**"

> Factuality Score: "**Scores apply to each publication as a whole, not to their
> individual articles.**"

This is the strongest single citation available to the project: the market leader
documents the exact two limitations Parallaxis is built to address. Quote it rather
than paraphrasing it.

**Two precision notes, so the claim is not overstated in the viva:**

1. Ground News *does* present per-story figures ("40% Right coverage: 280 sources").
   That is a *coverage distribution computed from publication-level ratings*, not an
   analysis of any article's framing. State the claim as "rates publications, not
   articles" — not as "has nothing story-level", which is false and checkable in
   seconds.
2. **Name collision:** Ground News ships a feature called **Blindspot** — "stories
   disproportionately covered by one side of the political spectrum". `features.md`
   plans a "Blindspot overlay" on a different axis (per-perspective-layer, not US
   left/right). Either rename ours or distinguish it explicitly; any panel member who
   uses Ground News will recognise the term.

### Leg 2 — The nearest academic system leaves the evaluation hole open

**Hasan, M. R. (2026).** *A Computational Framework Using NLP and LLMs for Media
Bias Detection in Geopolitical News Reporting.* MSc thesis, Business Data Science,
Aalborg University. Supervisor: Primoz Konda. Submitted 31 May 2026.
<https://projekter.aau.dk/projekter/files/840242806/Thesis.pdf>

This is Parallaxis's nearest existing neighbour and it should be cited early and
generously — it **validates the architecture**. It builds: scrape four outlets
(BBC, The Guardian, Daily Star, New Age) → clean, de-duplicate, topic-filter →
TF-IDF + sentiment + LLM comparative narrative analysis → Streamlit interface,
across the Russia–Ukraine war, the Iran–Israel conflict and Taiwan Strait tensions.
It found Bangladeshi coverage emphasised humanitarian consequence where
international coverage emphasised diplomacy and strategy. It passed.

So the pipeline is defensible. What it leaves open:

| Hasan's stated limitation | Parallaxis's response |
|---|---|
| Single OpenAI model; concedes LLMs "cannot be treated as fully neutral analytical observers" | multi-model council |
| English-only; never processed Bangla at scale despite it being the premise | cross-lingual by design |
| Four outlets, three conflicts | multi-source, multi-region |
| Scraping broke on HTML layout changes | RSS/API-first ingestion (see `data-sources-compliance.md`) |
| Periodic batch; real-time named as future work | continuous ingestion |
| Streamlit dashboard; future work asks for "geopolitical heatmaps, narrative evolution timelines, comparative framing matrices" | the map, the timeline, the divergence encoding |

**The decisive one is evaluation.** The thesis contains no quantitative evaluation:
no F1, no accuracy, no human gold standard, no inter-annotator agreement. Its
"evaluation" is an LLM-generated rubric scoring the LLM's own output on fidelity,
fairness and framing depth — a model judging itself. Its own Future Work section
names **"intercoder reliability testing"** as the missing piece.

That is the opening. It is also the cheapest item on the Parallaxis roadmap.

### Leg 3 — A single LLM is structurally unfit to adjudicate geopolitical framing

**Kim, S., & Kim, H. J. (2025).** *A Dual-Layered Evaluation of Geopolitical and
Cultural Bias in LLMs.* Proceedings of ACL 2025, Volume 4: Student Research
Workshop, pp. 580–595. <https://aclanthology.org/2025.acl-srw.38/>
Dataset and code: <https://github.com/seank021/LLM-Bias-Evaluation>

Two concepts to adopt as project vocabulary:

- **Model bias** — the model leans toward the national narrative of its training origin.
- **Inference bias** — the model leans toward whatever language the query is written in.

Evaluated Bllossom (KR), Qwen1.5 (CN), Rakuten (JP), Llama 3 (US) and GPT-4 over
four East Asian disputes (the Northeast Project, Dokdo/Takeshima, comfort women,
Senkaku/Diaoyu). Findings that bear directly on the council design:

- On **disputable** questions, models aligned with **national origin**. The Korean
  model favoured Korea's position across all four disputes *even when prompted in
  other languages*. GPT-4 "aims for neutrality but shows topic-dependent leanings".
- On **factual** questions, the **query language** dominated instead — the same
  model returned different national framings depending on the language asked in.
- **Question format determines whether bias is visible at all.** Open-ended
  questions produced mostly evasive or invalid answers; forced-choice (CHOICE) and
  true/false (TF) formats surfaced the lean clearly.

This is the empirical warrant for the council. Not "several models seemed more
balanced" but: *published evidence shows a single model's geopolitical stance is
determined by its training origin and the query language, therefore no single model
can adjudicate geopolitical framing.*

**Cite with care.** It is a Student Research Workshop paper and its Phase 2 is only
16 items, which it acknowledges is narrow next to BorderLines. Cite it for the
mechanism, not as heavy evidence. (Separately: ACL SRW is the appropriate venue
tier for this project's own publication requirement — useful calibration.)

**Downstream lead:** BorderLines (Li et al., 2024), a multilingual territorial-dispute
stance dataset, is a ready-made evaluation benchmark and is currently absent from
`research-papers.md`. Add it.

---

## 3. The research contribution

Leg 3 hands the project a testable hypothesis, and that hypothesis is the required
research paper:

> **Does an LLM's national training origin change how it scores the framing of a
> news article — and does that effect vary with the article's own national origin
> and language?**

Kim & Kim tested origin effects on *questions*. Nobody in the current bibliography
has tested them on *news articles*. The experiment is small, solo-achievable, and
falsifiable:

1. Take N articles covering the same events from outlets in several national media
   environments.
2. Score each with a council spanning training origins (a US model, a Chinese model,
   a European or open-weight model), using forced-choice probes rather than
   open-ended prompts, per Kim & Kim's format finding.
3. Report inter-model agreement, and whether disagreement concentrates where the
   article's origin matches or opposes a given model's origin.
4. Compare all of it against a human-annotated subset.

The result is publishable whichever way it comes out. Agreement means the council is
redundant and one model suffices — a useful negative result. Disagreement means
single-model bias analysis is unsound, which is the stronger claim and the one the
literature predicts.

**The council is not an implementation detail. It is the answer to the panel's
hardest question, and it should be framed that way from the first slide.**

---

## 4. The highest-value outstanding action

**Build the human-annotated evaluation set.** A few hundred articles annotated by
hand — the student plus two other annotators — with a reported agreement
coefficient (Krippendorff's α or Cohen's κ).

Why this before anything else:

- It is the exact dimension Hasan concedes is missing, so it is a direct, citable advance.
- Without it, every AI output in the system is unfalsifiable, and the panel will say so.
- It converts the project from a demo into a study, which the 10-mark publication requires.
- It costs a few weekends. Everything else on the roadmap costs months.

---

## 5. Defending the project under questioning

Panel Q&A is 25 marks. This section is written to be *said*, not read.

### 5.1 The reframe — deploy this early

The commonest challenge will be some form of **"why do this if it already
exists?"** The answer is not a list of differentiators. It is this:

> "The fact that several people are attacking this problem independently is the
> strongest evidence I have that it's worth attacking. If nothing comparable
> existed, the honest question would be whether the problem is real or tractable at
> all. The question isn't whether the space is occupied — it's whether this instance
> improves on what's there in a way I can state precisely. It does, in three ways,
> and I can tell you exactly which."

Ground News has a paying user base. prta.eu came out of a SemEval shared task.
Hasan's thesis passed at Aalborg. That convergence — commercial and academic,
independent of each other — is the argument. Prior work is evidence *for* the
project, not against it.

Said early, this puts the rest of the Q&A on the project's terms.

### 5.2 The discipline — make them name the thing

"This already exists" is almost never true in the form it is asked. Vague claims
cannot be rebutted; specific ones can be dismantled. So the first move is always to
ask **which** thing, and then run four beats:

**concede → locate → differentiate → consequence**

Concede what is true immediately and without hedging. Locate the prior work
precisely (author, venue, year). State the one difference that matters. Say what
follows from it. Then **stop** and let them follow up. Long defensive answers read
as insecurity.

### 5.3 Scripted answers — "it already exists"

**"Ground News already does this."**
> "Ground News rates *outlets*, not articles, and it rates them left / centre /
> right — a US domestic partisan scale. Ask it how Indian and Pakistani coverage of
> the same border incident differ and it has no axis to answer on, because there
> isn't a left and a right in that dispute. That's the case this is built for.
> Different unit of analysis, different axis, different domain."

**"There's already a thesis doing exactly this."** *(Hasan 2026)*
> "Yes — Hasan, at Aalborg, submitted 31 May this year. I've read it in full and it's
> cited throughout my report; it validates the architecture, which is part of why
> I'm confident the pipeline works. It uses one model, English only, four outlets,
> and its evaluation is an LLM scoring its own output against a rubric. Its own
> Future Work section names intercoder reliability testing as the missing piece.
> This project is that work."

Leading with *"I've read it in full and I cite it"* is the strongest move available:
it turns an attempted ambush into evidence of scholarship in one sentence.
**Bring the thesis to the viva, printed and tabbed.** Being able to say "page 52,
here is the limitations section" ends that line of questioning permanently.

**"Aren't these all just existing components?"**
> "Yes. Every component is established — the pipeline, the framing classifiers, the
> ensemble approach. I'm not claiming a new method. The contribution is the
> measurement: whether a model's national training origin changes how it scores news
> framing. I'd rather claim that precisely than claim a novelty I can't defend."

**"Why does this need to exist at all?"** — two answers, neither of which is novelty:

> *Access.* "The analytical capability exists but it's enclosed. Stratfor is
> enterprise-priced, Ground News's comparison sits behind a subscription, and
> Reuters' own robots.txt admits OpenAI's crawlers under licence while blocking a
> student research crawler. The capacity to read the international information
> environment is increasingly available to whoever can pay for it. Building it open
> and inspectable is a reason on its own."

> *Method.* "The closest prior system isn't merely incomplete — it has a specific
> flaw that published evidence identifies. Kim and Kim show a model's stance on a
> territorial dispute is determined by its training origin and the language it's
> asked in. Hasan used one model. So this isn't 'mine has more features'; it's that
> single-model geopolitical adjudication is unsound, and correcting it means
> rebuilding the analysis layer."

### 5.4 Scripted answers — method and validity

**"How do you know your AI isn't biased?"**
We assume it is. Kim & Kim (2025) show a model's geopolitical stance follows its
training origin and the query language. So no single model adjudicates. A council
spanning training origins scores each article, and the system reports the *spread*,
not the mean — disagreement is displayed as reduced confidence rather than hidden
behind an average. This is why the interface never shows a binary verdict.

**"Does showing people opposing perspectives actually help?"**
The honest answer is that the evidence is mixed and Parallaxis is not a
de-polarization intervention. Bail et al. (2018, *PNAS*) found that exposure to
opposing views on social media *increased* polarization; Wood & Porter (2019) found
backfire effects rare and hard to reproduce. Parallaxis is an analytical instrument
for people whose work is reading information environments — researchers, analysts,
journalists — not a persuasion tool aimed at partisan readers scrolling a feed. The
entire interface direction, an optical survey instrument rather than a social feed,
commits to that reading. **These two papers must be read before the viva.**

**"What is 'geopolitics'? Where's the line?"**
A written inclusion/exclusion codebook, derived from a published taxonomy — GDELT's
CAMEO event codes or IPTC Media Topics — not invented for this project. "We adapted
a published taxonomy" survives questioning; "we decided" does not.

**"Did you have the right to this data?"**
See `data-sources-compliance.md`. RSS and licensed APIs first, dated robots.txt
snapshots in the appendix, named and contactable crawler, no rehosting of article
text. Includes a measured sampling asymmetry and its mitigation.

**"What's your sample and is it representative?"**
Answered by the sampling-asymmetry section of `data-sources-compliance.md`. The
outlets that permit automated collection are not randomly distributed with respect
to the axis being measured. Stating and mitigating this is stronger than any claim
of a clean sample.

### 5.5 What not to say

- **"Nothing like this exists."** Falsifiable in ten seconds by anyone with a phone.
  One wrong claim of this kind costs the room.
- **"Mine has a better interface."** Reads as polish rather than substance, even
  though the encoding work is genuinely good. Let the design contribution arise on
  its own; never make it the differentiator.
- **"Mine has more features."** Invites the scope question, and sounds like padding.
- **Everything at once.** Four beats, then stop.

### 5.6 What is and isn't novel

Asked directly, answer honestly — there is **no novel method here and none should be
claimed.** Scrape/filter/classify pipelines, LLM framing detection, model ensembles,
cross-lingual event clustering and map-based news visualisation are all established.
"An AI system that detects bias in news" is the claim that gets dismantled fastest.

Four things are genuinely contributions, ranked by how well they survive scrutiny:

1. **The permission asymmetry as a corpus-construction confound** (§ `data-sources-compliance.md` §3).
   No known prior work documents that `robots.txt` AI-crawler permissions correlate
   with the geopolitical axis a media-bias study is measuring. Highest novelty,
   lowest cost — the data is already collected. A realistic standalone short paper,
   and a more achievable publication target than a systems paper.
   **Unverified priority claim** — search corpus-construction and web-measurement
   literature before asserting it, per §8.
2. **Model-origin effects on naturalistic news text.** Kim & Kim measured origin and
   language effects on 70 curated QA items and 16 dispute items. Extending this to
   real articles, at article level, cross-lingually, with a human-annotated gold set
   they did not have, is a legitimate contribution: novel application and new
   measurement, not new method. This is the main paper.
3. **Disagreement as the output rather than consensus.** Ensembles normally aggregate
   toward agreement. Treating inter-model disagreement as the signal, with models
   chosen for ideological diversity, and surfacing it to the reader as reduced
   confidence, is a novel *combination* — ensemble disagreement as uncertainty
   estimation is itself well known. Claim the combination, not the concept.
4. **The interface encoding.** The split-disc divergence marker, the refusal to
   permanently colour-code perspectives, confidence as stroke continuity, and the
   rejection of positional encoding because position on a map already means
   geography. Original, documented in `ui-design.md`, and undervalued by CS panels —
   but Final Product is 60 marks, so here it counts.

Two framings to keep straight, because they are different bars:

- **PUSL3190 wants a working prototype demonstrating competence.** Novelty is not the
  bar; scope, execution and defensible reasoning are.
- **The Research Paper Acceptance requirement wants a contribution.** That bar is
  cleared by item 1 or 2, not by the system as a whole.

And the point worth internalising: **an undergraduate final-year project is not
required to invent.** Replication with correction is legitimate research, and it is
what this is — a master's thesis established that the pipeline works and named its
own gaps; this project closes two of them. Saying that plainly is a stronger
position than any novelty claim that would have to be defended.

**Corollary for scope:** breadth is the enemy of a contribution claim. Nine features
and five perspective layers reads as an integration exercise. A narrow study — one
dispute type, three model origins, a few hundred annotated articles — claims far
more. This is a second, independent argument for the cut-lines `scope-decisions.md`
already calls for, and it says which way to cut: keep whatever feeds the
measurement, defer whatever only adds surface area.

---

## 6. Known weaknesses in the current position

Written down deliberately — a panel finds these faster than anyone.

1. **`research-papers.md` is a lead list, not a literature review.** It was
   AI-compiled on 2026-08-07 and its own header asserts every entry was verified,
   which is precisely the claim that cannot be taken on trust. Every citation must
   be independently opened, read and confirmed before it is used. Twenty-five marks
   ride on defending citations live.
2. **It is a "how to build it" bibliography, not a "why build it" bibliography.**
   Over a hundred entries on propaganda detection, framing classifiers, clustering
   and verification; nothing on framing *theory* and nothing on media *effects*.
   Missing and required: Entman (1993) on framing; Boydstun's Policy Frames Codebook
   (the codebook behind the Media Frames Corpus already cited); Bail et al. (2018);
   Wood & Porter (2019); BorderLines (Li et al., 2024).
3. **No evaluation set exists yet.** Section 4.
4. **Cross-lingual event clustering is unsolved and unscheduled.** The supervisor's
   proposed flow — crawl → filter → classify → display — omits the step that groups
   articles about the *same event* across languages and outlets. Without it there is
   no parallax, only a pile of separately scored articles. This is the schedule risk,
   not the bias classifier. Raise it at the next meeting.
5. **The literature after May 2026 has not been surveyed.** Section 7.

---

## 7. The post-May-2026 window

AI assistance has a hard knowledge cutoff of May 2026; today is September 2026. The
supervisor is right that this window must be covered manually, and the gap is wider
than four calendar months because indexing and publication lag push it back further.

Demonstrated concretely: the Hasan thesis is dated **31 May 2026**, sits exactly on
that boundary, and was unknown to the AI assistant until the supervisor supplied it.

Method, in priority order:

1. **Citation-forward, not keyword-first.** Take Kim & Kim (2025) and BorderLines
   (Li et al., 2024) and find who cited them during 2026, via Semantic Scholar or
   Google Scholar "Cited by" with a since-2026 filter. This surfaces recent work far
   more reliably than keyword search.
2. **Sweep the venues directly.** ACL Anthology for ACL 2026 (main, Findings, SRW)
   and NAACL 2026; EMNLP 2026 is November so preprints only.
3. **arXiv** cs.CL and cs.CY monthly listings.
4. **Standing alerts** on "media bias LLM", "geopolitical framing", "multilingual
   news framing" so the window maintains itself for the rest of the year.

---

## 8. Literature verification protocol

Per supervisory instruction, literature analysis is done **manually**, without AI
summarisation — at least initially. The reason is not purity, it is Q&A: a citation
that cannot be defended out loud in the viva is worse than no citation.

For each entry currently in `research-papers.md`:

1. Open the link. Confirm it resolves and matches the claimed title and authors.
2. Confirm venue and year against the publisher, not the aggregator.
3. Read at minimum the abstract, method and limitations sections.
4. Write two sentences in your own words: what it found, and what it is used for here.
5. Classify: **supporting**, **disrupting**, or **method**. The disrupting pile is
   the one the panel will ask about, and it is currently near-empty.
6. Mark unverified entries clearly. An unverified entry is not a citation.

Tools: Google Scholar, arXiv, ACL Anthology (aclanthology.org — the primary venue
for this topic and free full-text), Semantic Scholar for citation graphs.

---

## Sources cited in this document

- Hasan, M. R. (2026). *A Computational Framework Using NLP and LLMs for Media Bias
  Detection in Geopolitical News Reporting.* MSc thesis, Aalborg University.
  <https://projekter.aau.dk/projekter/files/840242806/Thesis.pdf> — read in full 2026-09-09.
- Kim, S., & Kim, H. J. (2025). *A Dual-Layered Evaluation of Geopolitical and
  Cultural Bias in LLMs.* ACL 2025 SRW, pp. 580–595.
  <https://aclanthology.org/2025.acl-srw.38/> — read in full 2026-09-09.
- `competitive-landscape.md`, `research-papers.md`, `scope-decisions.md`,
  `module-requirements.md`, `data-sources-compliance.md` — this repository.

**To verify before use** (named here from recall, not yet independently confirmed —
treat as leads, per §8): Entman (1993), *Journal of Communication*; Bail et al.
(2018), *PNAS*; Wood & Porter (2019), *Political Behavior*; Boydstun et al., Policy
Frames Codebook; Li et al. (2024), BorderLines.
