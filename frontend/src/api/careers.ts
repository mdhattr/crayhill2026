import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { CareerPosting, CareersPageStatus } from '@/api/types/careers'

/**
 * TanStack Query hooks for the Careers content domain.
 *
 * Query keys are namespaced under `['careers', ...]` so the whole domain can
 * be invalidated at once when the admin dashboard edits postings or visibility.
 */
export const careersKeys = {
  all: ['careers'] as const,
  list: () => [...careersKeys.all, 'list'] as const,
  status: () => [...careersKeys.all, 'status'] as const,
}

export async function fetchCareersPageStatus(): Promise<CareersPageStatus> {
  const { data } = await apiFetch<CareersPageStatus>('/careers/status')
  return data
}

export async function fetchCareersList(): Promise<CareerPosting[]> {
  const { data } = await apiFetch<CareerPosting[]>('/careers')
  return data
}

/** Whether the public Careers page and nav links should appear. */
export function useCareersPageStatus() {
  return useQuery({
    queryKey: careersKeys.status(),
    queryFn: fetchCareersPageStatus,
    staleTime: 60_000,
  })
}

/** All published openings, in display order. Backs the Careers page. */
export function useCareersList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: careersKeys.list(),
    queryFn: fetchCareersList,
    enabled: options?.enabled ?? true,
  })
}
