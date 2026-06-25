<?php

declare(strict_types=1);

/**
 * Shared team member helpers for public and admin endpoints.
 */

const TEAM_ROSTERS = ['leadership', 'senior-investment-professionals'];

function team_roster_path(string $roster): string
{
    return match ($roster) {
        'leadership' => '/team/leadership',
        'senior-investment-professionals' => '/team/senior-investment-professionals',
        default => throw new InvalidArgumentException('Unknown roster'),
    };
}

function team_is_valid_roster(string $roster): bool
{
    return in_array($roster, TEAM_ROSTERS, true);
}

/** Public roster card (grid). */
function team_list_item(array $row): array
{
    return [
        'slug' => (string) $row['slug'],
        'name' => (string) $row['name'],
        'title' => (string) $row['card_title'],
        'imageSrc' => (string) $row['image_src'],
    ];
}

/** Public bio detail. */
function team_bio_item(array $row): array
{
    $roster = (string) $row['roster'];

    return [
        'slug' => (string) $row['slug'],
        'name' => (string) $row['name'],
        'fullTitle' => (string) $row['full_title'],
        'imageSrc' => (string) $row['image_src'],
        'email' => $row['email'] !== null ? (string) $row['email'] : null,
        'linkedinUrl' => $row['linkedin_url'] !== null ? (string) $row['linkedin_url'] : null,
        'content' => (string) $row['content'],
        'rosterPath' => team_roster_path($roster),
        'roster' => $roster,
    ];
}

/** Admin list row. */
function team_admin_list_item(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => (string) $row['slug'],
        'name' => (string) $row['name'],
        'card_title' => (string) $row['card_title'],
        'full_title' => (string) $row['full_title'],
        'image_src' => (string) $row['image_src'],
        'email' => $row['email'] !== null ? (string) $row['email'] : null,
        'linkedin_url' => $row['linkedin_url'] !== null ? (string) $row['linkedin_url'] : null,
        'roster' => (string) $row['roster'],
        'sort_order' => (int) $row['sort_order'],
        'status' => (string) $row['status'],
        'updated_at' => (string) $row['updated_at'],
    ];
}

/** Admin detail (includes Markdown bio). */
function team_admin_detail(array $row): array
{
    return [
        ...team_admin_list_item($row),
        'content' => (string) $row['content'],
    ];
}

/** @return array<string, string> field-level validation errors */
function team_validate_write_fields(array $body, bool $requireAll): array
{
    $errors = [];

    $has = static fn (string $key): bool => array_key_exists($key, $body);

    if ($requireAll || $has('name')) {
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Name is required.';
        } elseif (mb_strlen($name) > 255) {
            $errors['name'] = 'Name must be 255 characters or fewer.';
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

    if ($requireAll || $has('card_title')) {
        $cardTitle = trim((string) ($body['card_title'] ?? ''));
        if ($cardTitle === '') {
            $errors['card_title'] = 'Card title is required.';
        } elseif (mb_strlen($cardTitle) > 255) {
            $errors['card_title'] = 'Card title must be 255 characters or fewer.';
        }
    }

    if ($requireAll || $has('full_title')) {
        $fullTitle = trim((string) ($body['full_title'] ?? ''));
        if ($fullTitle === '') {
            $errors['full_title'] = 'Full title is required.';
        } elseif (mb_strlen($fullTitle) > 512) {
            $errors['full_title'] = 'Full title must be 512 characters or fewer.';
        }
    }

    if ($requireAll || $has('image_src')) {
        $imageSrc = trim((string) ($body['image_src'] ?? ''));
        if ($imageSrc === '') {
            $errors['image_src'] = 'Headshot path is required.';
        } elseif (!str_starts_with($imageSrc, '/images/')) {
            $errors['image_src'] = 'Headshot path must start with /images/.';
        } elseif (strlen($imageSrc) > 512) {
            $errors['image_src'] = 'Headshot path must be 512 characters or fewer.';
        }
    }

    if ($requireAll || $has('email')) {
        $email = $body['email'] ?? null;
        if ($email !== null && trim((string) $email) !== '') {
            $email = trim((string) $email);
            if (mb_strlen($email) > 255) {
                $errors['email'] = 'Email must be 255 characters or fewer.';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Enter a valid email address.';
            }
        }
    }

    if ($requireAll || $has('linkedin_url')) {
        $linkedin = $body['linkedin_url'] ?? null;
        if ($linkedin !== null && trim((string) $linkedin) !== '') {
            $linkedin = trim((string) $linkedin);
            if (strlen($linkedin) > 512) {
                $errors['linkedin_url'] = 'LinkedIn URL must be 512 characters or fewer.';
            } elseif (!filter_var($linkedin, FILTER_VALIDATE_URL)) {
                $errors['linkedin_url'] = 'Enter a valid URL.';
            }
        }
    }

    if ($requireAll || $has('roster')) {
        $roster = trim((string) ($body['roster'] ?? ''));
        if ($roster === '') {
            $errors['roster'] = 'Roster is required.';
        } elseif (!team_is_valid_roster($roster)) {
            $errors['roster'] = 'Roster must be leadership or senior-investment-professionals.';
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
        if ($requireAll && trim($content) === '') {
            $errors['content'] = 'Bio content is required.';
        }
    }

    return $errors;
}

function team_parse_sort_order(mixed $value): ?int
{
    if (!is_numeric($value)) {
        return null;
    }

    return (int) $value;
}

function team_nullable_string(mixed $value): ?string
{
    if ($value === null) {
        return null;
    }

    $trimmed = trim((string) $value);

    return $trimmed === '' ? null : $trimmed;
}
