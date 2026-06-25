import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiPatch } from '@/api/client'
import type {
  AdminSitePage,
  AdminSitePageListItem,
  AdminSitePageUpdatePayload,
} from '@/api/types/admin-site-page'
import type { SitePageSlug } from '@/lib/site-page-slugs'

const LIST_KEY = ['admin', 'site-pages', 'list'] as const

function pageKey(slug: SitePageSlug) {
  return ['admin', 'site-pages', 'page', slug] as const
}

async function fetchAdminSitePageList(): Promise<AdminSitePageListItem[]> {
  const { data } = await apiFetch<AdminSitePageListItem[]>('/admin/pages')
  return data
}

async function fetchAdminSitePage(slug: SitePageSlug): Promise<AdminSitePage> {
  const { data } = await apiFetch<AdminSitePage>('/admin/pages', { slug })
  return data
}

async function updateAdminSitePage(
  payload: AdminSitePageUpdatePayload,
): Promise<AdminSitePage> {
  const { data } = await apiPatch<AdminSitePage>('/admin/pages', payload)
  return data
}

export function useAdminSitePageList() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: fetchAdminSitePageList,
  })
}

export function useAdminSitePage(slug: SitePageSlug | null) {
  return useQuery({
    queryKey: slug ? pageKey(slug) : ['admin', 'site-pages', 'page', 'none'],
    queryFn: () => fetchAdminSitePage(slug as SitePageSlug),
    enabled: slug !== null,
  })
}

export function useUpdateAdminSitePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminSitePage,
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.setQueryData(
        pageKey(page.slug as SitePageSlug),
        page,
      )
      queryClient.invalidateQueries({
        queryKey: ['site-page', page.slug],
      })
    },
  })
}
