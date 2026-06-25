import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import {
  TransactionsGrid,
  type Transaction,
} from '@/components/TransactionsGrid'
import { residentialRealEstateMeta } from '@/pages/sectors/residential-real-estate/meta'

/*
 * Page-specific asset types for Residential Real Estate. Kept inline
 * (see the matching note on the Power & Infrastructure page for the
 * convention rationale).
 *
 * TODO(routes): placeholder /sectors/<slug> paths — confirm with the
 * IA owner whether each asset type gets its own page, an anchor on
 * this page, or no link at all. Links currently fall through to
 * NotFoundPage.
 *
 *   - "Home Equity Investments" and "Non-Qualified Mortgages" use
 *     the same slug names as items already linked from the Investment
 *     Grade ABF page's Key Asset Types list. When those destination
 *     pages are scaffolded, both pages will link to the same target —
 *     which is correct (the asset type itself doesn't change between
 *     strategies; only its packaging does).
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Residential Home Lots', to: '/sectors/residential-home-lots' },
  { label: 'Home Equity Investments', to: '/sectors/home-equity-investments' },
  { label: 'Non-Qualified Mortgages', to: '/sectors/non-qualified-mortgages' },
]

/*
 * Page-specific transactions. Three entries, matching the designer's
 * 3-card grid spec; the shared <TransactionsGrid /> handles the
 * surrounding visual treatment.
 */
const TRANSACTIONS: ReadonlyArray<Transaction> = [
  {
    imageSrc: '/images/sectors-res-real-estate-grid-1.jpg',
    caption: 'Securitization warehouse of residential non-qualified mortgages',
  },
  {
    imageSrc: '/images/sectors-res-real-estate-grid-2.jpg',
    caption: 'Senior secured facility to regional homebuilders',
  },
  {
    imageSrc: '/images/sectors-res-real-estate-grid-3.jpg',
    caption: 'Securitization warehouse of home equity investments',
  },
]

/**
 * Residential Real Estate sector page (/sectors/residential-real-estate).
 * Linked from the homepage Asset Focus block, the TopNav Sectors
 * dropdown, and the Footer Sectors column.
 *
 * Page composition (top to bottom):
 *
 *   1. Intro — <section> on --color-paper-deep. Two columns on md+:
 *      Left:  H3 description in white.
 *      Right: single hero image (sectors-res-real-estate-hero.jpg),
 *             zooms slightly on hover.
 *      `py-[90px]` per designer's explicit module padding annotation.
 *      Unlike the Power & Infrastructure page, this page has no
 *      title banner above the intro; the design hands off with the
 *      two-column content as the first thing the user sees.
 *
 *      Also unlike Power & Infrastructure, the intro has only ONE
 *      hero image (page-behavior note says "Hero Image" singular).
 *      Layout therefore matches the Investment Grade ABF intro
 *      pattern (text in one column, image in the other) rather
 *      than the Power & Infrastructure / ABF Credit Opportunities
 *      pattern (two images stacked in the right column).
 *
 *   2. Key Asset Types — shared <KeyItemsList variant="sector" />
 *      with three asset types defined above.
 *
 *   3. Select Transactions — shared <TransactionsGrid /> block with
 *      three page-local transactions.
 *
 * Accessibility — visually-hidden H1:
 *   Like the Investment Grade ABF and Origination Platforms pages,
 *   the design does not show a visible <h1>. We ship an sr-only
 *   <h1> so the page has exactly one H1 in the DOM for screen-
 *   reader navigation.
 *
 * Layout note on Section 1:
 *   - Mobile (< md): single-column stack, text above image.
 *   - md+: two columns at a 2:3 ratio — text takes less width than
 *     image, matching the relative widths in the screenshot.
 *     `items-start` so the (shorter) text top-aligns with the top
 *     of the (taller) image; image's natural aspect drives the row
 *     height.
 */
export default function ResidentialRealEstatePage() {
  return (
    <>
      <PageHead
        title={residentialRealEstateMeta.title}
        description={residentialRealEstateMeta.description}
      />
      <main>
        {/*
         * Section 1 — designer-specified 90px module top/bottom
         * padding (deviation from the 120px standard, same
         * convention used on Power & Infrastructure Section 2).
         */}
        <section className="bg-paper-deep px-6 py-[60px] sm:px-10 md:py-[90px]">
          <div className="mx-auto max-w-7xl">
            <h1 className="sr-only">Residential Real Estate</h1>

            <div
              className={
                'grid grid-cols-1 items-start gap-y-12 ' +
                'md:grid-cols-[2fr_3fr] md:gap-x-10 md:gap-y-0'
              }
            >
              <h3 className="order-2 text-white md:order-none">
                Crayhill provides structured capital solutions to finance
                residential mortgages and real estate, such as
                securitization warehouse and term loan facilities to
                homebuilders and mortgage originators.
              </h3>

              <div className="group order-1 overflow-hidden rounded-image md:order-none">
                <img
                  src="/images/sectors-res-real-estate-hero.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={
                    // Mobile: 225px tall, cropped (mockup "Image height:
                    // 225px"); natural height on md+. Image leads on mobile
                    // via the order utilities (DOM order keeps the H3 first
                    // for screen readers; the image is decorative).
                    'block h-[225px] w-full object-cover ease-out md:h-auto ' +
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

        <KeyItemsList
          eyebrow="Key Asset Types"
          items={ASSET_TYPES}
          variant="sector"
        />

        <TransactionsGrid heading="Select Transactions" transactions={TRANSACTIONS} />
      </main>
    </>
  )
}
