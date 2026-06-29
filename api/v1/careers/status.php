<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/site_settings.php';

/**
 * GET /api/v1/careers/status
 *
 * Public visibility flag for the Careers page. Always returns 200 so the
 * frontend can hide nav links when inactive without treating it as an error.
 *
 * Response: { active: boolean }
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

try {
    $pdo = db();

    respond_ok([
        'active' => careers_page_is_active($pdo),
    ]);
} catch (Throwable $e) {
    error_log('[careers/status] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to load careers page status.', 500);
}
