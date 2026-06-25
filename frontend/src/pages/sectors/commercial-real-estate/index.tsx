import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import {
  TransactionsGrid,
  type Transaction,
} from '@/components/TransactionsGrid'
import { commercialRealEstateMeta } from '@/pages/sectors/commercial-real-estate/meta'

/*
 * Page-specific asset types. Inlined per the established sector-page
 * convention; see the Power & Infrastructure or Residential Real
 * Estate page for the rationale.
 *
 * TODO(routes): placeholder /sectors/<slug> paths — confirm with the
 * IA owner whether each asset type gets its own page, an anchor on
 * this page, or no link at all. Links currently fall through to
 * NotFoundPage.
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Bridge Loans', to: '/sectors/bridge-loans' },
  {
    label: 'Delaware Statutory Trust Interests',
    to: '/sectors/delaware-statutory-trust-interests',
  },
  { label: 'Non-Performing Loans', to: '/sectors/non-performing-loans' },
]

/*
 * Page-specific transactions. Three entries; the shared
 * <TransactionsGrid /> handles all the surrounding treatment.
 */
const TRANSACTIONS: ReadonlyArray<Transaction> = [
  {
    imageSrc: '/images/sectors-comm-real-estate-grid-1.jpg',
    caption: 'Bridge loans to commercial real estate developers',
  },
  {
    imageSrc: '/images/sectors-comm-real-estate-grid-2.jpg',
    caption:
      'Warehouse facility for Delaware Statutory Trust acquisition and syndication',
  },
  {
    imageSrc: '/images/sectors-comm-real-estate-grid-3.jpg',
    caption: 'Senior secured bridge loan facility for commercial properties',
  },
]

/**
 * Commercial Real Estate sector page (/sectors/commercial-real-estate).
 * Linked from the homepage Asset Focus block, the TopNav Sectors
 * dropdown, and the Footer Sectors column.
 *
 * Page composition (top to bottom):
 *
 *   1. Title banner — <section> on --color-paper-dark. Centered H1
 *      "Commercial Real Estate" in white. `pt-module pb-element`
 *      (120/90), matching the Power & Infrastructure title banner.
 *      Note: the H1 in the source mockup is mis-spelled "Commerical
 *      Real Estate" — clearly a typo (the breadcrumb and every
 *      other reference uses "Commercial"), corrected here.
 *
 *   2. Intro — <section> on --color-paper-deep. Two columns on md+:
 *      Left:  H3 description in white.
 *      Right: single hero image (sectors-comm-real-estate-hero.jpg),
 *             zooms slightly on hover.
 *      `py-[90px]` designer-specified module padding. Same layout
 *      shape as the Residential Real Estate intro: one image, one
 *      block of H3 copy, 2:3 column ratio with text on the smaller
 *      side.
 *
 *   3. Key Asset Types — shared <KeyItemsList variant="sector" />
 *      with three asset types defined above.
 *
 *   4. Select Transactions — shared <TransactionsGrid /> block with
 *      three page-local transactions.
 */
export default function CommercialRealEstatePage() {
  return (
    <>
      <PageHead
        title={commercialRealEstateMeta.title}
        description={commercialRealEstateMeta.description}
      />
      <main>
        <section className="bg-paper-dark px-6 pt-module pb-element sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">Commercial Real Estate</h1>
          </div>
        </section>

        {/*
         * Section 2 — designer-specified 90px module top/bottom
         * padding (deviation from the standard 120px module rhythm,
         * same convention used on every sector page's intro).
         */}
        <section className="bg-paper-deep px-6 py-[90px] sm:px-10">
          <div
            className={
              'mx-auto grid max-w-7xl grid-cols-1 items-start gap-y-12 ' +
              'md:grid-cols-[2fr_3fr] md:gap-x-10 md:gap-y-0'
            }
          >
            <h3 className="text-white">
              Crayhill provides bespoke warehouse and term loan facilities
              to commercial real estate bridge lenders, owners and
              developers.
            </h3>

            <div className="group overflow-hidden rounded-image">
              <img
                src="/images/sectors-comm-real-estate-hero.jpg"
                alt=""
                aria-hidden="true"
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
