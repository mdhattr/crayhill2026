<?php

declare(strict_types=1);

/**
 * Single env loader for the entire API.
 *
 * Reads .config/secrets.env at the repo root — the canonical secrets file
 * for this project (see .config/README.md and .cursor/rules/00-project.mdc).
 * Caches parsed values in a static; the file is read at most once per
 * request.
 *
 * NEVER logs, dumps, or echoes the values it loaded. Error messages name
 * keys but not values.
 */

function env_load(): array
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }

    $path = realpath(__DIR__ . '/../../.config/secrets.env');
    if ($path === false || !is_readable($path)) {
        throw new RuntimeException(
            'Secrets file not found or not readable. '
            . 'Expected at .config/secrets.env (copy from .config/secrets.env.example).'
        );
    }

    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        throw new RuntimeException('Failed to read secrets file.');
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }
        $pos = strpos($trimmed, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($trimmed, 0, $pos));
        $value = trim(substr($trimmed, $pos + 1));
        if ($key === '') {
            continue;
        }
        $values[$key] = $value;
    }

    $cache = $values;
    return $cache;
}

function env(string $key, mixed $default = null): mixed
{
    $values = env_load();
    return $values[$key] ?? $default;
}

function env_required(string $key): string
{
    $values = env_load();
    if (!isset($values[$key]) || $values[$key] === '') {
        throw new RuntimeException("Required env key missing or empty: {$key}");
    }
    return $values[$key];
}
