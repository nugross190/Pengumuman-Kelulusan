"""
Postgres persistence for graduation status overrides.

A status "override" is a deliberate change made by an admin that takes
precedence over the spreadsheet-computed status. The original computed
status from the spreadsheet is the source of truth; overrides are
auditable changes layered on top.

Schema:
    status_overrides (
        nisn               TEXT PRIMARY KEY,
        original_status    TEXT NOT NULL,
        new_status         TEXT NOT NULL,
        changed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        changed_by         TEXT NOT NULL DEFAULT 'admin'
    )

We use psycopg (v3) — same family as HADIR's stack but without SQLAlchemy
overhead since we have a single tiny table.

Connection: reads DATABASE_URL env var (Railway convention).
Falls back to a local SQLite-ish behavior is NOT supported; if the DB is
unreachable the app refuses to start. This is intentional — silent
fallback to a different store would mean overrides written today vanish
tomorrow without warning.
"""
from __future__ import annotations

import logging
import os
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Optional

import psycopg
from psycopg.rows import dict_row

log = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL", "")


class DatabaseNotConfigured(RuntimeError):
    pass


def _ensure_url() -> str:
    if not DATABASE_URL:
        raise DatabaseNotConfigured(
            "DATABASE_URL not set. On Railway, attach a Postgres plugin "
            "and the variable will be injected automatically. For local "
            "development, set DATABASE_URL=postgresql://user:pass@host/db"
        )
    # Railway sometimes provides postgres:// — psycopg wants postgresql://
    return DATABASE_URL.replace("postgres://", "postgresql://", 1)


@contextmanager
def get_conn():
    url = _ensure_url()
    conn = psycopg.connect(url, row_factory=dict_row)
    try:
        yield conn
    finally:
        conn.close()


def init_schema() -> None:
    """Create the overrides table if it doesn't exist. Safe to call repeatedly."""
    sql = """
    CREATE TABLE IF NOT EXISTS status_overrides (
        nisn            TEXT PRIMARY KEY,
        original_status TEXT NOT NULL,
        new_status      TEXT NOT NULL,
        changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        changed_by      TEXT NOT NULL DEFAULT 'admin'
    );
    CREATE INDEX IF NOT EXISTS idx_status_overrides_changed_at
        ON status_overrides (changed_at DESC);
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    log.info("Schema initialized")


def get_all_overrides() -> dict[str, dict]:
    """Return {nisn: {new_status, original_status, changed_at, changed_by}}."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT nisn, original_status, new_status, changed_at, changed_by "
                "FROM status_overrides"
            )
            rows = cur.fetchall()
    return {
        r["nisn"]: {
            "original_status": r["original_status"],
            "new_status": r["new_status"],
            "changed_at": r["changed_at"].isoformat() if r["changed_at"] else None,
            "changed_by": r["changed_by"],
        }
        for r in rows
    }


def get_override(nisn: str) -> Optional[dict]:
    """Return a single override or None."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT nisn, original_status, new_status, changed_at, changed_by "
                "FROM status_overrides WHERE nisn = %s",
                (nisn,),
            )
            row = cur.fetchone()
    if not row:
        return None
    return {
        "nisn": row["nisn"],
        "original_status": row["original_status"],
        "new_status": row["new_status"],
        "changed_at": row["changed_at"].isoformat() if row["changed_at"] else None,
        "changed_by": row["changed_by"],
    }


def upsert_override(
    nisn: str,
    original_status: str,
    new_status: str,
    changed_by: str = "admin",
) -> dict:
    """
    Set or replace an override for one student.

    If new_status equals original_status, the override is REMOVED instead
    (no point storing a no-op).
    """
    if new_status == original_status:
        delete_override(nisn)
        return {"nisn": nisn, "removed": True}

    sql = """
    INSERT INTO status_overrides (nisn, original_status, new_status, changed_at, changed_by)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (nisn) DO UPDATE SET
        new_status = EXCLUDED.new_status,
        changed_at = EXCLUDED.changed_at,
        changed_by = EXCLUDED.changed_by
    RETURNING nisn, original_status, new_status, changed_at, changed_by
    """
    now = datetime.now(timezone.utc)
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (nisn, original_status, new_status, now, changed_by))
            row = cur.fetchone()
        conn.commit()
    return {
        "nisn": row["nisn"],
        "original_status": row["original_status"],
        "new_status": row["new_status"],
        "changed_at": row["changed_at"].isoformat(),
        "changed_by": row["changed_by"],
    }


def delete_override(nisn: str) -> bool:
    """Remove an override. Returns True if a row was deleted."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM status_overrides WHERE nisn = %s", (nisn,))
            deleted = cur.rowcount > 0
        conn.commit()
    return deleted


def reset_all_overrides() -> int:
    """Delete every override. Returns the count of deleted rows."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM status_overrides")
            count = cur.rowcount
        conn.commit()
    return count
