import { NavLink } from 'react-router-dom'
import { useInViewOnce } from '@/hooks/useInViewOnce'

/**
 * KeyItemsList — the dark-surface "enumerated list of subdivisions"
 * block. Used on every strategy page and on every sector page; the
 * two visual treatments differ in heading scale and divider color,
 * captured by the `variant` prop.
 *
 * Variant: 'strategy' (default)
 *   - Used on Strategies pages (ABF Credit Opportunities, Investment
 *     Grade ABF, Origination Platforms).
 *   - Tighter rhythm: `pt-10 pb-module` (40px top, 120px bottom). The
 *     40px top is intentional — these blocks sit either directly
 *     below another paper-dark section (no color change to bridge)
 *     or right after a hard paper-deep → paper-dark transition, and
 *     the designer wants the eyebrow close to the top of the dark
 *     surface in both cases.
 *   - Items as <h4> white links. Hover/focus → --color-accent-green.
 *   - Dividers as white-at-20%-opacity rules.
 *
 * Variant: 'sector'
 *   - Used on sector deep-dive pages (Power & Infrastructure, etc).
 *   - Standard module padding: `py-module` (120px top and bottom) —
 *     the designer's explicit per-element annotation on this page.
 *   - Items as <h3> white links (larger headline scale; the items
 *     here are the canonical "asset types" of the sector, which the
 *     design treats as more prominent than the strategy-page
 *     subdivisions).
 *   - Dividers as --color-accent-light (#9AC6EB) — the lightest
 *     swatch in the brand navy→sky-blue gradient.
 *
 * Both variants:
 *   - <section> on --color-paper-dark.
 *   - H5 eyebrow in --color-accent (blue), uppercase + tracking from
 *     the H5 base rule.
 *   - Full-row click target (`block` on the NavLink + padding on the
 *     link, not on the heading), accent-green on hover/focus.
 *   - The list is bracketed top and bottom by the same divider rule.
 *
 * Animation (both variants):
 *   Items slide up + fade in from below as the list enters the
 *   viewport. One-shot via useInViewOnce; staggered by index; honors
 *   prefers-reduced-motion.
 */

export type KeyItem = {
  /** Display label, authored in Title Case. */
  label: string
  /**
   * Route the item links to. Accepts any react-router-dom-compatible
   * `to` value — typically a kebab-case slug under `/sectors/...`
   * for the existing pages, but page authors are free to point items
   * at whatever route makes sense for their context.
   */
  to: string
}

export type KeyItemsListVariant = 'strategy' | 'sector'

const ANIM_DURATION_MS = 650
const ANIM_STAGGER_MS = 110

// Variant-specific style tokens. Co-located so adding a third variant
// later is a single-place change (add a row, the JSX consumes it).
const VARIANT_STYLES: Record<
  KeyItemsListVariant,
  {
    sectionPadding: string
    /** Border + divide-y classes for the <ul>. */
    rules: string
  }
> = {
  strategy: {
    sectionPadding: 'pt-10 pb-module',
    rules: 'divide-y divide-white/20 border-y border-white/20',
  },
  sector: {
    sectionPadding: 'py-module',
    rules:
      'divide-y divide-accent-light border-y border-accent-light',
  },
}

export function KeyItemsList({
  eyebrow,
  items,
  variant = 'strategy',
}: {
  /**
   * H5 eyebrow text. Authored in Title Case (or however the brand
   * writes it); the H5 base rule applies uppercase via CSS so any
   * casing in source survives unchanged for AT/RSS readers.
   */
  eyebrow: string
  items: ReadonlyArray<KeyItem>
  /**
   * Treatment variant. See the JSDoc on this module for the
   * differences between 'strategy' and 'sector'. Defaults to
   * 'strategy' for backward compatibility with existing usage.
   */
  variant?: KeyItemsListVariant
}) {
  const [listRef, inView] = useInViewOnce<HTMLUListElement>()
  const styles = VARIANT_STYLES[variant]

  return (
    <section
      className={`bg-paper-dark px-6 sm:px-10 ${styles.sectionPadding}`}
    >
      <div className="mx-auto max-w-7xl">
        <h5 className="text-accent">{eyebrow}</h5>

        <ul ref={listRef} className={`mt-6 ${styles.rules}`}>
          {items.map((item, i) => {
            const liClass =
              'transition-[transform,opacity] ease-out ' +
              'motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ' +
              'motion-reduce:!transition-none ' +
              (inView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0')

            const linkClass =
              'block py-6 text-white ' +
              'transition-colors duration-150 ' +
              'hover:text-accent-green ' +
              'focus-visible:text-accent-green focus-visible:outline-none'

            // Visually-styling = semantic tag (per brand rule):
            // strategy variant renders H4 items, sector variant H3.
            const HeadingTag = variant === 'sector' ? 'h3' : 'h4'

            return (
              <li
                key={item.to}
                className={liClass}
                style={{
                  transitionDuration: `${ANIM_DURATION_MS}ms`,
                  transitionDelay: `${i * ANIM_STAGGER_MS}ms`,
                }}
              >
                <HeadingTag>
                  <NavLink to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                </HeadingTag>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
