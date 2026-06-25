-- Migration: 2026_06_24_005_create_site_pages
--
-- Static marketing/legal pages edited via the CMS (Legal Notice & Disclosures,
-- Privacy Policy, and future fixed-route copy). One row per page; the unique
-- `slug` matches the public URL segment and the admin editor route.
--
-- status: 'published' rows are served on the public site; 'draft' rows are
-- held back until an operator publishes from /admin/pages.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, safe to re-run.
--
-- Rollback (DESTRUCTIVE):
--   DROP TABLE IF EXISTS crayhill.site_pages;

CREATE TABLE IF NOT EXISTS crayhill.site_pages (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug             VARCHAR(255) NOT NULL,
    title            VARCHAR(512) NOT NULL,
    subtitle         VARCHAR(255) NULL DEFAULT NULL,
    meta_description VARCHAR(512) NOT NULL,
    content          LONGTEXT NOT NULL,
    status           ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_site_pages_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
