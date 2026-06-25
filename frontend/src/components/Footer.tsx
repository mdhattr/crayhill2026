import { Link, NavLink } from 'react-router-dom'

/**
 * Global site footer. Rendered by RootLayout below the page outlet so it
 * appears on every route.
 *
 * Brand spec (from designer):
 *   - Background: --color-paper-dark (#1B2636)
 *   - Top/bottom padding: 90px desktop, 60px mobile (mobile mockup)
 *   - 5 columns on desktop:
 *       1. Logo (white, 175px desktop / ~82.5px mobile — matches TopNav)
 *       2. ABOUT title + 4 links (Who We Are + 3 Strategies as flat siblings)
 *       3. SECTORS title + 5 links
 *       4. TEAM title + 4 links (Culture before Careers — matches nav)
 *       5. NEWS & INSIGHTS title (link) + PARTNER LOGIN title (link) +
 *          LinkedIn icon (link to external profile)
 *   - Blue H5 titles: --color-accent (#57A0DD), uppercase via existing H5 rule
 *   - Menu + address text: Body 2 (12/15), white
 *   - Hover/pressed on links: underlined (color unchanged)
 *   - Copyright + legal text: Body 3 (9/12), --color-muted-soft (#8B8A8A)
 *
 * Footer is intentionally NOT data-shared with TopNav:
 *   - The footer's ABOUT column is a FLAT list (Who We Are + 3 Strategies
 *     items as siblings); the nav nests Strategies under About.
 *   - Team order matches TopNav (Culture, then Careers).
 *   - Decoupling means changes to either surface don't bleed into the
 *     other. The duplication of route slugs across two source-of-truth
 *     lists is tolerable at this scale; tighten via a generated sitemap
 *     later if it ever drifts.
 *
 * Mobile responsive behavior:
 *   - Below md (~768px) the 5 columns collapse to 1 column. Copyright
 *     and legal links render after the menu columns (not under the logo).
 *   - md+: column 1 pins copyright/legal to the bottom via flex, matching
 *     the desktop comp.
 */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type FooterLink = { label: string; to: string }

type FooterTitleBlock = {
  /** Uppercase H5 label shown in --color-accent. */
  title: string
  /**
   * If present, the title itself links to this destination. Internal routes
   * (e.g. News & Insights) render as a NavLink; set `titleExternal` for an
   * absolute URL opened in a new tab (e.g. the Partner Login portal). Omit
   * for non-clickable category labels (About, Sectors, Team).
   */
  titleHref?: string
  /** When true, `titleHref` is an external URL opened in a new tab. */
  titleExternal?: boolean
  /** Optional list of child links rendered as Body 2 white links. */
  items?: ReadonlyArray<FooterLink>
}

/**
 * Outer array = visual columns. Inner array = stacked title blocks within
 * that column (most columns have exactly one block; the rightmost column
 * has two — News & Insights and Partner Login).
 */
const FOOTER_COLUMNS: ReadonlyArray<ReadonlyArray<FooterTitleBlock>> = [
  [
    {
      title: 'About',
      items: [
        { label: 'Who We Are', to: '/who-we-are' },
        {
          label: 'ABF Credit Opportunities',
          to: '/strategies/abf-credit-opportunities',
        },
        {
          label: 'Investment Grade ABF',
          to: '/strategies/investment-grade-abf',
        },
        {
          label: 'Origination Platforms',
          to: '/strategies/origination-platforms',
        },
      ],
    },
  ],
  [
    {
      title: 'Sectors',
      items: [
        {
          label: 'Power & Infrastructure',
          to: '/sectors/power-and-infrastructure',
        },
        {
          label: 'Residential Real Estate',
          to: '/sectors/residential-real-estate',
        },
        {
          label: 'Commercial Real Estate',
          to: '/sectors/commercial-real-estate',
        },
        { label: 'Media', to: '/sectors/media' },
        { label: 'Specialty Finance', to: '/sectors/specialty-finance' },
      ],
    },
  ],
  [
    {
      title: 'Team',
      items: [
        { label: 'Leadership', to: '/team/leadership' },
        {
          label: 'Senior Investment Professionals',
          to: '/team/senior-investment-professionals',
        },
        { label: 'Culture', to: '/team/culture' },
        { label: 'Careers', to: '/careers' },
      ],
    },
  ],
  [
    { title: 'News & Insights', titleHref: '/news-and-insights' },
    {
      title: 'Partner Login',
      titleHref: 'https://citcoone.citco.com/ui/login',
      titleExternal: true,
    },
  ],
]

// Crayhill's external LinkedIn profile. Update here when the final URL
// is confirmed; the rest of the component doesn't need to change.
const LINKEDIN_URL =
  'https://www.linkedin.com/company/crayhill-capital-management/'

// ---------------------------------------------------------------------------
// Style fragments
// ---------------------------------------------------------------------------

// Heading tags themselves carry the H5 typography (size, weight, tracking,
// uppercase, font) via @layer base rules in global.css. We only add color
// here. Per project convention: any element styled at H5 IS an <h5> tag
// (see TopNav.tsx for the same pattern at H4).
const titleColorClass = 'text-accent'
// `text-inherit` is load-bearing here: our `@layer base` rule sets every
// <a> to --color-link (near-black). Without an explicit override on the
// NavLink, the linked titles would render in near-black even though the
// wrapping <h5 class="text-accent"> says otherwise. text-inherit reaches
// up to whatever color the parent h5 holds, so the linked titles stay
// in lockstep with the non-linked ones.
const titleLinkInnerClass =
  'text-inherit hover:underline focus-visible:underline focus-visible:outline-none'

const menuLinkClass =
  'text-body-2 font-sans text-white ' +
  'hover:underline focus-visible:underline focus-visible:outline-none'

const fineTextClass = 'text-body-3 font-sans text-muted-soft'
const fineLinkClass =
  fineTextClass +
  ' hover:underline focus-visible:underline focus-visible:outline-none'

function FooterLegal({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <p className={fineTextClass}>
        Copyright &copy; 2026 Crayhill Capital LLC
      </p>
      <p className={'mt-1 ' + fineTextClass}>
        <NavLink
          to="/legal-notice-and-disclosures"
          className={fineLinkClass}
        >
          Legal Notice &amp; Disclosures
        </NavLink>
        {/* Two non-breaking spaces each side so the gap survives HTML
            whitespace collapsing (plain spaces would render as one). */}
        {'\u00a0\u00a0|\u00a0\u00a0'}
        <NavLink to="/privacy-policy" className={fineLinkClass}>
          Privacy Policy
        </NavLink>
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Footer() {
  return (
    <footer className="bg-paper-dark px-6 py-[60px] sm:px-10 md:py-[90px]">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-5">
        {/* Column 1: logo + address (top); copyright + legal pinned bottom on md+. */}
        <div className="flex h-full flex-col justify-between gap-12">
          <div>
            <Link to="/" aria-label="Crayhill Capital Management — Home">
              <img
                src="/crayhill-r-logo-svg/crayhill-r-logo-white.svg"
                alt=""
                width={175}
                className="block h-auto w-[82.5px] lg:w-[175px]"
              />
            </Link>
            <address className="mt-8 not-italic text-body-2 font-sans text-white">
              280 Park Avenue, FL 27E
              <br />
              New York, NY 10017
            </address>
          </div>

          <FooterLegal className="hidden md:block" />
        </div>

        {/* Columns 2-5: title blocks + optional item lists. */}
        {FOOTER_COLUMNS.map((column, columnIndex) => {
          const isLastColumn = columnIndex === FOOTER_COLUMNS.length - 1
          return (
            <div
              key={column.map((b) => b.title).join('|')}
              className="flex flex-col gap-8"
            >
              {column.map((block) => (
                <div key={block.title}>
                  {block.titleHref ? (
                    // Linked title: the <h5> carries heading semantics +
                    // H5 typography (uppercase + tracking from @layer
                    // base). The inner link carries the hover underline and
                    // color inherits through. External titles (Partner
                    // Login) open in a new tab via a plain <a>.
                    <h5 className={titleColorClass}>
                      {block.titleExternal ? (
                        <a
                          href={block.titleHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={titleLinkInnerClass}
                        >
                          {block.title}
                        </a>
                      ) : (
                        <NavLink
                          to={block.titleHref}
                          className={titleLinkInnerClass}
                        >
                          {block.title}
                        </NavLink>
                      )}
                    </h5>
                  ) : (
                    <h5 className={titleColorClass}>{block.title}</h5>
                  )}

                  {block.items && block.items.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-3">
                      {block.items.map((item) => (
                        <li key={item.to}>
                          <NavLink to={item.to} className={menuLinkClass}>
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/*
               * LinkedIn icon lives only in the last column. The base SVG
               * file at /icons/icon-linkedin.svg has a hardcoded #8b8a8a
               * fill baked in a <style> block, so we can't recolor it via
               * CSS the normal way (loaded as <img>, the SVG's internal
               * styles are sandboxed from the page's CSS). The
               * `brightness-0 invert` filter pair is the standard trick to
               * normalize any monochrome SVG to pure white: brightness(0)
               * collapses every pixel to black, then invert flips to
               * white. Works in all evergreen browsers. If we ever need
               * the icon in another color, we'll inline the SVG as a
               * React component with fill="currentColor".
               */}
              {isLastColumn && (
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Crayhill Capital Management on LinkedIn"
                  className="mt-2 inline-block focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  <img
                    src="/icons/icon-linkedin.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="block h-[30px] w-[30px] brightness-0 invert"
                  />
                </a>
              )}
            </div>
          )
        })}

        {/* Mobile only: copyright + legal after the menu columns. */}
        <FooterLegal className="md:hidden" />
      </div>
    </footer>
  )
}
