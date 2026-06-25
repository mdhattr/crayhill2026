-- Migration: 2026_06_24_003_create_news
--
-- Creates the `news` table that backs the News & Insights content domain.
-- Seeded from api/seeds/news_seed.sql (the cleaned legacy WordPress posts,
-- loaded via the mysql client) and served through GET /api/v1/news.
--
-- ID strategy (per .cursor/rules/20-php-api.mdc): integer auto-increment
-- surrogate key. The legacy WordPress post IDs are intentionally discarded;
-- the unique `slug` is the stable external identifier used in URLs and as the
-- upsert key for the seed loader.
--
-- status: 'published' rows are eligible to appear on the site; 'draft' rows
-- are held back. New rows default to 'draft'; the seed loader sets the legacy
-- posts to 'published' explicitly (they were already live).
--
-- Charset / collation: utf8mb4 / utf8mb4_unicode_ci, per the project rule.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, safe to re-run.
--
-- Rollback (DESTRUCTIVE -- only when there is no data to lose):
--   DROP TABLE IF EXISTS crayhill.news;

CREATE TABLE IF NOT EXISTS crayhill.news (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title           VARCHAR(512) NOT NULL,
    author          VARCHAR(255) NOT NULL DEFAULT 'Crayhill Capital Management',
    slug            VARCHAR(255) NOT NULL,
    published_date  DATE NOT NULL,
    image           VARCHAR(512) NULL DEFAULT NULL,
    status          ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    content         LONGTEXT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_news_slug (slug),
    KEY idx_news_status_date (status, published_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
