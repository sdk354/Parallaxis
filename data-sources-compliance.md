# Data Sources — Access Permissions and Collection Ethics

What Parallaxis is actually permitted to collect, verified by reading the files
rather than assuming.

Written 2026-09-10 on supervisory instruction to read `robots.txt` directly and
determine what crawlers are and are not allowed to access. Companion to
`data-sources.md`, which inventories *candidate* sources; this document records
*verified permissions* and *working endpoints*, and it is the evidence base for the
ethics section of the Final Report.

Raw snapshots of every file described here: `evidence/robots-2026-09-10/`.

---

## 1. Method

Fetched `https://<domain>/robots.txt` for 20 outlets spanning the project's
perspective layers, on **2026-09-10**, with a standard browser user-agent. Files
parsed for the `User-agent: *` group and for named AI-crawler groups
(GPTBot, ClaudeBot, Claude-Web, anthropic-ai, CCBot, Google-Extended, PerplexityBot,
Bytespider, Applebot-Extended, Amazonbot, Meta-ExternalAgent, omgilibot, Diffbot,
cohere-ai, AI2Bot, Timpibot, YouBot).

"Fully blocked" below means that agent has its own group containing `Disallow: /`.

---

## 2. Verified permissions

| Outlet | Perspective | `*` rules | AI crawlers fully blocked | Crawl-delay |
|---|---|---|---|---|
| Reuters | Western agency | **`Disallow: /`** (blanket) | +Applebot-Extended | — |
| DW | Western (DE) | 18 path rules | **17** | — |
| Haaretz | Israeli | 44 path rules | **16** | — |
| BBC | Western (UK) | 49 path rules | **15** | — |
| France 24 | Western (FR) | none | **11** | 5–10s |
| Indian Express | Indian | 120 path rules | **11** | — |
| AP News | Western agency | 17 path rules | **10** | — |
| The Hindu | Indian | 96 path rules | **10** | — |
| The Guardian | Western (UK) | 48 path rules | **9** | — |
| Al Jazeera | Arabic/global | 15 path rules | **7** | — |
| Times of India | Indian | 167 path rules | 1 | — |
| Dawn | Pakistani | 14 path rules | **0** | — |
| Kyiv Independent | Ukrainian | 12 path rules | **0** | — |
| Al Arabiya | Arabic | 5 path rules | **0** | — |
| RT | Russian state | 15 path rules | **0** | — |
| CGTN | Chinese state | 3 path rules | **0** | — |
| Global Times | Chinese state | none | **0** | — |
| Xinhua | Chinese state | `Allow: /` | **0** | — |

Not resolved:

- **New York Times** — `nytimes.com/robots.txt` returns **301 to the homepage**; no
  robots.txt is served at that path. Treat as unresolved. Do **not** read the absence
  of a file as permission.
- **TASS** — `tass.com/robots.txt` did not respond to the fetch (connection failure,
  not a 4xx). Retry before including TASS as a source; its RSS works (§5).

### Reuters in detail

Reuters is the only blanket refusal, and it is worth quoting in the report:

```
# Block all other bots
User-agent: *
Allow: /plus/
Disallow: /
```

Above that block sits a shared group naming ~85 permitted agents — search engines,
ad-tech, social preview bots — which receive only a short list of path exclusions.
**A Parallaxis crawler falls under "all other bots."** Reuters is out via crawling.

One detail worth citing: `ChatGPT-User` and `OAI-SearchBot` appear *inside* the
permitted allowlist, while `Applebot-Extended` is separately given `Disallow: /`.
Reuters therefore admits one AI company's crawlers under a commercial arrangement
while excluding a student research crawler. That is a clean, evidenced illustration
of unequal access to the public record — usable in the report's framing.

---

## 3. Finding: the permission asymmetry is a sampling bias

**This is the most consequential result of the exercise and belongs in the
methodology chapter, not a footnote.**

The outlets that block automated AI collection and the outlets that do not are not
randomly distributed — they are distributed roughly along the axis the project sets
out to measure.

Every major Western outlet blocks 7–17 AI crawlers by name. Every Chinese and
Russian state outlet blocks none: Xinhua's entire file is `Allow: /`, Global Times'
is two lines, RT names no AI agent at all.

> **Crawling only what `robots.txt` permits produces a corpus that systematically
> over-represents state media and under-represents Western independent press.**

The bias points in the direction that would most damage the project's conclusions. A
finding of the form "state-aligned outlets emphasise X more than Western outlets"
could be partly an artifact of *who left the door open*, not of how anyone reports.

Neither of the two reference papers addresses this. Hasan (2026) used four outlets,
all of which happen to be crawlable, and never raises it.

**State the cause precisely.** The split tracks legal and commercial resourcing and
AI-licensing posture more than state alignment as such — Dawn and the Kyiv
Independent are independent outlets blocking nothing, and Times of India blocks one.
The defensible claim is: *major well-resourced outlets, predominantly Western,
restrict AI crawlers heavily; state-funded and smaller regional outlets largely do
not.* The consequence for sampling is the same either way.

**Mitigation:** RSS and licensed APIs for the restricted side, so coverage stays
balanced across perspectives (§5). Measure and report the residual asymmetry —
articles collected per outlet per perspective layer — as a standing figure in the
evaluation chapter rather than a one-off check.

---

## 4. What robots.txt does not cover

Three limits that matter for the ethics form and the viva:

1. **It is not law.** It is a voluntary protocol. Compliance is an ethics and
   reputation argument, not a legal shield.
2. **It says nothing about storage or redisplay.** That is copyright and terms of
   service, separately. Policy: store links, metadata, derived analysis and short
   quotations. Do not rehost article text. Full text may be held privately for
   analysis; it is never served to users.
3. **AI-crawler directives target training crawlers** (GPTBot, ClaudeBot, CCBot). A
   Parallaxis crawler is technically none of them. The intent is nonetheless legible,
   and an ethics reviewer will read it as a general opt-out.

**Decision: honour named AI-crawler exclusions even where they are not technically
binding, and say so in the report.** "We treated named AI-crawler exclusions as
opt-outs even where not technically binding, and documented the resulting coverage
asymmetry" is a stronger sentence in a viva than any technicality it gives up.

---

## 5. Ingestion policy

**RSS first, licensed API second, crawl last.** Feeds are published *for* automated
consumption, which is the cleanest permission story available — and they work even
where the same outlet blocks a dozen AI crawlers.

Verified live on 2026-09-10 (HTTP 200, valid XML payload):

| Outlet | Endpoint |
|---|---|
| BBC World | `https://feeds.bbci.co.uk/news/world/rss.xml` |
| The Guardian World | `https://www.theguardian.com/world/rss` |
| Al Jazeera | `https://www.aljazeera.com/xml/rss/all.xml` |
| DW World (EN) | `https://rss.dw.com/rdf/rss-en-world` |
| France 24 (EN) | `https://www.france24.com/en/rss` |
| Indian Express World | `https://indianexpress.com/section/world/feed/` |
| The Hindu International | `https://www.thehindu.com/news/international/feeder/default.rss` |
| Times of India World | `https://timesofindia.indiatimes.com/rssfeeds/296589292.cms` |
| Dawn World | `https://www.dawn.com/feeds/world` |
| RT News | `https://www.rt.com/rss/news/` |
| TASS | `https://tass.com/rss/v2.xml` |
| Xinhua World (EN) | `https://english.news.cn/rss/worldrss.xml` |
| CGTN World | `https://www.cgtn.com/subscribe/rss/section/world.xml` |
| Global Times | `https://www.globaltimes.cn/rss/outbrain.xml` |

No public feed found:

- **Reuters** — `arc/outboundfeeds/rss` returns 404; public RSS discontinued.
  Combined with the blanket `Disallow: /`, Reuters is unavailable without a
  commercial licence. Exclude, and note the exclusion.
- **AP News** — hub RSS returns 403 at the edge. Needs another route or exclusion.
- **Al Arabiya** — `/tools/rss` returns 403 at the edge, despite a permissive
  robots.txt. Edge blocking and robots.txt are separate systems; check both.
- **Kyiv Independent** — `/feed/` and `/rss/` both 404. Locate the correct Ghost
  feed path before relying on it.
- **Haaretz** — feed path not found on first attempt; retry.

APIs, checked the same day:

- **Guardian Open Platform** — `content.guardianapis.com`. The historical `test` key
  now returns 401; a free developer key is required. Register before relying on it.
  Still the best free full-text news API.
- **GDELT DOC 2.0** — `api.gdeltproject.org/api/v2/doc/doc`. Live but rate-limited;
  returns HTTP 429 with the message **"Please limit requests to one every 5
  seconds."** Design ingestion around 1 request / 5s, or use the bulk ngram datasets
  for volume. Free, 65+ languages, and the natural backfill source.

---

## 6. Crawler identity and rate limits

Where crawling is used at all:

- **Declare a named, contactable user agent**, e.g.
  `ParallaxisBot/0.1 (+https://<project-page>; academic research; contact: <email>)`.
  Named and contactable crawlers get tolerated; anonymous ones get blocked.
- **Parse and obey `robots.txt` at runtime** — do not hard-code today's rules. Use a
  standards-compliant parser (Python's `urllib.robotparser`, or `reppy`).
- **Obey `Crawl-delay`.** France 24 sets 5–10s. Where none is set, default to one
  request every 2–5 seconds per host and never parallelise against a single host.
- **Cache and conditional-request.** Honour `ETag` / `If-Modified-Since` so the same
  article is fetched once.
- **Fail closed.** If `robots.txt` cannot be retrieved (NYT, TASS above), treat the
  host as disallowed until resolved. Absence is not permission.

---

## 7. Re-verification

These files change — BBC's grew substantially as outlets reacted to AI scraping.

- Re-fetch all `robots.txt` at the start of implementation, at the interim
  submission, and before final submission.
- Keep each run as a dated directory under `evidence/`, as
  `evidence/robots-2026-09-10/` does now.
- **Diff between runs.** A year-long record of outlets tightening access is itself a
  small empirical finding about the closing of the public record, and it costs
  nothing to collect.

---

## 8. Open items

- [ ] Resolve NYT (no robots.txt served) and TASS (fetch failed).
- [ ] Register a Guardian Open Platform developer key.
- [ ] Locate working feeds for AP, Al Arabiya, Kyiv Independent, Haaretz.
- [ ] Confirm whether the module requires formal ethics approval — still unknown per
      `module-requirements.md`. This document is the input to that form.
- [ ] Extend the survey to the remaining perspective layers before the source list is
      frozen: Latin American, African and Southeast Asian outlets are not yet covered.
- [ ] Decide the archive-backfill route for time-depth features — GDELT bulk versus
      Internet Archive — and check the permissions position for each separately.
