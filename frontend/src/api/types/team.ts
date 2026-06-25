/** Public Team API contract. Mirrors api/v1/team.php. */

export type TeamRoster = 'leadership' | 'senior-investment-professionals'

/** Roster grid card. Returned by GET /api/v1/team?roster=<roster>. */
export type TeamListItem = {
  slug: string
  name: string
  /** Short title shown on the roster card (H5). */
  title: string
  imageSrc: string
}

/** Bio detail. Returned by GET /api/v1/team?roster=<roster>&slug=<slug>. */
export type TeamBio = {
  slug: string
  name: string
  fullTitle: string
  imageSrc: string
  email: string | null
  linkedinUrl: string | null
  /** Markdown bio body (paragraphs separated by blank lines). */
  content: string
  rosterPath: '/team/leadership' | '/team/senior-investment-professionals'
  roster: TeamRoster
}
