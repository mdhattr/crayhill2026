import { NavLink } from 'react-router-dom'
import { ADMIN_NAV_ITEMS } from '@/pages/admin/nav'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-sm px-4 py-3 text-body-2 transition-colors duration-150',
    isActive
      ? 'bg-paper-deep font-semibold text-white'
      : 'text-white/80 hover:bg-paper-deep/60 hover:text-white',
  ].join(' ')

/**
 * Full-height CMS sidebar. Rendered only for authenticated sessions inside
 * AdminLayout. Disabled items are visible but not yet linked — they signal
 * planned tools without routing to a 404.
 */
export function AdminSideNav() {
  return (
    <nav
      aria-label="CMS"
      className="flex w-60 shrink-0 flex-col bg-paper-dark px-4 py-8"
    >
      <h5 className="px-4 text-accent">Tools</h5>

      <ul className="mt-6 flex flex-col gap-1">
        {ADMIN_NAV_ITEMS.map((item) => (
          <li key={item.to}>
            {item.disabled ? (
              <span
                aria-disabled="true"
                className="block cursor-not-allowed rounded-sm px-4 py-3 text-body-2 text-white/40"
                title="Coming soon"
              >
                {item.label}
              </span>
            ) : (
              <NavLink
                to={item.to}
                end={item.to === '/admin'}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
