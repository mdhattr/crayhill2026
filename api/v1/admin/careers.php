<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/careers.php';

/**
 * Authenticated CMS endpoints for Careers job postings.
 *
 *   GET    /api/v1/admin/careers           -> all postings (draft + published)
 *   GET    /api/v1/admin/careers?id=<id>   -> single posting for editing
 *   POST   /api/v1/admin/careers           -> create
 *   PATCH  /api/v1/admin/careers           -> update (partial body; `id` required)
 *   DELETE /api/v1/admin/careers?id=<id>   -> permanently delete
 *
 * Admin list/detail include `status`, `sort_order`, and `updated_at`. Deletes
 * are hard deletes (row removed from `careers`).
 */

cms_require_auth();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if (!in_array($method, ['GET', 'POST', 'PATCH', 'DELETE'], true)) {
    respond_error('METHOD_NOT_ALLOWED', 'Method not supported.', 405);
}

const CAREERS_ADMIN_SELECT =
    'id, slug, title, location, sort_order, status, content, updated_at';

/** @return array<string, mixed>|false */
function careers_fetch_by_id(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT ' . CAREERS_ADMIN_SELECT . '
         FROM careers
         WHERE id = :id
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':id' => $id]);

    return $stmt->fetch();
}

function careers_slug_taken(PDO $pdo, string $slug, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare(
            'SELECT id FROM careers WHERE slug = :slug AND id <> :id AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare(
            'SELECT id FROM careers WHERE slug = :slug AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
    }

    return $stmt->fetch() !== false;
}

/** @return int|null */
function careers_parse_sort_order(mixed $value): ?int
{
    if (!is_numeric($value)) {
        return null;
    }

    return (int) $value;
}

try {
    $pdo = db();

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($id > 0) {
            $row = careers_fetch_by_id($pdo, $id);
            if ($row === false) {
                respond_error('NOT_FOUND', 'Posting not found.', 404);
            }
            respond_ok(careers_admin_detail($row));
        }

        $stmt = $pdo->query(
            'SELECT ' . CAREERS_ADMIN_SELECT . '
             FROM careers
             WHERE deleted_at IS NULL
             ORDER BY sort_order ASC, id ASC'
        );
        $rows = $stmt->fetchAll();
        $items = array_map('careers_admin_list_item', $rows);

        respond_ok($items, ['count' => count($items)]);
    }

    if ($method === 'POST') {
        $body = read_json_body();
        $errors = careers_validate_write_fields($body, true);

        $sortOrder = careers_parse_sort_order($body['sort_order'] ?? null);
        if ($sortOrder === null) {
            $errors['sort_order'] = 'Display order must be a whole number.';
        }

        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        $slug = trim((string) $body['slug']);
        if (careers_slug_taken($pdo, $slug)) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, [
                'slug' => 'That slug is already in use.',
            ]);
        }

        $location = $body['location'] ?? null;
        $locationValue = ($location === null || trim((string) $location) === '')
            ? null
            : trim((string) $location);

        $stmt = $pdo->prepare(
            'INSERT INTO careers (title, slug, location, sort_order, status, content)
             VALUES (:title, :slug, :location, :sort_order, :status, :content)'
        );
        $stmt->execute([
            ':title' => trim((string) $body['title']),
            ':slug' => $slug,
            ':location' => $locationValue,
            ':sort_order' => $sortOrder,
            ':status' => trim((string) $body['status']),
            ':content' => (string) $body['content'],
        ]);

        $newId = (int) $pdo->lastInsertId();
        $row = careers_fetch_by_id($pdo, $newId);
        if ($row === false) {
            respond_error('INTERNAL_ERROR', 'Unable to load the new posting.', 500);
        }

        respond_ok(careers_admin_detail($row), null, 201);
    }

    if ($method === 'PATCH') {
        $body = read_json_body();
        $id = isset($body['id']) ? (int) $body['id'] : 0;

        if ($id <= 0) {
            respond_error('VALIDATION_ERROR', 'Posting id is required.', 422, [
                'id' => 'Posting id is required.',
            ]);
        }

        $existing = careers_fetch_by_id($pdo, $id);
        if ($existing === false) {
            respond_error('NOT_FOUND', 'Posting not found.', 404);
        }

        $errors = careers_validate_write_fields($body, false);

        if (array_key_exists('sort_order', $body)) {
            $sortOrder = careers_parse_sort_order($body['sort_order']);
            if ($sortOrder === null) {
                $errors['sort_order'] = 'Display order must be a whole number.';
            }
        }

        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        if (array_key_exists('slug', $body)) {
            $slug = trim((string) $body['slug']);
            if (careers_slug_taken($pdo, $slug, $id)) {
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
        if (array_key_exists('slug', $body)) {
            $updates[] = 'slug = :slug';
            $params[':slug'] = trim((string) $body['slug']);
        }
        if (array_key_exists('location', $body)) {
            $location = $body['location'];
            $updates[] = 'location = :location';
            $params[':location'] = ($location === null || trim((string) $location) === '')
                ? null
                : trim((string) $location);
        }
        if (array_key_exists('sort_order', $body)) {
            $updates[] = 'sort_order = :sort_order';
            $params[':sort_order'] = careers_parse_sort_order($body['sort_order']);
        }
        if (array_key_exists('status', $body)) {
            $updates[] = 'status = :status';
            $params[':status'] = trim((string) $body['status']);
        }
        if (array_key_exists('content', $body)) {
            $updates[] = 'content = :content';
            $params[':content'] = (string) $body['content'];
        }

        if ($updates === []) {
            respond_error('VALIDATION_ERROR', 'No fields to update.', 422);
        }

        $sql = 'UPDATE careers SET ' . implode(', ', $updates) . ' WHERE id = :id AND deleted_at IS NULL';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $row = careers_fetch_by_id($pdo, $id);
        if ($row === false) {
            respond_error('NOT_FOUND', 'Posting not found.', 404);
        }

        respond_ok(careers_admin_detail($row));
    }

    // DELETE
    $body = read_json_body();
    $id = isset($_GET['id'])
        ? (int) $_GET['id']
        : (isset($body['id']) ? (int) $body['id'] : 0);

    if ($id <= 0) {
        respond_error('VALIDATION_ERROR', 'Posting id is required.', 422, [
            'id' => 'Posting id is required.',
        ]);
    }

    $stmt = $pdo->prepare('DELETE FROM careers WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        respond_error('NOT_FOUND', 'Posting not found.', 404);
    }

    respond_ok(['deleted' => true, 'id' => $id]);
} catch (Throwable $e) {
    error_log('[admin/careers] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to process the careers request.', 500);
}
