<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/news.php';

/**
 * GET /api/v1/news            -> list of published posts, newest first
 * GET /api/v1/news?slug=<x>   -> a single published post (full content)
 *
 * Only `status = 'published'` rows that are not soft-deleted are ever
 * exposed; drafts and deleted rows are invisible to the public API. Results
 * are ordered by published_date DESC (id DESC as a stable tiebreak for posts
 * sharing a date), which is exactly the order the News & Insights page wants.
 *
 * Response shape (success envelope — see lib/response.php):
 *
 *   list item: { id, slug, title, author, date, image, excerpt }
 *   detail:    { id, slug, title, author, date, image, content }
 *
 * `date` is an ISO YYYY-MM-DD string. `image` is null until a hero image is
 * assigned (the frontend substitutes a placeholder). `excerpt` is a
 * plain-text summary derived from the Markdown `content` so list cards never
 * have to ship or parse the full body.
 *
 * The DB stores Markdown in `content`; only the detail response returns it,
 * and the frontend renders it. The list response intentionally omits the
 * full body to keep the payload small.
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';

try {
    $pdo = db();

    if ($slug !== '') {
        $stmt = $pdo->prepare(
            'SELECT id, slug, title, author, published_date, image, content
             FROM news
             WHERE slug = :slug
               AND status = :status
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute([':slug' => $slug, ':status' => 'published']);
        $row = $stmt->fetch();

        if ($row === false) {
            respond_error('NOT_FOUND', 'Article not found.', 404);
        }

        respond_ok(news_detail($row));
    }

    $stmt = $pdo->prepare(
        'SELECT id, slug, title, author, published_date, image, content
         FROM news
         WHERE status = :status
           AND deleted_at IS NULL
         ORDER BY published_date DESC, id DESC'
    );
    $stmt->execute([':status' => 'published']);
    $rows = $stmt->fetchAll();

    $items = array_map('news_list_item', $rows);

    respond_ok($items, ['count' => count($items)]);
} catch (Throwable $e) {
    error_log('[news] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to load news at this time.', 500);
}
