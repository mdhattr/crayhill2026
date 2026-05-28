import { useInViewOnce } from '@/hooks/useInViewOnce'

/**
 * "Firm Overview" sub-section inside the Who We Are navy module.
 *
 * Designer spec (annotated screenshot):
 *   - Title: H5, --color-accent (#57A0DD). H5 base rule applies uppercase
 *     transform; we author "Firm Overview" in title case and the CSS does
 *     the rest.
 *   - Copy: Body 1, white. Three paragraphs flowing through a two-column
 *     CSS multi-column block.
 *   - Scroll animation: content appears from the bottom of the module
 *     when the section enters the viewport (one-shot).
 *
 * Layout shape:
 *   On md and up, 4-column grid:
 *     col 1: H5 title (1/4 width)
 *     cols 2-4: prose (3/4 width, internally split into 2 columns via
 *               CSS `columns-2` so paragraphs flow naturally between the
 *               two text columns — which is what the design shows: the
 *               middle paragraph breaks mid-sentence between columns).
 *   On mobile (default), the layout stacks: title above, prose below in a
 *   single column (no multi-column).
 *
 * Animation note:
 *   Whole block translates up and fades in once. Paragraphs and title
 *   move as a group rather than staggering — keeps the prose block reading
 *   as one piece of content (vs. the homepage AssetFocus cascade where
 *   each card is conceptually independent).
 */

const ANIM_DURATION_MS = 700

export function FirmOverview() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={
        'grid grid-cols-1 gap-y-8 md:grid-cols-4 md:gap-x-10 ' +
        'transition-[transform,opacity] ease-out ' +
        'motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ' +
        'motion-reduce:!transition-none ' +
        (inView
          ? 'translate-y-0 opacity-100'
          : 'translate-y-12 opacity-0')
      }
      style={{ transitionDuration: `${ANIM_DURATION_MS}ms` }}
    >
      <div>
        {/* H5 base rule provides uppercase + tracking + weight; we only
            need to override color to the accent blue. */}
        <h5 className="text-accent">Firm Overview</h5>
      </div>

      <div
        className={
          'space-y-4 text-white md:col-span-3 ' +
          'md:columns-2 md:gap-x-10'
        }
      >
        <p>
          Founded by Carlos Mendez and Josh Eaton in 2015, Crayhill&rsquo;s
          asset-based investment strategies draw on our deep sector
          expertise and relationships throughout the structured finance and
          specialty finance markets.
        </p>
        <p>
          Our strategy is rooted in direct origination, thematic investing,
          and disciplined structuring. We seek to deliver tailored capital
          solutions across a range of opportunities backed by tangible or
          contractual cash-flowing assets, offering differentiated exposure
          across sectors and transaction types.
        </p>
        <p>
          We partner with a diverse global investor base, including
          insurance companies, pension funds, foundations, and consultants.
          We build our platform around these partnerships and offer a
          variety of tailored investment solutions.
        </p>
      </div>
    </div>
  )
}
