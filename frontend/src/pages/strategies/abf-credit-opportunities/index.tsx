import { KeyItemsList } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import { SECTORS } from '@/data/sectors'
import { abfCreditOpportunitiesMeta } from '@/pages/strategies/abf-credit-opportunities/meta'

/**
 * ABF Credit Opportunities page (/strategies/abf-credit-opportunities).
 * Linked from the About → Strategies dropdown in TopNav.
 *
 * Page composition (top to bottom):
 *
 *   1. Title banner — <section> on --color-paper-deep. Left-aligned H1
 *      "ABF Credit Opportunities" in white. 120px top, 90px bottom.
 *
 *   2. Two-column intro — <section> on --color-paper-dark.
 *        Left:  large hero image (Strategies_ABF-Opp_Hero1)
 *        Right: H3 description above a smaller hero image
 *               (Strategies_ABF-Opp_Hero2), pinned to the column bottom
 *      Both images zoom slightly on hover (CSS group-hover; see
 *      WhoWeArePage for the rationale on using group-hover rather than
 *      img:hover for clip-safe enlargement). 90px top + bottom padding.
 *
 *   3. Key Asset Types — the shared <KeyItemsList /> block, fed with
 *      the canonical SECTORS list. The eyebrow text is the only
 *      strategy-specific bit. Continues the paper-dark background.
 *
 * Layout note on Section 2:
 *   Both columns share a grid row whose height is the taller of (a) the
 *   left image's natural height and (b) the right column's natural
 *   height (H3 text + gap + small image). The left image is set to
 *   `h-full object-cover` on md+ so it always fills the row top-to-bottom
 *   (cropping slightly if (b) drives the row). The right column is a
 *   flex container with `justify-between`, pinning the H3 to its top
 *   and the small image to its bottom. Result: both image bottoms align
 *   at the row bottom; the tops differ because the small image is
 *   shorter — which matches the designer's spec ("both reach the same
 *   point at the bottom, only the tops don't align").
 */
export default function ABFCreditOpportunitiesPage() {
  return (
    <>
      <PageHead
        title={abfCreditOpportunitiesMeta.title}
        description={abfCreditOpportunitiesMeta.description}
      />
      <main>
        <section className="bg-paper-deep px-6 pt-module pb-element sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">ABF Credit Opportunities</h1>
          </div>
        </section>

        {/*
         * Section 2 — designer-specified 90px module top/bottom padding
         * (smaller than the standard 120px). Written as an arbitrary
         * value rather than `py-element` so it reads as "intentional
         * deviation from the module rhythm", not "internal element
         * spacing applied to a module".
         */}
        <section className="bg-paper-dark px-6 py-[90px] sm:px-10">
          <div
            className={
              'mx-auto grid max-w-7xl grid-cols-1 gap-y-12 ' +
              'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
            }
          >
            <div className="group overflow-hidden rounded-image">
              <img
                src="/images/strategies-abf-opp-hero-1.jpg"
                alt=""
                loading="lazy"
                className={
                  // On mobile (single-column stack), the image renders at
                  // its natural aspect (w-full + auto height). On md+
                  // (2-column layout), h-full + object-cover forces the
                  // image to fill its grid cell — guarantees the bottom
                  // of this image aligns with the bottom of the small
                  // image in the right column, regardless of which side
                  // dictates the grid row height.
                  'block w-full ease-out ' +
                  'md:h-full md:object-cover ' +
                  'transition-transform duration-700 ' +
                  'group-hover:scale-105 ' +
                  'motion-reduce:!transition-none ' +
                  'motion-reduce:group-hover:!scale-100'
                }
              />
            </div>

            <div className="flex flex-col justify-between gap-12">
              <h3 className="text-white">
                Crayhill&rsquo;s foundational investment program provides
                tailored capital solutions to non-bank lenders, specialty
                finance companies, asset-heavy corporates and other
                originators, servicers, developers and owners of real and
                financial assets.
              </h3>

              <div className="group overflow-hidden rounded-image">
                <img
                  src="/images/strategies-abf-opp-hero-2.jpg"
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
            </div>
          </div>
        </section>

        <KeyItemsList eyebrow="Key Asset Types" items={SECTORS} linked />
      </main>
    </>
  )
}
