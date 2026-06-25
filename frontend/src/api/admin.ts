import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiPost } from '@/api/client'
import type { AdminLoginPayload, AdminSession } from '@/api/types/admin'

const SESSION_KEY = ['admin', 'session'] as const

async function fetchAdminSession(): Promise<AdminSession> {
  const { data } = await apiFetch<AdminSession>('/admin/session')
  return data
}

async function loginAdmin(payload: AdminLoginPayload): Promise<AdminSession> {
  const { data } = await apiPost<AdminSession>('/admin/login', payload)
  return data
}

async function logoutAdmin(): Promise<AdminSession> {
  const { data } = await apiPost<AdminSession>('/admin/logout', {})
  return data
}

export function useAdminSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchAdminSession,
    staleTime: 0,
  })
}

export function useAdminLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (session) => {
      queryClient.setQueryData(SESSION_KEY, session)
    },
  })
}

export function useAdminLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: (session) => {
      queryClient.setQueryData(SESSION_KEY, session)
    },
  })
}
