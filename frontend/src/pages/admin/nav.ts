/**
 * CMS sidebar navigation. Each `to` is a child route under `/admin`.
 * Add entries here as new CMS tools ship; keep labels sentence case per
 * brand rules for UI chrome (not marketing headings).
 */
export type AdminNavItem = {
  label: string
  to: string
  /** When true, the route is listed but not yet implemented. */
  disabled?: boolean
}

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'News & insights', to: '/admin/news' },
  { label: 'Careers', to: '/admin/careers' },
  {
    label: 'Legal notice & disclosures',
    to: '/admin/pages/legal-notice-and-disclosures/edit',
  },
  { label: 'Privacy policy', to: '/admin/pages/privacy-policy/edit' },
  { label: 'Team', to: '/admin/team', disabled: true },
  { label: 'Media library', to: '/admin/media', disabled: true },
]
