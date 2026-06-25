<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/session.php';

/**
 * CMS credential check against .config/secrets.env (CMS_USERNAME / CMS_PASS).
 * Comparison is timing-safe via hash_equals.
 */
function cms_verify_credentials(string $username, string $password): bool
{
    $expectedUser = env_required('CMS_USERNAME');
    $expectedPass = env_required('CMS_PASS');

    return hash_equals($expectedUser, $username)
        && hash_equals($expectedPass, $password);
}

/**
 * Guard for future write endpoints — responds 401 if the CMS session is absent.
 */
function cms_require_auth(): void
{
    if (!cms_session_is_authenticated()) {
        respond_error('UNAUTHORIZED', 'Authentication required.', 401);
    }
}
