import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import { investmentGradeABFMeta } from '@/pages/strategies/investment-grade-abf/meta'

/*
 * Page-specific asset types. NOT in @/data/sectors because these are
 * sub-asset-types of the Investment Grade ABF strategy, distinct from
 * the top-level investment sectors that the homepage Asset Focus
 * block and the ABF Credit Opportunities page enumerate.
 *
 * TODO(routes): placeholder /sectors/* slugs — confirm with the IA
 * owner whether each asset type gets its own page, lives under a
 * different namespace, or becomes an anchor on a future expansion of
 * this page. Links currently fall through to NotFoundPage.
 */
const ASSET_TYPES: ReadonlyArray<KeyItem> = [
  { label: 'Residential Lot Financing', to: '/sectors/residential-lot-financing' },
  { label: 'Non-Qualified Mortgages', to: '/sectors/non-qualified-mortgages' },
  { label: 'Utility-Scale Solar Projects', to: '/sectors/utility-scale-solar-projects' },
  { label: 'Home Equity Investments', to: '/sectors/home-equity-investments' },
]

/**
 * Investment Grade ABF page (/strategies/investment-grade-abf).
 * Linked from the About → Strategies dropdown in TopNav and from the
 * Footer About column.
 *
 * Page composition (top to bottom):
 *
 *   1. Title — <section> on --color-paper-deep (#293A51). Centered H1
 *      "Investment Grade ABF" in white. Standard module padding.
 *
 *   2. Intro — <section> on --color-paper-dark (#1B2636). Two-column row:
 *        left intro copy as <h3> (white), right hero image. Hero zooms on
 *        hover (same group-hover pattern as other strategy pages).
 *      120px module top/bottom padding.
 *
 *   3. Key Asset Types — the shared <KeyItemsList /> block on
 *      --color-paper-deep, fed with the page-local ASSET_TYPES list
 *      (defined above; see comment for why it isn't in @/data/sectors).
 *
 * Layout note on Section 2:
 *   - Mobile (< md): single column stack, text above image, 12-unit
 *     vertical gap between them.
 *   - md+: two columns with a 2:3 ratio (image gets slightly more
 *     width than text, matching the screenshot's relative widths).
 *     `items-start` so the text top-aligns with the top of the image;
 *     the image's natural aspect ratio drives the row height, with
 *     whitespace below the (shorter) text column.
 */
export default function InvestmentGradeABFPage() {
  return (
    <>
      <PageHead
        title={investmentGradeABFMeta.title}
        description={investmentGradeABFMeta.description}
      />
      <main>
        <section className="bg-paper-deep px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-white">Investment Grade ABF</h1>
          </div>
        </section>

        <section className="bg-paper-dark px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <div
              className={
                'grid grid-cols-1 items-start gap-y-12 ' +
                'md:grid-cols-[2fr_3fr] md:gap-x-10 md:gap-y-0'
              }
            >
              <h3 className="text-white">
                Crayhill&rsquo;s investment grade ABF program is designed for
                institutional investors that require investment grade credit
                quality, predictable income, and low risk-weighted capital
                efficiency. The program issues private asset-backed notes
                referencing pools of real or financial assets structured to
                achieve investment grade ratings while delivering the
                enhanced yield and diversification of private markets.
              </h3>

              <div className="group overflow-hidden rounded-image">
                <img
                  src="/images/strategies-inv-grade-hero.jpg"
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
          </div>
        </section>

        <KeyItemsList eyebrow="Key Asset Types" items={ASSET_TYPES} />
      </main>
    </>
  )
}
