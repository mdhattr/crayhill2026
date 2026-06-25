import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type TeamBioMarkdownBodyProps = {
  /** Markdown source. Renders nothing when empty or whitespace-only. */
  content: string
  className?: string
}

/**
 * Renders team bio Markdown with the same multi-column paragraph flow as the
 * public bio detail page (columns-1 / md:columns-2, mb-6 between paragraphs).
 */
export function TeamBioMarkdownBody({
  content,
  className = '',
}: TeamBioMarkdownBodyProps) {
  if (content.trim() === '') {
    return null
  }

  return (
    <div
      className={`columns-1 gap-x-10 md:columns-2 ${className}`.trim()}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-6 text-ink">{children}</p>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
