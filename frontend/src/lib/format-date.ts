/**
 * Format an ISO YYYY-MM-DD date as "August 14, 2025".
 *
 * Parses from year/month/day parts in local time to avoid the classic
 * `new Date('2025-08-14')` UTC-midnight pitfall, which flips the date back
 * by one day when formatted in negative-offset timezones (e.g. US ET).
 *
 * Locale is fixed to en-US to match the design (Long Month DD, YYYY). When
 * we add i18n this becomes a parameter.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
