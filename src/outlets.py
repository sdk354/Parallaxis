"""Curated outlet set for Phase 1.

Feed URLs were verified live on 2026-09-10 and recorded in
data-sources-compliance.md §5. robots_* columns come from the manual
robots.txt survey in evidence/robots-worksheet.xlsx.

Reuters and AP are deliberately absent: Reuters blocks all unlisted bots
(`User-agent: * / Disallow: /`) and publishes no public feed; AP's hub feed
returns 403 at the edge. See data-sources-compliance.md §2 and §5.
"""

# slug, name, country, perspective, funding, feed_url, star_blocks, ai_blocked
OUTLETS = [
    ("bbc",          "BBC News",        "United Kingdom", "Western", "public",
     "https://feeds.bbci.co.uk/news/world/rss.xml",                       False, 10),
    ("guardian",     "The Guardian",    "United Kingdom", "Western", "trust",
     "https://www.theguardian.com/world/rss",                             False,  7),
    ("dw",           "Deutsche Welle",  "Germany",        "Western", "state",
     "https://rss.dw.com/rdf/rss-en-world",                               False, 10),
    ("france24",     "France 24",       "France",         "Western", "state",
     "https://www.france24.com/en/rss",                                   False,  7),
    ("aljazeera",    "Al Jazeera",      "Qatar",          "Arabic",  "state",
     "https://www.aljazeera.com/xml/rss/all.xml",                         False,  6),
    ("thehindu",     "The Hindu",       "India",          "Indian",  "private",
     "https://www.thehindu.com/news/international/feeder/default.rss",    False,  8),
    ("indianexpress","Indian Express",  "India",          "Indian",  "private",
     "https://indianexpress.com/section/world/feed/",                     False,  6),
    ("toi",          "Times of India",  "India",          "Indian",  "private",
     "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",        False,  0),
    ("dawn",         "Dawn",            "Pakistan",       "Other",   "private",
     "https://www.dawn.com/feeds/world",                                  False,  0),
    ("rt",           "RT",              "Russia",         "Russian", "state",
     "https://www.rt.com/rss/news/",                                      False,  0),
    ("tass",         "TASS",            "Russia",         "Russian", "state",
     "https://tass.com/rss/v2.xml",                                       None,  None),
    ("xinhua",       "Xinhua",          "China",          "Chinese", "state",
     "https://english.news.cn/rss/worldrss.xml",                          False,  0),
    ("cgtn",         "CGTN",            "China",          "Chinese", "state",
     "https://www.cgtn.com/subscribe/rss/section/world.xml",              False,  0),
    ("globaltimes",  "Global Times",    "China",          "Chinese", "state",
     "https://www.globaltimes.cn/rss/outbrain.xml",                       False,  0),
]
