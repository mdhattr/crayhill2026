import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { NewsArticle, NewsListItem } from '@/api/types/news'

/**
 * TanStack Query hooks for the News & Insights content domain.
 *
 * Query keys are namespaced under `['news', ...]` so the whole domain can be
 * invalidated at once when (eventually) an admin dashboard edits a post.
 */
export const newsKeys = {
  all: ['news'] as const,
  list: () => [...newsKeys.all, 'list'] as const,
  detail: (slug: string) => [...newsKeys.all, 'detail', slug] as const,
}

export async function fetchNewsList(): Promise<NewsListItem[]> {
  const { data } = await apiFetch<NewsListItem[]>('/news')
  return data
}

export async function fetchNewsArticle(slug: string): Promise<NewsArticle> {
  const { data } = await apiFetch<NewsArticle>('/news', { slug })
  return data
}

/** All published posts, newest first. Backs the News & Insights index page. */
export function useNewsList() {
  return useQuery({
    queryKey: newsKeys.list(),
    queryFn: fetchNewsList,
  })
}

/** A single published post by slug. `undefined` slug disables the query. */
export function useNewsArticle(slug: string | undefined) {
  return useQuery({
    queryKey: newsKeys.detail(slug ?? ''),
    queryFn: () => fetchNewsArticle(slug as string),
    enabled: Boolean(slug),
  })
}
