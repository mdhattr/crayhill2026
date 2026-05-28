import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref + boolean flag that flips to `true` the first time the
 * referenced element enters the viewport, then stops observing.
 *
 * Designed for one-shot scroll-triggered animations (entrance reveals,
 * staggered slide-ins, etc.). The observer disconnects after firing so the
 * animation doesn't replay when the user scrolls back up.
 *
 * Behavior:
 *   - Default threshold = 0.2 (fires when ~20% of the element is visible).
 *     Tune via the argument if the section is unusually tall/short.
 *   - If IntersectionObserver isn't available (older runtime / non-browser
 *     environment), we flip to `true` immediately — the animation is lost
 *     but the final state is shown, so nothing is invisible.
 *   - The hook returns the ref object directly so the caller writes
 *     `ref={ref}` on the element they want observed. The element type is
 *     a generic parameter, so callers can narrow it to (e.g.) HTMLUListElement
 *     and get correct DOM typing on the ref.
 *
 * Pair with `motion-reduce:` Tailwind utilities at the call site to honor
 * `prefers-reduced-motion`. This hook is content-agnostic and doesn't read
 * the motion preference itself; we let the animation CSS do that.
 */
export function useInViewOnce<T extends Element>(
  threshold = 0.2,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // entries always has at least one item (the observed node), but
        // tsconfig's noUncheckedIndexedAccess models the access as
        // possibly-undefined, so we check explicitly.
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
