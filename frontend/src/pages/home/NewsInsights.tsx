import { NavLink } from 'react-router-dom'
import { CtaChevron } from '@/components/CtaChevron'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { formatDate } from '@/lib/format-date'

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
 *   - Date line: Body 3, ink. Designer shows it as
 *     "Location — Long Month DD, YYYY".
 *   - CTA: "› Read More", Body 1 SemiBold, --color-accent-navy (#374D6C).
 *   - CTA hover: --color-accent-green (#92BE4B).
 *   - Animation: cards slide up from below, staggered, when the section
 *     enters the viewport.
 *
 * Placeholder data:
 *   Until the article list is pulled from the existing site's database via
 *   the PHP API, the three articles below are hardcoded. The shape of the
 *   `Article` type intentionally mirrors what the API will return so the
 *   swap-in is just "replace the const with a fetch", not a component
 *   rewrite. The placeholder images are the real article hero images that
 *   already live in /assets/images/, so the visual fidelity matches what
 *   the live data will eventually look like.
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

type Article = {
  /** URL slug, rendered into `/news-and-insights/<slug>`. */
  slug: string
  /** Full headline; visually capped to 3 lines via CSS line-clamp. */
  title: string
  /** Public-served path to the hero image (e.g. /images/article-2025-08.jpg). */
  imagePath: string
  /** Free-form location string. Empty string is allowed. */
  location: string
  /** ISO-8601 YYYY-MM-DD. Parsed in local time at render. */
  publishedOn: string
}

// Placeholder content. Slugs are best-effort; the real list will land via
// the PHP API and these will be deleted.
const PLACEHOLDER_ARTICLES: ReadonlyArray<Article> = [
  {
    slug: 'crayhill-launches-lending-solution-tax-equity-bridge-loans',
    title:
      'Crayhill Launches Lending Solution Combining Tax Equity Bridge Loans and Development Financing',
    imagePath: '/images/article-2025-08.jpg',
    location: 'New York',
    publishedOn: '2025-08-14',
  },
  {
    slug: 'universal-kraft-canada-renewables-solar-credit-facility',
    title:
      'Universal Kraft Canada Renewables secures USD 15 million credit facility for solar energy development',
    imagePath: '/images/article-2025-02.jpg',
    location: 'Alberta, Canada',
    publishedOn: '2025-02-11',
  },
  {
    slug: 'ampyr-energy-usa-development-capital-financing',
    title:
      'AMPYR Energy USA Secures Up to $200 Million Development Capital Financing Facility with Crayhill Capital Management',
    imagePath: '/images/article-2024-12.jpg',
    location: 'Long Beach, CA and New York, NY',
    publishedOn: '2024-12-18',
  },
]

// Slide-up entrance animation tuning. Keep total cascade under ~1s.
const ANIM_DURATION_MS = 600
const ANIM_STAGGER_MS = 120

export function NewsInsights() {
  const [gridRef, inView] = useInViewOnce<HTMLDivElement>()

  return (
    <section className="bg-paper px-6 pt-module pb-element sm:px-10">
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

      <div
        ref={gridRef}
        className={
          'mx-auto mt-element grid max-w-7xl ' +
          'grid-cols-1 gap-y-16 ' +
          'md:grid-cols-3 md:gap-x-10 md:gap-y-0'
        }
      >
        {PLACEHOLDER_ARTICLES.map((article, i) => (
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
            <img
              src={article.imagePath}
              alt=""
              className="block aspect-[4/3] w-full object-cover"
              loading="lazy"
            />

            <h3 className="mt-6 line-clamp-3 text-ink">
              <NavLink
                to={`/news-and-insights/${article.slug}`}
                // text-inherit so the link picks up the H3's ink color
                // instead of the global `a { color: var(--color-link) }`
                // rule (which is also ink-ish, but text-inherit makes the
                // intent explicit and survives any future link-color
                // change).
                // The after:* utilities stretch a transparent pseudo-
                // element to fill the (relative) <article>, making the
                // whole card the click target.
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
              {article.location} {'\u2014'} {formatDate(article.publishedOn)}
            </p>

            <span
              // The CTA is decorative: the real link is the H3, which
              // already covers the whole card via ::after. The chevron
              // and "Read More" text are just a visual affordance for
              // sighted users. aria-hidden keeps screen readers from
              // announcing them as separate content.
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
        ))}
      </div>
    </section>
  )
}
