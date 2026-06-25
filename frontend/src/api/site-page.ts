import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { SitePage } from '@/api/types/site-page'
import type { SitePageSlug } from '@/lib/site-page-slugs'

function pageKey(slug: SitePageSlug) {
  return ['site-page', slug] as const
}

async function fetchSitePage(slug: SitePageSlug): Promise<SitePage> {
  const { data } = await apiFetch<SitePage>('/pages', { slug })
  return data
}

export function useSitePage(slug: SitePageSlug) {
  return useQuery({
    queryKey: pageKey(slug),
    queryFn: () => fetchSitePage(slug),
    staleTime: 5 * 60 * 1000,
  })
}
