#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * Load team member seed data into crayhill.team_members.
 *
 * Run AFTER migration 2026_06_25_006_create_team_members.sql:
 *
 *   php api/seeds/load_team_members.php
 *
 * Idempotent: upserts on unique slug. Does not remove rows missing from the
 * seed file (same contract as careers_seed.sql).
 */

require_once __DIR__ . '/../lib/env.php';
require_once __DIR__ . '/../lib/db.php';

$rows = require __DIR__ . '/team_members_data.php';

if (!is_array($rows) || $rows === []) {
    fwrite(STDERR, "No seed rows found in team_members_data.php\n");
    exit(1);
}

try {
    $pdo = db();

    $stmt = $pdo->prepare(
        'INSERT INTO team_members (
            slug, name, card_title, full_title, image_src, email, linkedin_url,
            roster, sort_order, status, content
         ) VALUES (
            :slug, :name, :card_title, :full_title, :image_src, :email, :linkedin_url,
            :roster, :sort_order, :status, :content
         )
         ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            card_title = VALUES(card_title),
            full_title = VALUES(full_title),
            image_src = VALUES(image_src),
            email = VALUES(email),
            linkedin_url = VALUES(linkedin_url),
            roster = VALUES(roster),
            sort_order = VALUES(sort_order),
            status = VALUES(status),
            content = VALUES(content),
            deleted_at = NULL'
    );

    $count = 0;
    foreach ($rows as $row) {
        $stmt->execute([
            ':slug' => $row['slug'],
            ':name' => $row['name'],
            ':card_title' => $row['card_title'],
            ':full_title' => $row['full_title'],
            ':image_src' => $row['image_src'],
            ':email' => $row['email'] ?? null,
            ':linkedin_url' => $row['linkedin_url'] ?? null,
            ':roster' => $row['roster'],
            ':sort_order' => (int) $row['sort_order'],
            ':status' => $row['status'],
            ':content' => $row['content'],
        ]);
        $count++;
    }

    fwrite(STDOUT, "Loaded {$count} team member(s).\n");
} catch (Throwable $e) {
    fwrite(STDERR, 'Team seed failed: ' . $e->getMessage() . "\n");
    exit(1);
}
