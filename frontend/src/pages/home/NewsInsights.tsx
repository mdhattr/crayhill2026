import { NavLink } from 'react-router-dom'
import { useNewsList } from '@/api/news'
import { CtaChevron } from '@/components/CtaChevron'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { formatDate } from '@/lib/format-date'
import { resolveNewsImage } from '@/lib/news-image'

/**
 * Homepage "News & Insights" section. Three article cards on a white
 * background; the section heading is itself a link to the full
 * /news-and-insights index page.
 *
 * Designer spec (annotated screenshot):
 *   - Background: white
 *   - Module padding: 120px top, 90px bottom
 *   - 90px gap between H2 and the card row
 *   - Headline "News & Insights": H2, ink. Clickable → /news-and-insights.
 *   - Each card is fully clickable (image + text both link to the article).
 *   - Article title: H3, ink, capped at 3 lines with trailing ellipsis.
 *   - Date line: Body 3, ink.
 *   - CTA: "› Read More", Body 1 SemiBold, --color-accent-navy (#374D6C).
 *   - CTA hover: --color-accent-green (#92BE4B).
 *   - Animation: cards slide up from below, staggered, when the section
 *     enters the viewport.
 *
 * Data source:
 *   The three cards are the most recent published posts from
 *   GET /api/v1/news (the API filters to published and sorts newest-first;
 *   we just take the first three). Image resolution uses the shared
 *   `resolveNewsImage` policy (posts older than two years, or without a
 *   curated image, show a neutral placeholder).
 *
 * Card click-target pattern:
 *   The whole card is clickable, but only ONE link exists per card (the
 *   one wrapping the H3 title text). That link's `::after` pseudo-element
 *   stretches to fill the (position: relative) parent article element,
 *   making the entire card respond to clicks. Benefits:
 *     - One link per card → screen readers announce the link once, named
 *       by the title text.
 *     - The date line and "Read More" CTA stay regular text nodes
 *       (selectable for users who want to copy them) rather than getting
 *       wrapped in nested links.
 *     - Standard "card link" pattern, well-supported across AT.
 *   Focus indication uses `focus-within` on the article so keyboard users
 *   see the whole card outlined when the inner link gains focus.
 */

// Slide-up entrance animation tuning. Keep total cascade under ~1s.
const ANIM_DURATION_MS = 600
const ANIM_STAGGER_MS = 120

/** Skeleton placeholders shown while the post list is loading. */
function NewsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading stories"
      className={
        'mx-auto mt-element grid max-w-7xl ' +
        'grid-cols-1 gap-y-16 ' +
        'md:grid-cols-3 md:gap-x-10 md:gap-y-0'
      }
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="aspect-[4/3] w-full animate-pulse rounded-image bg-rule-soft"
        />
      ))}
    </div>
  )
}

export function NewsInsights() {
  // The reveal observer is attached to the <section> (always mounted) rather
  // than the card grid: the grid only renders once the post list resolves, so
  // a ref on it would mount too late for the one-shot effect in useInViewOnce
  // — leaving the cards stuck at opacity-0.
  const [sectionRef, inView] = useInViewOnce<HTMLElement>()
  const { data, isPending, isError } = useNewsList()
  const articles = (data ?? []).slice(0, 3)

  return (
    <section
      ref={sectionRef}
      className="bg-paper px-6 pt-module pb-element sm:px-10"
    >
      <h2 className="text-center text-ink">
        <NavLink
          to="/news-and-insights"
          className={
            'text-inherit transition-colors duration-150 ' +
            'hover:text-accent-green ' +
            'focus-visible:text-accent-green focus-visible:underline ' +
            'focus-visible:outline-none'
          }
        >
          News &amp; Insights
        </NavLink>
      </h2>

      {isPending ? (
        <NewsSkeleton />
      ) : isError || articles.length === 0 ? (
        // On the marketing homepage we degrade quietly rather than showing a
        // broken/empty band: the heading still links to the full index, which
        // has its own retry affordance. No cards render.
        null
      ) : (
        <div
          className={
            'mx-auto mt-element grid max-w-7xl ' +
            'grid-cols-1 gap-y-16 ' +
            'md:grid-cols-3 md:gap-x-10 md:gap-y-0'
          }
        >
          {articles.map((article, i) => {
            const image = resolveNewsImage(article.image, article.date)
            return (
              <article
                key={article.slug}
                // `relative` anchors the title link's ::after click-target
                // overlay. `group` exposes hover/focus-within to descendants
                // (the CTA picks up the green color via group-hover/group-
                // focus-within).
                className={
                  'group relative ' +
                  'focus-within:outline focus-within:outline-2 ' +
                  'focus-within:outline-offset-4 focus-within:outline-accent-navy ' +
                  'transition-[transform,opacity] ease-out ' +
                  'motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ' +
                  'motion-reduce:!transition-none ' +
                  (inView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0')
                }
                style={{
                  transitionDuration: `${ANIM_DURATION_MS}ms`,
                  transitionDelay: `${i * ANIM_STAGGER_MS}ms`,
                }}
              >
                <div className="overflow-hidden rounded-image">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className={
                        'block aspect-[4/3] w-full object-cover ' +
                        'transition-transform duration-300 ease-out ' +
                        'group-hover:scale-105 ' +
                        'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-paper-alt">
                      <span className="text-body-3 uppercase tracking-wider text-muted-soft">
                        No image
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="mt-6 line-clamp-3 text-ink">
                  <NavLink
                    to={`/news-and-insights/${article.slug}`}
                    // text-inherit so the link picks up the H3's ink color
                    // instead of the global link color. The after:* utilities
                    // stretch a transparent pseudo-element to fill the
                    // (relative) <article>, making the whole card the click
                    // target.
                    className={
                      'text-inherit ' +
                      'after:absolute after:inset-0 after:content-[""] ' +
                      'focus-visible:outline-none'
                    }
                  >
                    {article.title}
                  </NavLink>
                </h3>

                <p className="mt-3 text-body-3 text-ink">
                  {formatDate(article.date)}
                </p>

                <span
                  // The CTA is decorative: the real link is the H3, which
                  // already covers the whole card via ::after. aria-hidden
                  // keeps screen readers from announcing it separately.
                  aria-hidden="true"
                  className={
                    'mt-4 inline-flex items-center gap-1.5 ' +
                    'text-body-1 font-semibold text-accent-navy ' +
                    'transition-colors duration-150 ' +
                    'group-hover:text-accent-green ' +
                    'group-focus-within:text-accent-green'
                  }
                >
                  <CtaChevron />
                  Read More
                </span>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
