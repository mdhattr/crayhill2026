import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { CareerPosting } from '@/api/types/careers'

/**
 * TanStack Query hooks for the Careers content domain.
 *
 * Query keys are namespaced under `['careers', ...]` so the whole domain can
 * be invalidated at once when (eventually) an admin dashboard edits a posting.
 */
export const careersKeys = {
  all: ['careers'] as const,
  list: () => [...careersKeys.all, 'list'] as const,
}

export async function fetchCareersList(): Promise<CareerPosting[]> {
  const { data } = await apiFetch<CareerPosting[]>('/careers')
  return data
}

/** All published openings, in display order. Backs the Careers page. */
export function useCareersList() {
  return useQuery({
    queryKey: careersKeys.list(),
    queryFn: fetchCareersList,
  })
}
