/**
 * Static right-pointing chevron used to prefix CTAs ("Read More", "View All",
 * "View Bio"). Inherits color from its text parent via `currentColor`, so the
 * parent's hover color change applies to the icon too without separate
 * handling. Decorative — `aria-hidden`.
 */
export function CtaChevron() {
  return (
    <svg
      width="0.7em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}
