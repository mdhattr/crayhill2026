/**
 * News & Insights API contract. Mirrors the response shape of
 * GET /api/v1/news (see api/v1/news.php). Keep this in sync with the PHP
 * endpoint — change the type first, then let the type checker find every
 * consumer (00-project.mdc).
 */

/** A row in the News & Insights index. Returned by GET /api/v1/news. */
export type NewsListItem = {
  id: number
  slug: string
  title: string
  author: string
  /** Published date as an ISO YYYY-MM-DD string. */
  date: string
  /** Hero image path (root-relative, e.g. /images/foo.jpg), or null if unset. */
  image: string | null
  /** Plain-text summary derived server-side from the Markdown body. */
  excerpt: string
}

/** A single article with full body. Returned by GET /api/v1/news?slug=<x>. */
export type NewsArticle = {
  id: number
  slug: string
  title: string
  author: string
  /** Published date as an ISO YYYY-MM-DD string. */
  date: string
  image: string | null
  /** Article body as Markdown. */
  content: string
}
