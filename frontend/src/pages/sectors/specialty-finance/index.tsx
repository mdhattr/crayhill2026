import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import {
  TransactionsGrid,
  type Transaction,
} from '@/components/TransactionsGrid'
import { specialtyFinanceMeta } from '@/pages/sectors/specialty-finance/meta'

/*
 * Page-specific asset types. Five entries — the largest Key Asset
 * Types list across the sector pages handed off so far. The shared
 * <KeyItemsList /> handles any number of items, so no component
 * change needed.
 *
 * TODO(routes): placeholder /sectors/<slug> paths — confirm with the
 * IA owner whether each asset type gets its own page, an anchor on
 * this page, or no link at all.
 *
 *   - "Equipment Leases" is conceptually adjacent to (but distinct
 *     from) "Equipment Loans" on the Power & Infrastructure page;
 *     the slugs differ so the eventual destination pages can also
 *     diverge if needed.
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Equipment Leases', to: '/sectors/equipment-leases' },
  { label: 'Senior Corporate Revolvers', to: '/sectors/senior-corporate-revolvers' },
  { label: 'Trade Receivables', to: '/sectors/trade-receivables' },
  {
    label: 'Small and Medium-Sized Enterprises Loans',
    to: '/sectors/small-and-medium-sized-enterprises-loans',
  },
  { label: 'Litigation Finance', to: '/sectors/litigation-finance' },
]

const TRANSACTIONS: ReadonlyArray<Transaction> = [
  {
    imageSrc: '/images/sectors-specialty-finance-grid-1.jpg',
    caption: 'Commercial bank SRT backed by senior corporate revolvers',
  },
  {
    imageSrc: '/images/sectors-specialty-finance-grid-2.jpg',
    caption: 'Revolving warehouse facility for small business loans',
  },
  {
    imageSrc: '/images/sectors-specialty-finance-grid-3.jpg',
    caption: 'Facility to acquire trade finance receivables',
  },
]

/**
 * Specialty Finance sector page (/sectors/specialty-finance). Linked
 * from the homepage Asset Focus block, the TopNav Sectors dropdown,
 * and the Footer Sectors column.
 *
 * Page composition (top to bottom):
 *
 *   1. Title banner — <section> on --color-paper-dark. Centered H1
 *      "Specialty Finance" in white. `pt-module pb-element` (120/90),
 *      matching the Power & Infrastructure and Commercial Real
 *      Estate title banners.
 *
 *   2. Intro — <section> on --color-paper-deep. Two columns on md+:
 *      Left:  single hero image (sectors-specialty-finance-hero.jpg),
 *             zooms slightly on hover.
 *      Right: H3 description in white.
 *      `py-[90px]` designer-specified module padding. Image-left /
 *      text-right ordering matches the Origination Platforms intro
 *      (but with H3 text here rather than Body 1).
 *
 *   3. Key Asset Types — shared <KeyItemsList variant="sector" />
 *      with five asset types defined above.
 *
 *   4. Select Transactions — shared <TransactionsGrid /> with three
 *      page-local transactions.
 *
 * Layout note on Section 2:
 *   - md+ ratio of 3:2 (image gets more width than text), matching
 *     the screenshot's relative widths. `items-start` so the
 *     (shorter) text top-aligns with the top of the (taller) image.
 *   - mobile: stacked, image above text.
 */
export default function SpecialtyFinancePage() {
  return (
    <>
      <PageHead
        title={specialtyFinanceMeta.title}
        description={specialtyFinanceMeta.description}
      />
      <main>
        <section className="bg-paper-dark px-6 pt-module pb-element sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">Specialty Finance</h1>
          </div>
        </section>

        {/*
         * Section 2 — designer-specified 90px module top/bottom
         * padding (deviation from the 120px standard, same
         * convention used on every sector page intro).
         */}
        <section className="bg-paper-deep px-6 py-[90px] sm:px-10">
          <div
            className={
              'mx-auto grid max-w-7xl grid-cols-1 items-start gap-y-12 ' +
              'md:grid-cols-[3fr_2fr] md:gap-x-10 md:gap-y-0'
            }
          >
            <div className="group overflow-hidden rounded-image">
              <img
                src="/images/sectors-specialty-finance-hero.jpg"
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

            <h3 className="text-white">
              Crayhill provides bespoke financing to commercial operators,
              banks and specialty finance companies seeking flexible
              capital solutions for portfolios of loans, leases,
              receivables and equipment.
            </h3>
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
