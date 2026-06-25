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
 *   1. Title — <section> on --color-paper-deep (#293A51). Centered H1
 *      "Origination Platforms" in white. Standard module padding.
 *
 *   2. Intro — <section> on --color-paper-dark (#1B2636). Two-column row:
 *        left hero image, right intro copy as <h3> (white). Image-left /
 *        text-right ordering is the inverse of Investment Grade ABF.
 *        Hero zooms on hover (group-hover scale, same pattern as other
 *        strategy pages). 120px module top/bottom padding.
 *
 *   3. Key Asset Types — the shared <KeyItemsList /> block on
 *      --color-paper-deep.
 *
 *   4. Select Transactions — see SelectTransactions.tsx. New block
 *      type introduced on this page; renders on --color-accent-navy
 *      with a green external-link CTA.
 *
 * Per-page behavior (from designer's annotation):
 *   - The Hero Image (Section 2) zooms slightly on hover.
 *   - Key Asset Types rows animate in as they scroll into view.
 *   The Select Transactions image deliberately does NOT zoom — the
 *   designer specifies hover-zoom only for the Hero Image. See
 *   SelectTransactions.tsx for the same note.
 *
 * Layout note on Section 2:
 *   - Mobile (< md): single column stack, image above text, 12-unit
 *     vertical gap between them.
 *   - md+: two columns with a 3:2 ratio (image gets slightly more
 *     width than text).
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
            <h1 className="text-center text-white">Origination Platforms</h1>
          </div>
        </section>

        <section className="bg-paper-dark px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
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

              <h3 className="text-white">
                Crayhill partners directly with real asset infrastructure
                businesses to provide long-term capital and strategic
                support to build scalable platforms. Crayhill works
                alongside management teams to structure capital solutions
                that accelerate growth, strengthen balance sheets, and
                position their platforms to become category leaders in
                their respective markets.
              </h3>
            </div>
          </div>
        </section>

        <KeyItemsList eyebrow="Key Asset Types" items={SUB_SECTORS} />

        <SelectTransactions />
      </main>
    </>
  )
}
