/** CMS session state returned by admin auth endpoints. */
export type AdminSession = {
  authenticated: boolean
  username: string | null
}

export type AdminLoginPayload = {
  username: string
  password: string
}
