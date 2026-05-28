import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { TopNav } from '@/components/TopNav'

/**
 * Top-level shell shared by every route. Renders the persistent site nav
 * above each route's page content and the global footer below it. The
 * skip-to-content link will land here when designed. Keep this file
 * tight — page-specific chrome belongs in the pages themselves.
 */
export function RootLayout() {
  return (
    <>
      <TopNav />
      <Outlet />
      <Footer />
    </>
  )
}
