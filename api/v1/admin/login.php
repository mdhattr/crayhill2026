<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/response.php';

/**
 * POST /api/v1/admin/login
 *
 * Body: { "username": "...", "password": "..." }
 *
 * Validates against CMS_USERNAME and CMS_PASS in .config/secrets.env.
 * On success, opens a server-side PHP session (HttpOnly cookie) and returns
 * { authenticated: true, username }.
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond_error('METHOD_NOT_ALLOWED', 'Only POST is supported.', 405);
}

$body = read_json_body();
$username = trim((string) ($body['username'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($username === '' || $password === '') {
    $fields = [];
    if ($username === '') {
        $fields['username'] = 'Required.';
    }
    if ($password === '') {
        $fields['password'] = 'Required.';
    }
    respond_error(
        'VALIDATION_ERROR',
        'Username and password are required.',
        422,
        $fields
    );
}

if (!cms_verify_credentials($username, $password)) {
    respond_error('INVALID_CREDENTIALS', 'Invalid username or password.', 401);
}

cms_session_login($username);

respond_ok([
    'authenticated' => true,
    'username' => $username,
]);
