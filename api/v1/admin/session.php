<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/session.php';

/**
 * GET /api/v1/admin/session
 *
 * Returns the current CMS session state for the browser:
 * { authenticated: boolean, username: string | null }
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

$username = cms_session_username();

respond_ok([
    'authenticated' => $username !== null,
    'username' => $username,
]);
