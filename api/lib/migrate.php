#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * Minimal migration applier.
 *
 *   php api/lib/migrate.php <migration-filename.sql>
 *
 * Reads the named SQL file from api/migrations/ and runs it against the
 * RDS instance using the **admin** credentials (DB_ADMIN_USER /
 * DB_ADMIN_PASSWORD) from .config/secrets.env. The runtime API uses the
 * least-privilege app user (DB_USER / DB_PASSWORD) via api/lib/db.php;
 * those two credential pairs MUST stay separate.
 *
 * Placeholder substitution
 * ------------------------
 * Migration files may reference a small allowlist of env keys via
 * ${VAR} syntax — used to inject runtime app credentials into a CREATE
 * USER statement without committing them to the migration file itself.
 * Allowed keys: DB_USER, DB_PASSWORD.
 * Substituted values are validated to contain ONLY [A-Za-z0-9_-] so they
 * are safe to splice into a SQL string literal. If your generated value
 * has special characters, regenerate it.
 *
 * INTENTIONALLY MINIMAL: no schema_migrations tracking table, no down
 * migrations, no transactions. Migrations use IF NOT EXISTS / IF EXISTS
 * so re-running is safe; filename ordering is the canonical sequence.
 *
 * Must be run from a CLI shell, not through the web server.
 */

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "migrate.php must be run from the CLI.\n");
    exit(1);
}

require_once __DIR__ . '/env.php';

const RDS_CA_BUNDLE_PATH = __DIR__ . '/../certs/aws-rds-ca-bundle.pem';

/** @var list<string> */
const ALLOWED_PLACEHOLDERS = ['DB_USER', 'DB_PASSWORD'];

function migrate_pdo(): PDO
{
    $caPath = realpath(RDS_CA_BUNDLE_PATH);
    if ($caPath === false || !is_readable($caPath)) {
        throw new RuntimeException(
            'RDS CA bundle missing or unreadable at api/certs/aws-rds-ca-bundle.pem'
        );
    }

    $host = env_required('DB_HOST');
    $port = (string) env('DB_PORT', '3306');
    $name = (string) env('DB_NAME', '');
    $user = env_required('DB_ADMIN_USER');
    $password = env_required('DB_ADMIN_PASSWORD');

    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    if ($name !== '') {
        $dsn .= ";dbname={$name}";
    }

    return new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5,
        PDO::MYSQL_ATTR_SSL_CA => $caPath,
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
    ]);
}

function resolve_placeholders(string $sql): string
{
    $result = preg_replace_callback(
        '/\$\{([A-Z][A-Z0-9_]*)\}/',
        function (array $m): string {
            $key = $m[1];
            if (!in_array($key, ALLOWED_PLACEHOLDERS, true)) {
                throw new RuntimeException(
                    "Placeholder \${{$key}} is not on the SQL substitution allowlist."
                );
            }
            $value = env_required($key);
            if (preg_match('/^[A-Za-z0-9_\-]+$/', $value) !== 1) {
                throw new RuntimeException(
                    "Value for {$key} contains characters disallowed for SQL "
                    . "substitution (allowed: A-Z a-z 0-9 underscore hyphen). "
                    . "Regenerate the value as plain hex/alphanumeric."
                );
            }
            return $value;
        },
        $sql
    );
    if ($result === null) {
        throw new RuntimeException('Placeholder substitution failed.');
    }
    return $result;
}

/** @return list<string> */
function split_statements(string $sql): array
{
    // Strip line comments so stray semicolons inside `--` comments don't trip
    // the naive split below. Migration files we control don't include block
    // comments or string literals containing semicolons, so this is enough.
    $lines = explode("\n", $sql);
    $cleaned = array_map(
        fn(string $l): string => preg_replace('/^\s*--.*$/', '', $l) ?? $l,
        $lines
    );
    $clean = implode("\n", $cleaned);

    return array_values(array_filter(
        array_map('trim', explode(';', $clean)),
        fn(string $s): bool => $s !== ''
    ));
}

// --- Main -------------------------------------------------------------------

$migrationsDir = realpath(__DIR__ . '/../migrations');
if ($migrationsDir === false) {
    fwrite(STDERR, "api/migrations/ directory not found.\n");
    exit(1);
}

if ($argc < 2) {
    fwrite(STDERR, "Usage: php api/lib/migrate.php <migration-filename.sql>\n");
    fwrite(
        STDERR,
        "Example: php api/lib/migrate.php 2026_04_28_001_create_database.sql\n"
    );
    exit(1);
}

$filename = $argv[1];

if (
    str_contains($filename, '/') ||
    str_contains($filename, '\\') ||
    !str_ends_with($filename, '.sql')
) {
    fwrite(
        STDERR,
        "Migration filename must be a plain .sql filename in api/migrations/.\n"
    );
    exit(1);
}

$path = $migrationsDir . DIRECTORY_SEPARATOR . $filename;
if (!is_readable($path)) {
    fwrite(STDERR, "Migration file not found or not readable: {$filename}\n");
    exit(1);
}

$sql = file_get_contents($path);
if ($sql === false || trim($sql) === '') {
    fwrite(STDERR, "Migration file is empty: {$filename}\n");
    exit(1);
}

try {
    $sql = resolve_placeholders($sql);
    $statements = split_statements($sql);
    $pdo = migrate_pdo();

    echo "Applying: {$filename} (" . count($statements) . " statement(s))\n";
    foreach ($statements as $stmt) {
        $pdo->exec($stmt);
    }
} catch (Throwable $e) {
    fwrite(STDERR, "Migration failed: " . $e->getMessage() . "\n");
    exit(1);
}

echo "Done.\n";
