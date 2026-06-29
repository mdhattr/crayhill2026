-- Migration: 2026_06_29_007_create_site_settings
--
-- Key/value store for CMS-controlled site flags (e.g. Careers page visibility).
-- Served through the API; edited in the admin dashboard.
--
-- Rollback (DESTRUCTIVE):
--   DROP TABLE IF EXISTS crayhill.site_settings;

CREATE TABLE IF NOT EXISTS crayhill.site_settings (
    setting_key   VARCHAR(64)  NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO crayhill.site_settings (setting_key, setting_value)
VALUES ('careers_page_active', '1')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
