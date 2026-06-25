import { PageHead } from '@/components/PageHead'
import { useAdminSession } from '@/api/admin'
import { AdminLoginForm } from '@/pages/admin/AdminLoginForm'

/**
 * CMS dashboard home (`/admin`). Shows the sign-in form when logged out;
 * otherwise a simple landing panel.
 */
export default function AdminDashboardPage() {
  const { data: session } = useAdminSession()

  if (!session?.authenticated) {
    return <AdminLoginForm />
  }

  return (
    <>
      <PageHead title="Dashboard" description="Crayhill content management." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-paper-deep">Dashboard</h1>
          <p className="mt-6 max-w-prose text-body-1 text-ink">
            Welcome back,{' '}
            <span className="font-semibold">{session.username}</span>. Use the
            tools in the left navigation to manage site content.
          </p>
        </div>
      </main>
    </>
  )
}
