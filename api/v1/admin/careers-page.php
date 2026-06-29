<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/site_settings.php';

/**
 * Authenticated CMS endpoints for Careers page visibility.
 *
 *   GET   /api/v1/admin/careers-page  -> { pageActive: boolean }
 *   PATCH /api/v1/admin/careers-page  -> { pageActive: boolean }
 *
 * When `pageActive` is false, GET /api/v1/careers returns 404 and the public
 * site hides Careers from TopNav and Footer.
 */

cms_require_auth();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if (!in_array($method, ['GET', 'PATCH'], true)) {
    respond_error('METHOD_NOT_ALLOWED', 'Method not supported.', 405);
}

try {
    $pdo = db();

    if ($method === 'GET') {
        respond_ok([
            'pageActive' => careers_page_is_active($pdo),
        ]);
    }

    $body = read_json_body();

    if (!array_key_exists('pageActive', $body)) {
        respond_error('VALIDATION_ERROR', 'pageActive is required.', 422, [
            'pageActive' => 'pageActive is required.',
        ]);
    }

    $raw = $body['pageActive'];
    if (!is_bool($raw)) {
        respond_error('VALIDATION_ERROR', 'pageActive must be true or false.', 422, [
            'pageActive' => 'pageActive must be true or false.',
        ]);
    }

    careers_page_set_active($pdo, $raw);

    respond_ok([
        'pageActive' => careers_page_is_active($pdo),
    ]);
} catch (Throwable $e) {
    error_log('[admin/careers-page] request failed: ' . $e->getMessage());
    if (
        $e instanceof PDOException
        && str_contains($e->getMessage(), 'site_settings')
    ) {
        respond_error(
            'SERVICE_UNAVAILABLE',
            'Careers page settings are not provisioned. Run migration 2026_06_29_007_create_site_settings.sql.',
            503,
        );
    }
    respond_error('INTERNAL_ERROR', 'Unable to process the careers page request.', 500);
}
