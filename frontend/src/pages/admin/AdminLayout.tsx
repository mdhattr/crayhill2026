import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminSession } from '@/api/admin'
import { ApiError } from '@/api/client'
import { AdminSideNav } from '@/pages/admin/AdminSideNav'
import { AdminTopNav } from '@/pages/admin/AdminTopNav'

/**
 * CMS shell: top bar (site logo + account actions) and, when signed in, a
 * full-height left nav for inner tools. The login screen at `/admin` renders
 * without the sidebar; all other `/admin/*` routes redirect here until the
 * session is valid.
 */
export default function AdminLayout() {
  const { data: session, isPending, isError, error, refetch } = useAdminSession()
  const { pathname } = useLocation()

  const isAuthenticated = session?.authenticated === true
  const isLoginRoute = pathname === '/admin'

  if (!isPending && !isAuthenticated && !isLoginRoute) {
    return <Navigate to="/admin" replace />
  }

  const sessionErrorMessage =
    error instanceof ApiError
      ? error.message
      : 'Unable to reach the admin API.'

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />

      <div className="flex min-h-dvh flex-col bg-paper">
        <AdminTopNav />

        <div className="flex min-h-0 flex-1">
          {isAuthenticated ? <AdminSideNav /> : null}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {isPending ? (
              <p
                className="px-6 py-module text-body-1 text-muted sm:px-10"
                role="status"
              >
                Checking session…
              </p>
            ) : isError && !session ? (
              <div className="px-6 py-module sm:px-10">
                <p className="text-body-1 text-accent-navy" role="alert">
                  {sessionErrorMessage}
                </p>
                <p className="mt-4 max-w-prose text-body-2 text-ink">
                  The CMS needs the PHP API at{' '}
                  <code className="text-body-3">/api/v1/admin/session</code>.
                  On EC2, run{' '}
                  <code className="text-body-3">bash scripts/setup-api-ec2.sh</code>{' '}
                  once if News and Careers also fail to load from the database.
                </p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-6 rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90"
                >
                  Try again
                </button>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
