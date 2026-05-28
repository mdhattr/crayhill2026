/**
 * "Select Transactions" feature block on the Origination Platforms
 * page. Highlights a single notable transaction with a green CTA
 * that opens the partner company's external site in a new tab.
 *
 * Per-element treatment is driven by explicit designer annotations:
 *   - Module top/bottom padding: 120px (`py-module`).
 *   - Background: --color-accent-navy (#374D6C) — the lightest of
 *     the three navies in the brand palette. Distinct from paper-
 *     dark (used for KeyItemsList) and paper-deep (used for the
 *     intro section above), so the page reads as three discrete
 *     navy modules stacked in increasing lightness.
 *   - Eyebrow: H5 in --color-accent (blue).
 *   - Headline: H2 in white.
 *   - CTA: --color-accent-green button, Body 2 SemiBold white text.
 *
 * Layout:
 *   - md+: two columns, image left + text-stack right, vertically
 *     centered against the image (`items-center`) — matches the
 *     screenshot where the eyebrow/headline/button group sits at
 *     the visual middle of the image's height.
 *   - mobile (< md): stacked, image above text, with a 12-unit
 *     vertical gap.
 *
 * Image: intentionally NOT a hover-zoom (the page-behavior note
 * specifies hover-zoom only for the *Hero Image* in the intro
 * section). The image here is illustrative; the only interactive
 * surface in this block is the CTA.
 *
 * CTA — accessibility:
 *   The visible button label is the partner brand name ("SUNRAYCER",
 *   rendered uppercase via CSS) but is authored in source as
 *   "Sunraycer" so screen readers pronounce it as a word rather
 *   than spelling letter-by-letter. The aria-label additionally
 *   surfaces the open-in-new-tab behavior, which target="_blank"
 *   alone does not announce reliably across screen readers. The
 *   rel="noopener noreferrer" pairing with target="_blank" is the
 *   standard external-link security guardrail.
 *
 * Extending later:
 *   If the page grows to multiple highlighted transactions, lift
 *   the currently-hardcoded company / headline / href fields into
 *   a `transactions` array and render with a map. The visual block
 *   already lives in its own <section>; stacking N of them is
 *   either N sections or one section with internal repetition,
 *   depending on the eventual designer spec.
 */

export function SelectTransactions() {
  return (
    <section className="bg-accent-navy px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div
          className={
            'grid grid-cols-1 items-center gap-y-12 ' +
            'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
          }
        >
          <div>
            <img
              src="/images/strategies-origin-plat-grid-1.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block w-full"
            />
          </div>

          <div>
            <h5 className="text-accent">Select Transactions</h5>
            <h2 className="mt-4 text-white">
              Independent Power Producer of Solar and Battery Power Plants
            </h2>
            <div className="mt-8">
              <a
                href="https://sunraycer.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Sunraycer (opens in a new tab)"
                className={
                  'inline-block rounded bg-accent-green px-6 py-3 ' +
                  'text-body-2 font-semibold uppercase text-white ' +
                  'transition-[filter] duration-150 ease-out ' +
                  'hover:brightness-95 ' +
                  'focus-visible:brightness-95 focus-visible:outline-none ' +
                  'motion-reduce:!transition-none'
                }
              >
                Sunraycer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
