import { NavLink } from 'react-router-dom'
import type { NewsListItem } from '@/api/types/news'
import { CtaChevron } from '@/components/CtaChevron'
import { formatDate } from '@/lib/format-date'
import { resolveNewsImage } from '@/lib/news-image'

/**
 * An image card for a single published post. Shared by the News & Insights
 * index (featured grid) and the article detail page (recent-posts sidebar).
 * Designer spec (News & Insights mockups):
 *   - Article title: H3, ink, capped at 3 lines + ellipsis. The whole card is
 *     one click target linking to the article.
 *   - Excerpt: Body 1, ink, capped at 2 lines (omitted in the sidebar).
 *   - Date: Body 3, ink.
 *   - CTA "› Read More": Body 1 SemiBold, --color-accent, turning
 *     --color-accent-green on hover/focus.
 *   - Image: slight zoom-in on hover; posts older than two years (or without a
 *     curated image) show a neutral "No image" placeholder instead.
 *
 * `variant` only controls the image aspect ratio: `lead` is the large 4:3 card
 * at the top-left of the index; `secondary` is the 16:9 card used everywhere
 * else (index right column and the detail sidebar).
 */

type NewsCardProps = {
  article: NewsListItem
  variant: 'lead' | 'secondary'
  /** Show the excerpt under the title. Off in the compact sidebar. */
  showExcerpt?: boolean
}

export function NewsCard({
  article,
  variant,
  showExcerpt = true,
}: NewsCardProps) {
  const image = resolveNewsImage(article.image, article.date)
  const aspect = variant === 'lead' ? 'aspect-[4/3]' : 'aspect-[16/9]'

  return (
    <article
      className={
        'group relative ' +
        'focus-within:outline focus-within:outline-2 ' +
        'focus-within:outline-offset-4 focus-within:outline-accent-navy'
      }
    >
      {/* overflow-hidden clips the hover zoom so the image grows within its box */}
      <div className="overflow-hidden rounded-image">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className={
              'block w-full object-cover ' +
              aspect +
              ' transition-transform duration-300 ease-out ' +
              'group-hover:scale-105 ' +
              'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
            }
          />
        ) : (
          // Posts older than two years (or with no curated image yet) show a
          // neutral placeholder rather than a hero image — designer policy.
          <div
            className={
              'flex w-full items-center justify-center bg-paper-alt ' + aspect
            }
          >
            <span className="text-body-3 uppercase tracking-wider text-muted-soft">
              No image
            </span>
          </div>
        )}
      </div>

      <h3 className="mt-6 line-clamp-3 text-ink">
        <NavLink
          to={`/news-and-insights/${article.slug}`}
          className={
            'text-inherit ' +
            'after:absolute after:inset-0 after:content-[""] ' +
            'focus-visible:outline-none'
          }
        >
          {article.title}
        </NavLink>
      </h3>

      {showExcerpt ? (
        <p className="mt-4 line-clamp-2 text-body-1 text-ink">
          {article.excerpt}
        </p>
      ) : null}

      <p className="mt-3 text-body-3 text-ink">{formatDate(article.date)}</p>

      <span
        aria-hidden="true"
        className={
          'mt-4 inline-flex items-center gap-1.5 ' +
          'text-body-1 font-semibold text-accent ' +
          'transition-colors duration-150 ' +
          'group-hover:text-accent-green group-focus-within:text-accent-green'
        }
      >
        <CtaChevron />
        Read More
      </span>
    </article>
  )
}
