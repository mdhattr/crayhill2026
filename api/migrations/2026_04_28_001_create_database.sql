-- Migration: 2026_04_28_001_create_database
--
-- Creates the `crayhill` schema. This is the foundation migration; every
-- subsequent migration creates tables within this schema and assumes it
-- already exists.
--
-- Charset / collation: utf8mb4 / utf8mb4_unicode_ci, per the project rule
-- in .cursor/rules/20-php-api.mdc ("utf8mb4 everywhere, no latin1").
--
-- Idempotent: safe to run multiple times.
--
-- Rollback (DESTRUCTIVE — only when there is no data to lose):
--   DROP DATABASE IF EXISTS crayhill;

CREATE DATABASE IF NOT EXISTS crayhill
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
