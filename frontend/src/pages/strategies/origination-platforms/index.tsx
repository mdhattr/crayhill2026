import { KeyItemsList, type KeyItem } from '@/components/KeyItemsList'
import { PageHead } from '@/components/PageHead'
import { SelectTransactions } from '@/pages/strategies/origination-platforms/SelectTransactions'
import { originationPlatformsMeta } from '@/pages/strategies/origination-platforms/meta'

/*
 * Page-specific sub-sectors. NOT in @/data/sectors — these are the
 * Origination Platforms strategy's own sub-sector taxonomy, distinct
 * from both the top-level investment SECTORS and the Investment
 * Grade ABF asset types. Each strategy enumerates its own.
 *
 * TODO(routes): placeholder /sectors/* slugs — confirm with the IA
 * owner whether each sub-sector gets its own page, lives under a
 * different namespace (e.g. /sub-sectors/), or anchors into a future
 * expansion of this page. Links currently fall through to NotFoundPage.
 */
const SUB_SECTORS: ReadonlyArray<KeyItem> = [
  {
    label: 'Renewable Energy and Battery Storage',
    to: '/sectors/renewable-energy-and-battery-storage',
  },
  {
    label: 'Power Generation and Transmission',
    to: '/sectors/power-generation-and-transmission',
  },
  {
    label: 'Digital and Communications Infrastructure',
    to: '/sectors/digital-and-communications-infrastructure',
  },
  {
    label: 'Mortgage Financing and Bridge Loans',
    to: '/sectors/mortgage-financing-and-bridge-loans',
  },
]

/**
 * Origination Platforms page (/strategies/origination-platforms).
 * Linked from the About → Strategies dropdown in TopNav and from the
 * Footer About column.
 *
 * Page composition (top to bottom):
 *
 *   1. Intro — <section> on --color-paper-deep.
 *        Left:  hero image (strategies-origin-plat-hero.jpg), zooms
 *               slightly on hover (group-hover scale, same pattern
 *               as the other strategy hero images).
 *        Right: paragraph of body copy in white.
 *      Image-LEFT / text-RIGHT ordering is the inverse of the
 *      Investment Grade ABF page's intro — alternating sides across
 *      strategy pages keeps the set from feeling templated.
 *      120px module top/bottom padding (standard).
 *
 *   2. Key Sub-Sectors — the shared <KeyItemsList /> block, eyebrow
 *      copy changed per designer's note ("KEY ASSET TYPES" -> "KEY
 *      SUB-SECTORS"). On --color-paper-dark.
 *
 *   3. Select Transactions — see SelectTransactions.tsx. New block
 *      type introduced on this page; renders on --color-accent-navy
 *      with a green external-link CTA.
 *
 * Per-page behavior (from designer's annotation):
 *   - The Hero Image (Section 1) zooms slightly on hover.
 *   - Key Sub-Sectors rows animate in as they scroll into view.
 *   The Select Transactions image deliberately does NOT zoom — the
 *   designer specifies hover-zoom only for the Hero Image. See
 *   SelectTransactions.tsx for the same note.
 *
 * Accessibility — visually-hidden H1:
 *   Like the Investment Grade ABF page, the design does not show a
 *   visible <h1>; the title "Origination Platforms" lives in the
 *   document title and TopNav. We ship an sr-only <h1> so the page
 *   has exactly one H1 in the DOM for screen reader navigation.
 */
export default function OriginationPlatformsPage() {
  return (
    <>
      <PageHead
        title={originationPlatformsMeta.title}
        description={originationPlatformsMeta.description}
      />
      <main>
        <section className="bg-paper-deep px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="sr-only">Origination Platforms</h1>

            <div
              className={
                'grid grid-cols-1 items-start gap-y-12 ' +
                'md:grid-cols-[3fr_2fr] md:gap-x-10 md:gap-y-0'
              }
            >
              <div className="group overflow-hidden rounded-image">
                <img
                  src="/images/strategies-origin-plat-hero.jpg"
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

              <p className="text-white">
                Crayhill partners directly with real asset infrastructure
                businesses to provide long-term capital and strategic
                support to build scalable platforms. Crayhill works
                alongside management teams to structure capital solutions
                that accelerate growth, strengthen balance sheets, and
                position their platforms to become category leaders in
                their respective markets.
              </p>
            </div>
          </div>
        </section>

        <KeyItemsList eyebrow="Key Sub-Sectors" items={SUB_SECTORS} />

        <SelectTransactions />
      </main>
    </>
  )
}
