import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiDelete,
  apiFetch,
  apiPatch,
  apiPost,
} from '@/api/client'
import type {
  AdminTeamDeleteResult,
  AdminTeamListItem,
  AdminTeamMember,
  AdminTeamUpdatePayload,
  AdminTeamWritePayload,
} from '@/api/types/admin-team'
import { teamKeys } from '@/api/team'
import type { TeamRoster } from '@/api/types/team'

function listKey(roster: TeamRoster) {
  return ['admin', 'team', 'list', roster] as const
}

function memberKey(id: number) {
  return ['admin', 'team', 'member', id] as const
}

async function fetchAdminTeamList(
  roster: TeamRoster,
): Promise<AdminTeamListItem[]> {
  const { data } = await apiFetch<AdminTeamListItem[]>('/admin/team', { roster })
  return data
}

async function fetchAdminTeamMember(id: number): Promise<AdminTeamMember> {
  const { data } = await apiFetch<AdminTeamMember>('/admin/team', { id })
  return data
}

async function createAdminTeamMember(
  payload: AdminTeamWritePayload,
): Promise<AdminTeamMember> {
  const { data } = await apiPost<AdminTeamMember>('/admin/team', payload)
  return data
}

async function updateAdminTeamMember(
  payload: AdminTeamUpdatePayload,
): Promise<AdminTeamMember> {
  const { data } = await apiPatch<AdminTeamMember>('/admin/team', payload)
  return data
}

async function deleteAdminTeamMember(
  id: number,
): Promise<AdminTeamDeleteResult> {
  const { data } = await apiDelete<AdminTeamDeleteResult>('/admin/team', { id })
  return data
}

export function useAdminTeamList(roster: TeamRoster) {
  return useQuery({
    queryKey: listKey(roster),
    queryFn: () => fetchAdminTeamList(roster),
  })
}

export function useAdminTeamMember(id: number | null) {
  return useQuery({
    queryKey:
      id !== null ? memberKey(id) : ['admin', 'team', 'member', 'none'],
    queryFn: () => fetchAdminTeamMember(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useCreateAdminTeamMember(roster: TeamRoster) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdminTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey(roster) })
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
    },
  })
}

export function useUpdateAdminTeamMember(roster: TeamRoster) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminTeamMember,
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: listKey(roster) })
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
      queryClient.setQueryData(memberKey(member.id), member)
      if (member.roster !== roster) {
        queryClient.invalidateQueries({ queryKey: listKey(member.roster) })
      }
    },
  })
}

export function useDeleteAdminTeamMember(roster: TeamRoster) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminTeamMember,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: listKey(roster) })
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
      queryClient.removeQueries({ queryKey: memberKey(id) })
    },
  })
}
