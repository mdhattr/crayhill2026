import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import {
  TransactionsGrid,
  type Transaction,
} from '@/components/TransactionsGrid'
import { powerAndInfrastructureMeta } from '@/pages/sectors/power-and-infrastructure/meta'

/*
 * Page-specific transactions for the Select Transactions block.
 * The visual treatment lives in the shared <TransactionsGrid />;
 * each sector page supplies its own three transactions here.
 */
const TRANSACTIONS: ReadonlyArray<Transaction> = [
  {
    imageSrc: '/images/sectors-power-grid-1.jpg',
    caption:
      'Hybrid tax equity investment financing for renewable energy projects',
  },
  {
    imageSrc: '/images/sectors-power-grid-2.jpg',
    caption:
      'Development financing of battery energy storage systems and solar projects',
  },
  {
    imageSrc: '/images/sectors-power-grid-3.jpg',
    caption: 'Senior secured term loan to developer of late-stage solar projects',
  },
]

/*
 * Sector-specific asset types for Power & Infrastructure. Kept inline
 * per the same convention used by the Investment Grade ABF and
 * Origination Platforms pages — these are this sector's own taxonomy,
 * not the cross-page SECTORS list. If multiple sector pages start
 * sharing asset-type taxonomies, lift each shared list into
 * @/data/sectors as a separate exported constant.
 *
 * TODO(routes): placeholder /sectors/<slug> paths — confirm with the
 * IA owner whether each asset type gets its own page, an anchor on
 * this page, or no link at all. Links currently fall through to
 * NotFoundPage.
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Solar Power Solutions', to: '/sectors/solar-power-solutions' },
  {
    label: 'Battery Energy Storage Systems',
    to: '/sectors/battery-energy-storage-systems',
  },
  { label: 'Electrical Vehicle Charging', to: '/sectors/electrical-vehicle-charging' },
  { label: 'Data Centers', to: '/sectors/data-centers' },
  { label: 'Equipment Loans', to: '/sectors/equipment-loans' },
  { label: 'Tax Credits', to: '/sectors/tax-credits' },
]

/**
 * Power & Infrastructure sector page (/sectors/power-and-infrastructure).
 * Linked from the homepage Asset Focus block, the TopNav Sectors
 * dropdown, and the Footer Sectors column.
 *
 * Page composition (top to bottom):
 *
 *   1. Title banner — <section> on --color-paper-dark. Centered H1
 *      "Power & Infrastructure" in white. `pt-module pb-element`
 *      (120px top, 90px bottom, per designer annotation). Same shape
 *      as the ABF Credit Opportunities page's title banner.
 *
 *   2. Intro — <section> on --color-paper-deep. Two-column on md+:
 *      Left:  large hero image (sectors-power-hero-1.jpg).
 *      Right: H3 description above a smaller hero image
 *             (sectors-power-hero-2.jpg), pinned to the column
 *             bottom so both image bottoms align (matches the
 *             ABF Credit Opportunities Section 2 layout).
 *      Both images zoom slightly on hover (page-behavior note
 *      reserves zoom for these "Hero Images" specifically).
 *      `py-[90px]` designer-specified module padding (an explicit
 *      deviation from the standard 120px rhythm).
 *
 *   3. Key Asset Types — <KeyItemsList variant="sector" /> on
 *      --color-paper-dark with accent-light divider rules.
 *
 *   4. Select Transactions — the shared <TransactionsGrid /> block,
 *      fed with the page-local TRANSACTIONS list above. Three-card
 *      grid on --color-paper-deep.
 *
 * Layout note on Section 2:
 *   Same alignment trick used on the ABF Credit Opportunities page —
 *   `md:items-stretch` (default) so both columns share a grid row
 *   height driven by the taller column, plus `md:h-full md:object-
 *   cover` on the large left image to force it to fill the row.
 *   The right column is a flex column with `justify-between`, pinning
 *   the H3 to the top and the small image to the bottom. Result:
 *   both image bottoms align at the row bottom; only the tops differ
 *   because the small image is shorter.
 */
export default function PowerAndInfrastructurePage() {
  return (
    <>
      <PageHead
        title={powerAndInfrastructureMeta.title}
        description={powerAndInfrastructureMeta.description}
      />
      <main>
        <section className="bg-paper-dark px-6 pt-module pb-element sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">Power &amp; Infrastructure</h1>
          </div>
        </section>

        {/*
         * Section 2 — designer-specified module padding: 90px on
         * desktop (an intentional deviation from the standard 120px
         * rhythm, hence an arbitrary value rather than `py-module`),
         * tightening to the standard 60px mobile module padding below
         * md per the mobile mockup. Same convention as the ABF Credit
         * Opportunities Section 2.
         */}
        <section className="bg-paper-deep px-6 py-[60px] sm:px-10 md:py-[90px]">
          <div
            className={
              'mx-auto grid max-w-7xl grid-cols-1 gap-y-12 ' +
              'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
            }
          >
            <div className="group overflow-hidden rounded-image">
              <img
                src="/images/sectors-power-hero-1.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={
                  // Mobile: fixed 425px tall, cropped, per the mobile
                  // mockup's "1st Image height: 425px". On md+ h-full +
                  // object-cover fills the grid cell so this image's bottom
                  // aligns with the small image in the right column.
                  'block h-[425px] w-full object-cover ease-out ' +
                  'md:h-full ' +
                  'transition-transform duration-700 ' +
                  'group-hover:scale-105 ' +
                  'motion-reduce:!transition-none ' +
                  'motion-reduce:group-hover:!scale-100'
                }
              />
            </div>

            <div className="flex flex-col justify-between gap-12">
              <h3 className="text-white">
                Crayhill provides bespoke financing solutions to energy and
                infrastructure developers and operators to support
                development, construction, and equipment procurement, often
                where regulatory complexity or capital scarcity creates a
                funding gap.
              </h3>

              <div className="group overflow-hidden rounded-image">
                <img
                  src="/images/sectors-power-hero-2.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={
                    // Mobile: fixed 225px tall, cropped, per the mockup's
                    // "2nd Image height: 225px"; natural height on md+.
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
