import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

/**
 * Primary site navigation. Rendered by RootLayout so it appears on every
 * route. Brand spec from designer:
 *
 * Top-level row
 *   - Background: --color-paper-alt (#F3F3F3)
 *   - Logo: crayhill-r-logo-color.svg, 175px wide, links to /
 *   - Right-aligned items in H4 typography (display font, sizing from the
 *     --text-h4 token), spaced 40px apart. Per project convention,
 *     anything styled at H4 IS rendered inside an <h4> tag; the inner
 *     <button>/<NavLink> handles the interaction, the wrapping <h4>
 *     supplies the typography (via @layer base) and the heading
 *     semantics.
 *   - Default text: --color-muted-soft (#8B8A8A)
 *   - Hover / pressed / keyboard focus / open-disclosure:
 *     --color-ink (black), underlined on interaction
 *   - 40px padding above and below the logo (drives header height)
 *
 * Dropdown panels (About, Sectors, Team)
 *   - Background: --color-paper (#FAFAF7), 1px border in --color-rule-soft
 *   - Item text: H4, ink (black). Hover/focus underlines.
 *   - "Strategies" inside the About panel is a disclosure to its own
 *     sub-panel (it has no landing page itself, but visually it styles
 *     identically to "Who We Are" — H4 ink, hover underline — with a
 *     right-chevron to signal the sub-disclosure.
 *
 * Sub-dropdown (Strategies, opens to the right of the About panel)
 *   - Anchored to the TOP edge of the About panel (not the Strategies
 *     row), so its first item lines up horizontally with About's first
 *     item. Flush right of the About panel's right edge with a 1px
 *     border overlap so the two read as a single composed surface.
 *   - Item text: H4, ink (black). Same hover treatment.
 *
 * Responsive model
 *   - At `lg` and up: the horizontal nav described below (hover/flyout).
 *   - Below `lg`: the horizontal nav is hidden and a hamburger toggles a
 *     full-width accordion panel (see "Mobile navigation" further down).
 *     Both share the same NAV_ITEMS data.
 *
 * Interaction model (desktop)
 *   - On fine-pointer devices (mouse / trackpad): hover opens, mouseleave
 *     closes after a short delay so the cursor can travel from trigger to
 *     panel without dismissing.
 *   - On coarse-pointer devices (touch): hover handlers are NOT attached
 *     (iOS Safari synthesizes mouse events around taps, which would cause
 *     the menu to flicker open-then-closed). Click toggles.
 *   - Click toggles on all devices. Escape closes everything. A click
 *     anywhere outside the nav closes everything.
 *   - Top-level carets rotate 180° to indicate open state (down→up). The
 *     Strategies sub-disclosure caret is static (always points right).
 *
 * Notes for future contributors
 *   - Menu items link to canonical kebab-case slugs even though most of
 *     those pages don't exist yet. They will hit the 404 catch-all until
 *     each page is built; the link "just starts working" without touching
 *     this component.
 *   - About, Sectors, Team have no landing pages of their own (working
 *     assumption — adjust the NAV_ITEMS data if any of them should). If
 *     one needs an overview page, prepend an `{ kind: 'link' }` child like
 *     `{ kind: 'link', label: 'Overview', to: '/about' }`.
 *   - NavLink is used (vs. raw <a> or Link) so once an active-route style
 *     is added to the designer's spec, we can opt in by reading the
 *     `isActive` argument from className without restructuring.
 *   - The wrapping <Link> on the logo carries the accessible label; the
 *     <img> uses alt="" so screen readers don't announce the company name
 *     twice. This is the WCAG-clean pattern for "decorative image inside
 *     a meaningful link".
 */

// ---------------------------------------------------------------------------
// Menu data structure
// ---------------------------------------------------------------------------

type LinkItem = {
  kind: 'link'
  label: string
  to: string
  /**
   * When true, `to` is an absolute external URL opened in a new tab via a
   * plain <a> (not client-side routing). Used for the Partner Login portal.
   */
  external?: boolean
}

type DisclosureItem = {
  kind: 'disclosure'
  label: string
  children: ReadonlyArray<LinkItem | DisclosureItem>
}

type NavItem = LinkItem | DisclosureItem

/*
 * Styling rules (implicit in the type, documented here for clarity):
 *
 * Top-level disclosures (children of NAV_ITEMS) — About, Sectors, Team —
 * use the top-level trigger styling (muted-soft, brought to ink on hover
 * or while open). No underline by default.
 *
 * Nested disclosures (currently only "Strategies" inside About) use the
 * dropdown-disclosure trigger styling — H4 ink, hover adds underline —
 * which is intentionally identical to the leaf-link rows in the same
 * panel. The right-chevron is the only visual cue that Strategies opens
 * a sub-panel rather than navigating to a page.
 */

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    kind: 'disclosure',
    label: 'About',
    children: [
      { kind: 'link', label: 'Who We Are', to: '/who-we-are' },
      {
        kind: 'disclosure',
        label: 'Strategies',
        children: [
          {
            kind: 'link',
            label: 'ABF Credit Opportunities',
            to: '/strategies/abf-credit-opportunities',
          },
          {
            kind: 'link',
            label: 'Investment Grade ABF',
            to: '/strategies/investment-grade-abf',
          },
          {
            kind: 'link',
            label: 'Origination Platforms',
            to: '/strategies/origination-platforms',
          },
        ],
      },
    ],
  },
  {
    kind: 'disclosure',
    label: 'Sectors',
    children: [
      {
        kind: 'link',
        label: 'Power & Infrastructure',
        to: '/sectors/power-and-infrastructure',
      },
      {
        kind: 'link',
        label: 'Residential Real Estate',
        to: '/sectors/residential-real-estate',
      },
      {
        kind: 'link',
        label: 'Commercial Real Estate',
        to: '/sectors/commercial-real-estate',
      },
      { kind: 'link', label: 'Media', to: '/sectors/media' },
      {
        kind: 'link',
        label: 'Specialty Finance',
        to: '/sectors/specialty-finance',
      },
    ],
  },
  {
    kind: 'disclosure',
    label: 'Team',
    children: [
      { kind: 'link', label: 'Leadership', to: '/team/leadership' },
      {
        kind: 'link',
        label: 'Senior Investment Professionals',
        to: '/team/senior-investment-professionals',
      },
      { kind: 'link', label: 'Culture', to: '/team/culture' },
      { kind: 'link', label: 'Careers', to: '/careers' },
    ],
  },
  { kind: 'link', label: 'News & Insights', to: '/news-and-insights' },
  {
    kind: 'link',
    label: 'Partner Login',
    to: 'https://citcoone.citco.com/ui/login',
    external: true,
  },
]

// ---------------------------------------------------------------------------
// Hover-capability detection
// ---------------------------------------------------------------------------

/**
 * Returns `true` on devices that support precise hover (mouse, trackpad);
 * `false` on touch-primary devices. We gate the mouseenter/mouseleave
 * handlers on this so iOS Safari's synthetic mouse events around a tap
 * don't cause the menu to flicker open-then-closed.
 *
 * Falls back to `false` when window/matchMedia is unavailable (e.g. SSR
 * or non-browser environments), which is the safer default.
 */
function useHoverCapable(): boolean {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setCanHover(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return canHover
}

// ---------------------------------------------------------------------------
// Inline chevron icons (no dependency)
//   - Stroke uses currentColor, so chevrons inherit text color (grey when
//     idle, ink on hover / open).
//   - Rotated 180° via CSS transform when `open` so we don't ship two SVGs,
//     UNLESS `rotateOnOpen` is false (the Strategies sub-disclosure keeps a
//     static right-caret rather than flipping right→left).
// ---------------------------------------------------------------------------

function Chevron({
  open,
  direction,
  rotateOnOpen = true,
}: {
  open: boolean
  direction: 'down' | 'right'
  /**
   * When true (default), the caret rotates 180° while `open` to signal
   * state (down→up, right→left). When false it stays put — used for the
   * Strategies sub-disclosure, which keeps a static right-caret.
   */
  rotateOnOpen?: boolean
}) {
  // Two static path datasets, one for the "down" closed state and one for
  // the "right" closed state. Rotation handles open state.
  const points =
    direction === 'down' ? '6 9 12 15 18 9' : '9 6 15 12 9 18'

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={
        'ml-1.5 inline-block shrink-0 transition-transform duration-150 ease-out ' +
        (rotateOnOpen && open ? '-rotate-180' : 'rotate-0')
      }
    >
      <polyline points={points} />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Shared class strings
// ---------------------------------------------------------------------------

// Per project convention, anything sized at H4 typography IS rendered
// inside an <h4> tag — the heading tag provides font-size, line-height,
// weight, and font-family via @layer base rules. So none of these class
// strings include `text-h4` or `font-display`; they only carry color,
// interaction, and layout concerns.

const topLevelTriggerClass =
  'inline-flex items-center text-muted-soft ' +
  'bg-transparent border-0 p-0 m-0 cursor-pointer appearance-none ' +
  'hover:text-ink hover:underline ' +
  'focus-visible:text-ink focus-visible:underline focus-visible:outline-none'

// Applied additively when a top-level disclosure is open, so the trigger
// stays in the "active" treatment while its panel is showing.
const topLevelTriggerOpenClass = '!text-ink'

const dropdownLinkClass =
  'block w-full px-5 py-2 text-ink whitespace-nowrap ' +
  'hover:underline focus-visible:underline focus-visible:outline-none'

const dropdownDisclosureTriggerClass =
  'flex items-center justify-between gap-2 w-full px-5 py-2 ' +
  'text-ink whitespace-nowrap text-left ' +
  'bg-transparent border-0 cursor-pointer appearance-none ' +
  'hover:underline focus-visible:underline focus-visible:outline-none'

const panelClass =
  'absolute z-50 min-w-[14rem] bg-paper border border-rule-soft py-2'

// ---------------------------------------------------------------------------
// Sub-disclosure (currently only "Strategies" inside About)
// ---------------------------------------------------------------------------

const HOVER_CLOSE_DELAY_MS = 180

function SubDisclosure({
  item,
  onAnyLeafClick,
}: {
  item: DisclosureItem
  onAnyLeafClick: () => void
}) {
  const [open, setOpen] = useState(false)
  const canHover = useHoverCapable()
  const closeTimerRef = useRef<number | undefined>(undefined)
  const panelId = useId()

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = undefined
    }
  }
  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(
      () => setOpen(false),
      HOVER_CLOSE_DELAY_MS,
    )
  }

  useEffect(() => clearCloseTimer, [])

  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => {
          clearCloseTimer()
          setOpen(true)
        },
        onMouseLeave: scheduleClose,
      }
    : {}

  return (
    // No `position: relative` here on purpose: the sub-panel below is
    // `position: absolute` and we WANT it to position against the next
    // positioned ancestor up — the About panel <ul>, which is `absolute`
    // (via `panelClass`). That anchors the sub-panel's `top-0` to the top
    // of the About panel itself, so it sits flush with About's top edge
    // rather than dropping down to the row Strategies happens to occupy.
    // The sub-panel is still a DOM descendant of this <li>, so the
    // mouseenter/mouseleave hover semantics still work correctly — those
    // care about DOM containment, not CSS positioning.
    <li {...hoverHandlers}>
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className={dropdownDisclosureTriggerClass}
        >
          <span>{item.label}</span>
          <Chevron open={open} direction="right" rotateOnOpen={false} />
        </button>
      </h4>

      {open && (
        <ul
          id={panelId}
          role="menu"
          // Positions against the About panel <ul> (see comment on parent
          // <li> above). top-0 = top of About panel, left-full = right
          // edge of About panel, -ml-px overlaps the 1px borders so we
          // read a single composed panel rather than two adjacent cards.
          className={panelClass + ' top-0 left-full -ml-px'}
        >
          {item.children.map((child) => {
            // Spec-wise the Strategies sub-dropdown only contains leaf
            // links; if a nested disclosure ever lands here it would need
            // its own handling. Render a typed fallback for safety.
            if (child.kind !== 'link') return null
            return (
              <li key={child.to} role="none">
                <h4>
                  <NavLink
                    role="menuitem"
                    to={child.to}
                    className={dropdownLinkClass}
                    onClick={onAnyLeafClick}
                  >
                    {child.label}
                  </NavLink>
                </h4>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Top-level disclosure (About, Sectors, Team)
// ---------------------------------------------------------------------------

function TopDisclosure({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: DisclosureItem
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const canHover = useHoverCapable()
  const closeTimerRef = useRef<number | undefined>(undefined)
  const panelId = useId()

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = undefined
    }
  }
  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(
      () => onClose(),
      HOVER_CLOSE_DELAY_MS,
    )
  }

  useEffect(() => clearCloseTimer, [])

  // If the parent decides this disclosure is no longer the open one (e.g.
  // user hovered a different top-level item), kill any pending close
  // timer — otherwise it could fire later and stomp the new open menu.
  useEffect(() => {
    if (!isOpen) clearCloseTimer()
  }, [isOpen])

  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => {
          clearCloseTimer()
          onOpen()
        },
        onMouseLeave: scheduleClose,
      }
    : {}

  return (
    <li className="relative" {...hoverHandlers}>
      <h4>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={panelId}
          onClick={() => (isOpen ? onClose() : onOpen())}
          className={
            topLevelTriggerClass + (isOpen ? ' ' + topLevelTriggerOpenClass : '')
          }
        >
          <span>{item.label}</span>
          <Chevron open={isOpen} direction="down" />
        </button>
      </h4>

      {isOpen && (
        <ul
          id={panelId}
          role="menu"
          // top-full sits the panel directly below the trigger row, mt-3
          // gives a small breathing gap (the bounding box of <li> still
          // contains it, so the gap doesn't break hover persistence).
          className={panelClass + ' top-full right-0 mt-3'}
        >
          {item.children.map((child) => {
            if (child.kind === 'link') {
              return (
                <li key={child.to} role="none">
                  <h4>
                    <NavLink
                      role="menuitem"
                      to={child.to}
                      className={dropdownLinkClass}
                      onClick={onClose}
                    >
                      {child.label}
                    </NavLink>
                  </h4>
                </li>
              )
            }
            return (
              <SubDisclosure
                key={child.label}
                item={child}
                onAnyLeafClick={onClose}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Mobile navigation (below the `lg` breakpoint)
//
// The desktop hover/flyout model doesn't translate to a 320–768px phone, so
// below `lg` the horizontal nav is replaced by a hamburger that toggles a
// full-width panel. Inside the panel the same NAV_ITEMS render as a vertical
// accordion: leaf links navigate (and close the menu), disclosures expand
// their children inline (no right-flyout). Nesting is unlimited in principle;
// in practice it's two levels deep (About → Strategies).
// ---------------------------------------------------------------------------

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      className="block"
    >
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

// Base for a mobile menu row. Color is applied per depth in MobileNavItem:
// top-level + first-level links are H4 black; the deepest links (the
// Strategies sub-items) are "H4, Light" (#8B8A8A) per the mobile mockup.
// py-[15px] gives ~30px between adjacent titles ("Padding between main page
// titles: 30px") while keeping a comfortable tap target.
const mobileLinkBase =
  'block py-[15px] ' +
  'hover:underline focus-visible:underline focus-visible:outline-none'

const mobileDisclosureTriggerClass =
  'flex w-full items-center justify-between gap-2 py-[15px] text-left text-ink ' +
  'bg-transparent border-0 cursor-pointer appearance-none ' +
  'focus-visible:underline focus-visible:outline-none'

function MobileNavItem({
  item,
  depth,
  onNavigate,
}: {
  item: NavItem
  /** 0 = top-level. Links at depth >= 2 render in the "Light" subtext color. */
  depth: number
  onNavigate: () => void
}) {
  if (item.kind === 'link') {
    const linkClass =
      mobileLinkBase + (depth >= 2 ? ' text-muted-soft' : ' text-ink')
    return (
      <li>
        <h4>
          {item.external ? (
            <a
              href={item.to}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              onClick={onNavigate}
            >
              {item.label}
            </a>
          ) : (
            <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
              {item.label}
            </NavLink>
          )}
        </h4>
      </li>
    )
  }
  return (
    <MobileDisclosure item={item} depth={depth} onNavigate={onNavigate} />
  )
}

function MobileDisclosure({
  item,
  depth,
  onNavigate,
}: {
  item: DisclosureItem
  depth: number
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <li>
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className={mobileDisclosureTriggerClass}
        >
          <span>{item.label}</span>
          <Chevron open={open} direction="down" />
        </button>
      </h4>

      {open && (
        // Nested rows indent one step so the hierarchy reads at a glance in
        // the flat accordion (the designer comp has no divider lines).
        <ul id={panelId} className="ml-4">
          {item.children.map((child) => (
            <MobileNavItem
              key={child.kind === 'link' ? child.to : child.label}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// TopNav (export)
// ---------------------------------------------------------------------------

export function TopNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const mobilePanelId = useId()
  const { pathname } = useLocation()

  const closeAll = () => {
    setOpenMenu(null)
    setMobileOpen(false)
  }

  // Escape closes any open menu (desktop dropdowns or the mobile panel)
  // from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Pointer-down outside the nav closes any open menu. Using `pointerdown`
  // (vs. `click`) closes BEFORE a click on outside content fires, which
  // is the expected behavior when clicking a link in page content.
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        closeAll()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  // A completed navigation (path change) should always leave the nav closed —
  // otherwise the mobile panel stays open over the freshly-loaded page.
  useEffect(() => {
    closeAll()
  }, [pathname])

  return (
    <header ref={headerRef} className="relative z-40 bg-paper-alt">
      {/*
       * py-5 (20px) on mobile per the mobile mockup's "Top padding: 20px
       * above logo"; the full 40px (py-10) returns at lg where the desktop
       * header layout kicks in.
       */}
      <div className="flex items-center justify-between px-6 py-5 sm:px-10 lg:py-10">
        <Link to="/" aria-label="Crayhill Capital Management — Home">
          <img
            src="/crayhill-r-logo-svg/crayhill-r-logo-color.svg"
            alt=""
            width={175}
            /*
             * 75px on the compact (hamburger) header per the mobile mockup,
             * scaling to the full 175px once the desktop nav appears at lg.
             */
            className="block h-auto w-[75px] lg:w-[175px]"
          />
        </Link>

        {/* Desktop nav — hover/flyout model, shown at lg and up. */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'link') {
                return (
                  <li key={item.to}>
                    <h4>
                      {item.external ? (
                        <a
                          href={item.to}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={topLevelTriggerClass}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <NavLink to={item.to} className={topLevelTriggerClass}>
                          {item.label}
                        </NavLink>
                      )}
                    </h4>
                  </li>
                )
              }
              return (
                <TopDisclosure
                  key={item.label}
                  item={item}
                  isOpen={openMenu === item.label}
                  onOpen={() => setOpenMenu(item.label)}
                  onClose={() =>
                    setOpenMenu((prev) =>
                      prev === item.label ? null : prev,
                    )
                  }
                />
              )
            })}
          </ul>
        </nav>

        {/* Mobile trigger — shown below lg. */}
        <button
          type="button"
          className="text-ink lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls={mobilePanelId}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      {/* Mobile panel — full-width accordion overlay, below lg only. */}
      {mobileOpen && (
        <div
          id={mobilePanelId}
          /*
           * Designer mobile spec: the open menu is a white takeover panel
           * (min-h fills the viewport below the header), with 50px top/bottom
           * padding. Background is white (bg-paper) rather than the #F3F3F3
           * header bar. Stays scrollable if the expanded accordion exceeds the
           * viewport.
           */
          className={
            'absolute inset-x-0 top-full z-40 ' +
            'max-h-[calc(100dvh_-_100%)] min-h-[calc(100dvh_-_100%)] overflow-y-auto ' +
            'border-t border-rule-soft bg-paper px-6 py-[50px] ' +
            'lg:hidden'
          }
        >
          <nav aria-label="Primary">
            <ul>
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.kind === 'link' ? item.to : item.label}
                  item={item}
                  depth={0}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
