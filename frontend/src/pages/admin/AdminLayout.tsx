import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminSession } from '@/api/admin'
import { AdminSideNav } from '@/pages/admin/AdminSideNav'
import { AdminTopNav } from '@/pages/admin/AdminTopNav'

/**
 * CMS shell: top bar (site logo + account actions) and, when signed in, a
 * full-height left nav for inner tools. The login screen at `/admin` renders
 * without the sidebar; all other `/admin/*` routes redirect here until the
 * session is valid.
 */
export default function AdminLayout() {
  const { data: session, isPending } = useAdminSession()
  const { pathname } = useLocation()

  const isAuthenticated = session?.authenticated === true
  const isLoginRoute = pathname === '/admin'

  if (!isPending && !isAuthenticated && !isLoginRoute) {
    return <Navigate to="/admin" replace />
  }

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
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
