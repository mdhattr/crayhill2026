/** Fixed site-page slugs provisioned in the database and editable in the CMS. */
export const SITE_PAGE_SLUG = {
  legalNotice: 'legal-notice-and-disclosures',
  privacyPolicy: 'privacy-policy',
} as const

export type SitePageSlug = (typeof SITE_PAGE_SLUG)[keyof typeof SITE_PAGE_SLUG]

const ALLOWED = new Set<string>(Object.values(SITE_PAGE_SLUG))

export function isSitePageSlug(value: string): value is SitePageSlug {
  return ALLOWED.has(value)
}

export const SITE_PAGE_LABELS: Record<SitePageSlug, string> = {
  [SITE_PAGE_SLUG.legalNotice]: 'Legal notice & disclosures',
  [SITE_PAGE_SLUG.privacyPolicy]: 'Privacy policy',
}
