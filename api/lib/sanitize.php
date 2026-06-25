<?php

declare(strict_types=1);

/**
 * CMS input sanitization and Markdown content policy.
 *
 * All admin write endpoints validate through these helpers before persisting.
 * SQL injection is already mitigated by prepared statements; this layer focuses
 * on stripping dangerous control characters and rejecting HTML/code in Markdown.
 */

/** Remove null bytes and disallowed control characters; preserve tab/newline. */
function sanitize_text_field(string $value): string
{
    $value = str_replace("\0", '', $value);
    $cleaned = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);

    return $cleaned ?? $value;
}

function sanitize_optional_text(mixed $value): ?string
{
    if ($value === null) {
        return null;
    }

    $trimmed = trim(sanitize_text_field((string) $value));

    return $trimmed === '' ? null : $trimmed;
}

/**
 * Returns a field-level error message when Markdown violates CMS policy, or null
 * when the content is acceptable.
 */
function validate_markdown_content(string $content, bool $required): ?string
{
    if ($required && trim($content) === '') {
        return 'Content is required.';
    }

    if ($content === '') {
        return null;
    }

    if (str_contains($content, "\0")) {
        return 'Content contains invalid characters.';
    }

    if (preg_match('/<\s*\/?\s*[a-zA-Z!][^>]*>/', $content) === 1) {
        return 'HTML is not allowed in content. Use Markdown formatting only.';
    }

    if (preg_match('/```/', $content) === 1 || preg_match('/^~~~\s/m', $content) === 1) {
        return 'Code blocks are not allowed in content.';
    }

    if (preg_match('/(?<!`)`[^`\n]+`(?!`)/', $content) === 1) {
        return 'Inline code is not allowed in content.';
    }

    if (preg_match('/(?:javascript|vbscript|data)\s*:/i', $content) === 1) {
        return 'Unsafe link schemes are not allowed in content.';
    }

    if (preg_match('/\bon[a-z]+\s*=/i', $content) === 1) {
        return 'Inline event handlers are not allowed in content.';
    }

    return null;
}

/** Validate http(s) URLs for LinkedIn and external links stored in the CMS. */
function validate_http_url(mixed $value, bool $required = false): ?string
{
    if ($value === null || trim((string) $value) === '') {
        return $required ? 'URL is required.' : null;
    }

    $url = sanitize_text_field(trim((string) $value));

    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return 'Enter a valid URL.';
    }

    if (strlen($url) > 512) {
        return 'URL must be 512 characters or fewer.';
    }

    $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
    if (!in_array($scheme, ['http', 'https'], true)) {
        return 'URL must use http or https.';
    }

    return null;
}

/** Validate email addresses stored in the CMS. */
function validate_email_address(mixed $value, bool $required = false): ?string
{
    if ($value === null || trim((string) $value) === '') {
        return $required ? 'Email is required.' : null;
    }

    $email = sanitize_text_field(trim((string) $value));

    if (mb_strlen($email) > 255) {
        return 'Email must be 255 characters or fewer.';
    }

    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        return 'Enter a valid email address.';
    }

    return null;
}

/** Root-relative image paths served from the committed assets folder. */
function validate_image_src_path(mixed $value, bool $required = false): ?string
{
    if ($value === null || trim((string) $value) === '') {
        return $required ? 'Image path is required.' : null;
    }

    $path = sanitize_text_field(trim((string) $value));

    if (!str_starts_with($path, '/images/')) {
        return 'Image path must start with /images/.';
    }

    if (strlen($path) > 512) {
        return 'Image path must be 512 characters or fewer.';
    }

    if (preg_match('/[\x00-\x1F\x7F<>"]/', $path) === 1) {
        return 'Image path contains invalid characters.';
    }

    return null;
}

/** Reject text fields that still contain disallowed control characters. */
function validate_clean_text_field(string $value, string $fieldLabel, int $maxLength, bool $required): ?string
{
    $sanitized = sanitize_text_field($value);
    if ($sanitized !== $value) {
        return $fieldLabel . ' contains invalid characters.';
    }

    $trimmed = trim($sanitized);
    if ($required && $trimmed === '') {
        return $fieldLabel . ' is required.';
    }

    if ($trimmed !== '' && mb_strlen($trimmed) > $maxLength) {
        return $fieldLabel . ' must be ' . $maxLength . ' characters or fewer.';
    }

    return null;
}

/** Trim and strip control characters from a scalar CMS text field before storage. */
function prepare_stored_text(mixed $value): string
{
    return trim(sanitize_text_field((string) $value));
}

/** Strip disallowed control characters from Markdown before storage. */
function prepare_stored_markdown(mixed $value): string
{
    return sanitize_text_field((string) $value);
}
