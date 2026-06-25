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
 *   - Items as <h4> in white.
 *   - Dividers as white-at-20%-opacity rules.
 *
 * Variant: 'sector'
 *   - Used on sector deep-dive pages (Power & Infrastructure, etc).
 *   - Standard module padding: `py-module` (120px top and bottom) —
 *     the designer's explicit per-element annotation on this page.
 *   - Items as <h4> in white (same scale as strategy pages).
 *   - Dividers as --color-accent-light (#9AC6EB) — the lightest
 *     swatch in the brand navy→sky-blue gradient.
 *
 * Linking (`linked` prop, default false):
 *   - By default items render as plain headings — NOT links, no hover
 *     or focus color change. This is the common case: most key-asset
 *     lists are descriptive, not navigable.
 *   - When `linked` is true, each item with a `to` becomes a full-row
 *     <NavLink> (accent-green on hover/focus). Only the ABF Credit
 *     Opportunities page opts in, linking each asset type to its
 *     canonical sector page.
 *
 * Both variants:
 *   - <section> on --color-paper-deep (#293A51).
 *   - H5 eyebrow in --color-accent (blue), uppercase + tracking from
 *     the H5 base rule.
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
   * Route the item links to. Only consumed when the list is rendered
   * with `linked` (currently just the ABF Credit Opportunities page);
   * otherwise items are plain headings and `to` is ignored. Accepts
   * any react-router-dom-compatible `to` value — typically a
   * kebab-case slug under `/sectors/...`.
   */
  to?: string
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
  linked = false,
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
  /**
   * When true, items with a `to` render as full-row links with a
   * hover/focus accent. When false (default), items render as plain
   * headings with no link or hover effect. See the module JSDoc.
   */
  linked?: boolean
}) {
  const [listRef, inView] = useInViewOnce<HTMLUListElement>()
  const styles = VARIANT_STYLES[variant]

  return (
    <section
      className={`bg-paper-deep px-6 sm:px-10 ${styles.sectionPadding}`}
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

            // Shared row geometry: full-width block with the same
            // vertical padding whether the row is a link or plain text.
            const rowClass = 'block py-6 text-white'
            const linkClass =
              rowClass +
              ' transition-colors duration-150 ' +
              'hover:text-accent-green ' +
              'focus-visible:text-accent-green focus-visible:outline-none'

            // Visually-styling = semantic tag (per brand rule): all items
            // are <h4> so they inherit H4 typography from @layer base.
            const isLink = linked && Boolean(item.to)

            return (
              <li
                key={item.label}
                className={liClass}
                style={{
                  transitionDuration: `${ANIM_DURATION_MS}ms`,
                  transitionDelay: `${i * ANIM_STAGGER_MS}ms`,
                }}
              >
                {isLink ? (
                  <h4>
                    <NavLink to={item.to as string} className={linkClass}>
                      {item.label}
                    </NavLink>
                  </h4>
                ) : (
                  <h4 className={rowClass}>{item.label}</h4>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
