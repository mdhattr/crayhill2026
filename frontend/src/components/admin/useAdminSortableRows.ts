import { useEffect, useState } from 'react'
import {
  SORT_ORDER_MIN,
  reorderById,
  sortByDisplayOrder,
  sortOrderUpdates,
} from '@/lib/sort-order'

type SortableRow = {
  id: number
  sort_order: number
}

type UseAdminSortableRowsOptions<T extends SortableRow> = {
  items: T[] | undefined
  onPersistOrder: (
    updates: { id: number; sort_order: number }[],
  ) => Promise<void>
}

export function useAdminSortableRows<T extends SortableRow>({
  items,
  onPersistOrder,
}: UseAdminSortableRowsOptions<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [dropTargetId, setDropTargetId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items && !isSaving) {
      setRows(sortByDisplayOrder(items))
    }
  }, [items, isSaving])

  function handleDragStart(id: number) {
    setDraggingId(id)
    setError(null)
  }

  function handleDragEnd() {
    setDraggingId(null)
    setDropTargetId(null)
  }

  function handleDragOver(targetId: number) {
    if (draggingId === null || draggingId === targetId) {
      return
    }

    setDropTargetId(targetId)
  }

  async function handleDrop(targetId: number) {
    if (draggingId === null || draggingId === targetId) {
      handleDragEnd()
      return
    }

    const previous = rows
    const reordered = reorderById(rows, draggingId, targetId)
    const withOrder = reordered.map((item, index) => ({
      ...item,
      sort_order: index + SORT_ORDER_MIN,
    }))

    setRows(withOrder)
    handleDragEnd()

    const updates = sortOrderUpdates(previous, withOrder)
    if (updates.length === 0) {
      return
    }

    setIsSaving(true)
    try {
      await onPersistOrder(updates)
    } catch {
      setRows(previous)
      setError('Unable to save the new order. Try again.')
    } finally {
      setIsSaving(false)
    }
  }

  function rowClassName(id: number): string {
    const classes = ['border-b', 'border-rule']

    if (draggingId === id) {
      classes.push('opacity-50')
    }

    if (dropTargetId === id && draggingId !== id) {
      classes.push('bg-paper')
    }

    return classes.join(' ')
  }

  return {
    rows,
    draggingId,
    isSaving,
    error,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    rowClassName,
  }
}
