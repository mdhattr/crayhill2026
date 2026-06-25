import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SAFE_MARKDOWN_COMPONENTS } from '@/lib/safe-markdown'

type NewsMarkdownBodyProps = {
  /** Markdown source. Renders nothing when empty or whitespace-only. */
  content: string
  className?: string
}

/**
 * Renders news article Markdown with the same pipeline and prose styles as
 * the public News & Insights detail page (.news-prose in global.css).
 */
export function NewsMarkdownBody({ content, className = '' }: NewsMarkdownBodyProps) {
  if (content.trim() === '') {
    return null
  }

  return (
    <div className={`news-prose text-body-1 text-ink ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={SAFE_MARKDOWN_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
