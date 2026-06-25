import { useId, useRef, useState, type ReactNode } from 'react'
import { CareersMarkdownBody } from '@/components/CareersMarkdownBody'
import { LegalMarkdownBody } from '@/components/LegalMarkdownBody'
import { NewsMarkdownBody } from '@/components/NewsMarkdownBody'
import { TeamBioMarkdownBody } from '@/components/TeamBioMarkdownBody'
import {
  applyMarkdownEdit,
  restoreTextareaSelection,
  type MarkdownAction,
} from '@/lib/markdown-editor'

type EditorPane = 'write' | 'preview'
export type MarkdownPreviewVariant = 'news' | 'careers' | 'legal' | 'team-bio'

type MarkdownEditorWithPreviewProps = {
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  /** Which public-page prose styles the preview pane uses. */
  previewVariant?: MarkdownPreviewVariant
}

type ToolbarButton = {
  action: MarkdownAction
  label: string
  title: string
  face: string
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { action: 'bold', label: 'Bold', title: 'Bold (**text**)', face: 'B' },
  { action: 'italic', label: 'Italic', title: 'Italic (*text*)', face: 'I' },
  { action: 'link', label: 'Link', title: 'Insert link', face: 'Link' },
  { action: 'h2', label: 'Heading 2', title: 'Heading 2 (## )', face: 'H2' },
  { action: 'h3', label: 'Heading 3', title: 'Heading 3 (### )', face: 'H3' },
  {
    action: 'bullet',
    label: 'Bullet list',
    title: 'Bullet list (- )',
    face: 'List',
  },
  {
    action: 'ordered',
    label: 'Numbered list',
    title: 'Numbered list (1. )',
    face: '1.',
  },
  {
    action: 'blockquote',
    label: 'Blockquote',
    title: 'Blockquote (> )',
    face: 'Quote',
  },
  {
    action: 'strike',
    label: 'Strikethrough',
    title: 'Strikethrough (~~text~~)',
    face: 'S',
  },
]

const PREVIEW_HELP: Record<MarkdownPreviewVariant, string> = {
  news:
    'Select text and use the toolbar to add Markdown, or type syntax directly. ' +
    'HTML and code are not allowed. The preview matches the public article page.',
  careers:
    'Select text and use the toolbar to add Markdown, or type syntax directly. ' +
    'HTML and code are not allowed. The preview matches the expanded Careers accordion body.',
  legal:
    'Select text and use the toolbar to add Markdown, or type syntax directly. ' +
    'HTML and code are not allowed. The preview matches the public legal page styling.',
  'team-bio':
    'Write one paragraph per block, separated by a blank line. ' +
    'HTML and code are not allowed. The preview matches the public bio page column flow.',
}

function toolbarButtonClass(isActive = false): string {
  return (
    'rounded border px-2.5 py-1.5 text-body-3 ' +
    (isActive
      ? 'border-paper-deep bg-paper-deep text-paper'
      : 'border-rule bg-paper text-ink hover:bg-paper-alt')
  )
}

function MarkdownPreview({
  variant,
  content,
}: {
  variant: MarkdownPreviewVariant
  content: string
}): ReactNode {
  if (variant === 'careers') {
    return <CareersMarkdownBody content={content} />
  }
  if (variant === 'legal') {
    return <LegalMarkdownBody content={content} />
  }
  if (variant === 'team-bio') {
    return <TeamBioMarkdownBody content={content} />
  }
  return <NewsMarkdownBody content={content} />
}

/**
 * Split Markdown editor with a formatting toolbar, live preview, and plain
 * Markdown stored as the value. Shared by News & Insights and Careers CMS.
 */
export function MarkdownEditorWithPreview({
  id,
  value,
  onChange,
  error,
  required = false,
  previewVariant = 'news',
}: MarkdownEditorWithPreviewProps) {
  const tabsId = useId()
  const linkFormId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pane, setPane] = useState<EditorPane>('write')
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('https://')

  function runEdit(action: MarkdownAction, linkUrlValue?: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const { nextValue, selectionStart, selectionEnd } = applyMarkdownEdit(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      action,
      { linkUrl: linkUrlValue },
    )

    onChange(nextValue)
    requestAnimationFrame(() => {
      restoreTextareaSelection(textarea, selectionStart, selectionEnd)
    })
  }

  function handleToolbarClick(action: MarkdownAction) {
    if (action === 'link') {
      setLinkUrl('https://')
      setLinkOpen(true)
      return
    }
    runEdit(action)
  }

  function handleLinkInsert() {
    runEdit('link', linkUrl)
    setLinkOpen(false)
  }

  function handleLinkKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLinkInsert()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setLinkOpen(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label htmlFor={id} className="block text-body-3 text-muted">
          Body (Markdown)
        </label>

        <div
          role="tablist"
          aria-label="Editor pane"
          className="flex rounded border border-rule lg:hidden"
        >
          <button
            type="button"
            role="tab"
            id={`${tabsId}-write`}
            aria-selected={pane === 'write'}
            aria-controls={`${tabsId}-write-panel`}
            onClick={() => setPane('write')}
            className={
              'px-4 py-2 text-body-3 ' +
              (pane === 'write'
                ? 'bg-paper-deep text-paper'
                : 'bg-paper text-ink hover:bg-paper-alt')
            }
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            id={`${tabsId}-preview`}
            aria-selected={pane === 'preview'}
            aria-controls={`${tabsId}-preview-panel`}
            onClick={() => setPane('preview')}
            className={
              'border-l border-rule px-4 py-2 text-body-3 ' +
              (pane === 'preview'
                ? 'bg-paper-deep text-paper'
                : 'bg-paper text-ink hover:bg-paper-alt')
            }
          >
            Preview
          </button>
        </div>
      </div>

      <p className="mt-2 text-body-3 text-muted">
        {PREVIEW_HELP[previewVariant]}
      </p>

      <div className="mt-2 grid gap-x-10 gap-y-6 lg:grid-cols-2">
        <div
          id={`${tabsId}-write-panel`}
          aria-labelledby={`${tabsId}-write`}
          className={pane === 'write' ? 'block' : 'hidden lg:block'}
        >
          <p className="mb-2 hidden text-body-3 text-muted lg:block">
            Markdown source
          </p>

          <div className="overflow-hidden rounded border border-rule">
            <div className="relative border-b border-rule bg-paper-alt">
              <div
                role="toolbar"
                aria-label="Markdown formatting"
                className="flex flex-wrap gap-1 px-2 py-2"
              >
                {TOOLBAR_BUTTONS.map((button) => (
                  <button
                    key={button.action}
                    type="button"
                    aria-label={button.label}
                    title={button.title}
                    onClick={() => handleToolbarClick(button.action)}
                    className={
                      toolbarButtonClass(
                        button.action === 'link' && linkOpen,
                      ) +
                      (button.face.length === 1
                        ? ' min-w-[2rem] font-semibold'
                        : '')
                    }
                  >
                    {button.face === 'I' ? (
                      <span className="italic">{button.face}</span>
                    ) : (
                      button.face
                    )}
                  </button>
                ))}
              </div>

              {linkOpen ? (
                <div
                  className={
                    'absolute left-2 right-2 top-full z-10 mt-1 ' +
                    'rounded border border-rule bg-paper p-3 shadow-sm'
                  }
                >
                  <label
                    htmlFor={`${linkFormId}-url`}
                    className="block text-body-3 text-muted"
                  >
                    Link URL
                  </label>
                  <input
                    id={`${linkFormId}-url`}
                    type="url"
                    autoFocus
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    onKeyDown={handleLinkKeyDown}
                    placeholder="https://example.com"
                    className={
                      'mt-1 w-full rounded border border-rule bg-paper px-3 py-2 ' +
                      'text-body-2 text-ink focus-visible:border-accent focus-visible:outline-none'
                    }
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleLinkInsert}
                      className="rounded bg-paper-deep px-3 py-1.5 text-body-3 text-paper hover:opacity-90"
                    >
                      Insert link
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkOpen(false)}
                      className="rounded border border-rule px-3 py-1.5 text-body-3 text-ink hover:bg-paper-alt"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <textarea
              ref={textareaRef}
              id={id}
              required={required}
              rows={22}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={
                'min-h-[28rem] w-full resize-y border-0 bg-paper px-4 py-3 ' +
                'font-mono text-body-2 text-ink ' +
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ' +
                'focus-visible:ring-inset'
              }
            />
          </div>
        </div>

        <div
          id={`${tabsId}-preview-panel`}
          aria-labelledby={`${tabsId}-preview`}
          className={pane === 'preview' ? 'block' : 'hidden lg:block'}
        >
          <p className="mb-2 hidden text-body-3 text-muted lg:block">
            Live preview
          </p>
          <div
            aria-live="polite"
            className={
              'min-h-[28rem] overflow-y-auto rounded border border-rule ' +
              'bg-paper px-4 py-3 sm:px-6 sm:py-4'
            }
          >
            {value.trim() === '' ? (
              <p className="text-body-2 text-muted">
                Nothing to preview yet. Start writing in the editor.
              </p>
            ) : (
              <MarkdownPreview variant={previewVariant} content={value} />
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-body-3 text-accent-navy">{error}</p>
      ) : null}
    </div>
  )
}
