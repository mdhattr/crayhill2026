<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/session.php';

/**
 * POST /api/v1/admin/logout
 *
 * Destroys the CMS session cookie and returns { authenticated: false }.
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond_error('METHOD_NOT_ALLOWED', 'Only POST is supported.', 405);
}

cms_session_logout();

respond_ok([
    'authenticated' => false,
    'username' => null,
]);
