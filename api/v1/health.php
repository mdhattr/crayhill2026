<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';

/**
 * GET /api/v1/health
 *
 * Smoke check that the env loader, response envelope, and database
 * connection chain all work end-to-end. Always returns 200 with the
 * actual state in the body — this is a diagnostic endpoint, not a
 * load-balancer readiness check (that should be a separate endpoint
 * that 503s when dependencies are down).
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

$dbStatus = [
    'connected' => false,
    'selected_schema' => null,
    'error' => null,
];

try {
    $pdo = db();
    $pdo->query('SELECT 1')->fetch();
    $dbStatus['connected'] = true;
    $schema = (string) env('DB_NAME', '');
    if ($schema !== '') {
        $dbStatus['selected_schema'] = $schema;
    }
} catch (Throwable $e) {
    error_log('[health] DB check failed: ' . $e->getMessage());
    $dbStatus['error'] = 'connection_failed';
}

respond_ok([
    'status' => 'ok',
    'app_env' => env('APP_ENV', 'unknown'),
    'php_version' => PHP_VERSION,
    'database' => $dbStatus,
]);
