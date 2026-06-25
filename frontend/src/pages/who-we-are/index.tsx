import { PageHead } from '@/components/PageHead'
import { FirmOverview } from '@/pages/who-we-are/FirmOverview'
import { OurApproach } from '@/pages/who-we-are/OurApproach'
import { whoWeAreMeta } from '@/pages/who-we-are/meta'

/**
 * Who We Are page (/who-we-are). Linked from the About dropdown in TopNav.
 *
 * Page composition (top to bottom):
 *
 *   1. Navy module — single <section> on --color-paper-deep that contains:
 *        - H1 "Who We Are" + Body 1 white subhead, centered
 *        - Hero image (about-hero.jpg) with a subtle scale-up on hover
 *        - Firm Overview block (see FirmOverview.tsx)
 *      The module has 120px top/bottom padding; the image has 90px above
 *      and 90px below it (between the subhead and the image, and between
 *      the image and the Firm Overview block respectively).
 *
 *   2. Light grey block — a single centered H3 quote on --color-paper-alt
 *      with --color-paper-deep text. 120px top/bottom padding.
 *
 * Hero image hover zoom:
 *   The image lives in an overflow-hidden container marked as a `group`,
 *   and scales to 1.05 when the GROUP (container) is hovered, not when
 *   the img itself is hovered. Two reasons:
 *     - Stable hit target: the container is fixed-size, so hover state
 *       toggles cleanly when the cursor crosses the container's edge.
 *       Hovering the img directly would mean the scaled img's hit target
 *       extends beyond the visible area (because overflow-hidden only
 *       clips rendering, not pointer events), causing the image to "stick"
 *       enlarged even after the cursor visually left it.
 *     - prefers-reduced-motion: we use motion-reduce:!scale-100 on the
 *       img with !important to guarantee the override beats the
 *       group-hover variant regardless of Tailwind's emitted cascade
 *       order. Users who opted out of motion get a static image.
 *
 * Page-level animation notes from the designer's spec (carry-over for
 * future sections of this page that aren't shown yet):
 *   - "Icons will slide in from the left of the screen. When hovered
 *     over, the icons will change to green; they are not clickable."
 *     We'll implement this when the icons section is added.
 */
export default function WhoWeArePage() {
  return (
    <>
      <PageHead
        title={whoWeAreMeta.title}
        description={whoWeAreMeta.description}
      />
      <main>
        <section className="bg-paper-deep px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">Who We Are</h1>

            <p className="mx-auto mt-6 max-w-3xl text-center text-white">
              Crayhill Capital Management is an asset-based finance
              (&ldquo;ABF&rdquo;) investment manager focused on delivering
              structured private capital solutions to underserved segments
              of the market.
            </p>

            <div className="group mt-element overflow-hidden rounded-image">
              <img
                src="/images/about-hero.jpg"
                alt=""
                loading="lazy"
                className={
                  'block w-full ease-out ' +
                  'transition-transform duration-700 ' +
                  'group-hover:scale-105 ' +
                  'motion-reduce:!transition-none ' +
                  'motion-reduce:group-hover:!scale-100'
                }
              />
            </div>

            <div className="mt-element">
              <FirmOverview />
            </div>
          </div>
        </section>

        <section className="bg-paper-alt px-6 py-module sm:px-10">
          <h3 className="mx-auto max-w-4xl text-center text-paper-deep">
            Crayhill focuses on asset-based private credit strategies that
            are designed to generate current income and preserve capital.
            Investments are backed by assets with contracted or determinable
            cash flows, such as loans, leases, royalties, receivables and
            subsidies.
          </h3>
        </section>

        <OurApproach />
      </main>
    </>
  )
}
