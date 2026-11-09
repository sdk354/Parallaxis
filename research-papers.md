# Research Papers & Articles — Literature Base

Compiled 2026-08-07. Every entry below was verified via web search (links checked to exist and match the topic). Organised by Parallaxis feature area so this can seed the literature-review chapter directly. Entries marked ⚠️ are caveat/limitations papers — important to cite for the epistemic-humility positioning.

---

## 1. Propaganda & Rhetoric Detection
*(Feature: Rhetoric & Debate Analyser)*

- **Fine-Grained Analysis of Propaganda in News Articles** — Da San Martino et al., EMNLP 2019.
  [https://aclanthology.org/D19-1565/](https://aclanthology.org/D19-1565/)
  The foundational paper: defines the 18-technique propaganda taxonomy and the span-level annotated corpus (PTC) that everything else builds on. Cite first.

- **SemEval-2020 Task 11: Detection of Propaganda Techniques in News Articles** — Da San Martino, Barrón-Cedeño, Wachsmuth, Petrov, Nakov, 2020.
  [https://aclanthology.org/2020.semeval-1.186/](https://aclanthology.org/2020.semeval-1.186/) · [arXiv:2009.02696](https://arxiv.org/abs/2009.02696)
  The shared task behind your planned training data. Two subtasks (span identification + technique classification, 14 techniques); best systems were transformer ensembles. Gives you the realistic state-of-the-art F1 baseline to quote.

- **Prta: A System to Support the Analysis of Propaganda Techniques in the News** — Da San Martino et al., ACL 2020 (demo).
  [https://aclanthology.org/2020.acl-demos.32/](https://aclanthology.org/2020.acl-demos.32/) · live at [propaganda.math.unipd.it](https://propaganda.math.unipd.it/)
  Your closest academic predecessor (already in competitive-landscape.md as prta.eu). Cite it and articulate what Parallaxis adds: geopolitical context, multi-perspective layers, confidence-first UX.

- **Interpretable Propaganda Detection in News Articles** — RANLP 2021.
  [https://arxiv.org/abs/2108.12802](https://arxiv.org/abs/2108.12802)
  Interpretability of propaganda classifiers — directly supports the "show why it was flagged" design principle.

- **Logical Fallacy Detection** — Jin et al., Findings of EMNLP 2022.
  [https://arxiv.org/abs/2202.13758](https://arxiv.org/abs/2202.13758)
  Introduces the Logic dataset (+ LogicClimate challenge set) for classifying fallacies in text; shows LLMs perform poorly out of the box. The core reference for the fallacy half of the Analyser.

- **Case-Based Reasoning with Language Models for Classification of Logical Fallacies** — 2023.
  [https://arxiv.org/abs/2301.11879](https://arxiv.org/abs/2301.11879)
  A stronger method on the same task; useful as the "how to actually do it" reference.

- **Robust and explainable identification of logical fallacies in natural language arguments** — Knowledge-Based Systems, 2023.
  [https://www.sciencedirect.com/science/article/abs/pii/S0950705123001685](https://www.sciencedirect.com/science/article/abs/pii/S0950705123001685)
  Three-stage framework (detection → coarse → fine-grained classification) with explainability — matches your UX of layered, explained annotations.

- **Large Language Models for Propaganda Detection** — 2023.
  [https://arxiv.org/abs/2310.06422](https://arxiv.org/abs/2310.06422)
  GPT-3.5/GPT-4 vs fine-tuned models on SemEval-2020 data — the LLM-vs-fine-tuned decision you'll face.

- ⚠️ **Limitations of Large Language Models in Propaganda Detection Task** — Applied Sciences 14(10), 2024.
  [https://www.mdpi.com/2076-3417/14/10/4330](https://www.mdpi.com/2076-3417/14/10/4330)
  LLMs over-predict propaganda and are inconsistent as detectors — key citation for why you show confidence scores, not verdicts.

- **Large Language Models for Propaganda Span Annotation** — Findings of EMNLP 2024.
  [https://aclanthology.org/2024.findings-emnlp.850/](https://aclanthology.org/2024.findings-emnlp.850/)
  Using LLMs to annotate propaganda spans at scale (incl. non-English) — relevant to expanding training data cheaply.

- **PropaInsight: Toward Deeper Understanding of Propaganda in Terms of Techniques, Appeals, and Intent** — 2024.
  [https://arxiv.org/abs/2409.18997](https://arxiv.org/abs/2409.18997)
  Moves beyond technique labels to appeals and intent — a possible richer output format for the Analyser.

- **Hybrid Annotation for Propaganda Detection: Integrating LLM Pre-Annotations with Human Intelligence** — 2025.
  [https://arxiv.org/abs/2507.18343](https://arxiv.org/abs/2507.18343)
  LLM pre-annotation + human refinement pipeline — mirrors your automated-pipeline + verified-contributor design.

---

## 2. Framing & Narrative Comparison
*(Features: Cross-Lingual Narrative Comparator, State Media Dashboard)*

### Framing detection
- **The Media Frames Corpus: Annotations of Frames Across Issues** — Card et al., ACL 2015.
  [https://aclanthology.org/P15-2072/](https://aclanthology.org/P15-2072/) · [data](https://github.com/dallascard/media_frames_corpus)
  The canonical 15 framing dimensions — the scheme SemEval-2023's frames derive from.

- **SemEval-2023 Task 3: Detecting the Category, the Framing, and the Persuasion Techniques in Online News in a Multi-lingual Setup** — Piskorski et al., 2023.
  [https://aclanthology.org/2023.semeval-1.317/](https://aclanthology.org/2023.semeval-1.317/)
  Your planned framing dataset: 9 languages (EN/FR/DE/IT/PL/RU + ES/EL/KA), genre + 14 frames + 23 persuasion techniques. The single most load-bearing dataset for the Comparator. Note: no Arabic, Hindi, or Chinese — directly relevant to the perspective-layer rethink.

- **Generalizability of Media Frames: Corpus creation and analysis across countries** — 2025.
  [https://arxiv.org/abs/2506.16337](https://arxiv.org/abs/2506.16337)
  Do framing schemes transfer across countries? Exactly the cross-cultural validity question the Comparator raises.

- **A Systematic Media Frame Analysis of 1.5 Million New York Times Articles from 2000 to 2017** — 2020.
  [https://arxiv.org/abs/2005.01803](https://arxiv.org/abs/2005.01803)
  Frame analysis at pipeline scale — methodological template for running framing models over an archive.

- **Semantic-based Unsupervised Framing Analysis (SUFA)** — 2025.
  [https://arxiv.org/abs/2505.15563](https://arxiv.org/abs/2505.15563)
  Unsupervised framing analysis — an option where labelled data doesn't exist (relevant for added perspective languages).

### Hero / villain / victim roles
- **Who is the Hero, the Villain, and the Victim? Detection of Roles in News Articles using Natural Language Techniques** — Gomez-Zara et al., IUI 2018.
  [https://dl.acm.org/doi/10.1145/3172944.3172993](https://dl.acm.org/doi/10.1145/3172944.3172993)
  Directly implements your "who is portrayed as hero/villain" feature — dictionary + sentiment approach.

- **Heroes, Villains, and Victims, and GPT-3: Automated Extraction of Character Roles Without Training Data** — 2022.
  [https://arxiv.org/abs/2205.07557](https://arxiv.org/abs/2205.07557)
  Same task, zero-shot with LLMs framed as reading comprehension — the modern way to build it.

- **Conflicts, Villains, Resolutions: Towards models of Narrative Media Framing** — Frermann et al., ACL 2023.
  [https://arxiv.org/abs/2306.02052](https://arxiv.org/abs/2306.02052)
  Unifies narrative roles with media framing theory — the theoretical bridge between your two narrative features.

- **Evaluating the Ability of Computationally Extracted Narrative Maps to Encode Media Framing** — 2024.
  [https://arxiv.org/abs/2405.02677](https://arxiv.org/abs/2405.02677)
  Narrative maps as a visual representation — relevant to the Comparator's "visual narrative comparison map" output.

### State media specifically
- **Two International Propaganda Models: Comparing RT and CGTN's 2020 US Election Coverage** — Journalism Practice, 2022.
  [https://www.tandfonline.com/doi/full/10.1080/17512786.2022.2086157](https://www.tandfonline.com/doi/full/10.1080/17512786.2022.2086157)
  Empirical evidence that RT and CGTN run *different* propaganda strategies — grounding for why the dashboard tracks narrative divergence between outlets, not just "state media" as a bloc.

- **Signalling media professionalism: comparative social constructions of RT and CGTN** — 2024.
  [https://tcv.gsu.edu/2024/06/06/new-research-signaling-media-professionalism-comparative-social-constructions-of-rt-and-cgtn-has-been-published-via-taylor-francis-online/](https://tcv.gsu.edu/2024/06/06/new-research-signaling-media-professionalism-comparative-social-constructions-of-rt-and-cgtn-has-been-published-via-taylor-francis-online/)
  Mixed-methods analysis of thousands of RT/CGTN posts (2017–2022) — RT aggressive/ideological vs CGTN tacit/celebratory.

- **Troubled Democracy: The Messaging of Democracy on CGTN, Facebook and Instagram** — APSA preprint.
  [https://preprints.apsanet.org/engage/api-gateway/apsa/assets/orp/resource/item/6762b8d881d2151a021b543e/original/troubled-democracy-the-messaging-of-democracy-on-cgtn-facebook-and-instagram.pdf](https://preprints.apsanet.org/engage/api-gateway/apsa/assets/orp/resource/item/6762b8d881d2151a021b543e/original/troubled-democracy-the-messaging-of-democracy-on-cgtn-facebook-and-instagram.pdf)
  Topic modeling + qualitative analysis of CGTN's "democracy" framing over 5 years — a methodological template for the dashboard.

- **Studying Chinese Foreign Policy Narratives: Introducing the Ministry of Foreign Affairs Press Conferences Corpus** — 2021.
  [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8458046/](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8458046/)
  Ready-made corpus of Chinese MFA press conferences — useful for both the dashboard and the Diplomatic Decoder.

---

## 3. Cross-Lingual Event Detection & Clustering
*(The event model — the platform's keystone decision)*

- **Event Registry: Learning About World Events From News** — Leban, Fortuna, Brank, Grobelnik, WWW 2014.
  [https://archives.iw3c2.org/www2014/proceedings/companion/p107.pdf](https://archives.iw3c2.org/www2014/proceedings/companion/p107.pdf)
  A production system doing exactly what you decided to build: clustering multilingual articles into single event objects with location, date, actors. **Study this before designing your pipeline** — it's the existence proof and the architecture reference.

- **News Across Languages — Cross-Lingual Document Similarity and Event Tracking** — Rupnik et al., JAIR 55:283–316, 2016.
  [https://arxiv.org/abs/1512.07046](https://arxiv.org/abs/1512.07046) · [IJCAI 2017 extended abstract](https://www.ijcai.org/proceedings/2017/0720.pdf)
  The formal methods paper behind Event Registry's cross-lingual similarity — the core algorithmic reference for your clustering component.

- **Multilingual and cross-lingual news topic tracking** — Pouliquen et al., COLING 2004.
  [https://dl.acm.org/doi/10.3115/1220355.1220493](https://dl.acm.org/doi/10.3115/1220355.1220493)
  The Europe Media Monitor lineage — agglomerative clustering + cross-lingual tracking. Older, but shows the problem has 20 years of history worth citing.

- **Research on Multilingual News Clustering Based on Cross-Language Word Embeddings** — 2023.
  [https://arxiv.org/abs/2305.18880](https://arxiv.org/abs/2305.18880)
  Modern embedding-based approach (sentence vectors + topic distributions + knowledge distillation) — closer to what you'd actually implement with today's models.

---

## 4. Fact-Checking & Verification
*(Feature: Verification & Context Engine)*

### Surveys & text claims
- **A Survey on Automated Fact-Checking** — Guo, Schlichtkrull, Vlachos, TACL 2022.
  [https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00454/109469/A-Survey-on-Automated-Fact-Checking](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00454/109469/A-Survey-on-Automated-Fact-Checking)
  The standard survey: claim detection → evidence retrieval → verdict + justification. Your engine's three-stage structure maps onto this — cite it as the framework. Companion resource list: [github.com/Cartus/Automated-Fact-Checking-Resources](https://github.com/Cartus/Automated-Fact-Checking-Resources)

- **Automated fact-checking: A survey** — Zeng, Abumansour, Zubiaga, Language and Linguistics Compass, 2021.
  [https://compass.onlinelibrary.wiley.com/doi/10.1111/lnc3.12438](https://compass.onlinelibrary.wiley.com/doi/10.1111/lnc3.12438)
  Second survey with deeper claim-detection focus.

- **Claim detection for automated fact-checking: A survey on monolingual, multilingual and cross-lingual research** — Natural Language Processing Journal, 2024.
  [https://www.sciencedirect.com/science/article/pii/S2949719124000141](https://www.sciencedirect.com/science/article/pii/S2949719124000141)
  The multilingual angle on claim detection — matches your cross-lingual scope.

- ⚠️ **Missing Counter-Evidence Renders NLP Fact-Checking Unrealistic for Misinformation** — Glockner et al., EMNLP 2022.
  [https://arxiv.org/abs/2210.13865](https://arxiv.org/abs/2210.13865)
  Shows real-world fact-checking often lacks retrievable counter-evidence — the strongest argument for your "evidence trail, not verdict" output design. Cite prominently.

### Image / multimodal verification
- **SNIFFER: Multimodal Large Language Model for Explainable Out-of-Context Misinformation Detection** — CVPR 2024.
  [https://arxiv.org/abs/2403.03170](https://arxiv.org/abs/2403.03170)
  Explainable out-of-context (miscaptioned image) detection — the most common conflict-imagery abuse your engine targets.

- **VERITE: A Robust Benchmark for Multimodal Misinformation Detection Accounting for Unimodal Bias** — 2024.
  [https://github.com/stevejpapad/image-text-verification](https://github.com/stevejpapad/image-text-verification)
  Evaluation benchmark for your multimodal verification component.

- **Leveraging Chat-Based Large Vision Language Models for Multimodal Out-Of-Context Detection** — 2024.
  [https://arxiv.org/abs/2403.08776](https://arxiv.org/abs/2403.08776)
  VLM-based approach — the practical build path given you'll be API-driven.

- **Multimedia Verification Through Multi-Agent Deep Research** — 2025.
  [https://arxiv.org/abs/2507.04410](https://arxiv.org/abs/2507.04410)
  Pipeline combining reverse image search, metadata analysis, fact-check databases, and news processing — essentially your engine's planned architecture as a paper.

- ⚠️ **Mitigating GenAI-powered Evidence Pollution for Out-of-Context Multimodal Misinformation Detection** — 2025.
  [https://arxiv.org/abs/2501.14728](https://arxiv.org/abs/2501.14728)
  AI-generated content polluting the web evidence your engine retrieves — a threat model to acknowledge.

- **Multimodal Fake News Detection via Evidence Retrieval and Visual Forensics with Large Vision-Language Models** — Information (MDPI), 2026.
  [https://www.mdpi.com/2078-2489/17/4/317](https://www.mdpi.com/2078-2489/17/4/317)
  Recent end-to-end evidence-retrieval + forensics system.

- **Fighting cheapfakes: using a digital media literacy intervention to motivate reverse search of out-of-context visual misinformation** — Journal of Computer-Mediated Communication 28(1), 2023.
  [https://academic.oup.com/jcmc/article/28/1/zmac024/6839987](https://academic.oup.com/jcmc/article/28/1/zmac024/6839987)
  User-side evidence that reverse-search tools improve verification behaviour — supports the platform's media-literacy mission for the report's motivation section.

---

## 5. Misinformation Spread & Narrative Mutation
*(Feature: Narrative Mutation Tracker)*

- **Lost in Translation: Using global fact-checks to measure multilingual misinformation prevalence, spread, and evolution** — 2023.
  [https://arxiv.org/abs/2310.18089](https://arxiv.org/abs/2310.18089)
  Tracks claims across languages using fact-check data — the closest existing methodology to the Mutation Tracker, and it uses data sources you already planned to ingest.

- **Narrative diffusion in social networks: a survey** — Social Network Analysis and Mining, 2025.
  [https://link.springer.com/article/10.1007/s13278-025-01565-1](https://link.springer.com/article/10.1007/s13278-025-01565-1)
  Recent survey of how narratives spread and mutate through networks — the literature map for this feature.

- **Tracking evolving communities in fake news cascades using temporal graphs** — Scientific Reports, 2026.
  [https://www.nature.com/articles/s41598-026-35175-4](https://www.nature.com/articles/s41598-026-35175-4)
  Temporal-graph method for following misinformation cascades — relevant to the genealogy-tree visualisation.

- **Trend analysis of COVID-19 mis/disinformation narratives — A 3-year study** — PLOS One, 2023.
  [https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0291423](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0291423)
  Longitudinal narrative tracking with hierarchical annotation (supernarrative → narrative → subnarrative) — a labeling scheme you could adopt.

- **The diffusion of misinformation on social media: Temporal pattern, message, and source** — Computers in Human Behavior, 2018.
  [https://www.sciencedirect.com/science/article/abs/pii/S0747563218300669](https://www.sciencedirect.com/science/article/abs/pii/S0747563218300669)
  Classic reference on how misinformation diffuses over time.

- **Misinformation dissemination on social media: key research themes and evolutionary paths between 2013 and 2023** — Humanities and Social Sciences Communications, 2025.
  [https://www.nature.com/articles/s41599-025-06067-1](https://www.nature.com/articles/s41599-025-06067-1)
  Decade-scale bibliometric map of the field — useful for framing the related-work chapter.

---

## 6. Geopolitical Data, Diplomatic Signals & Early Warning
*(Features: Conflict Map, Diplomatic Decoder, UN Voting Tracker, Gray Zone Tracker)*

### Core datasets (cite the papers, not just the data)
- **Introducing ACLED: An Armed Conflict Location and Event Dataset** — Raleigh, Linke, Hegre, Karlsen, Journal of Peace Research 47(5), 2010.
  [https://journals.sagepub.com/doi/10.1177/0022343310378914](https://journals.sagepub.com/doi/10.1177/0022343310378914)

- **Introducing the UCDP Georeferenced Event Dataset** — Sundberg & Melander, Journal of Peace Research 50(4), 2013.
  [https://journals.sagepub.com/doi/10.1177/0022343313484347](https://journals.sagepub.com/doi/10.1177/0022343313484347)

- **GDELT: Global Data on Events, Location and Tone, 1979–2012** — Leetaru & Schrodt, ISA 2013.
  [http://data.gdeltproject.org/documentation/ISA.2013.GDELT.pdf](http://data.gdeltproject.org/documentation/ISA.2013.GDELT.pdf)

- **Estimating Dynamic State Preferences from United Nations Voting Data** — Bailey, Strezhnev, Voeten, Journal of Conflict Resolution 61(2), 2017.
  [https://journals.sagepub.com/doi/10.1177/0022002715595700](https://journals.sagepub.com/doi/10.1177/0022002715595700) · [code](https://github.com/evoeten/United-Nations-General-Assembly-Votes-and-Ideal-Points)
  The ideal-point methodology your UN Voting Tracker visualises. Replication code exists — the tracker becomes largely a visualisation layer over this.

- **Understanding State Preferences with Text as Data: Introducing the UN General Debate Corpus** — Baturo, Dasandi, Mikhaylov, Research & Politics, 2017.
  [https://journals.sagepub.com/doi/10.1177/2053168017712821](https://journals.sagepub.com/doi/10.1177/2053168017712821)
  7,300+ UNGA statements 1970–2014 with methods for extracting country positions from text — the Diplomatic Decoder's historical backbone.

- **Quantifying Global Foreign Affairs with a Multimodal Dataset of Diplomatic Websites** — Scientific Data, 2025.
  [https://www.nature.com/articles/s41597-025-06334-5](https://www.nature.com/articles/s41597-025-06334-5)
  The 156-country / 1.16M-article dataset already in data-sources.md (GlobalDiplomacyNET) — this is its citable paper; data on Harvard Dataverse.

- **Diplomatic documents data for international relations: the Freedom of Information Archive Database** — Connelly et al., Conflict Management and Peace Science, 2021.
  [https://journals.sagepub.com/doi/full/10.1177/0738894220930326](https://journals.sagepub.com/doi/full/10.1177/0738894220930326)
  Declassified diplomatic documents corpus — supplementary historical depth for the Decoder.

### Early warning from text (validates the Diplomatic Decoder premise)
- **Reading Between the Lines: Prediction of Political Violence Using Newspaper Text** — Mueller & Rauh, American Political Science Review, 2018.
  [https://www.cambridge.org/core/journals/american-political-science-review/article/abs/reading-between-the-lines-prediction-of-political-violence-using-newspaper-text/4EABB473AFE18F157EEDE4339F34ABB0](https://www.cambridge.org/core/journals/american-political-science-review/article/abs/reading-between-the-lines-prediction-of-political-violence-using-newspaper-text/4EABB473AFE18F157EEDE4339F34ABB0)
  The landmark result: newspaper topic distributions predict violent escalation. The academic legitimacy anchor for language-as-early-warning.

- **ViEWS: A political violence early-warning system** — Hegre et al., Journal of Peace Research, 2019.
  [https://journals.sagepub.com/doi/10.1177/0022343319823860](https://journals.sagepub.com/doi/10.1177/0022343319823860)
  The major academic early-warning system — related-work benchmark.

- **Text as data for crisis-early warning: A comparative assessment of NLP methods for conflict prediction** — Conflict Management and Peace Science, 2026.
  [https://journals.sagepub.com/doi/10.1177/07388942261422045](https://journals.sagepub.com/doi/10.1177/07388942261422045)
  Very recent comparison of which NLP methods actually work for conflict prediction — method-selection guidance.

- **Do Large Language Models Know Conflict? Investigating Parametric vs. Non-Parametric Knowledge of LLMs for Conflict Forecasting** — 2025.
  [https://arxiv.org/abs/2505.09852](https://arxiv.org/abs/2505.09852)
  Whether LLMs can forecast conflict — relevant if you consider LLM-assisted severity/escalation signals.

- **Introducing a global dataset on conflict forecasts and news topics** — Data & Policy (Cambridge).
  [https://www.cambridge.org/core/journals/data-and-policy/article/introducing-a-global-dataset-on-conflict-forecasts-and-news-topics/AADA08BD5FC80EDD01E5CEBA7434F6E0](https://www.cambridge.org/core/journals/data-and-policy/article/introducing-a-global-dataset-on-conflict-forecasts-and-news-topics/AADA08BD5FC80EDD01E5CEBA7434F6E0)
  Ready-made forecasts + news-topic dataset — potential direct input for the map's escalation indicators.

### Gray zone
*(Note: this area is think-tank literature more than peer-reviewed datasets — reflect that honestly in the report.)*
- **Quantifying the Gray Zone: A Framework for Measuring Hybrid Warfare Power Balances** — Irregular Warfare Initiative, 2025.
  [https://irregularwarfare.org/articles/quantifying-the-gray-zone-a-framework-for-measuring-hybrid-warfare-power-balances/](https://irregularwarfare.org/articles/quantifying-the-gray-zone-a-framework-for-measuring-hybrid-warfare-power-balances/)
  A measurement framework for gray-zone activity — the closest thing to a methodology for your tracker's taxonomy; also documents that no systematic dataset exists (your feature's gap statement).

- **Hybrid Warfare, Grey Zone Conflicts, and the Battle of Narratives: Discourse as a Strategic Weapon** — 2025.
  [https://www.researchgate.net/publication/393763412_Hybrid_Warfare_Grey_Zone_Conflicts_and_the_Battle_of_Narratives_Discourse_as_a_Strategic_Weapon](https://www.researchgate.net/publication/393763412_Hybrid_Warfare_Grey_Zone_Conflicts_and_the_Battle_of_Narratives_Discourse_as_a_Strategic_Weapon)
  Connects gray-zone operations to narrative warfare — the conceptual bridge between your Gray Zone Tracker and the narrative features.

---

## 7. Media Attention vs Conflict Severity
*(Features: Coverage heat layer, Blindspot overlay)*

- **Unequal Attention: Why Some Conflicts Make Headlines and Others Don't** — Vision of Humanity (Institute for Economics & Peace).
  [https://www.visionofhumanity.org/unequal-attention-why-some-conflicts-make-headlines-and-others-dont/](https://www.visionofhumanity.org/unequal-attention-why-some-conflicts-make-headlines-and-others-dont/)
  Documents the coverage–severity mismatch (e.g. DRC vs Gaza attention) — the empirical motivation for the blindspot layer.

- **Why some wars don't make headlines** — Reuters Institute for the Study of Journalism.
  [https://reutersinstitute.politics.ox.ac.uk/news/why-some-wars-dont-make-headlines](https://reutersinstitute.politics.ox.ac.uk/news/why-some-wars-dont-make-headlines)
  Newsworthiness logics (proximity, elite involvement, visuals, ideological utility) — the determinants your heat layer visualises.

- **How news coverage influences countries' emergency aid budgets** — The Conversation, 2021.
  [https://theconversation.com/how-news-coverage-influences-countries-emergency-aid-budgets-new-research-172894](https://theconversation.com/how-news-coverage-influences-countries-emergency-aid-budgets-new-research-172894)
  The "forgotten crisis effect" — evidence that coverage gaps have real-world consequences; strong motivation-section material.

- **Humanitarian Crisis Coverage Report** — Media and Journalism Research Center.
  [https://journalismresearch.org/humanitarian-crisis-coverage-report/](https://journalismresearch.org/humanitarian-crisis-coverage-report/)
  Systematic coverage-disparity data across crises.

- **Measuring the Gap Between Media Coverage and Public Information Demand: Evidence from the 2026 Lebanon Conflict** — 2026.
  [https://arxiv.org/abs/2604.16417](https://arxiv.org/abs/2604.16417)
  Recent quantitative coverage-gap methodology — closest to how you'd actually compute the blindspot metric.

---

## 8. Media Bias Detection (related-work context)
*(Background for the report — Parallaxis deliberately does framing/narrative analysis rather than bias scoring, but examiners will expect this literature to be acknowledged.)*

- **Automated Detection of Media Bias Using Artificial Intelligence and Natural Language Processing: A Systematic Review** — Social Science Computer Review, 2026.
  [https://journals.sagepub.com/doi/10.1177/08944393251331510](https://journals.sagepub.com/doi/10.1177/08944393251331510)
  Recent systematic review (2019–2023 literature) — one citation that covers the whole adjacent field.

- **A Survey on Bias Detection in Online News using Deep Learning** — IEEE, 2023.
  [https://ieeexplore.ieee.org/document/10140917/](https://ieeexplore.ieee.org/document/10140917/)
  Deep-learning-specific survey of the same space.

---

## How this maps to open decisions

| Open decision (scope-decisions.md) | Most relevant entries |
|---|---|
| Event clustering feasibility spike | Section 3 (start with Event Registry + Rupnik et al.) |
| Perspective-layer rethink | SemEval-2023 language coverage (§2), RT/CGTN studies (§2) |
| Severity composite formula | ACLED/UCDP (§6), coverage-vs-severity work (§7) |
| Verification engine architecture | Multi-Agent Deep Research + SNIFFER (§4), Glockner caveat (§4) |
| Epistemic-humility justification | ⚠️-marked entries in §1 and §4 |
| Mutation Tracker method | Lost in Translation (§5) |
