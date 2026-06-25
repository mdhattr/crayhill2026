/**
 * Textarea helpers for the CMS Markdown editor. Inserts/wraps GFM syntax at
 * the current selection while keeping plain Markdown as the stored value.
 */

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'link'
  | 'code'
  | 'strike'
  | 'h2'
  | 'h3'
  | 'bullet'
  | 'ordered'
  | 'blockquote'

export type MarkdownEditResult = {
  nextValue: string
  selectionStart: number
  selectionEnd: number
}

type WrapSpec = {
  before: string
  after: string
  placeholder: string
}

const WRAP: Record<
  Extract<MarkdownAction, 'bold' | 'italic' | 'code' | 'strike'>,
  WrapSpec
> = {
  bold: { before: '**', after: '**', placeholder: 'bold text' },
  italic: { before: '*', after: '*', placeholder: 'italic text' },
  code: { before: '`', after: '`', placeholder: 'code' },
  strike: { before: '~~', after: '~~', placeholder: 'deleted text' },
}

const LINE_PREFIX: Record<
  Extract<
    MarkdownAction,
    'h2' | 'h3' | 'bullet' | 'ordered' | 'blockquote'
  >,
  string
> = {
  h2: '## ',
  h3: '### ',
  bullet: '- ',
  ordered: '1. ',
  blockquote: '> ',
}

function lineBounds(value: string, index: number): { start: number; end: number } {
  let start = index
  while (start > 0 && value[start - 1] !== '\n') {
    start -= 1
  }

  let end = index
  while (end < value.length && value[end] !== '\n') {
    end += 1
  }

  return { start, end }
}

function selectedLineRange(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): { start: number; end: number } {
  const startLine = lineBounds(value, selectionStart).start
  const endLine = lineBounds(value, Math.max(selectionStart, selectionEnd - 1)).end
  return { start: startLine, end: endLine }
}

function applyWrap(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  spec: WrapSpec,
): MarkdownEditResult {
  const selected = value.slice(selectionStart, selectionEnd)

  if (selected.length > 0) {
    const nextValue =
      value.slice(0, selectionStart) +
      spec.before +
      selected +
      spec.after +
      value.slice(selectionEnd)
    const start = selectionStart + spec.before.length
    const end = start + selected.length
    return { nextValue, selectionStart: start, selectionEnd: end }
  }

  const insertion = spec.before + spec.placeholder + spec.after
  const nextValue =
    value.slice(0, selectionStart) + insertion + value.slice(selectionEnd)
  const start = selectionStart + spec.before.length
  const end = start + spec.placeholder.length
  return { nextValue, selectionStart: start, selectionEnd: end }
}

function applyLinePrefix(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
): MarkdownEditResult {
  const { start, end } = selectedLineRange(value, selectionStart, selectionEnd)
  const block = value.slice(start, end)
  const lines = block.split('\n')
  const nextBlock = lines
    .map((line) => {
      if (line.trim() === '') return line
      if (line.startsWith(prefix)) return line
      return prefix + line
    })
    .join('\n')

  const nextValue = value.slice(0, start) + nextBlock + value.slice(end)
  const offset = nextBlock.length - block.length
  return {
    nextValue,
    selectionStart: selectionStart + (selectionStart > start ? offset : 0),
    selectionEnd: selectionEnd + offset,
  }
}

function applyLink(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  url: string,
): MarkdownEditResult {
  const trimmedUrl = url.trim()
  if (trimmedUrl === '') {
    return { nextValue: value, selectionStart, selectionEnd }
  }

  const selected = value.slice(selectionStart, selectionEnd)
  const label = selected.length > 0 ? selected : 'link text'
  const insertion = `[${label}](${trimmedUrl})`
  const nextValue =
    value.slice(0, selectionStart) + insertion + value.slice(selectionEnd)

  if (selected.length > 0) {
    const start = selectionStart
    const end = selectionStart + insertion.length
    return { nextValue, selectionStart: start, selectionEnd: end }
  }

  const start = selectionStart + 1
  const end = start + label.length
  return { nextValue, selectionStart: start, selectionEnd: end }
}

export function applyMarkdownEdit(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  action: MarkdownAction,
  options?: { linkUrl?: string },
): MarkdownEditResult {
  if (action === 'link') {
    return applyLink(
      value,
      selectionStart,
      selectionEnd,
      options?.linkUrl ?? '',
    )
  }

  if (action in WRAP) {
    return applyWrap(
      value,
      selectionStart,
      selectionEnd,
      WRAP[action as keyof typeof WRAP],
    )
  }

  return applyLinePrefix(
    value,
    selectionStart,
    selectionEnd,
    LINE_PREFIX[action as keyof typeof LINE_PREFIX],
  )
}

export function restoreTextareaSelection(
  textarea: HTMLTextAreaElement,
  selectionStart: number,
  selectionEnd: number,
) {
  textarea.focus()
  textarea.setSelectionRange(selectionStart, selectionEnd)
}
