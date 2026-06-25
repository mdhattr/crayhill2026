import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { TopNav } from '@/components/TopNav'

/**
 * Reset scroll to the top of the document whenever the route's path
 * changes. Without this, a client-side navigation keeps the previous
 * page's scroll position, so following a link from halfway down one page
 * can land the visitor halfway down the next.
 *
 * Keyed on `pathname` only (not `hash`/`search`), so an in-page anchor
 * jump (`/page#section`) isn't overridden. Uses an instant jump rather
 * than a smooth scroll — a page change should feel like a fresh load, not
 * an animated glide.
 */
function useScrollToTopOnNavigate() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
}

/**
 * Top-level shell shared by every route. Renders the persistent site nav
 * above each route's page content and the global footer below it. The
 * skip-to-content link will land here when designed. Keep this file
 * tight — page-specific chrome belongs in the pages themselves.
 */
export function RootLayout() {
  useScrollToTopOnNavigate()

  return (
    <>
      <TopNav />
      <Outlet />
      <Footer />
    </>
  )
}
