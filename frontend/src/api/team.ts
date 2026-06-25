import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { TeamBio, TeamListItem, TeamRoster } from '@/api/types/team'

export const teamKeys = {
  all: ['team'] as const,
  list: (roster: TeamRoster) => [...teamKeys.all, 'list', roster] as const,
  bio: (roster: TeamRoster, slug: string) =>
    [...teamKeys.all, 'bio', roster, slug] as const,
}

export async function fetchTeamList(roster: TeamRoster): Promise<TeamListItem[]> {
  const { data } = await apiFetch<TeamListItem[]>('/team', { roster })
  return data
}

export async function fetchTeamBio(
  roster: TeamRoster,
  slug: string,
): Promise<TeamBio> {
  const { data } = await apiFetch<TeamBio>('/team', { roster, slug })
  return data
}

/** Published roster grid for Leadership or Senior Investment Professionals. */
export function useTeamList(roster: TeamRoster) {
  return useQuery({
    queryKey: teamKeys.list(roster),
    queryFn: () => fetchTeamList(roster),
  })
}

/** Published bio detail for a roster + slug pair. */
export function useTeamBio(roster: TeamRoster | null, slug: string) {
  return useQuery({
    queryKey:
      roster !== null
        ? teamKeys.bio(roster, slug)
        : ['team', 'bio', 'none', slug],
    queryFn: () => fetchTeamBio(roster as TeamRoster, slug),
    enabled: roster !== null && slug !== '',
  })
}
