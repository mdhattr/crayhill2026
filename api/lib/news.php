<?php

declare(strict_types=1);

/**
 * Shared News & Insights helpers used by the public and admin endpoints.
 */

/**
 * Reduce Markdown to a plain-text summary suitable for a list card.
 * Not a full Markdown parser — just enough to strip the syntax that would
 * otherwise leak into an excerpt (links, emphasis, headings, list markers).
 */
function news_excerpt(string $markdown, int $maxChars = 220): string
{
    $text = $markdown;
    $text = preg_replace('/!\[[^\]]*\]\([^)]*\)/', '', $text) ?? $text;
    $text = preg_replace('/\[([^\]]*)\]\([^)]*\)/', '$1', $text) ?? $text;
    $text = preg_replace('/(\*\*|\*|__|_|`)/', '', $text) ?? $text;
    $text = preg_replace('/^\s{0,3}(#{1,6}\s+|>\s?|[-*+]\s+|\d+\.\s+)/m', '', $text) ?? $text;
    $text = preg_replace('/\s+/u', ' ', $text) ?? $text;
    $text = trim($text);

    if (mb_strlen($text) <= $maxChars) {
        return $text;
    }

    $cut = mb_substr($text, 0, $maxChars);
    $lastSpace = mb_strrpos($cut, ' ');
    if ($lastSpace !== false && $lastSpace > 0) {
        $cut = mb_substr($cut, 0, $lastSpace);
    }

    return rtrim($cut, " \t\n\r\0\x0B.,;:") . '…';
}

/** Shape a raw DB row into the public list-item contract. */
function news_list_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'author' => (string) $row['author'],
        'date' => (string) $row['published_date'],
        'image' => $row['image'] !== null ? (string) $row['image'] : null,
        'excerpt' => news_excerpt((string) $row['content']),
    ];
}

/** Shape a raw DB row into the public detail contract (full content). */
function news_detail(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'author' => (string) $row['author'],
        'date' => (string) $row['published_date'],
        'image' => $row['image'] !== null ? (string) $row['image'] : null,
        'content' => (string) $row['content'],
    ];
}

/** Shape a raw DB row into the admin list-item contract. */
function news_admin_list_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'author' => (string) $row['author'],
        'date' => (string) $row['published_date'],
        'image' => $row['image'] !== null ? (string) $row['image'] : null,
        'status' => (string) $row['status'],
        'updated_at' => (string) $row['updated_at'],
    ];
}

/** Shape a raw DB row into the admin detail contract (full content). */
function news_admin_detail(array $row): array
{
    return [
        ...news_admin_list_item($row),
        'content' => (string) $row['content'],
    ];
}

/** @return array<string, string> field-level validation errors */
function news_validate_write_fields(array $body, bool $requireAll): array
{
    $errors = [];

    $has = static fn (string $key): bool => array_key_exists($key, $body);

    if ($requireAll || $has('title')) {
        $title = trim((string) ($body['title'] ?? ''));
        if ($title === '') {
            $errors['title'] = 'Title is required.';
        } elseif (mb_strlen($title) > 512) {
            $errors['title'] = 'Title must be 512 characters or fewer.';
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

    if ($requireAll || $has('author')) {
        $author = trim((string) ($body['author'] ?? ''));
        if ($requireAll && $author === '') {
            $errors['author'] = 'Author is required.';
        } elseif ($author !== '' && mb_strlen($author) > 255) {
            $errors['author'] = 'Author must be 255 characters or fewer.';
        }
    }

    if ($requireAll || $has('date')) {
        $date = trim((string) ($body['date'] ?? ''));
        if ($date === '') {
            $errors['date'] = 'Published date is required.';
        } else {
            $dt = DateTime::createFromFormat('Y-m-d', $date);
            if ($dt === false || $dt->format('Y-m-d') !== $date) {
                $errors['date'] = 'Date must be YYYY-MM-DD.';
            }
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
        if ($requireAll && trim($content) === '') {
            $errors['content'] = 'Content is required.';
        }
    }

    if ($has('image') && $body['image'] !== null) {
        $image = trim((string) $body['image']);
        if ($image !== '' && strlen($image) > 512) {
            $errors['image'] = 'Image path must be 512 characters or fewer.';
        }
    }

    return $errors;
}
