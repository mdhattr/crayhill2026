<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';

/**
 * Single shared PDO instance for the API.
 *
 * - Reads connection details from .config/secrets.env via the env loader.
 * - utf8mb4 charset.
 * - PDO::ERRMODE_EXCEPTION so failures throw, never silently fail.
 * - PDO::ATTR_EMULATE_PREPARES = false so prepared statements use real
 *   server-side prepares — required for safe parameter binding.
 * - Connection timeout of 5 seconds: we'd rather fail fast in dev than
 *   hang the request when RDS isn't reachable from the current network.
 * - **TLS is enforced for every connection** — see `connectViaTls()` below
 *   and the rationale in .cursor/rules/20-php-api.mdc.
 *
 * NEVER catches and swallows exceptions here. Callers decide what to do
 * with connection failures (the health endpoint reports them as data;
 * regular endpoints should let them propagate to a 500 response).
 */

/**
 * Path to the AWS-published combined RDS root-certificate bundle.
 * The file is committed to the repo (not a secret) so deploys get a
 * deterministic copy. Refresh it from
 * https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
 * if AWS rotates the bundle (every few years).
 */
const RDS_CA_BUNDLE_PATH = __DIR__ . '/../certs/aws-rds-ca-bundle.pem';

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = env_required('DB_HOST');
    $port = (string) env('DB_PORT', '3306');
    $name = (string) env('DB_NAME', '');
    $user = env_required('DB_USER');
    $password = env_required('DB_PASSWORD');

    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    if ($name !== '') {
        $dsn .= ";dbname={$name}";
    }

    if (!is_readable(RDS_CA_BUNDLE_PATH)) {
        throw new RuntimeException(
            'RDS CA bundle missing or unreadable at api/certs/aws-rds-ca-bundle.pem. '
            . 'Refresh from https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem'
        );
    }

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5,
        // Require TLS, validating the RDS server cert against AWS's root CA bundle.
        PDO::MYSQL_ATTR_SSL_CA => RDS_CA_BUNDLE_PATH,
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
    ]);

    return $pdo;
}
