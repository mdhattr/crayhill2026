import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type CareersMarkdownBodyProps = {
  /** Markdown source. Renders nothing when empty or whitespace-only. */
  content: string
  className?: string
}

/**
 * Renders Careers posting Markdown with the same pipeline and prose styles as
 * the public Careers page (.careers-prose in global.css).
 */
export function CareersMarkdownBody({
  content,
  className = '',
}: CareersMarkdownBodyProps) {
  if (content.trim() === '') {
    return null
  }

  return (
    <div className={`careers-prose text-body-1 text-ink ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
