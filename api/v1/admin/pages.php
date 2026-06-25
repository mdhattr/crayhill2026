<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/site_pages.php';

/**
 * Authenticated CMS endpoints for fixed site pages (legal copy, etc.).
 *
 *   GET   /api/v1/admin/pages           -> all provisioned pages
 *   GET   /api/v1/admin/pages?slug=<x>  -> single page for editing
 *   PATCH /api/v1/admin/pages           -> update (partial body; `id` required)
 *
 * Pages are provisioned in the database with a fixed slug allowlist — no create or delete through the CMS.
 */

cms_require_auth();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if (!in_array($method, ['GET', 'PATCH'], true)) {
    respond_error('METHOD_NOT_ALLOWED', 'Method not supported.', 405);
}

const SITE_PAGES_ADMIN_SELECT =
    'id, slug, title, subtitle, meta_description, status, content, updated_at';

/** @return array<string, mixed>|false */
function site_page_fetch_by_id(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT ' . SITE_PAGES_ADMIN_SELECT . '
         FROM site_pages
         WHERE id = :id
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':id' => $id]);

    return $stmt->fetch();
}

/** @return array<string, mixed>|false */
function site_page_fetch_by_slug(PDO $pdo, string $slug): array|false
{
    if (!site_page_is_allowed_slug($slug)) {
        return false;
    }

    $stmt = $pdo->prepare(
        'SELECT ' . SITE_PAGES_ADMIN_SELECT . '
         FROM site_pages
         WHERE slug = :slug
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':slug' => $slug]);

    return $stmt->fetch();
}

try {
    $pdo = db();

    if ($method === 'GET') {
        $slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($slug !== '') {
            $row = site_page_fetch_by_slug($pdo, $slug);
            if ($row === false) {
                respond_error('NOT_FOUND', 'Page not found.', 404);
            }
            respond_ok(site_page_admin_detail($row));
        }

        if ($id > 0) {
            $row = site_page_fetch_by_id($pdo, $id);
            if ($row === false) {
                respond_error('NOT_FOUND', 'Page not found.', 404);
            }
            respond_ok(site_page_admin_detail($row));
        }

        $stmt = $pdo->query(
            'SELECT id, slug, title, subtitle, status, updated_at
             FROM site_pages
             WHERE deleted_at IS NULL
             ORDER BY slug ASC'
        );
        $rows = $stmt->fetchAll();
        $items = array_map('site_page_admin_list_item', $rows);

        respond_ok($items, ['count' => count($items)]);
    }

    // PATCH
    $body = read_json_body();
    $id = isset($body['id']) ? (int) $body['id'] : 0;

    if ($id <= 0) {
        respond_error('VALIDATION_ERROR', 'Page id is required.', 422, [
            'id' => 'Page id is required.',
        ]);
    }

    $existing = site_page_fetch_by_id($pdo, $id);
    if ($existing === false) {
        respond_error('NOT_FOUND', 'Page not found.', 404);
    }

    $errors = site_page_validate_write_fields($body, false);
    if ($errors !== []) {
        respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
    }

    $updates = [];
    $params = [':id' => $id];

    if (array_key_exists('title', $body)) {
        $updates[] = 'title = :title';
        $params[':title'] = prepare_stored_text($body['title']);
    }
    if (array_key_exists('subtitle', $body)) {
        $subtitle = $body['subtitle'];
        $updates[] = 'subtitle = :subtitle';
        $params[':subtitle'] = ($subtitle === null || trim((string) $subtitle) === '')
            ? null
            : prepare_stored_text($subtitle);
    }
    if (array_key_exists('meta_description', $body)) {
        $updates[] = 'meta_description = :meta_description';
        $params[':meta_description'] = prepare_stored_text($body['meta_description']);
    }
    if (array_key_exists('status', $body)) {
        $updates[] = 'status = :status';
        $params[':status'] = trim((string) $body['status']);
    }
    if (array_key_exists('content', $body)) {
        $updates[] = 'content = :content';
        $params[':content'] = prepare_stored_markdown($body['content']);
    }

    if ($updates === []) {
        respond_error('VALIDATION_ERROR', 'No fields to update.', 422);
    }

    $sql = 'UPDATE site_pages SET ' . implode(', ', $updates) . ' WHERE id = :id AND deleted_at IS NULL';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $row = site_page_fetch_by_id($pdo, $id);
    if ($row === false) {
        respond_error('NOT_FOUND', 'Page not found.', 404);
    }

    respond_ok(site_page_admin_detail($row));
} catch (Throwable $e) {
    error_log('[admin/pages] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to process the page request.', 500);
}
