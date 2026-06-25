import type { Components } from 'react-markdown'

const ALLOWED_LINK_SCHEMES = new Set(['http:', 'https:', 'mailto:'])

/** Allow root-relative paths and http(s)/mailto links only. */
export function isSafeMarkdownHref(href: string): boolean {
  const trimmed = href.trim()
  if (trimmed === '') {
    return false
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return !trimmed.includes('<') && !trimmed.includes('>')
  }

  try {
    const url = new URL(trimmed)
    return ALLOWED_LINK_SCHEMES.has(url.protocol)
  } catch {
    return false
  }
}

/**
 * Defense-in-depth Markdown rendering: no code blocks, no unsafe links.
 * react-markdown does not parse raw HTML by default; these overrides block
 * code syntax and strip dangerous href schemes if they appear in stored content.
 */
export const SAFE_MARKDOWN_COMPONENTS: Components = {
  code: ({ children }) => <span>{children}</span>,
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => {
    if (!href || !isSafeMarkdownHref(href)) {
      return <span>{children}</span>
    }

    const external = /^https?:\/\//i.test(href)

    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  },
}
