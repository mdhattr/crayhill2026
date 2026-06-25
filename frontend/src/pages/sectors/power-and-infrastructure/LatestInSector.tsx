/**
 * "Latest in Power & Infrastructure" featured-article block — final
 * section on the Power & Infrastructure sector page, and the page's
 * only light surface.
 *
 * Per-element treatment is driven by explicit designer annotations:
 *   - Module top/bottom padding: 120px (`py-module`).
 *   - Background: --color-paper-alt (#F3F3F3) — light bg, in
 *     contrast to every other section on this page.
 *   - Eyebrow: H5 in --color-accent (blue).
 *   - Headline: H2 in --color-ink (black; the H2 base rule already
 *     inherits ink, so no override needed).
 *   - CTA: --color-accent-green button, Body 2 SemiBold white text.
 *
 * Layout:
 *   - md+: two columns, image left + (eyebrow + headline + button)
 *     right, vertically centered against the image's height
 *     (`items-center`) — the screenshot shows the eyebrow/H2/button
 *     group at the visual middle of the image.
 *   - mobile (< md): stacked, image above text.
 *
 * CTA:
 *   "View all articles" is an *internal* link to the news index
 *   (/news-and-insights) — different from the Origination Platforms
 *   SelectTransactions CTA which was external. Uses <NavLink> for
 *   client-side routing.
 *
 * Article data:
 *   The eyebrow text and the featured-article content are hardcoded
 *   for now ("Crayhill Launches Lending Solution..." matches the
 *   asset `article-2025-08.jpg`). When the News & Insights API
 *   lights up, this block becomes a query: "latest article tagged
 *   'power-and-infrastructure'". The shape will match the Article
 *   type already in use by the homepage NewsInsights component.
 *
 *   This block is intentionally page-local (not in /components/)
 *   because (a) only one sector page uses it today and (b) the
 *   eyebrow's sector-name half is hardcoded into the file. If a
 *   second sector page wants the same treatment, lift the component
 *   into /components/LatestInSector with a `sectorLabel` prop.
 */

import { NavLink } from 'react-router-dom'

export function LatestInSector() {
  return (
    <section className="bg-paper-alt px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div
          className={
            'grid grid-cols-1 items-center gap-y-12 ' +
            'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
          }
        >
          <div>
            <img
              src="/images/article-2025-08.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block w-full"
            />
          </div>

          <div>
            <h5 className="text-accent">Latest in Power &amp; Infrastructure</h5>
            <h2 className="mt-4 text-ink">
              Crayhill Launches Lending Solution Combining Tax Equity Bridge
              Loans and Development Financing
            </h2>
            <div className="mt-8">
              <NavLink
                to="/news-and-insights"
                className={
                  'inline-block rounded bg-accent-green px-6 py-3 ' +
                  'text-body-2 font-semibold uppercase text-white ' +
                  'transition-[filter] duration-150 ease-out ' +
                  'hover:brightness-95 ' +
                  'focus-visible:brightness-95 focus-visible:outline-none ' +
                  'motion-reduce:!transition-none'
                }
              >
                View all articles
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
