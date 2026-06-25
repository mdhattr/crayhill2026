<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/news.php';

/**
 * Authenticated CMS endpoints for News & Insights.
 *
 *   GET    /api/v1/admin/news           -> all posts (draft + published)
 *   GET    /api/v1/admin/news?id=<id>   -> single post for editing
 *   POST   /api/v1/admin/news           -> create
 *   PATCH  /api/v1/admin/news           -> update (partial body; `id` required)
 *   DELETE /api/v1/admin/news?id=<id>   -> permanently delete
 *
 * Admin list/detail include `status` and `updated_at`. Deletes are hard
 * deletes (row removed from `news`); the public API's soft-delete column is
 * unused by this CMS path.
 */

cms_require_auth();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if (!in_array($method, ['GET', 'POST', 'PATCH', 'DELETE'], true)) {
    respond_error('METHOD_NOT_ALLOWED', 'Method not supported.', 405);
}

const NEWS_ADMIN_SELECT = 'id, slug, title, author, published_date, image, status, content, updated_at';

/** @return array<string, mixed>|false */
function news_fetch_by_id(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT ' . NEWS_ADMIN_SELECT . '
         FROM news
         WHERE id = :id
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':id' => $id]);

    return $stmt->fetch();
}

function news_slug_taken(PDO $pdo, string $slug, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare(
            'SELECT id FROM news WHERE slug = :slug AND id <> :id AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare(
            'SELECT id FROM news WHERE slug = :slug AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
    }

    return $stmt->fetch() !== false;
}

try {
    $pdo = db();

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($id > 0) {
            $row = news_fetch_by_id($pdo, $id);
            if ($row === false) {
                respond_error('NOT_FOUND', 'Article not found.', 404);
            }
            respond_ok(news_admin_detail($row));
        }

        $stmt = $pdo->query(
            'SELECT ' . NEWS_ADMIN_SELECT . '
             FROM news
             WHERE deleted_at IS NULL
             ORDER BY published_date DESC, id DESC'
        );
        $rows = $stmt->fetchAll();
        $items = array_map('news_admin_list_item', $rows);

        respond_ok($items, ['count' => count($items)]);
    }

    if ($method === 'POST') {
        $body = read_json_body();
        $errors = news_validate_write_fields($body, true);

        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        $slug = trim((string) $body['slug']);
        if (news_slug_taken($pdo, $slug)) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, [
                'slug' => 'That slug is already in use.',
            ]);
        }

        $author = trim((string) $body['author']);
        if ($author === '') {
            $author = 'Crayhill Capital Management';
        }

        $image = $body['image'] ?? null;
        $imageValue = ($image === null || trim((string) $image) === '')
            ? null
            : trim((string) $image);

        $stmt = $pdo->prepare(
            'INSERT INTO news (title, author, slug, published_date, image, status, content)
             VALUES (:title, :author, :slug, :published_date, :image, :status, :content)'
        );
        $stmt->execute([
            ':title' => trim((string) $body['title']),
            ':author' => $author,
            ':slug' => $slug,
            ':published_date' => trim((string) $body['date']),
            ':image' => $imageValue,
            ':status' => trim((string) $body['status']),
            ':content' => (string) $body['content'],
        ]);

        $newId = (int) $pdo->lastInsertId();
        $row = news_fetch_by_id($pdo, $newId);
        if ($row === false) {
            respond_error('INTERNAL_ERROR', 'Unable to load the new article.', 500);
        }

        respond_ok(news_admin_detail($row), null, 201);
    }

    if ($method === 'PATCH') {
        $body = read_json_body();
        $id = isset($body['id']) ? (int) $body['id'] : 0;

        if ($id <= 0) {
            respond_error('VALIDATION_ERROR', 'Article id is required.', 422, [
                'id' => 'Article id is required.',
            ]);
        }

        $existing = news_fetch_by_id($pdo, $id);
        if ($existing === false) {
            respond_error('NOT_FOUND', 'Article not found.', 404);
        }

        $errors = news_validate_write_fields($body, false);
        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        if (array_key_exists('slug', $body)) {
            $slug = trim((string) $body['slug']);
            if (news_slug_taken($pdo, $slug, $id)) {
                respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, [
                    'slug' => 'That slug is already in use.',
                ]);
            }
        }

        $updates = [];
        $params = [':id' => $id];

        if (array_key_exists('title', $body)) {
            $updates[] = 'title = :title';
            $params[':title'] = trim((string) $body['title']);
        }
        if (array_key_exists('author', $body)) {
            $author = trim((string) $body['author']);
            $updates[] = 'author = :author';
            $params[':author'] = $author !== '' ? $author : 'Crayhill Capital Management';
        }
        if (array_key_exists('slug', $body)) {
            $updates[] = 'slug = :slug';
            $params[':slug'] = trim((string) $body['slug']);
        }
        if (array_key_exists('date', $body)) {
            $updates[] = 'published_date = :published_date';
            $params[':published_date'] = trim((string) $body['date']);
        }
        if (array_key_exists('status', $body)) {
            $updates[] = 'status = :status';
            $params[':status'] = trim((string) $body['status']);
        }
        if (array_key_exists('image', $body)) {
            $image = $body['image'];
            $updates[] = 'image = :image';
            $params[':image'] = ($image === null || trim((string) $image) === '')
                ? null
                : trim((string) $image);
        }
        if (array_key_exists('content', $body)) {
            $updates[] = 'content = :content';
            $params[':content'] = (string) $body['content'];
        }

        if ($updates === []) {
            respond_error('VALIDATION_ERROR', 'No fields to update.', 422);
        }

        $sql = 'UPDATE news SET ' . implode(', ', $updates) . ' WHERE id = :id AND deleted_at IS NULL';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $row = news_fetch_by_id($pdo, $id);
        if ($row === false) {
            respond_error('NOT_FOUND', 'Article not found.', 404);
        }

        respond_ok(news_admin_detail($row));
    }

    // DELETE
    $body = read_json_body();
    $id = isset($_GET['id'])
        ? (int) $_GET['id']
        : (isset($body['id']) ? (int) $body['id'] : 0);

    if ($id <= 0) {
        respond_error('VALIDATION_ERROR', 'Article id is required.', 422, [
            'id' => 'Article id is required.',
        ]);
    }

    $stmt = $pdo->prepare('DELETE FROM news WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        respond_error('NOT_FOUND', 'Article not found.', 404);
    }

    respond_ok(['deleted' => true, 'id' => $id]);
} catch (Throwable $e) {
    error_log('[admin/news] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to process the news request.', 500);
}
