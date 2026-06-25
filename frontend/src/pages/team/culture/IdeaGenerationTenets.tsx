import { MaskedIcon } from '@/components/MaskedIcon'
import { useInViewOnce } from '@/hooks/useInViewOnce'

/**
 * Middle band of the Culture page — three "tenets of our team's
 * approach to idea generation" rendered as icon + body-1 caption
 * on a paper-deep (#293A51) background.
 *
 * Designer spec (annotated screenshot):
 *   - Module padding: 120px top/bottom
 *   - Block background: --color-paper-deep
 *   - Headline: H3 white, centered
 *   - Icons: 45px tall, --color-accent (#57A0DD) — no hover state
 *     (this section is not interactive; the recoloring affordance
 *     used on Our Approach doesn't apply here)
 *   - Caption: Body 1 white, centered under each icon
 *   - Animation: each icon + caption pair slides in from the left
 *     when the row scrolls into view (staggered)
 *
 * Layout choice (3 columns vs 4):
 *   The Our Approach section uses 4 columns; this one uses 3.
 *   That's why the tenets list isn't a generic shared component —
 *   the column count, headline level (H3 here vs H1 there), and
 *   absence of a hover state are all different. If a third
 *   "icon-grid-on-dark" instance shows up, that's the moment to
 *   extract a shared IconGrid component.
 */

type Tenet = {
  /** Path under /icons served by Vite publicDir; the SVG is recolored
   *  via MaskedIcon so it picks up the accent color from CSS. */
  iconPath: string
  /** Body 1 white caption underneath the icon. */
  text: string
}

const TENETS: ReadonlyArray<Tenet> = [
  {
    iconPath: '/icons/icon-04.svg',
    text:
      'Focus on accuracy over confirmation where objectivity and ' +
      'truth seeking are rewarded',
  },
  {
    iconPath: '/icons/icon-10.svg',
    text:
      'Accountability based on mutually derived goals and ' +
      'targeted outcomes',
  },
  {
    iconPath: '/icons/icon-41.svg',
    text: 'Openness to a diversity of ideas',
  },
]

/*
 * Animation tuning. Same family as Our Approach (left → in) but
 * dialed for a 3-column row of shorter content: slightly faster
 * duration so all three tenets settle before the eye finishes
 * scanning the headline, and a similar stagger to Our Approach
 * so the cadence reads as part of the same site's vocabulary.
 */
const ANIM_DURATION_MS = 1200
const ANIM_STAGGER_MS = 240

export function IdeaGenerationTenets() {
  const [gridRef, inView] = useInViewOnce<HTMLDivElement>()

  return (
    <section className="bg-paper-deep px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="text-center text-white">
          The key tenets of our team{'\u2019'}s approach to idea generation
          include:
        </h3>

        <div
          ref={gridRef}
          className={
            'mt-element grid grid-cols-1 gap-y-14 ' +
            'md:grid-cols-3 md:gap-x-10 md:gap-y-0'
          }
        >
          {TENETS.map((tenet, i) => (
            <div
              key={tenet.iconPath}
              className={
                'flex flex-col items-center text-center ' +
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
              }}
            >
              {/*
               * h-[45px] matches the designer's "Icon Height: 45px"
               * call. w-12 (48px) gives the mask plenty of room so
               * the SVG renders at its natural aspect rather than
               * being squeezed by a width constraint. bg-accent
               * provides the visible color through the SVG's alpha
               * channel.
               */}
              <MaskedIcon
                src={tenet.iconPath}
                className="block h-[45px] w-12 bg-accent"
              />

              <p className="mt-6 max-w-xs text-white">{tenet.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
