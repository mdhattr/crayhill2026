import { Link } from 'react-router-dom'
import { useAdminLogout, useAdminSession } from '@/api/admin'

/**
 * CMS top bar — mirrors the public site header's paper-alt background and
 * logo treatment without the marketing flyout nav. Right cluster: link back
 * to the public site, signed-in username, and sign out.
 */
export function AdminTopNav() {
  const { data: session } = useAdminSession()
  const logout = useAdminLogout()
  const isAuthenticated = session?.authenticated === true

  return (
    <header className="shrink-0 border-b border-rule-soft bg-paper-alt">
      <div className="flex items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:py-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" aria-label="Crayhill Capital Management — public site">
            <img
              src="/crayhill-r-logo-svg/crayhill-r-logo-color.svg"
              alt=""
              width={175}
              className="block h-auto w-[120px] sm:w-[155px] lg:w-[175px]"
            />
          </Link>
          <span className="hidden text-body-3 text-muted sm:inline">
            Content management
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <a
            href="/"
            className={
              'text-body-2 text-muted-soft ' +
              'hover:text-ink hover:underline ' +
              'focus-visible:text-ink focus-visible:underline focus-visible:outline-none'
            }
          >
            View site
          </a>

          {isAuthenticated ? (
            <>
              <span className="hidden text-body-2 text-ink md:inline">
                {session.username}
              </span>
              <button
                type="button"
                onClick={() => void logout.mutateAsync()}
                disabled={logout.isPending}
                className={
                  'text-body-2 text-accent ' +
                  'hover:text-accent-strong hover:underline ' +
                  'focus-visible:underline focus-visible:outline-none ' +
                  'disabled:cursor-not-allowed disabled:opacity-60'
                }
              >
                {logout.isPending ? 'Signing out…' : 'Sign out'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
