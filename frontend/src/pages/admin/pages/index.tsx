import { Link } from 'react-router-dom'
import { useAdminSitePageList } from '@/api/admin-site-page'
import { ApiError } from '@/api/client'
import { PageHead } from '@/components/PageHead'
import { SITE_PAGE_LABELS, type SitePageSlug } from '@/lib/site-page-slugs'

/** CMS index for fixed site pages (legal copy, etc.). */
export default function AdminPagesIndex() {
  const { data: pages, isPending, isError, error } = useAdminSitePageList()

  return (
    <>
      <PageHead title="Page copy" description="Edit static site pages." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-paper-deep">Page copy</h1>
          <p className="mt-4 max-w-2xl text-body-1 text-ink">
            Edit fixed-route pages. Each page is provisioned in the database; use
            the editors below to update copy without a code deploy.
          </p>

          {isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading pages…
            </p>
          ) : null}

          {isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load pages.'}
            </p>
          ) : null}

          {!isPending && !isError && pages && pages.length > 0 ? (
            <div className="mt-element overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">Static site pages</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Page
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Status
                    </th>
                    <th scope="col" className="py-3 text-body-3 text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b border-rule">
                      <td className="py-4 pr-6 align-top">
                        <p className="text-body-2 text-ink">
                          {SITE_PAGE_LABELS[page.slug as SitePageSlug] ??
                            page.title}
                        </p>
                        <p className="mt-1 text-body-3 text-muted">{page.slug}</p>
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 capitalize text-ink">
                        {page.status}
                      </td>
                      <td className="py-4 align-top">
                        <Link
                          to={`/admin/pages/${page.slug}/edit`}
                          className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
