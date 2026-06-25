type ChevronDirection = 'left' | 'right'

/**
 * Both directions share the same glyph bounds (x 9–15, y 6–18 in the source
 * 24-grid), so a single tight viewBox crops either one identically — that's
 * what keeps a left "‹ Back" caret optically matched to a right "› Read More"
 * caret.
 */
const CHEVRON_POINTS: Record<ChevronDirection, string> = {
  right: '9 6 15 12 9 18',
  left: '15 6 9 12 15 18',
}

/**
 * The single source of truth for inline text chevrons across the site —
 * "Read More" / "View All" / "View bio" CTAs and the "‹ Team" style back
 * links. Inherits color from its text parent via `currentColor`, so the
 * parent's hover color change applies to the icon too without separate
 * handling. Decorative — `aria-hidden`.
 *
 * Adjust size/weight here and every chevron stays consistent.
 *
 * Sizing is in `em`, so the chevron scales with the font-size of whatever it
 * sits next to. The viewBox is cropped tightly to the glyph (rather than the
 * usual 0 0 24 24, where the chevron only fills the middle ~half and therefore
 * renders visually small and floats inside empty SVG padding): with this box
 * the visible chevron is ~0.8em tall, roughly the cap-height of the adjacent
 * text, sits flush against its label, and the stroke reads at a weight that
 * pairs with the semibold label.
 */
export function CtaChevron({
  direction = 'right',
}: {
  direction?: ChevronDirection
} = {}) {
  return (
    <svg
      width="0.6em"
      height="1em"
      viewBox="7.5 4.5 9 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <polyline points={CHEVRON_POINTS[direction]} />
    </svg>
  )
}
