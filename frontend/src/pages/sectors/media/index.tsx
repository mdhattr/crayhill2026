import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import {
  TransactionsGrid,
  type Transaction,
} from '@/components/TransactionsGrid'
import { mediaMeta } from '@/pages/sectors/media/meta'

/*
 * Page-specific asset types. Inlined per the established sector-page
 * convention.
 *
 * TODO(routes): placeholder /sectors/<slug> paths — confirm with the
 * IA owner whether each asset type gets its own page, an anchor on
 * this page, or no link at all.
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Film Receivables', to: '/sectors/film-receivables' },
  { label: 'Music Royalties', to: '/sectors/music-royalties' },
  { label: 'Royalty Advances', to: '/sectors/royalty-advances' },
]

/*
 * Page-specific transactions. NOTE: only two transactions on this
 * page (vs. three on the other sector pages handed off so far). The
 * shared <TransactionsGrid /> auto-detects this case and switches
 * to a centred 2-column layout where the cards stay roughly the
 * same width as 3-card-layout cards — matching the visual in the
 * Media screenshot.
 */
const TRANSACTIONS: ReadonlyArray<Transaction> = [
  {
    imageSrc: '/images/sectors-media-grid-1.jpg',
    caption: 'Senior secured loan to an independent music label',
  },
  {
    imageSrc: '/images/sectors-media-grid-2.jpg',
    caption: 'Senior film slate financing to a major production studio',
  },
]

/**
 * Media sector page (/sectors/media). Linked from the homepage Asset
 * Focus block, the TopNav Sectors dropdown, and the Footer Sectors
 * column.
 *
 * Page composition (top to bottom):
 *
 *   1. Intro — <section> on --color-paper-deep. Two columns on md+:
 *      Left:  H3 description (top) above a smaller hero image
 *             (sectors-media-hero-1.jpg) pinned to the column bottom.
 *      Right: large hero image (sectors-media-hero-2.jpg) filling
 *             the full row height (h-full + object-cover).
 *
 *      This is a *mirror* of the ABF Credit Opportunities Section 2
 *      and Power & Infrastructure Section 2 layouts — those put the
 *      large image on the LEFT and the (H3 + small image) stack on
 *      the RIGHT. The Media page swaps the sides.
 *
 *      `py-[90px]` designer-specified module padding (same deviation
 *      from the 120px module rhythm used on every other sector
 *      page's intro).
 *
 *      Both images zoom slightly on hover. The page-behavior note
 *      says "Hero Image" singular but the design clearly shows two —
 *      same inconsistency that appeared on the Power & Infrastructure
 *      and Investment Grade ABF specs. Treating both as heroes.
 *
 *   2. Key Asset Types — shared <KeyItemsList variant="sector" />
 *      with three asset types defined above.
 *
 *   3. Select Transactions — shared <TransactionsGrid /> block with
 *      *two* page-local transactions. See the TRANSACTIONS comment
 *      above and the TransactionsGrid JSDoc for the 2-card layout
 *      treatment.
 *
 * Accessibility — visually-hidden H1:
 *   No visible H1 in the design (no title banner on this page).
 *   We ship an sr-only <h1> for the screen-reader / one-H1-per-page
 *   convention, same as on Residential Real Estate, Investment Grade
 *   ABF, and Origination Platforms.
 *
 * Layout note on Section 1:
 *   Both columns share a grid row whose height is the taller of
 *   (a) the right column's large image and (b) the left column's
 *   (H3 text + small image) stack. The right image is set to
 *   `md:h-full md:object-cover` so it always fills the row top-to-
 *   bottom (cropping slightly if the left stack drives the row).
 *   The left column is a flex column with `justify-between`, pinning
 *   the H3 to its top and the small image to its bottom. Result:
 *   both image bottoms align at the row bottom; the small left image
 *   is shorter, so its top sits well below the right image's top.
 *   Same alignment trick as the ABF Credit Opportunities Section 2,
 *   just mirrored.
 */
export default function MediaPage() {
  return (
    <>
      <PageHead title={mediaMeta.title} description={mediaMeta.description} />
      <main>
        {/*
         * Section 1 — designer-specified 90px module top/bottom
         * padding (deviation from the 120px module standard, same
         * convention used on every sector page intro).
         */}
        <section className="bg-paper-deep px-6 py-[90px] sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="sr-only">Media</h1>

            <div
              className={
                'grid grid-cols-1 gap-y-12 ' +
                'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
              }
            >
              <div className="flex flex-col justify-between gap-12">
                <h3 className="text-white">
                  Crayhill provides tailored capital solutions backed by
                  royalties, residuals and advances to allow artists,
                  labels, studios and production companies to finance
                  their long-duration assets with predictable cash flows.
                </h3>

                <div className="group overflow-hidden">
                  <img
                    src="/images/sectors-media-hero-1.jpg"
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

              <div className="group overflow-hidden">
                <img
                  src="/images/sectors-media-hero-2.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={
                    'block w-full ease-out ' +
                    'md:h-full md:object-cover ' +
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
