"""Phase 1 ingestion: RSS feed -> article row.

Compliance (data-sources-compliance.md §4-§6):
  - RSS only. Feeds are published for automated consumption.
  - Named, contactable User-Agent on every request.
  - CRAWL_DELAY seconds between requests to the same host.
  - Body text stored for analysis only; never re-served.

Usage:
    python src/ingest.py                 # every active outlet
    python src/ingest.py --limit 5       # first five
    python src/ingest.py --outlet bbc    # one outlet
    python src/ingest.py --no-body       # feed metadata only, no article fetches
"""
import argparse
import os
import sys
import time
from datetime import datetime, timezone

import feedparser
import trafilatura
from dotenv import load_dotenv

from db import connect, seed_outlets

load_dotenv()
UA = os.getenv("USER_AGENT", "ParallaxisBot/0.1")
DELAY = float(os.getenv("CRAWL_DELAY", "2.0"))


def published_dt(entry):
    for key in ("published_parsed", "updated_parsed"):
        t = entry.get(key)
        if t:
            return datetime(*t[:6], tzinfo=timezone.utc)
    return None


def fetch_body(url):
    """Return (text, ok). Failure is normal — paywalls, JS pages, timeouts."""
    try:
        html = trafilatura.fetch_url(url)
        if not html:
            return None, False
        text = trafilatura.extract(html, include_comments=False, include_tables=False)
        return (text, True) if text else (None, False)
    except Exception:
        return None, False


def ingest_outlet(conn, outlet, with_body=True):
    oid, slug, feed_url = outlet["id"], outlet["slug"], outlet["feed_url"]
    with conn.cursor() as cur:
        cur.execute("INSERT INTO ingest_runs (outlet_id) VALUES (%s) RETURNING id", (oid,))
        run_id = cur.fetchone()[0]
    conn.commit()

    feed = feedparser.parse(feed_url, agent=UA)
    entries = feed.entries or []
    inserted = skipped = errors = 0
    note = None
    if getattr(feed, "bozo", 0) and not entries:
        note = str(getattr(feed, "bozo_exception", "feed parse failed"))[:200]

    for e in entries:
        url = (e.get("link") or "").strip()
        if not url:
            errors += 1
            continue
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM articles WHERE url = %s", (url,))
            if cur.fetchone():
                skipped += 1
                continue

        body, ok = (None, False)
        if with_body:
            body, ok = fetch_body(url)
            time.sleep(DELAY)

        try:
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO articles
                         (outlet_id, url, title, summary, published_at, language,
                          body_text, body_chars, extract_ok)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                       ON CONFLICT (url) DO NOTHING""",
                    (oid, url, e.get("title"), e.get("summary"), published_dt(e),
                     outlet.get("language"), body, len(body) if body else None, ok),
                )
                inserted += cur.rowcount
            conn.commit()
        except Exception as ex:
            conn.rollback()
            errors += 1
            note = note or str(ex)[:200]

    with conn.cursor() as cur:
        cur.execute(
            """UPDATE ingest_runs
                  SET finished_at = now(), entries=%s, inserted=%s, skipped=%s, errors=%s, note=%s
                WHERE id = %s""",
            (len(entries), inserted, skipped, errors, note, run_id),
        )
    conn.commit()
    return len(entries), inserted, skipped, errors, note


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--limit", type=int, help="only the first N outlets")
    ap.add_argument("--outlet", help="a single outlet slug")
    ap.add_argument("--no-body", action="store_true", help="skip article-text fetches")
    a = ap.parse_args()

    with connect() as conn:
        seed_outlets(conn)
        q = "SELECT id, slug, name, perspective, feed_url, language FROM outlets WHERE active"
        params = []
        if a.outlet:
            q += " AND slug = %s"
            params.append(a.outlet)
        q += " ORDER BY id"
        if a.limit:
            q += f" LIMIT {int(a.limit)}"
        with conn.cursor() as cur:
            cur.execute(q, params)
            cols = [c.name for c in cur.description]
            outlets = [dict(zip(cols, r)) for r in cur.fetchall()]

        if not outlets:
            sys.exit("no matching outlets")

        print(f"{'outlet':<16}{'perspective':<12}{'feed':>6}{'new':>6}{'dup':>6}{'err':>6}")
        print("-" * 52)
        totals = [0, 0, 0, 0]
        for o in outlets:
            n, ins, skip, err, note = ingest_outlet(conn, o, with_body=not a.no_body)
            totals = [t + v for t, v in zip(totals, (n, ins, skip, err))]
            print(f"{o['slug']:<16}{o['perspective']:<12}{n:>6}{ins:>6}{skip:>6}{err:>6}"
                  + (f"  {note}" if note else ""))
        print("-" * 52)
        print(f"{'TOTAL':<28}{totals[0]:>6}{totals[1]:>6}{totals[2]:>6}{totals[3]:>6}")

        with conn.cursor() as cur:
            cur.execute("SELECT * FROM coverage_by_perspective")
            rows = cur.fetchall()
        print(f"\n{'perspective':<12}{'outlets':>8}{'articles':>10}{'w/ body':>9}{'avg blocked':>13}")
        for p, outs, arts, body, avg in rows:
            print(f"{p:<12}{outs:>8}{arts:>10}{body:>9}{str(avg):>13}")


if __name__ == "__main__":
    main()
