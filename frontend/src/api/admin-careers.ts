import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiDelete,
  apiFetch,
  apiPatch,
  apiPost,
} from '@/api/client'
import type {
  AdminCareersDeleteResult,
  AdminCareersListItem,
  AdminCareersPageSettings,
  AdminCareersPosting,
  AdminCareersUpdatePayload,
  AdminCareersWritePayload,
} from '@/api/types/admin-careers'
import { careersKeys } from '@/api/careers'

const LIST_KEY = ['admin', 'careers', 'list'] as const
const PAGE_KEY = ['admin', 'careers', 'page'] as const

function postingKey(id: number) {
  return ['admin', 'careers', 'posting', id] as const
}

async function fetchAdminCareersList(): Promise<AdminCareersListItem[]> {
  const { data } = await apiFetch<AdminCareersListItem[]>('/admin/careers')
  return data
}

async function fetchAdminCareersPosting(id: number): Promise<AdminCareersPosting> {
  const { data } = await apiFetch<AdminCareersPosting>('/admin/careers', { id })
  return data
}

async function createAdminCareersPosting(
  payload: AdminCareersWritePayload,
): Promise<AdminCareersPosting> {
  const { data } = await apiPost<AdminCareersPosting>('/admin/careers', payload)
  return data
}

async function updateAdminCareersPosting(
  payload: AdminCareersUpdatePayload,
): Promise<AdminCareersPosting> {
  const { data } = await apiPatch<AdminCareersPosting>('/admin/careers', payload)
  return data
}

async function deleteAdminCareersPosting(
  id: number,
): Promise<AdminCareersDeleteResult> {
  const { data } = await apiDelete<AdminCareersDeleteResult>('/admin/careers', {
    id,
  })
  return data
}

async function fetchAdminCareersPageSettings(): Promise<AdminCareersPageSettings> {
  const { data } = await apiFetch<AdminCareersPageSettings>('/admin/careers-page')
  return data
}

async function updateAdminCareersPageSettings(
  pageActive: boolean,
): Promise<AdminCareersPageSettings> {
  const { data } = await apiPatch<AdminCareersPageSettings>('/admin/careers-page', {
    pageActive,
  })
  return data
}

export function useAdminCareersList() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: fetchAdminCareersList,
  })
}

export function useAdminCareersPosting(id: number | null) {
  return useQuery({
    queryKey:
      id !== null ? postingKey(id) : ['admin', 'careers', 'posting', 'none'],
    queryFn: () => fetchAdminCareersPosting(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useCreateAdminCareersPosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdminCareersPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useUpdateAdminCareersPosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminCareersPosting,
    onSuccess: (posting) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.setQueryData(postingKey(posting.id), posting)
    },
  })
}

export function useDeleteAdminCareersPosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminCareersPosting,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY })
      queryClient.removeQueries({ queryKey: postingKey(id) })
    },
  })
}

export function useAdminCareersPageSettings() {
  return useQuery({
    queryKey: PAGE_KEY,
    queryFn: fetchAdminCareersPageSettings,
  })
}

export function useUpdateAdminCareersPageSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminCareersPageSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(PAGE_KEY, settings)
      queryClient.invalidateQueries({ queryKey: careersKeys.status() })
      queryClient.invalidateQueries({ queryKey: careersKeys.list() })
    },
  })
}
