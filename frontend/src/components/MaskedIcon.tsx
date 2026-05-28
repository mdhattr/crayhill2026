import type { CSSProperties } from 'react'

/**
 * Recolorable SVG icon rendered via CSS `mask-image`.
 *
 * Why this pattern (vs. an <img>, or vs. inlining the SVG):
 *
 *   - <img src=".svg"> renders the SVG with its own fill colors baked in.
 *     To recolor on hover you'd need CSS `filter: hue-rotate(...) brightness(...)`
 *     hacks, which can only approximate a target color, never hit it exactly.
 *
 *   - Inlining the SVG paths in JSX would let you fill="currentColor", but
 *     then every icon's path data lives inside the codebase (huge diff
 *     noise, designer can't drop in new SVGs).
 *
 *   - CSS mask uses the SVG's alpha channel as a shape; the visible color
 *     comes from `background-color`. So we keep SVGs as assets the
 *     designer edits in Illustrator, and React only owns the color (via
 *     Tailwind classes like `bg-accent`, `group-hover:bg-accent-green`).
 *     Hover transitions are a regular `transition-colors` away.
 *
 * Caveats / when NOT to use this:
 *
 *   - SVGs with multiple fill colors collapse to a single mask shape
 *     (color information is discarded). Only the silhouette is preserved.
 *     Use inline SVG if you need per-path coloring.
 *
 *   - Browser support: modern Chrome/Firefox/Edge support unprefixed
 *     `mask-*`; Safari 15.3 and below need `-webkit-mask-*`. We emit both
 *     to cover older Safari without thinking about it.
 *
 *   - The element is a styled <div>, not semantic. Always provide
 *     accessible name via the surrounding context (a sibling label, etc.)
 *     and let this element be `aria-hidden`. For icons that ARE the
 *     accessible name of an interactive control, prefer inline SVG with
 *     <title>.
 *
 * Usage:
 *
 *   <MaskedIcon
 *     src="/icons/icon-43.svg"
 *     className="h-[45px] w-[45px] bg-accent transition-colors group-hover:bg-accent-green"
 *   />
 *
 * The caller controls size (h-/w-), default color (bg-*), and any hover
 * or transition behavior. This component only sets up the masking plumbing.
 */
export function MaskedIcon({
  src,
  className = '',
}: {
  src: string
  className?: string
}) {
  const url = `url("${src}")`
  // Inline style is the only practical way to template the asset URL —
  // Tailwind arbitrary values can't dynamically interpolate at runtime.
  // The unprefixed and -webkit- variants are emitted together so we
  // don't have to think about the Safari ≤15.3 fallback.
  const style: CSSProperties = {
    maskImage: url,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskImage: url,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
  }

  return <span aria-hidden="true" className={className} style={style} />
}
