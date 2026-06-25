<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';

/**
 * PHP session helpers for the CMS admin dashboard.
 *
 * Uses a dedicated cookie (`crayhill_cms`) scoped to `/`, HttpOnly, and
 * SameSite=Lax. `Secure` is enabled when APP_ENV=production so the session
 * cookie is not sent over plain HTTP in prod once HTTPS lands.
 */

function cms_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isProduction = env('APP_ENV', 'development') === 'production';

    session_name('crayhill_cms');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isProduction,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function cms_session_is_authenticated(): bool
{
    cms_session_start();

    return !empty($_SESSION['cms_authenticated']);
}

function cms_session_username(): ?string
{
    cms_session_start();

    if (!cms_session_is_authenticated()) {
        return null;
    }

    $username = $_SESSION['cms_username'] ?? null;

    return is_string($username) && $username !== '' ? $username : null;
}

function cms_session_login(string $username): void
{
    cms_session_start();

    session_regenerate_id(true);

    $_SESSION['cms_authenticated'] = true;
    $_SESSION['cms_username'] = $username;
}

function cms_session_logout(): void
{
    cms_session_start();

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 3600,
            $params['path'],
            $params['domain'] ?? '',
            (bool) $params['secure'],
            (bool) $params['httponly']
        );
    }

    session_destroy();
}
