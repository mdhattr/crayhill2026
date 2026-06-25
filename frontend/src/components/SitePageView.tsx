import { PageHead } from '@/components/PageHead'
import { LegalMarkdownBody } from '@/components/LegalMarkdownBody'
import { useSitePage } from '@/api/site-page'
import { ApiError } from '@/api/client'
import type { SitePageSlug } from '@/lib/site-page-slugs'

type SitePageViewProps = {
  slug: SitePageSlug
}

/**
 * Shared layout for DB-backed static pages (legal notice, privacy policy).
 * Headline and optional subtitle come from the API; body renders as Markdown.
 */
export function SitePageView({ slug }: SitePageViewProps) {
  const { data: page, isPending, isError, error } = useSitePage(slug)

  return (
    <>
      <PageHead
        title={page?.title ?? 'Page'}
        description={page?.meta_description ?? 'Crayhill Capital Management.'}
      />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-4xl">
            {isPending ? (
              <p className="text-muted" role="status">
                Loading&hellip;
              </p>
            ) : null}

            {isError || !page ? (
              <div>
                <h2 className="text-ink">Page unavailable</h2>
                <p className="mt-6 text-muted">
                  {error instanceof ApiError
                    ? error.message
                    : 'This page could not be loaded.'}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-ink">{page.title}</h2>
                {page.subtitle ? (
                  <p className="mt-3 text-body-3 text-ink">{page.subtitle}</p>
                ) : null}
                <LegalMarkdownBody content={page.content} className="mt-10" />
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
