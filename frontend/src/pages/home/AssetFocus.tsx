import { NavLink } from 'react-router-dom'
import { SECTORS } from '@/data/sectors'
import { useInViewOnce } from '@/hooks/useInViewOnce'

/**
 * Homepage "Asset Focus" section. Five sector cards arranged horizontally;
 * each is a colored 10px bar above an H3 label that links to the sector
 * page. Cards slide in from the left, staggered, the first time the row
 * enters the viewport (observed once via IntersectionObserver; the observer
 * disconnects after firing so there's no re-trigger on scroll-up/down).
 *
 * Designer spec (annotated screenshot):
 *   - Background: --color-paper-alt (#F3F3F3)
 *   - Module padding: 120px top + bottom desktop, 60px mobile (py-module)
 *   - Headline "Asset Focus": H1, --color-paper-deep (#293A51), centered
 *   - 90px gap between headline and bar row (kept at 90px on mobile too)
 *   - 5 colored bars, 10px tall, gradient navy → light blue
 *   - 40px gap between each bar and its label (30px on mobile)
 *   - Label: H3, ink (black) default; --color-accent-green (#92BE4B) on
 *     hover / click / keyboard focus
 *   - Animation: each (bar + label) unit slides in from the left, with a
 *     small per-card stagger
 *
 * Per project convention "visual styling = semantic tag":
 *   - "Asset Focus" is H1 (designer said H1) → <h1>
 *   - Each label is H3 (designer said H3) → <h3>
 *
 * Sector data (label, slug, bar color) comes from `@/data/sectors` —
 * single source of truth shared with the Key Asset Types list on the
 * ABF Credit Opportunities page. The TopNav still inlines its sectors
 * menu; when that's next touched, fold it into the data module too.
 */

// Slide-in animation tuning.
//   Duration: how long each card takes to travel from offset → 0.
//   Stagger:  the per-card delay step (card N starts at N * stagger).
//   Offset:   how far to the left each card starts (translateX).
// Total cascade length = stagger * (N - 1) + duration. ~2s at current values.
const ANIM_DURATION_MS = 1200
const ANIM_STAGGER_MS = 200
const ANIM_OFFSET_PX = 48

export function AssetFocus() {
  // The hook flips `inView` true the first time the bar row crosses the
  // viewport threshold, then disconnects — so the cards don't re-animate
  // when the user scrolls back up. Pairs with `motion-reduce:` utilities
  // below for the prefers-reduced-motion path.
  const [listRef, inView] = useInViewOnce<HTMLUListElement>()

  return (
    <section className="bg-paper-alt px-6 py-module sm:px-10">
      <h1 className="text-center text-paper-deep">Asset Focus</h1>

      <ul
        ref={listRef}
        /*
         * 90px gap between the "Asset Focus" headline and the bar row on
         * BOTH mobile and desktop. The designer's mobile mockup explicitly
         * keeps this at 90px (it does not drop to the 50px mobile element
         * default), so it's pinned with an arbitrary value rather than the
         * `mt-element` token, which would resolve to 50px below md.
         */
        className={
          'mx-auto mt-[90px] grid max-w-7xl ' +
          'grid-cols-1 gap-y-14 ' +
          'lg:grid-cols-5 lg:gap-x-10 lg:gap-y-0'
        }
      >
        {SECTORS.map((sector, i) => (
          <li
            key={sector.to}
            // Two parallel sets of utilities for the slide-in:
            //   inView=false → translated left, transparent
            //   inView=true  → in place, opaque
            // The transition itself is always on; the only thing that
            // changes is the target values. motion-reduce: forces the
            // "shown" state immediately for users who opted out of motion.
            className={
              'transition-[transform,opacity] ease-out ' +
              'motion-reduce:!translate-x-0 motion-reduce:!opacity-100 ' +
              'motion-reduce:!transition-none ' +
              (inView
                ? 'translate-x-0 opacity-100'
                : '-translate-x-12 opacity-0')
            }
            style={{
              transitionDuration: `${ANIM_DURATION_MS}ms`,
              transitionDelay: `${i * ANIM_STAGGER_MS}ms`,
              // The translate-x utility uses class-based values; the inline
              // style here would override only if Tailwind's class lost
              // specificity. We rely on the utility for the X offset and
              // only use inline style for timing.
            }}
          >
            <NavLink
              to={sector.to}
              className="group block focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="block h-[10px] w-full"
                style={{ backgroundColor: sector.barColor }}
              />
              <h3
                /*
                 * Gap between the colored bar and its label: 30px on mobile,
                 * 40px (`mt-10`) on desktop, per the mobile vs desktop comps
                 * ("Padding between bar and text: 30px" on mobile).
                 */
                className={
                  'mt-[30px] md:mt-10 transition-colors duration-150 ' +
                  'group-hover:text-accent-green ' +
                  'group-focus-visible:text-accent-green ' +
                  'group-focus-visible:underline ' +
                  'group-active:text-accent-green'
                }
              >
                {sector.label}
              </h3>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Unused-but-deliberate export: keep the offset constant alongside the
// component so a future contributor tuning the animation finds all three
// knobs (duration, stagger, offset) in one place. The translateX value
// itself is bound to the Tailwind utility `-translate-x-12` (= 48px) —
// keep these in sync if you adjust ANIM_OFFSET_PX.
export const __ASSET_FOCUS_ANIM_OFFSET_PX__ = ANIM_OFFSET_PX
