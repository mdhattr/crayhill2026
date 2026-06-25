-- Migration: 2026_06_25_006_create_team_members
--
-- Team roster members for Leadership and Senior Investment Professionals.
-- Backs public GET /api/v1/team and authenticated /api/v1/admin/team.
-- Seeded from api/seeds/team_members_seed.sql (sourced from the former
-- hardcoded team-bios.ts + roster page card titles).
--
-- roster: which public page the member appears on.
-- card_title: short title on the roster grid card (H5).
-- full_title: longer title on the bio detail page (H5).
-- content: Markdown bio body (paragraphs separated by blank lines).
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, safe to re-run.
--
-- Rollback (DESTRUCTIVE):
--   DROP TABLE IF EXISTS crayhill.team_members;

CREATE TABLE IF NOT EXISTS crayhill.team_members (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug          VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    card_title    VARCHAR(255) NOT NULL,
    full_title    VARCHAR(512) NOT NULL,
    image_src     VARCHAR(512) NOT NULL,
    email         VARCHAR(255) NULL DEFAULT NULL,
    linkedin_url  VARCHAR(512) NULL DEFAULT NULL,
    roster        ENUM('leadership', 'senior-investment-professionals') NOT NULL,
    sort_order    INT NOT NULL DEFAULT 0,
    status        ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    content       LONGTEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_team_members_slug (slug),
    KEY idx_team_members_roster_sort (roster, status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
