/** Public site page API contract. Mirrors GET /api/v1/pages?slug=<x>. */

export type SitePage = {
  slug: string
  title: string
  /** Optional line below the headline (e.g. effective date). */
  subtitle: string | null
  meta_description: string
  /** Page body as Markdown (excludes the headline/subtitle). */
  content: string
}
