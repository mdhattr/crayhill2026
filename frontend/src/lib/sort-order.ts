/** First display position shown in admin lists and assigned to new rows. */
export const SORT_ORDER_MIN = 1

export function nextSortOrder(
  items: ReadonlyArray<{ sort_order: number }>,
): number {
  if (items.length === 0) {
    return SORT_ORDER_MIN
  }

  return Math.max(...items.map((item) => item.sort_order)) + 1
}

export function sortByDisplayOrder<T extends { sort_order: number; id: number }>(
  items: ReadonlyArray<T>,
): T[] {
  return [...items].sort((a, b) =>
    a.sort_order !== b.sort_order ? a.sort_order - b.sort_order : a.id - b.id,
  )
}

export function assignSequentialSortOrders<T extends { id: number }>(
  orderedItems: ReadonlyArray<T>,
): { id: number; sort_order: number }[] {
  return orderedItems.map((item, index) => ({
    id: item.id,
    sort_order: index + SORT_ORDER_MIN,
  }))
}

/** Returns only rows whose sort_order changed after a reorder. */
export function sortOrderUpdates<T extends { id: number; sort_order: number }>(
  previous: ReadonlyArray<T>,
  reordered: ReadonlyArray<T>,
): { id: number; sort_order: number }[] {
  const next = assignSequentialSortOrders(reordered)
  const previousById = new Map(previous.map((item) => [item.id, item.sort_order]))

  return next.filter((update) => previousById.get(update.id) !== update.sort_order)
}

export function reorderById<T extends { id: number }>(
  items: ReadonlyArray<T>,
  draggedId: number,
  targetId: number,
): T[] {
  const fromIndex = items.findIndex((item) => item.id === draggedId)
  const toIndex = items.findIndex((item) => item.id === targetId)

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return [...items]
  }

  const reordered = [...items]
  const [moved] = reordered.splice(fromIndex, 1)
  if (moved === undefined) {
    return [...items]
  }
  reordered.splice(toIndex, 0, moved)

  return reordered
}
