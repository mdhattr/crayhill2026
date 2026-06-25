<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/site_pages.php';

/**
 * GET /api/v1/pages?slug=<slug>  -> a single published static page
 *
 * Fixed legal/marketing pages (Legal Notice, Privacy Policy, etc.) stored in
 * `site_pages`. Only `status = 'published'` and non-deleted rows are exposed.
 *
 * Response: { slug, title, subtitle, meta_description, content }
 * `content` is Markdown; `subtitle` is optional (e.g. effective date line).
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';

if ($slug === '') {
    respond_error('VALIDATION_ERROR', 'Page slug is required.', 422, [
        'slug' => 'Page slug is required.',
    ]);
}

if (!site_page_is_allowed_slug($slug)) {
    respond_error('NOT_FOUND', 'Page not found.', 404);
}

try {
    $pdo = db();

    $stmt = $pdo->prepare(
        'SELECT slug, title, subtitle, meta_description, content
         FROM site_pages
         WHERE slug = :slug
           AND status = :status
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':slug' => $slug, ':status' => 'published']);
    $row = $stmt->fetch();

    if ($row === false) {
        respond_error('NOT_FOUND', 'Page not found.', 404);
    }

    respond_ok(site_page_public($row));
} catch (Throwable $e) {
    error_log('[pages] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to load page content at this time.', 500);
}
