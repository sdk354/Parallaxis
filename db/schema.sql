-- Parallaxis schema — Phase 1 (Foundation)
-- Compliance: we store links, metadata and our own derived analysis.
-- Article body text is held for analysis only and is never re-served to users.
-- See data-sources-compliance.md §4.

CREATE EXTENSION IF NOT EXISTS vector;

-- One row per news outlet we ingest from.
-- robots_ai_blocked records the 2026-09-10 robots.txt survey (evidence/robots-worksheet.xlsx)
-- so the collection asymmetry stays measurable, per Objective 2.
CREATE TABLE IF NOT EXISTS outlets (
    id                 SERIAL PRIMARY KEY,
    slug               TEXT NOT NULL UNIQUE,
    name               TEXT NOT NULL,
    country            TEXT NOT NULL,
    perspective        TEXT NOT NULL,
    funding            TEXT,
    feed_url           TEXT NOT NULL,
    language           TEXT NOT NULL DEFAULT 'en',
    robots_star_blocks BOOLEAN,
    robots_ai_blocked  SMALLINT,
    active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
    id            BIGSERIAL PRIMARY KEY,
    outlet_id     INTEGER NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    url           TEXT NOT NULL UNIQUE,
    title         TEXT,
    summary       TEXT,
    published_at  TIMESTAMPTZ,
    fetched_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    language      TEXT,
    body_text     TEXT,          -- analysis only; never re-served
    body_chars    INTEGER,
    extract_ok    BOOLEAN NOT NULL DEFAULT FALSE,
    embedding     VECTOR(768)    -- LaBSE; populated in Phase 2
);

CREATE INDEX IF NOT EXISTS articles_outlet_idx    ON articles (outlet_id);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles (published_at DESC);

-- Per-run record so ingestion volume per perspective can be reported (Objective 2).
CREATE TABLE IF NOT EXISTS ingest_runs (
    id          BIGSERIAL PRIMARY KEY,
    outlet_id   INTEGER REFERENCES outlets(id) ON DELETE CASCADE,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    entries     INTEGER NOT NULL DEFAULT 0,
    inserted    INTEGER NOT NULL DEFAULT 0,
    skipped     INTEGER NOT NULL DEFAULT 0,
    errors      INTEGER NOT NULL DEFAULT 0,
    note        TEXT
);

CREATE OR REPLACE VIEW coverage_by_perspective AS
SELECT o.perspective,
       COUNT(DISTINCT o.id)                      AS outlets,
       COUNT(a.id)                               AS articles,
       COUNT(a.id) FILTER (WHERE a.extract_ok)   AS with_body,
       ROUND(AVG(o.robots_ai_blocked), 1)        AS avg_ai_crawlers_blocked
FROM outlets o
LEFT JOIN articles a ON a.outlet_id = o.id
GROUP BY o.perspective
ORDER BY articles DESC;
