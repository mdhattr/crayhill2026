<?php

declare(strict_types=1);

require_once __DIR__ . '/sanitize.php';

/**
 * Shared Careers helpers used by the public and admin endpoints.
 */

/** Shape a raw DB row into the public posting contract. */
function careers_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'location' => $row['location'] !== null ? (string) $row['location'] : null,
        'content' => normalize_stored_markdown((string) $row['content']),
    ];
}

/** Shape a raw DB row into the admin list-item contract. */
function careers_admin_list_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'location' => $row['location'] !== null ? (string) $row['location'] : null,
        'sort_order' => (int) $row['sort_order'],
        'status' => (string) $row['status'],
        'updated_at' => (string) $row['updated_at'],
    ];
}

/** Shape a raw DB row into the admin detail contract (full content). */
function careers_admin_detail(array $row): array
{
    return [
        ...careers_admin_list_item($row),
        'content' => normalize_stored_markdown((string) $row['content']),
    ];
}

/** @return array<string, string> field-level validation errors */
function careers_validate_write_fields(array $body, bool $requireAll): array
{
    $errors = [];

    $has = static fn (string $key): bool => array_key_exists($key, $body);

    if ($requireAll || $has('title')) {
        $title = (string) ($body['title'] ?? '');
        $error = validate_clean_text_field($title, 'Title', 255, $requireAll);
        if ($error !== null) {
            $errors['title'] = $error;
        }
    }

    if ($requireAll || $has('slug')) {
        $slug = trim((string) ($body['slug'] ?? ''));
        if ($slug === '') {
            $errors['slug'] = 'Slug is required.';
        } elseif (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
            $errors['slug'] = 'Slug must use lowercase letters, numbers, and hyphens only.';
        } elseif (strlen($slug) > 255) {
            $errors['slug'] = 'Slug must be 255 characters or fewer.';
        }
    }

    if ($requireAll || $has('location')) {
        if ($body['location'] !== null) {
            $location = (string) ($body['location'] ?? '');
            $error = validate_clean_text_field($location, 'Location', 255, false);
            if ($error !== null) {
                $errors['location'] = $error;
            }
        }
    }

    if ($requireAll || $has('sort_order')) {
        if (!array_key_exists('sort_order', $body) || !is_numeric($body['sort_order'])) {
            $errors['sort_order'] = 'Display order must be a whole number.';
        }
    }

    if ($requireAll || $has('status')) {
        $status = trim((string) ($body['status'] ?? ''));
        if ($status === '') {
            $errors['status'] = 'Status is required.';
        } elseif (!in_array($status, ['published', 'draft'], true)) {
            $errors['status'] = 'Status must be published or draft.';
        }
    }

    if ($requireAll || $has('content')) {
        $content = (string) ($body['content'] ?? '');
        $error = validate_markdown_content($content, $requireAll);
        if ($error !== null) {
            $errors['content'] = $error;
        }
    }

    return $errors;
}
