import { useNewsList } from '@/api/news'
import { CtaChevron } from '@/components/CtaChevron'
import { PageHead } from '@/components/PageHead'
import { CrayhillInTheNews } from './CrayhillInTheNews'
import { FeaturedStories } from './FeaturedStories'
import { newsAndInsightsMeta } from './meta'

/**
 * News & Insights index.
 *
 * Layout (designer mockup):
 *   1. White module — "News & Insights" H1 (--color-paper-deep), then the
 *      three most recent published posts as featured image cards.
 *   2. Light-gray module — "Crayhill in the News", the remaining published
 *      posts as a compact list with a "View All" expander.
 *
 * Data comes from GET /api/v1/news (published posts only, newest first — the
 * API does the filtering and sorting). One fetch drives both modules: the
 * first three items are featured, the rest fall into the list.
 */

function FeaturedSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading stories"
      className={
        'mx-auto mt-element grid max-w-7xl ' +
        'grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2'
      }
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-rule-soft" />
      <div className="flex flex-col gap-y-12">
        <div className="aspect-[16/9] w-full animate-pulse bg-rule-soft" />
        <div className="aspect-[16/9] w-full animate-pulse bg-rule-soft" />
      </div>
    </div>
  )
}

function NewsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto mt-element max-w-3xl text-center">
      <p className="text-muted">
        We couldn&rsquo;t load the latest stories. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={
          'mt-4 inline-flex items-center gap-1.5 ' +
          'text-body-1 font-semibold text-accent ' +
          'transition-colors duration-150 ' +
          'hover:text-accent-green ' +
          'focus-visible:text-accent-green focus-visible:underline ' +
          'focus-visible:outline-none'
        }
      >
        <CtaChevron />
        Retry
      </button>
    </div>
  )
}

export default function NewsAndInsightsPage() {
  const { data, isPending, isError, refetch } = useNewsList()
  const articles = data ?? []
  const featured = articles.slice(0, 3)
  const rest = articles.slice(3)

  return (
    <>
      <PageHead
        title={newsAndInsightsMeta.title}
        description={newsAndInsightsMeta.description}
      />
      <main>
        <section className="bg-paper px-6 pt-module pb-module sm:px-10">
          <h1 className="text-center text-paper-deep">News &amp; Insights</h1>

          {isPending ? (
            <FeaturedSkeleton />
          ) : isError ? (
            <NewsError onRetry={() => void refetch()} />
          ) : articles.length === 0 ? (
            <p className="mx-auto mt-element max-w-3xl text-center text-muted">
              No published stories yet. Check back soon.
            </p>
          ) : (
            <FeaturedStories articles={featured} />
          )}
        </section>

        {!isPending && !isError ? (
          <CrayhillInTheNews articles={rest} />
        ) : null}
      </main>
    </>
  )
}
