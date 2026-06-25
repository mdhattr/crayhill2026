<?php

declare(strict_types=1);

require_once __DIR__ . '/sanitize.php';

/**
 * Shared site-page helpers used by the public and admin endpoints.
 */

/** Slugs provisioned in the database; not creatable through the CMS. */
const SITE_PAGE_SLUGS = [
    'legal-notice-and-disclosures',
    'privacy-policy',
];

function site_page_is_allowed_slug(string $slug): bool
{
    return in_array($slug, SITE_PAGE_SLUGS, true);
}

/** Shape a raw DB row into the public page contract. */
function site_page_public(array $row): array
{
    return [
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'subtitle' => $row['subtitle'] !== null ? (string) $row['subtitle'] : null,
        'meta_description' => (string) $row['meta_description'],
        'content' => (string) $row['content'],
    ];
}

/** Shape a raw DB row into the admin detail contract. */
function site_page_admin_detail(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'subtitle' => $row['subtitle'] !== null ? (string) $row['subtitle'] : null,
        'meta_description' => (string) $row['meta_description'],
        'status' => (string) $row['status'],
        'content' => (string) $row['content'],
        'updated_at' => (string) $row['updated_at'],
    ];
}

/** Shape a raw DB row into the admin list-item contract. */
function site_page_admin_list_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'title' => (string) $row['title'],
        'subtitle' => $row['subtitle'] !== null ? (string) $row['subtitle'] : null,
        'status' => (string) $row['status'],
        'updated_at' => (string) $row['updated_at'],
    ];
}

/** @return array<string, string> field-level validation errors */
function site_page_validate_write_fields(array $body, bool $requireAll): array
{
    $errors = [];

    $has = static fn (string $key): bool => array_key_exists($key, $body);

    if ($requireAll || $has('title')) {
        $error = validate_clean_text_field((string) ($body['title'] ?? ''), 'Title', 512, $requireAll);
        if ($error !== null) {
            $errors['title'] = $error;
        }
    }

    if ($requireAll || $has('meta_description')) {
        $error = validate_clean_text_field(
            (string) ($body['meta_description'] ?? ''),
            'Meta description',
            512,
            $requireAll,
        );
        if ($error !== null) {
            $errors['meta_description'] = $error;
        }
    }

    if ($requireAll || $has('subtitle')) {
        if ($body['subtitle'] !== null) {
            $error = validate_clean_text_field(
                (string) ($body['subtitle'] ?? ''),
                'Subtitle',
                255,
                false,
            );
            if ($error !== null) {
                $errors['subtitle'] = $error;
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
        $error = validate_markdown_content($content, $requireAll);
        if ($error !== null) {
            $errors['content'] = $error;
        }
    }

    return $errors;
}
