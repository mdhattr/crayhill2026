<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/env.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/request.php';
require_once __DIR__ . '/../../lib/team_members.php';

/**
 * Authenticated CMS endpoints for team roster members.
 *
 *   GET    /api/v1/admin/team?roster=<roster>     -> members for one roster
 *   GET    /api/v1/admin/team?id=<id>             -> single member for editing
 *   POST   /api/v1/admin/team                     -> create
 *   PATCH  /api/v1/admin/team                     -> update (partial body; `id` required)
 *   DELETE /api/v1/admin/team?id=<id>               -> soft delete (sets deleted_at)
 *
 * Admin list/detail include draft + published rows. Deletes are soft deletes.
 */

cms_require_auth();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if (!in_array($method, ['GET', 'POST', 'PATCH', 'DELETE'], true)) {
    respond_error('METHOD_NOT_ALLOWED', 'Method not supported.', 405);
}

const TEAM_ADMIN_SELECT =
    'id, slug, name, card_title, full_title, image_src, email, linkedin_url, roster, sort_order, status, content, updated_at';

/** @return array<string, mixed>|false */
function team_fetch_by_id(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT ' . TEAM_ADMIN_SELECT . '
         FROM team_members
         WHERE id = :id
           AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([':id' => $id]);

    return $stmt->fetch();
}

function team_slug_taken(PDO $pdo, string $slug, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare(
            'SELECT id FROM team_members WHERE slug = :slug AND id <> :id AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare(
            'SELECT id FROM team_members WHERE slug = :slug AND deleted_at IS NULL LIMIT 1'
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
            $row = team_fetch_by_id($pdo, $id);
            if ($row === false) {
                respond_error('NOT_FOUND', 'Team member not found.', 404);
            }
            respond_ok(team_admin_detail($row));
        }

        $roster = trim((string) ($_GET['roster'] ?? ''));
        if ($roster === '' || !team_is_valid_roster($roster)) {
            respond_error('VALIDATION_ERROR', 'A valid roster query parameter is required.', 422, [
                'roster' => 'Roster must be leadership or senior-investment-professionals.',
            ]);
        }

        $stmt = $pdo->prepare(
            'SELECT ' . TEAM_ADMIN_SELECT . '
             FROM team_members
             WHERE roster = :roster
               AND deleted_at IS NULL
             ORDER BY sort_order ASC, id ASC'
        );
        $stmt->execute([':roster' => $roster]);
        $rows = $stmt->fetchAll();
        $items = array_map('team_admin_list_item', $rows);

        respond_ok($items, ['count' => count($items), 'roster' => $roster]);
    }

    if ($method === 'POST') {
        $body = read_json_body();
        $errors = team_validate_write_fields($body, true);

        $sortOrder = team_parse_sort_order($body['sort_order'] ?? null);
        if ($sortOrder === null) {
            $errors['sort_order'] = 'Display order must be 1 or greater.';
        }

        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        $slug = trim((string) $body['slug']);
        if (team_slug_taken($pdo, $slug)) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, [
                'slug' => 'That slug is already in use.',
            ]);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO team_members (
                slug, name, card_title, full_title, image_src, email, linkedin_url,
                roster, sort_order, status, content
             ) VALUES (
                :slug, :name, :card_title, :full_title, :image_src, :email, :linkedin_url,
                :roster, :sort_order, :status, :content
             )'
        );
        $stmt->execute([
            ':slug' => $slug,
            ':name' => prepare_stored_text($body['name']),
            ':card_title' => prepare_stored_text($body['card_title']),
            ':full_title' => prepare_stored_text($body['full_title']),
            ':image_src' => prepare_stored_text($body['image_src']),
            ':email' => team_nullable_string($body['email'] ?? null),
            ':linkedin_url' => team_nullable_string($body['linkedin_url'] ?? null),
            ':roster' => prepare_stored_text($body['roster']),
            ':sort_order' => $sortOrder,
            ':status' => prepare_stored_text($body['status']),
            ':content' => prepare_stored_markdown($body['content']),
        ]);

        $newId = (int) $pdo->lastInsertId();
        $row = team_fetch_by_id($pdo, $newId);
        if ($row === false) {
            respond_error('INTERNAL_ERROR', 'Unable to load the new team member.', 500);
        }

        respond_ok(team_admin_detail($row), null, 201);
    }

    if ($method === 'PATCH') {
        $body = read_json_body();
        $id = isset($body['id']) ? (int) $body['id'] : 0;

        if ($id <= 0) {
            respond_error('VALIDATION_ERROR', 'Team member id is required.', 422, [
                'id' => 'Team member id is required.',
            ]);
        }

        $existing = team_fetch_by_id($pdo, $id);
        if ($existing === false) {
            respond_error('NOT_FOUND', 'Team member not found.', 404);
        }

        $errors = team_validate_write_fields($body, false);

        if (array_key_exists('sort_order', $body)) {
            $sortOrder = team_parse_sort_order($body['sort_order']);
            if ($sortOrder === null) {
                $errors['sort_order'] = 'Display order must be 1 or greater.';
            }
        }

        if ($errors !== []) {
            respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        if (array_key_exists('slug', $body)) {
            $slug = trim((string) $body['slug']);
            if (team_slug_taken($pdo, $slug, $id)) {
                respond_error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, [
                    'slug' => 'That slug is already in use.',
                ]);
            }
        }

        $updates = [];
        $params = [':id' => $id];

        $stringFields = [
            'name' => 'name',
            'slug' => 'slug',
            'card_title' => 'card_title',
            'full_title' => 'full_title',
            'image_src' => 'image_src',
            'roster' => 'roster',
            'status' => 'status',
        ];

        foreach ($stringFields as $bodyKey => $column) {
            if (array_key_exists($bodyKey, $body)) {
                $updates[] = $column . ' = :' . $column;
                $params[':' . $column] = prepare_stored_text($body[$bodyKey]);
            }
        }

        if (array_key_exists('email', $body)) {
            $updates[] = 'email = :email';
            $params[':email'] = team_nullable_string($body['email']);
        }
        if (array_key_exists('linkedin_url', $body)) {
            $updates[] = 'linkedin_url = :linkedin_url';
            $params[':linkedin_url'] = team_nullable_string($body['linkedin_url']);
        }
        if (array_key_exists('sort_order', $body)) {
            $updates[] = 'sort_order = :sort_order';
            $params[':sort_order'] = team_parse_sort_order($body['sort_order']);
        }
        if (array_key_exists('content', $body)) {
            $updates[] = 'content = :content';
            $params[':content'] = prepare_stored_markdown($body['content']);
        }

        if ($updates === []) {
            respond_error('VALIDATION_ERROR', 'No fields to update.', 422);
        }

        $sql = 'UPDATE team_members SET ' . implode(', ', $updates) . ' WHERE id = :id AND deleted_at IS NULL';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $row = team_fetch_by_id($pdo, $id);
        if ($row === false) {
            respond_error('NOT_FOUND', 'Team member not found.', 404);
        }

        respond_ok(team_admin_detail($row));
    }

    // DELETE — soft delete
    $body = read_json_body();
    $id = isset($_GET['id'])
        ? (int) $_GET['id']
        : (isset($body['id']) ? (int) $body['id'] : 0);

    if ($id <= 0) {
        respond_error('VALIDATION_ERROR', 'Team member id is required.', 422, [
            'id' => 'Team member id is required.',
        ]);
    }

    $stmt = $pdo->prepare(
        'UPDATE team_members SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL'
    );
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        respond_error('NOT_FOUND', 'Team member not found.', 404);
    }

    respond_ok(['deleted' => true, 'id' => $id]);
} catch (Throwable $e) {
    error_log('[admin/team] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to process the team request.', 500);
}
