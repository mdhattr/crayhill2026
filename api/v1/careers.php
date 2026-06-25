<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/careers.php';

/**
 * GET /api/v1/careers  -> list of published job postings, in display order.
 *
 * Only `status = 'published'` rows that are not soft-deleted are exposed;
 * drafts and deleted rows are invisible to the public API. Results are ordered
 * by sort_order ASC (id ASC as a stable tiebreak).
 *
 * Unlike News, there are no individual job-posting pages: the Careers page
 * renders each posting as an accordion (title -> expand to full body), so the
 * full Markdown `content` is returned inline in the list response. The list is
 * tiny (a handful of openings), so the payload stays small.
 *
 * Response shape (success envelope — see lib/response.php):
 *
 *   item: { id, slug, title, location, content }
 *
 * `location` is null when unspecified. `content` is Markdown; the frontend
 * renders it.
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

try {
    $pdo = db();

    $stmt = $pdo->prepare(
        'SELECT id, slug, title, location, content
         FROM careers
         WHERE status = :status
           AND deleted_at IS NULL
         ORDER BY sort_order ASC, id ASC'
    );
    $stmt->execute([':status' => 'published']);
    $rows = $stmt->fetchAll();

    $items = array_map('careers_item', $rows);

    respond_ok($items, ['count' => count($items)]);
} catch (Throwable $e) {
    error_log('[careers] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to load careers at this time.', 500);
}
