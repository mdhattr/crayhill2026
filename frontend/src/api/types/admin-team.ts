/** Admin Team API contract. Mirrors api/v1/admin/team.php. */

import type { TeamRoster } from '@/api/types/team'

export type TeamMemberStatus = 'draft' | 'published'

/** Row in a roster CMS list. Returned by GET /api/v1/admin/team?roster=<roster>. */
export type AdminTeamListItem = {
  id: number
  slug: string
  name: string
  card_title: string
  full_title: string
  image_src: string
  email: string | null
  linkedin_url: string | null
  roster: TeamRoster
  sort_order: number
  status: TeamMemberStatus
  updated_at: string
}

/** Full member for editing. Returned by GET /api/v1/admin/team?id=<id>. */
export type AdminTeamMember = AdminTeamListItem & {
  content: string
}

export type AdminTeamWritePayload = {
  slug: string
  name: string
  card_title: string
  full_title: string
  image_src: string
  email: string | null
  linkedin_url: string | null
  roster: TeamRoster
  sort_order: number
  status: TeamMemberStatus
  content: string
}

export type AdminTeamUpdatePayload = Partial<AdminTeamWritePayload> & {
  id: number
}

export type AdminTeamDeleteResult = {
  deleted: true
  id: number
}
