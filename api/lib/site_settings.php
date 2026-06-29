<?php

declare(strict_types=1);

/**
 * CMS site-wide settings (key/value flags).
 */

const SITE_SETTING_CAREERS_PAGE_ACTIVE = 'careers_page_active';

/** @return array<string, string> */
function site_setting_get_all(PDO $pdo, array $keys): array
{
    if ($keys === []) {
        return [];
    }

    $placeholders = implode(', ', array_fill(0, count($keys), '?'));
    $stmt = $pdo->prepare(
        "SELECT setting_key, setting_value
         FROM site_settings
         WHERE setting_key IN ($placeholders)"
    );
    $stmt->execute(array_values($keys));

    $out = [];
    foreach ($stmt->fetchAll() as $row) {
        $out[(string) $row['setting_key']] = (string) $row['setting_value'];
    }

    return $out;
}

function site_setting_get(PDO $pdo, string $key, ?string $default = null): ?string
{
    $stmt = $pdo->prepare(
        'SELECT setting_value
         FROM site_settings
         WHERE setting_key = :key
         LIMIT 1'
    );
    $stmt->execute([':key' => $key]);
    $value = $stmt->fetchColumn();

    if ($value === false) {
        return $default;
    }

    return (string) $value;
}

function site_setting_set(PDO $pdo, string $key, string $value): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO site_settings (setting_key, setting_value)
         VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $stmt->execute([
        ':key' => $key,
        ':value' => $value,
    ]);
}

function careers_page_is_active(PDO $pdo): bool
{
    $raw = site_setting_get($pdo, SITE_SETTING_CAREERS_PAGE_ACTIVE, '1');

    return $raw === '1' || strtolower($raw) === 'true';
}

function careers_page_set_active(PDO $pdo, bool $active): void
{
    site_setting_set($pdo, SITE_SETTING_CAREERS_PAGE_ACTIVE, $active ? '1' : '0');
}
