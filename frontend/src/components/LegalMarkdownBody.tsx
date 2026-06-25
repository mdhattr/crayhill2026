import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type LegalMarkdownBodyProps = {
  content: string
  className?: string
}

/**
 * Renders legal/static page Markdown with the same pipeline and prose styles
 * as the Legal Notice and Privacy Policy pages (.legal-prose in global.css).
 * Internal root-relative links use client-side routing.
 */
export function LegalMarkdownBody({
  content,
  className = '',
}: LegalMarkdownBodyProps) {
  if (content.trim() === '') {
    return null
  }

  return (
    <div className={`legal-prose text-body-1 text-ink ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            if (href?.startsWith('/')) {
              return <Link to={href}>{children}</Link>
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
