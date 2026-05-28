/**
 * TransactionsGrid — centered H2 above a grid of N transaction cards
 * (image + Body 1 caption). Used at the bottom of every sector
 * page's transaction-showcase block ("Select Transactions").
 *
 * Visually distinct from the *other* SelectTransactions block on the
 * Origination Platforms page, which features a single transaction
 * with a green external-link CTA on an accent-navy surface. That
 * one stays page-local; this grid is the recurring sector-page
 * variant.
 *
 * Per-element treatment from the designer's annotations
 * (consistent across sector pages so far):
 *   - Module padding top: 90px (`pt-element`).
 *   - Module padding bottom: 120px (`pb-module`).
 *   - Background: --color-paper-deep (#293A51).
 *   - Heading: H2 in white, centered above the card grid.
 *   - Card caption: Body 1 in white, centered below its image.
 *
 * Layout:
 *   - md+, 3+ transactions: 3-column grid spanning the full content
 *     width (`max-w-7xl` from the page container), 40px (`gap-x-10`)
 *     gutter. Each card lands at roughly 400px wide.
 *   - md+, exactly 2 transactions: 2-column grid constrained to a
 *     narrower inner container (`max-w-4xl`) and centered in the
 *     section. Each card stays at roughly the same width as it would
 *     be in the 3-card layout — i.e. the design intent is "same-
 *     sized cards, centered as a pair", NOT "two cards stretched to
 *     fill the full content width". The Media sector page is the
 *     first instance of this 2-card case.
 *   - mobile (< md): single-column stack regardless of count.
 *   - 1 transaction or 4+ are not covered by any designer spec yet;
 *     they fall through to the 3-column grid which handles them
 *     gracefully (1 lands at left, 4+ wraps).
 *
 * Cards are static illustration — no per-card link in any designer
 * spec yet. If a future spec lights up per-transaction detail pages,
 * extend the Transaction type with an optional `to` field and
 * conditionally wrap each <article> in a <NavLink>; the rest of
 * the markup is structured to absorb that change cleanly.
 *
 * Images intentionally do NOT hover-zoom: the page-behavior notes
 * across sector pages reserve hover-zoom for *Hero Images* in the
 * intro section only.
 */

export type Transaction = {
  /** Root-relative image URL (e.g. "/images/sectors-power-grid-1.jpg"). */
  imageSrc: string
  /**
   * Alt text for the image. Defaults to empty + aria-hidden when
   * omitted, treating the image as decorative (which it currently is
   * — the caption carries all the meaning). Pass a real alt only if
   * the image conveys information the caption doesn't.
   */
  imageAlt?: string
  /** Body 1 caption rendered centered below the image. */
  caption: string
}

export function TransactionsGrid({
  heading,
  transactions,
}: {
  /**
   * H2 heading text, authored in Title Case. The H2 base rule
   * handles typography; this component handles centering.
   * Typically "Select Transactions" per the existing designer spec.
   */
  heading: string
  transactions: ReadonlyArray<Transaction>
}) {
  // The grid layout adapts to the number of transactions. See the
  // module-level JSDoc for the rationale; in short: for 2, we
  // centre a narrower 2-column grid so each card stays the same
  // width as a 3-card-layout card. For 3+, we use the full-width
  // 3-column grid.
  const isPair = transactions.length === 2
  const gridClass = isPair
    ? 'mt-element mx-auto grid max-w-4xl grid-cols-1 gap-y-12 ' +
      'md:grid-cols-2 md:gap-x-10 md:gap-y-0'
    : 'mt-element grid grid-cols-1 gap-y-12 ' +
      'md:grid-cols-3 md:gap-x-10 md:gap-y-0'

  return (
    <section className="bg-paper-deep px-6 pt-element pb-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-white">{heading}</h2>

        <div className={gridClass}>
          {transactions.map((transaction) => {
            const hasAlt =
              typeof transaction.imageAlt === 'string' &&
              transaction.imageAlt.length > 0

            return (
              <article key={transaction.imageSrc} className="flex flex-col">
                <img
                  src={transaction.imageSrc}
                  alt={hasAlt ? transaction.imageAlt : ''}
                  aria-hidden={hasAlt ? undefined : true}
                  loading="lazy"
                  className="block w-full"
                />
                <p className="mt-6 text-center text-white">
                  {transaction.caption}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
