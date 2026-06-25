import { SitePageView } from '@/components/SitePageView'
import { SITE_PAGE_SLUG } from '@/lib/site-page-slugs'

/** Legal Notice & Disclosures — content from `site_pages` via the API. */
export default function LegalNoticeAndDisclosuresPage() {
  return <SitePageView slug={SITE_PAGE_SLUG.legalNotice} />
}
