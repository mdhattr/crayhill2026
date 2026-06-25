import { SitePageView } from '@/components/SitePageView'
import { SITE_PAGE_SLUG } from '@/lib/site-page-slugs'

/** Privacy Policy — content from `site_pages` via the API. */
export default function PrivacyPolicyPage() {
  return <SitePageView slug={SITE_PAGE_SLUG.privacyPolicy} />
}
