<?php

declare(strict_types=1);

/**
 * Response envelope helpers. Every endpoint returns one of these shapes:
 *
 *   success: { "data": ..., "error": null, "meta": ... }
 *   failure: { "data": null, "error": { "code", "message", "fields"? }, "meta": null }
 *
 * Always sets Content-Type: application/json and exits — endpoints don't
 * write any output before calling these.
 */

function respond_ok(mixed $data, ?array $meta = null, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        [
            'data' => $data,
            'error' => null,
            'meta' => $meta,
        ],
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

function respond_error(
    string $code,
    string $message,
    int $status,
    array $fields = []
): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    $error = ['code' => $code, 'message' => $message];
    if (!empty($fields)) {
        $error['fields'] = $fields;
    }
    echo json_encode(
        [
            'data' => null,
            'error' => $error,
            'meta' => null,
        ],
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

function respond_no_content(): never
{
    http_response_code(204);
    exit;
}
