import { MaskedIcon } from '@/components/MaskedIcon'
import { useInViewOnce } from '@/hooks/useInViewOnce'

/**
 * "Our Approach" section — the bottom of the Who We Are page.
 *
 * Designer spec (annotated screenshot):
 *   - Background: white (--color-paper)
 *   - Module padding: 120px top, 120px bottom
 *   - Headline "Our Approach": H1, --color-paper-deep (#293A51), centered
 *   - Subhead: Body 1, ink, centered. Ends with a colon — it's an intro
 *     sentence for the four cards that follow.
 *   - Four principle cards in a row (centered text and icons):
 *       Icon (45px tall): default --color-accent, hover --color-accent-green
 *       Title:  Body 2 SemiBold, ink (rendered in an <h3> for screen-
 *               reader heading navigation — see comment below)
 *       Body:   Body 2, ink
 *   - Animation: cards slide in from the left, staggered, on viewport
 *     entry.
 *   - Icons are NOT clickable (per the page-level animation note); the
 *     hover-to-green is decorative interactivity only.
 *
 * Heading-tag choice for card titles:
 *   The designer spec says "Body 2 (Title: SemiBold)" — that's a body
 *   visual style, not a heading style, so our "visual H styling → H tag"
 *   convention doesn't dictate anything here (it's one-directional).
 *   We use <h3> regardless so screen-reader users get heading-navigation
 *   to each principle, matching the pattern used on the homepage
 *   (AssetFocus / NewsInsights) where card titles are also <h3>. The
 *   default H3 typography is overridden in className with
 *   `font-sans text-body-2 font-semibold` so the visual matches the spec.
 *
 * Hover scope:
 *   The hover green is triggered by `group-hover` on the whole card, not
 *   on the icon alone, so a user hovering anywhere over the card (icon
 *   or text) sees the icon turn green. More discoverable than icon-only
 *   hover, and there's no click action that the broader hover area could
 *   imply incorrectly (the icons aren't links).
 *
 * Why a CSS mask for the icons:
 *   The SVGs in /assets/icons/ have `fill: #57a0dd` hardcoded. To recolor
 *   on hover we use them as CSS mask-images and let `background-color`
 *   provide the visible color. See MaskedIcon for the full rationale.
 */

type Principle = {
  /** Icon asset path, served from /assets/icons/ at runtime. */
  iconPath: string
  /** Card heading (rendered as <h3> with Body 2 SemiBold styling). */
  title: string
  /** Card body copy. */
  body: string
}

const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    iconPath: '/icons/icon-43.svg',
    title: 'Direct Origination',
    body:
      'Crayhill sources transactions through long-standing relationships ' +
      'and thematic research, targeting areas where traditional capital is ' +
      'constrained.',
  },
  {
    iconPath: '/icons/icon-16.svg',
    title: 'Structured Protection',
    body:
      'Investments are designed with robust downside protections, ' +
      'including asset-level controls, extensive covenants, and ' +
      'diversified collateral.',
  },
  {
    iconPath: '/icons/icon-61.svg',
    title: 'Scalable Themes',
    body:
      'Crayhill identifies and builds exposure to scalable investment ' +
      'themes across sectors and asset types.',
  },
  {
    iconPath: '/icons/icon-64.svg',
    title: 'Active Risk Management',
    body:
      'Proprietary risk management technology enables real-time monitoring ' +
      'and data-driven oversight of portfolio assets.',
  },
]

// Slide-in animation tuning. Same family as the homepage AssetFocus
// cascade; small differences (slightly longer duration, slightly smaller
// stagger) tuned by eye for a 4-card row of taller content.
const ANIM_DURATION_MS = 1625
const ANIM_STAGGER_MS = 275

export function OurApproach() {
  const [gridRef, inView] = useInViewOnce<HTMLDivElement>()

  return (
    <section className="bg-paper px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-paper-deep">Our Approach</h1>

        <p className="mx-auto mt-4 max-w-3xl text-center text-ink">
          Our strategies are built on core principles that have delivered
          differentiated portfolios and consistent performance across market
          cycles:
        </p>

        <div
          ref={gridRef}
          className={
            'mt-element grid grid-cols-1 gap-y-14 ' +
            'sm:grid-cols-2 sm:gap-x-10 ' +
            'lg:grid-cols-4 lg:gap-x-10'
          }
        >
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.title}
              className={
                'group text-center transition-[transform,opacity] ease-out ' +
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
              <MaskedIcon
                src={p.iconPath}
                className={
                  'mx-auto block h-[45px] w-[45px] bg-accent ' +
                  'transition-colors duration-200 ' +
                  'group-hover:bg-accent-green'
                }
              />

              {/*
                <h3> for AT heading navigation; default H3 typography is
                overridden so the visual matches the designer's "Body 2
                SemiBold" spec. font-sans defeats the @layer base rule
                that puts H1–H4 in --font-display.
              */}
              <h3 className="mt-6 font-sans text-body-2 font-semibold text-ink">
                {p.title}
              </h3>

              <p className="mt-4 text-body-2 text-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
