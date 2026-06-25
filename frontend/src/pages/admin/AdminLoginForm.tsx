import { useState, type FormEvent } from 'react'
import { PageHead } from '@/components/PageHead'
import { ApiError } from '@/api/client'
import { useAdminLogin, useAdminSession } from '@/api/admin'
import { adminMeta } from '@/pages/admin/meta'

/**
 * Sign-in form shown at `/admin` when no CMS session exists. Renders inside
 * AdminLayout without the left sidebar.
 */
export function AdminLoginForm() {
  const { data: session } = useAdminSession()
  const login = useAdminLogin()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  if (session?.authenticated) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    try {
      await login.mutateAsync({ username, password })
      setPassword('')
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
        return
      }
      setFormError('Sign in failed. Try again.')
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-paper-alt px-6 py-module sm:px-10">
      <div className="w-full max-w-md">
        <PageHead title={adminMeta.title} description={adminMeta.description} />
        <h1 className="text-center text-paper-deep">Sign in</h1>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-10 rounded-image border border-rule-soft bg-paper px-8 py-10"
          noValidate
        >
          <div>
            <label htmlFor="cms-username" className="text-body-2 text-ink">
              Username
            </label>
            <input
              id="cms-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={
                'mt-2 block w-full border border-rule-soft bg-paper ' +
                'px-4 py-3 text-body-1 text-ink ' +
                'focus-visible:border-accent focus-visible:outline-none'
              }
            />
          </div>

          <div className="mt-6">
            <label htmlFor="cms-password" className="text-body-2 text-ink">
              Password
            </label>
            <input
              id="cms-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={
                'mt-2 block w-full border border-rule-soft bg-paper ' +
                'px-4 py-3 text-body-1 text-ink ' +
                'focus-visible:border-accent focus-visible:outline-none'
              }
            />
          </div>

          {formError ? (
            <p className="mt-6 text-body-2 text-accent-navy" role="alert">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={login.isPending}
            className={
              'mt-10 inline-flex w-full items-center justify-center ' +
              'rounded-sm bg-accent-green px-6 py-3 ' +
              'text-body-2 font-semibold text-white ' +
              'transition-opacity duration-150 hover:opacity-90 ' +
              'focus-visible:outline focus-visible:outline-2 ' +
              'focus-visible:outline-offset-2 focus-visible:outline-accent-navy ' +
              'disabled:cursor-not-allowed disabled:opacity-60'
            }
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
