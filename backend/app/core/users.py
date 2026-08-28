import hashlib
import hmac
import os
import sqlite3
from datetime import datetime, timezone

from .config import USERS_DB_PATH

ROLES = ("Admin", "Project Manager", "HR Manager")


def _connect():
    connection = sqlite3.connect(USERS_DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310000)
    return f"pbkdf2_sha256$310000${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt, digest = encoded.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(iterations)).hex()
        return hmac.compare_digest(actual, digest)
    except (ValueError, TypeError):
        return False


def initialize():
    with _connect() as db:
        db.execute("""CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            username TEXT NOT NULL COLLATE NOCASE UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('Admin', 'Project Manager', 'HR Manager')),
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )""")
        if db.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
            now = datetime.now(timezone.utc).isoformat()
            for full_name, username, password, role in (
                ("KSHAMTA Administrator", "admin", "Admin@123", "Admin"),
                ("Project Manager", "project_manager", "Manager@123", "Project Manager"),
                ("HR Manager", "hr_manager", "HR@123", "HR Manager"),
            ):
                db.execute("INSERT INTO users(full_name, username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                           (full_name, username, hash_password(password), role, now, now))


def public_user(row):
    return {"id": row["id"], "full_name": row["full_name"], "username": row["username"],
            "role": row["role"], "status": "Active" if row["is_active"] else "Inactive",
            "created_at": row["created_at"], "updated_at": row["updated_at"]}


def find(identifier):
    initialize()
    with _connect() as db:
        return db.execute("SELECT * FROM users WHERE id = ? OR username = ?", (identifier, str(identifier))).fetchone()


def list_users():
    initialize()
    with _connect() as db:
        return [public_user(row) for row in db.execute("SELECT * FROM users ORDER BY created_at, id")]


initialize()
