import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isSafeMarkdownHref, SAFE_MARKDOWN_COMPONENTS } from '@/lib/safe-markdown'

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
          ...SAFE_MARKDOWN_COMPONENTS,
          a({ href, children }) {
            if (href && isSafeMarkdownHref(href) && href.startsWith('/')) {
              return <Link to={href}>{children}</Link>
            }

            if (href && isSafeMarkdownHref(href)) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            }

            return <span>{children}</span>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
