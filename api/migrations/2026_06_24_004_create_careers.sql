-- Migration: 2026_06_24_004_create_careers
--
-- Creates the `careers` table that backs the Careers page content domain
-- (open job postings). Seeded from api/seeds/careers_seed.sql (scraped from
-- the legacy crayhill.com/careers listing + job detail pages, converted to
-- Markdown) and served through GET /api/v1/careers.
--
-- The rebuilt site has NO individual job-posting pages: the Careers page
-- renders each posting as a clickable accordion (title -> expand to full
-- Markdown body), so the list endpoint returns the full `content` inline.
--
-- ID strategy (per .cursor/rules/20-php-api.mdc): integer auto-increment
-- surrogate key. The unique `slug` is the stable external identifier and the
-- upsert key for the seed loader. `sort_order` controls display order on the
-- page (ascending); ties break on id.
--
-- status: 'published' rows appear on the site; 'draft' rows are held back.
-- New rows default to 'draft'; the seed sets the live postings to 'published'.
--
-- Charset / collation: utf8mb4 / utf8mb4_unicode_ci, per the project rule.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, safe to re-run.
--
-- Rollback (DESTRUCTIVE -- only when there is no data to lose):
--   DROP TABLE IF EXISTS crayhill.careers;

CREATE TABLE IF NOT EXISTS crayhill.careers (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    location    VARCHAR(255) NULL DEFAULT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    status      ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    content     LONGTEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_careers_slug (slug),
    KEY idx_careers_status_sort (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
