import type { TeamRoster } from '@/api/types/team'

export const TEAM_ROSTERS = [
  'leadership',
  'senior-investment-professionals',
] as const satisfies ReadonlyArray<TeamRoster>

export function isTeamRoster(value: string): value is TeamRoster {
  return (TEAM_ROSTERS as readonly string[]).includes(value)
}

export const ROSTER_LABELS: Record<TeamRoster, string> = {
  leadership: 'Leadership',
  'senior-investment-professionals': 'Senior investment professionals',
}

export const ROSTER_PUBLIC_PREFIX: Record<TeamRoster, string> = {
  leadership: '/team/leadership',
  'senior-investment-professionals': '/team/senior-investment-professionals',
}

export const ROSTER_ADMIN_PREFIX = '/admin/team'

export function rosterAdminPath(roster: TeamRoster): string {
  return `${ROSTER_ADMIN_PREFIX}/${roster}`
}
