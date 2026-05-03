"""
Pengumuman Kelulusan — SMA Negeri 5 Garut
Tahun Pelajaran 2025/2026

FastAPI service that:
  - Reads NILAI_SKL_2025-2026.xlsx on startup (one-shot parse)
  - Stores admin status overrides in Postgres (via DATABASE_URL)
  - Serves the static index.html UI plus a small JSON API

Endpoints:
  GET  /                          -> index.html
  GET  /static/*                  -> logos, etc.
  GET  /health                    -> health check
  POST /api/login                 -> validate NISN + Nama, return student card
  POST /api/admin/login           -> validate admin credentials
  GET  /api/admin/students        -> full list with effective status
  POST /api/admin/override        -> set/replace status for one student
  POST /api/admin/reset           -> wipe all overrides
"""
from __future__ import annotations

import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import db
import parser as xlsx_parser

# ----------------------------------------------------------------------------
# Setup
# ----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger("kelulusan")

BASE_DIR = Path(__file__).parent
XLSX_PATH = Path(os.environ.get("NILAI_SKL_PATH", BASE_DIR / "nilai_skl.xlsx"))
INDEX_HTML = BASE_DIR / "index.html"
STATIC_DIR = BASE_DIR / "static"

# Admin credentials. As discussed: hardcoded gate — anyone with source
# access can read these. Acceptable because (a) the public gate is
# NISN+Nama for students anyway, and (b) overrides go through Postgres
# with timestamps so audit is recoverable. For real security, move to
# env vars + a real session system later.
ADMIN_NISN = "1231231234"
ADMIN_NAMA_NORMALIZED = "ADMINISTRATOR"

# In-memory caches populated on startup
_STUDENTS: list[dict] = []
_INDEX: dict[str, dict] = {}


def _normalize_name(s: str) -> str:
    """Match the JS-side normalization: uppercase, trim, collapse whitespace,
    strip non-alphanumeric except spaces."""
    out = (s or "").upper().strip()
    out = " ".join(out.split())
    return "".join(c for c in out if c.isalnum() or c == " ")


def _effective_status(student: dict, override: Optional[dict]) -> str:
    """Override wins if present, else computed from grades."""
    if override:
        return override["new_status"]
    return student["computed_status"]


def _student_with_status(student: dict, override: Optional[dict]) -> dict:
    """Project a student record + override into the public shape used by the UI."""
    return {
        "nisn": student["nisn"],
        "nis": student["nis"],
        "nama": student["nama"],
        "jurusan": student["jurusan"],
        "grades": student["grades"],
        "average": student["average"],
        "computed_status": student["computed_status"],
        "effective_status": _effective_status(student, override),
        "failed_subjects": student["failed_subjects"],
        "is_overridden": override is not None,
        "override": override,
        "ttl": student.get("ttl", ""),
        "nama_ortu": student.get("nama_ortu", ""),
    }


# ----------------------------------------------------------------------------
# Lifespan
# ----------------------------------------------------------------------------
app = FastAPI(title="Pengumuman Kelulusan SMAN 5 Garut")


@app.on_event("startup")
def startup() -> None:
    global _STUDENTS, _INDEX
    log.info("Parsing spreadsheet: %s", XLSX_PATH)
    _STUDENTS = xlsx_parser.parse_workbook(XLSX_PATH)
    _INDEX = xlsx_parser.build_index(_STUDENTS)
    log.info("Loaded %d students", len(_STUDENTS))

    log.info("Initializing database schema")
    try:
        db.init_schema()
    except db.DatabaseNotConfigured:
        log.error("DATABASE_URL is not set. Admin overrides will not work. "
                  "Attach a Postgres plugin in Railway or export DATABASE_URL.")
        # We don't raise — student lookup still works without the DB.
        # Admin endpoints will fail with a clear error.
    except Exception:
        log.exception("Database init failed")
        raise


# ----------------------------------------------------------------------------
# Static + index
# ----------------------------------------------------------------------------
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
def root():
    return FileResponse(INDEX_HTML, media_type="text/html")


@app.get("/health")
def health():
    db_ok = False
    try:
        with db.get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False
    return {
        "status": "ok",
        "students_loaded": len(_STUDENTS),
        "database_ok": db_ok,
    }


# ----------------------------------------------------------------------------
# Public API: student lookup
# ----------------------------------------------------------------------------
class LoginIn(BaseModel):
    nisn: str = Field(..., min_length=1, max_length=20)
    nama: str = Field(..., min_length=1, max_length=200)


@app.post("/api/login")
def api_login(payload: LoginIn):
    nisn = payload.nisn.strip()
    nama = payload.nama.strip()

    # Admin? Route to /api/admin/login from the client; here we just block.
    if nisn == ADMIN_NISN and _normalize_name(nama) == ADMIN_NAMA_NORMALIZED:
        # Admin should not appear as a "student". Tell the client to switch flow.
        return JSONResponse(
            status_code=200,
            content={"role": "admin"},
        )

    # Try direct lookup, then padded variant (leading-zero NISN)
    student = _INDEX.get(nisn)
    if not student:
        student = _INDEX.get(nisn.zfill(10))

    if not student:
        raise HTTPException(status_code=404, detail="NISN tidak ditemukan dalam basis data.")

    if _normalize_name(student["nama"]) != _normalize_name(nama):
        raise HTTPException(status_code=403, detail="Nama tidak sesuai dengan NISN yang dimasukkan.")

    # Apply override if any
    override = None
    try:
        override = db.get_override(student["nisn"])
    except db.DatabaseNotConfigured:
        log.warning("DB not configured; serving computed status only")
    except Exception:
        log.exception("Failed to read override for %s", student["nisn"])

    return {
        "role": "student",
        "data": _student_with_status(student, override),
    }


# ----------------------------------------------------------------------------
# Admin API
# ----------------------------------------------------------------------------
class AdminLoginIn(BaseModel):
    nisn: str
    nama: str


def _require_admin(payload: AdminLoginIn) -> None:
    if payload.nisn != ADMIN_NISN or _normalize_name(payload.nama) != ADMIN_NAMA_NORMALIZED:
        raise HTTPException(status_code=403, detail="Bukan kredensial administrator.")


@app.post("/api/admin/login")
def admin_login(payload: AdminLoginIn):
    _require_admin(payload)
    return {"ok": True}


class AdminQueryIn(BaseModel):
    nisn: str
    nama: str


@app.post("/api/admin/students")
def admin_students(payload: AdminQueryIn):
    """Return all students with their effective status. Admin-only.

    Uses POST so we can carry credentials in the body without exposing
    them in URL/logs (this is still hardcoded auth — see note at top).
    """
    _require_admin(AdminLoginIn(nisn=payload.nisn, nama=payload.nama))

    try:
        overrides = db.get_all_overrides()
    except db.DatabaseNotConfigured:
        raise HTTPException(status_code=503, detail="Database belum dikonfigurasi (DATABASE_URL).")
    except Exception:
        log.exception("Failed to read overrides")
        raise HTTPException(status_code=500, detail="Gagal membaca overrides.")

    out = []
    for s in _STUDENTS:
        ov = overrides.get(s["nisn"])
        out.append(_student_with_status(s, ov))

    # Counts
    total = len(out)
    lulus = sum(1 for x in out if x["effective_status"] == "Lulus")
    hold = sum(1 for x in out if x["effective_status"] == "Ditangguhkan")
    modified = sum(1 for x in out if x["is_overridden"])

    return {
        "total": total,
        "lulus": lulus,
        "ditangguhkan": hold,
        "modified": modified,
        "students": out,
    }


class OverrideIn(BaseModel):
    nisn: str               # admin auth
    nama: str               # admin auth
    target_nisn: str        # student to modify
    new_status: str         # 'Lulus' or 'Ditangguhkan'


@app.post("/api/admin/override")
def admin_override(payload: OverrideIn):
    _require_admin(AdminLoginIn(nisn=payload.nisn, nama=payload.nama))

    if payload.new_status not in ("Lulus", "Ditangguhkan"):
        raise HTTPException(status_code=400, detail="new_status harus 'Lulus' atau 'Ditangguhkan'.")

    student = _INDEX.get(payload.target_nisn)
    if not student:
        raise HTTPException(status_code=404, detail="Target NISN tidak ditemukan.")

    try:
        result = db.upsert_override(
            nisn=student["nisn"],
            original_status=student["computed_status"],
            new_status=payload.new_status,
            changed_by="admin",
        )
    except db.DatabaseNotConfigured:
        raise HTTPException(status_code=503, detail="Database belum dikonfigurasi.")
    except Exception:
        log.exception("Override write failed for %s", student["nisn"])
        raise HTTPException(status_code=500, detail="Gagal menyimpan perubahan.")

    return {"ok": True, "result": result}


@app.post("/api/admin/reset")
def admin_reset(payload: AdminLoginIn):
    _require_admin(payload)
    try:
        count = db.reset_all_overrides()
    except db.DatabaseNotConfigured:
        raise HTTPException(status_code=503, detail="Database belum dikonfigurasi.")
    except Exception:
        log.exception("Reset failed")
        raise HTTPException(status_code=500, detail="Gagal mereset overrides.")
    return {"ok": True, "deleted": count}
