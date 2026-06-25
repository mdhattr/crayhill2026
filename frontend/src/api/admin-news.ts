import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiDelete,
  apiFetch,
  apiPatch,
  apiPost,
} from '@/api/client'
import type {
  AdminNewsArticle,
  AdminNewsDeleteResult,
  AdminNewsListItem,
  AdminNewsUpdatePayload,
  AdminNewsWritePayload,
} from '@/api/types/admin-news'

const LIST_KEY = ['admin', 'news', 'list'] as const

function articleKey(id: number) {
  return ['admin', 'news', 'article', id] as const
}

async function fetchAdminNewsList(): Promise<AdminNewsListItem[]> {
  const { data } = await apiFetch<AdminNewsListItem[]>('/admin/news')
  return data
}

async function fetchAdminNewsArticle(id: number): Promise<AdminNewsArticle> {
  const { data } = await apiFetch<AdminNewsArticle>('/admin/news', { id })
  return data
}

async function createAdminNewsPost(
  payload: AdminNewsWritePayload,
): Promise<AdminNewsArticle> {
  const { data } = await apiPost<AdminNewsArticle>('/admin/news', payload)
  return data
}

async function updateAdminNewsPost(
  payload: AdminNewsUpdatePayload,
): Promise<AdminNewsArticle> {
  const { data } = await apiPatch<AdminNewsArticle>('/admin/news', payload)
  return data
}

async function deleteAdminNewsPost(id: number): Promise<AdminNewsDeleteResult> {
  const { data } = await apiDelete<AdminNewsDeleteResult>('/admin/news', { id })
  return data
}

export function useAdminNewsList() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: fetchAdminNewsList,
  })
}

export function useAdminNewsArticle(id: number | null) {
  return useQuery({
    queryKey: id !== null ? articleKey(id) : ['admin', 'news', 'article', 'none'],
    queryFn: () => fetchAdminNewsArticle(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useCreateAdminNewsPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdminNewsPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useUpdateAdminNewsPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminNewsPost,
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.setQueryData(articleKey(article.id), article)
    },
  })
}

export function useDeleteAdminNewsPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminNewsPost,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.removeQueries({ queryKey: articleKey(id) })
    },
  })
}
