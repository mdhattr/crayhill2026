-- Migration: 2026_04_28_002_create_app_user
--
-- Creates the runtime app user (`crayhill_app` by default) with least-
-- privilege access to the `crayhill` schema. The API uses these credentials
-- at runtime (api/lib/db.php); the admin user is reserved for migrations
-- only.
--
-- Privileges granted:    SELECT, INSERT, UPDATE, DELETE on crayhill.*
-- Privileges NOT granted: CREATE, ALTER, DROP, GRANT, FILE, SUPER, REPLICATION,
--                         PROCESS, EVENT, TRIGGER, EXECUTE, RELOAD, etc.
-- TLS:                   REQUIRE SSL — non-SSL connections from this user
--                         are rejected by the server.
--
-- Placeholders are filled from .config/secrets.env by api/lib/migrate.php:
--   ${DB_USER}     -> the username the app will connect as (e.g. crayhill_app)
--   ${DB_PASSWORD} -> the password to set for that user
-- See migrate.php for the substitution allowlist and validation rules.
--
-- Idempotent: drops the user (if present) before re-creating, so the
-- password and grant set are deterministically what this migration declares.
--
-- Rollback: DROP USER IF EXISTS '${DB_USER}'@'%';

DROP USER IF EXISTS '${DB_USER}'@'%';

CREATE USER '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}'
    REQUIRE SSL;

GRANT SELECT, INSERT, UPDATE, DELETE ON crayhill.* TO '${DB_USER}'@'%';

FLUSH PRIVILEGES;
