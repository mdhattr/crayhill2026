const CAREERS_PATH = '/careers'

/** Remove Careers links from nav/footer data when the page is hidden. */
export function filterCareersLinks<T extends { label: string; to: string }>(
  items: ReadonlyArray<T>,
  showCareers: boolean,
): ReadonlyArray<T> {
  if (showCareers) {
    return items
  }

  return items.filter((item) => item.to !== CAREERS_PATH)
}

export { CAREERS_PATH }
