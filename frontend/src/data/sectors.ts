/**
 * Canonical list of investment sectors.
 *
 * Single source of truth for any UI that renders sector names, links, or
 * brand-treatment colors. Currently consumed by:
 *
 *   - HomePage / AssetFocus       (uses label + to + barColor)
 *   - ABF Credit Opportunities /
 *     KeyAssetTypes               (uses label + to)
 *
 * The TopNav's Sectors dropdown is NOT yet consuming this list — TopNav
 * keeps its menu items inline because they're embedded in a larger
 * NAV_ITEMS tree (with About/Team siblings). When TopNav is touched
 * again, the right refactor is to read its sectors from here so the
 * nav and the page-level lists can't drift apart.
 *
 * `barColor` is the navy → sky-blue gradient swatch the brand uses to
 * mark each sector visually (Asset Focus block, future sector hero
 * treatments). Order of the array IS the canonical brand order (darkest
 * → lightest); preserve it unless the designer explicitly reorders.
 */

export type Sector = {
  /** Display label, authored in Title Case. */
  label: string
  /** Canonical route path for the sector page (kebab-case slug). */
  to: string
  /** Hex color from the brand sector gradient. */
  barColor: string
}

export const SECTORS: ReadonlyArray<Sector> = [
  {
    label: 'Power & Infrastructure',
    to: '/sectors/power-and-infrastructure',
    barColor: '#1B2636',
  },
  {
    label: 'Residential Real Estate',
    to: '/sectors/residential-real-estate',
    barColor: '#374D6C',
  },
  {
    label: 'Commercial Real Estate',
    to: '/sectors/commercial-real-estate',
    barColor: '#277AC0',
  },
  {
    label: 'Media',
    to: '/sectors/media',
    barColor: '#57A0DD',
  },
  {
    label: 'Specialty Finance',
    to: '/sectors/specialty-finance',
    barColor: '#9AC6EB',
  },
]
