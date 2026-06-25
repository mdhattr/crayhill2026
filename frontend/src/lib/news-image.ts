/**
 * Resolve the hero image for a news post.
 *
 * Interim logic until article images move to S3 and the `news.image` column
 * is populated (per-post) via the admin dashboard. Mirrors the designer's
 * article/image pairing reference:
 *
 *   1. If the post already carries an `image` (the future S3/DB path), use it.
 *   2. Posts older than two years don't get an image — the card shows a
 *      "No image" placeholder instead (designer policy).
 *   3. Otherwise the image is paired by published month: a post dated
 *      YYYY-MM-DD maps to `/images/article-YYYY-MM.jpg`.
 *
 * Returns `null` when there is no image (older than two years, or no curated
 * file exists yet for that month) so callers can render the "No image" state.
 */

// Curated article images currently in assets/images, keyed by published month
// (YYYY-MM). This guard prevents a broken <img> if a recent post has no
// matching file yet. Interim: removed when images move to S3 + the DB column.
const AVAILABLE_ARTICLE_IMAGES: ReadonlySet<string> = new Set([
  '2024-06',
  '2024-07',
  '2024-12',
  '2025-02',
  '2025-04',
  '2025-05',
  '2025-08',
  '2025-12',
  '2026-01',
])

/**
 * Two-year cutoff, measured in whole months so a post dated exactly 24 months
 * ago still counts as "within two years" (matches the designer's pairing
 * reference, where the 24-month-old article still has an image).
 */
function isOlderThanTwoYears(date: string, now: Date): boolean {
  const [year, month] = date.split('-').map(Number)
  if (!year || !month) return false
  const monthsAgo = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month)
  return monthsAgo > 24
}

export function resolveNewsImage(
  image: string | null,
  date: string,
  now: Date = new Date(),
): string | null {
  if (image) return image
  if (isOlderThanTwoYears(date, now)) return null
  const month = date.slice(0, 7)
  return AVAILABLE_ARTICLE_IMAGES.has(month) ? `/images/article-${month}.jpg` : null
}
