<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/team_members.php';

/**
 * GET /api/v1/team?roster=<roster>           -> published roster grid items
 * GET /api/v1/team?roster=<roster>&slug=<x>  -> one published bio
 *
 * roster: leadership | senior-investment-professionals
 *
 * List item: { slug, name, title, imageSrc }
 * Bio item:  { slug, name, fullTitle, imageSrc, email, linkedinUrl, content,
 *              rosterPath, roster }
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_error('METHOD_NOT_ALLOWED', 'Only GET is supported.', 405);
}

$roster = trim((string) ($_GET['roster'] ?? ''));
if ($roster === '' || !team_is_valid_roster($roster)) {
    respond_error('VALIDATION_ERROR', 'A valid roster query parameter is required.', 422, [
        'roster' => 'Roster must be leadership or senior-investment-professionals.',
    ]);
}

$slug = trim((string) ($_GET['slug'] ?? ''));

try {
    $pdo = db();

    if ($slug !== '') {
        $stmt = $pdo->prepare(
            'SELECT slug, name, full_title, image_src, email, linkedin_url, content, roster
             FROM team_members
             WHERE roster = :roster
               AND slug = :slug
               AND status = :status
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute([
            ':roster' => $roster,
            ':slug' => $slug,
            ':status' => 'published',
        ]);
        $row = $stmt->fetch();

        if ($row === false) {
            respond_error('NOT_FOUND', 'Team member not found.', 404);
        }

        respond_ok(team_bio_item($row));
    }

    $stmt = $pdo->prepare(
        'SELECT slug, name, card_title, image_src
         FROM team_members
         WHERE roster = :roster
           AND status = :status
           AND deleted_at IS NULL
         ORDER BY sort_order ASC, id ASC'
    );
    $stmt->execute([
        ':roster' => $roster,
        ':status' => 'published',
    ]);
    $rows = $stmt->fetchAll();
    $items = array_map('team_list_item', $rows);

    respond_ok($items, ['count' => count($items)]);
} catch (Throwable $e) {
    error_log('[team] request failed: ' . $e->getMessage());
    respond_error('INTERNAL_ERROR', 'Unable to load team members at this time.', 500);
}
