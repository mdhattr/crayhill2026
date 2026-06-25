type AdminDragHandleProps = {
  label: string
  disabled?: boolean
  onDragStart: () => void
  onDragEnd: () => void
}

function GripIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="block"
    >
      <circle cx="9" cy="7" r="1.5" />
      <circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  )
}

/** Drag handle for reordering rows in admin sortable lists. */
export function AdminDragHandle({
  label,
  disabled = false,
  onDragStart,
  onDragEnd,
}: AdminDragHandleProps) {
  return (
    <button
      type="button"
      draggable={!disabled}
      disabled={disabled}
      aria-label={label}
      title="Drag to reorder"
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', label)
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className={
        'inline-flex rounded border border-rule bg-paper p-2 text-muted ' +
        'hover:bg-paper-alt hover:text-ink ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        'cursor-grab active:cursor-grabbing'
      }
    >
      <GripIcon />
    </button>
  )
}
