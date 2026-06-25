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
 *   1. Intro — <section> on --color-paper-deep.
 *        Left:  paragraph of body copy (white).
 *        Right: hero image (strategies-inv-grade-hero.jpg). Zooms
 *               slightly on hover (CSS group-hover; same pattern as
 *               the WhoWeArePage and ABF Credit Opportunities hero
 *               images).
 *      120px module top/bottom padding — the standard module rhythm.
 *      Unlike the ABF Credit Opportunities page, this one has no
 *      separate title banner above the intro; the design hands off
 *      with the two-column content as the first thing the user sees.
 *
 *   2. Key Asset Types — the shared <KeyItemsList /> block, fed with
 *      the page-local ASSET_TYPES list (defined above; see comment
 *      for why it isn't in @/data/sectors). Continues on
 *      --color-paper-dark.
 *
 * Accessibility note — visually-hidden H1:
 *   The design does not show a visible <h1> on this page; the title
 *   "Investment Grade ABF" lives in the TopNav breadcrumb / page
 *   title bar / document <title>. To keep the page navigable for
 *   screen readers and to satisfy "every page has exactly one H1",
 *   we ship an sr-only <h1>. The visual design is unchanged.
 *
 * Layout note on Section 1:
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
            <h1 className="sr-only">Investment Grade ABF</h1>

            <div
              className={
                'grid grid-cols-1 items-start gap-y-12 ' +
                'md:grid-cols-[2fr_3fr] md:gap-x-10 md:gap-y-0'
              }
            >
              <p className="text-white">
                Crayhill&rsquo;s investment grade ABF program is designed for
                institutional investors that require investment grade credit
                quality, predictable income, and low risk-weighted capital
                efficiency. The program issues private asset-backed notes
                referencing pools of real or financial assets structured to
                achieve investment grade ratings while delivering the
                enhanced yield and diversification of private markets.
              </p>

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
