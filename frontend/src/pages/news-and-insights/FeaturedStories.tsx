import type { NewsListItem } from '@/api/types/news'
import { NewsCard } from '@/pages/news-and-insights/NewsCard'

/**
 * The three most recent published posts: one large lead card on the left, two
 * smaller cards stacked on the right (single column on mobile). The card markup
 * itself lives in <NewsCard /> (shared with the detail-page sidebar).
 */

type Props = {
  /** Up to three articles: the first is the lead, the next two are secondary. */
  articles: ReadonlyArray<NewsListItem>
}

export function FeaturedStories({ articles }: Props) {
  const [lead, ...rest] = articles
  const secondary = rest.slice(0, 2)

  return (
    <div
      className={
        'mx-auto mt-element grid max-w-7xl ' +
        'grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2'
      }
    >
      {lead ? <NewsCard article={lead} variant="lead" /> : null}

      {secondary.length > 0 ? (
        <div className="flex flex-col gap-y-12">
          {secondary.map((article) => (
            <NewsCard key={article.slug} article={article} variant="secondary" />
          ))}
        </div>
      ) : null}
    </div>
  )
}
