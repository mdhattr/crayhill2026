/**
 * Typed fetch wrapper for the PHP API. This is the ONLY place the app talks
 * to the backend — pages and components go through the typed query hooks in
 * the sibling modules, never `fetch()` directly (see 00-project.mdc).
 *
 * Every endpoint returns the standard envelope:
 *   success: { data: ...,  error: null,            meta: ... }
 *   failure: { data: null, error: { code, message }, meta: null }
 *
 * `apiFetch` unwraps `data` on success and throws `ApiError` on any failure
 * (transport error, non-2xx status, or an `error` envelope), so callers and
 * TanStack Query only ever see clean data or a typed error.
 */

// Relative by default: in dev the Vite server proxies `/api` to the local PHP
// server; in production Apache serves `/api` on the same origin. Override with
// a full origin only when the API lives on a different host.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

/** Fail fast when the API is unreachable (e.g. PHP not wired on EC2). */
const API_TIMEOUT_MS = 15_000

export type ApiErrorBody = {
  code: string
  message: string
  fields?: Record<string, string>
}

export type ApiEnvelope<T> = {
  data: T | null
  error: ApiErrorBody | null
  meta: Record<string, unknown> | null
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly fields?: Record<string, string>

  constructor(
    message: string,
    code: string,
    status: number,
    fields?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.fields = fields
  }
}

type QueryParams = Record<string, string | number | undefined>

type ApiRequestInit = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

async function apiRequest<T>(
  path: string,
  params?: QueryParams,
  init: ApiRequestInit = {},
): Promise<{ data: T; meta: ApiEnvelope<T>['meta'] }> {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const method = init.method ?? 'GET'
  const headers: Record<string, string> = { Accept: 'application/json' }
  const fetchInit: RequestInit = {
    method,
    headers,
    // CMS session cookie (and any future cookie-auth endpoints).
    credentials: 'include',
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }

  if (init.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    fetchInit.body = JSON.stringify(init.body)
  }

  let res: Response
  try {
    res = await fetch(url, fetchInit)
  } catch (cause) {
    const timedOut =
      cause instanceof DOMException && cause.name === 'TimeoutError'
    throw new ApiError(
      timedOut
        ? 'The server did not respond in time. The API may not be running on this host.'
        : 'Network request failed. Check your connection and try again.',
      timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
      0,
      cause instanceof Error ? { detail: cause.message } : undefined,
    )
  }

  let body: ApiEnvelope<T> | null = null
  try {
    body = (await res.json()) as ApiEnvelope<T>
  } catch {
    // Non-JSON response (e.g. an HTML error page). Fall through to the
    // status-based error below.
  }

  if (!res.ok || !body || body.error) {
    throw new ApiError(
      body?.error?.message ?? `Request failed with status ${res.status}.`,
      body?.error?.code ?? 'HTTP_ERROR',
      res.status,
      body?.error?.fields,
    )
  }

  return { data: body.data as T, meta: body.meta }
}

export async function apiFetch<T>(
  path: string,
  params?: QueryParams,
): Promise<{ data: T; meta: ApiEnvelope<T>['meta'] }> {
  return apiRequest<T>(path, params)
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ data: T; meta: ApiEnvelope<T>['meta'] }> {
  return apiRequest<T>(path, undefined, { method: 'POST', body })
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
): Promise<{ data: T; meta: ApiEnvelope<T>['meta'] }> {
  return apiRequest<T>(path, undefined, { method: 'PATCH', body })
}

export async function apiDelete<T>(
  path: string,
  params?: QueryParams,
): Promise<{ data: T; meta: ApiEnvelope<T>['meta'] }> {
  return apiRequest<T>(path, params, { method: 'DELETE' })
}
