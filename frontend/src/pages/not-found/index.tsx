import { Link } from 'react-router-dom'
import { PageHead } from '@/components/PageHead'
import { notFoundMeta } from '@/pages/not-found/meta'

/**
 * Eagerly imported (not lazy) — when a user lands on a bad URL we want the
 * 404 to render immediately without waiting on a network round-trip.
 */
export default function NotFoundPage() {
  return (
    <>
      <PageHead title={notFoundMeta.title} description={notFoundMeta.description} />
      <main className="mx-auto flex min-h-dvh max-w-[var(--measure)] flex-col gap-12 px-6 py-16">
        <header className="border-b border-rule pb-4">
          <p className="text-sm uppercase tracking-[0.08em] text-muted">
            Crayhill Capital Management
          </p>
        </header>

        <section className="flex-1">
          <h1 className="mb-6">Page not found.</h1>
          <p>
            The page you requested does not exist or has been moved.{' '}
            <Link to="/">Return to the homepage</Link>.
          </p>
        </section>

        <footer className="border-t border-rule pt-4 text-sm text-muted">
          <p>Internal preview &middot; not for distribution.</p>
        </footer>
      </main>
    </>
  )
}
