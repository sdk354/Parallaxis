"""Database connection and outlet seeding."""
import os
import psycopg
from dotenv import load_dotenv
from outlets import OUTLETS

load_dotenv()


def connect():
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5433"),
        dbname=os.getenv("POSTGRES_DB", "parallaxis"),
        user=os.getenv("POSTGRES_USER", "parallaxis"),
        password=os.getenv("POSTGRES_PASSWORD", "parallaxis"),
    )


def seed_outlets(conn):
    """Insert or update the curated outlet list. Idempotent."""
    with conn.cursor() as cur:
        for row in OUTLETS:
            cur.execute(
                """
                INSERT INTO outlets
                    (slug, name, country, perspective, funding, feed_url,
                     robots_star_blocks, robots_ai_blocked)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (slug) DO UPDATE SET
                    name = EXCLUDED.name,
                    country = EXCLUDED.country,
                    perspective = EXCLUDED.perspective,
                    funding = EXCLUDED.funding,
                    feed_url = EXCLUDED.feed_url,
                    robots_star_blocks = EXCLUDED.robots_star_blocks,
                    robots_ai_blocked = EXCLUDED.robots_ai_blocked
                """,
                row,
            )
    conn.commit()
    return len(OUTLETS)


if __name__ == "__main__":
    with connect() as conn:
        print(f"seeded {seed_outlets(conn)} outlets")
