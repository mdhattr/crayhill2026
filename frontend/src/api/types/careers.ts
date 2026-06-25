/**
 * Careers API contract. Mirrors the response shape of GET /api/v1/careers
 * (see api/v1/careers.php). Keep this in sync with the PHP endpoint — change
 * the type first, then let the type checker find every consumer (00-project.mdc).
 */

/** A single open job posting. Returned by GET /api/v1/careers. */
export type CareerPosting = {
  id: number
  slug: string
  title: string
  /** Office location, or null if unspecified. */
  location: string | null
  /** Full posting body as Markdown. */
  content: string
}
