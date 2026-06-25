// One-off migration tool: parse the legacy WordPress posts dump
// (wp_155282834_posts.sql), repair the encoding/markup garbage, convert each
// post body to Markdown, and emit a CSV with only the fields we keep.
//
// Zero dependencies. Run from the repo root:
//   node scripts/clean-wp-posts.mjs
//
// The dump is a latin1 MySQL export whose text columns hold UTF-8 bytes that
// were stored as if they were latin1 (classic "mojibake"), so a latin1->utf8
// round-trip restores the original characters. The body markup is a small,
// predictable subset (Gutenberg block comments, classic-editor HTML, Open
// Calais xn-* spans), so a hand-rolled HTML->Markdown pass is sufficient.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const SOURCE = resolve(repoRoot, 'wp_155282834_posts.sql')
const OUTPUT = resolve(repoRoot, 'news-posts.csv')

const AUTHOR = 'Crayhill Capital Management'

// Column positions in the INSERT tuple (0-indexed), per the CREATE TABLE.
const COL = { postDate: 2, postContent: 4, postTitle: 5, postName: 11 }

/**
 * Split a single INSERT value tuple `(...)` into its fields. Understands MySQL
 * single-quoted string literals with backslash escapes, so commas, parens, and
 * escaped quotes inside a string don't split the field.
 */
function parseTuple(line) {
  const fields = []
  let i = 0
  const n = line.length

  // Expect a leading '(' and a trailing ')' (the row terminator , or ; is
  // stripped by the caller).
  if (line[i] !== '(') throw new Error('tuple does not start with (')
  i += 1

  while (i < n) {
    // Skip whitespace between fields.
    while (i < n && /\s/.test(line[i])) i += 1

    if (line[i] === ')') break

    if (line[i] === "'") {
      // Quoted string literal.
      i += 1
      let buf = ''
      while (i < n) {
        const ch = line[i]
        if (ch === '\\') {
          const next = line[i + 1]
          if (next === 'n') buf += '\n'
          else if (next === 'r') buf += '\r'
          else if (next === 't') buf += '\t'
          else if (next === '0') buf += '\0'
          else buf += next // \' \" \\ and anything else -> literal char
          i += 2
          continue
        }
        if (ch === "'") {
          i += 1
          break
        }
        buf += ch
        i += 1
      }
      fields.push(buf)
    } else {
      // Unquoted token (number, NULL) up to the next comma or closing paren.
      let buf = ''
      while (i < n && line[i] !== ',' && line[i] !== ')') {
        buf += line[i]
        i += 1
      }
      fields.push(buf.trim())
    }

    // Skip to the next field separator.
    while (i < n && /\s/.test(line[i])) i += 1
    if (line[i] === ',') i += 1
  }

  return fields
}

// Windows-1252 differs from latin1 only in 0x80-0x9F. Map those code points
// back to their byte so the round-trip can reconstruct the original UTF-8.
const CP1252_HIGH = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
}

/**
 * Repair UTF-8 text that was mis-decoded as Windows-1252 and re-encoded to
 * UTF-8 (classic WordPress-on-latin1 mojibake). Encode each char back to the
 * cp1252 byte it came from, then decode the byte stream as UTF-8. Characters
 * that aren't cp1252 (i.e. were never corrupted) pass through as their own
 * UTF-8 bytes so they survive untouched.
 */
function fixMojibake(s) {
  const bytes = []
  for (const ch of s) {
    const cp = ch.codePointAt(0)
    if (cp <= 0xff) {
      bytes.push(cp)
    } else if (CP1252_HIGH[cp] !== undefined) {
      bytes.push(CP1252_HIGH[cp])
    } else {
      // Not a cp1252 char: keep its real UTF-8 bytes.
      for (const b of Buffer.from(ch, 'utf8')) bytes.push(b)
    }
  }
  const repaired = Buffer.from(bytes).toString('utf8')
  // Guard: if the round-trip made things worse (more replacement chars than we
  // started with), keep the original field.
  const count = (str) => (str.match(/\uFFFD/g) || []).length
  return count(repaired) > count(s) ? s : repaired
}

const NAMED_ENTITIES = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  ndash: '\u2013',
  mdash: '\u2014',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  hellip: '\u2026',
  copy: '\u00a9',
  reg: '\u00ae',
  trade: '\u2122',
  eacute: '\u00e9',
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, name) ? NAMED_ENTITIES[name] : m,
    )
}

/** Decode the real destination out of a tracking/wrapper URL. */
function unwrapTrackingUrl(url) {
  try {
    // PR Newswire c212 wrapper: ...?...&u=<encoded target>&...
    if (/c212\.net\/c\/link\//.test(url)) {
      const u = new URL(url).searchParams.get('u')
      if (u) return decodeURIComponent(u)
    }
    // Outlook SafeLinks wrapper: ...safelinks.protection.outlook.com/?url=<encoded>
    if (/safelinks\.protection\.outlook\.com/.test(url)) {
      const target = new URL(url).searchParams.get('url')
      if (target) return decodeURIComponent(target)
    }
  } catch {
    // Malformed URL: fall through and return as-is.
  }
  return url
}

/** Convert the post body HTML to Markdown. */
function htmlToMarkdown(html) {
  let s = html

  // Drop all HTML comments (Gutenberg block markers, <!--more-->, etc.).
  s = s.replace(/<!--[\s\S]*?-->/g, '')

  // Normalize line breaks to paragraph boundaries we control.
  s = s.replace(/\r\n?/g, '\n')

  // Links -> [text](url), unwrapping tracking wrappers. Decode entities in the
  // href first so query params like &amp;u=... parse correctly.
  s = s.replace(/<a\b[^>]*?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = decodeEntities(stripTags(text)).trim()
    const url = unwrapTrackingUrl(decodeEntities(href.trim()))
    if (!cleanText) return ''
    if (!url || url.startsWith('#')) return cleanText
    return `[${cleanText}](${url})`
  })

  // Headings (only h1-h6 seen is h4).
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const hashes = '#'.repeat(Number(level))
    return `\n\n${hashes} ${stripTags(inner).trim()}\n\n`
  })

  // A <br> immediately before a closing emphasis tag (common in the legacy
  // "<strong>About X<br></strong>body" headers) belongs after the tag, not
  // inside it - move it out so the bold span stays clean.
  s = s.replace(/\s*<br\b[^>]*>\s*<\/(strong|b|em|i)>/gi, '</$1>\n')

  // The legacy editor often split one continuous bold/italic run across several
  // directly-adjacent tags (`</strong><strong>`). Merge same-type spans that
  // touch with NO whitespace between them, so we don't emit broken "****"
  // sequences. A space between two spans is a real word separator, so those are
  // left alone (the emit step below keeps that space outside the markers).
  s = s.replace(/<\/(?:strong|b)><(?:strong|b)\b[^>]*>/gi, '')
  s = s.replace(/<\/(?:em|i)><(?:em|i)\b[^>]*>/gi, '')

  // Bold / italic. Keep any leading/trailing whitespace OUTSIDE the markers
  // (Markdown forbids "** bold **"), so adjacent words don't run together when
  // a span carried the separating space inside it.
  s = s.replace(/<\s*(strong|b)\b[^>]*>([\s\S]*?)<\/\s*\1\s*>/gi, (_, _tag, inner) => {
    const t = inner.trim()
    if (!t) return /\s/.test(inner) ? ' ' : ''
    return `${/^\s/.test(inner) ? ' ' : ''}**${t}**${/\s$/.test(inner) ? ' ' : ''}`
  })
  s = s.replace(/<\s*(em|i)\b[^>]*>([\s\S]*?)<\/\s*\1\s*>/gi, (_, _tag, inner) => {
    const t = inner.trim()
    if (!t) return /\s/.test(inner) ? ' ' : ''
    return `${/^\s/.test(inner) ? ' ' : ''}*${t}*${/\s$/.test(inner) ? ' ' : ''}`
  })

  // Line breaks (including attributed ones like <br class="dnr" />).
  s = s.replace(/<br\b[^>]*>/gi, '\n')

  // Paragraph and block boundaries -> blank lines.
  s = s.replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote)>/gi, '\n\n')
  s = s.replace(/<(p|div|ul|ol|blockquote)\b[^>]*>/gi, '\n\n')
  s = s.replace(/<li\b[^>]*>/gi, '\n- ')

  // Strip every remaining tag (span.xn-*, u, sub, sup, etc.).
  s = stripTags(s)

  // Decode entities now that tags are gone.
  s = decodeEntities(s)

  // Whitespace tidy.
  s = s
    .split('\n')
    .map((line) => line.replace(/[ \t\u00a0\u202f]+/g, ' ').trim())
    .join('\n')
  s = s.replace(/\n{3,}/g, '\n\n') // collapse runs of blank lines
  s = s.replace(/[ \t]+\n/g, '\n')
  s = s.trim()

  return s
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '')
}

/** RFC-4180 CSV field: always quote, double internal quotes. */
function csvField(value) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function main() {
  const sql = readFileSync(SOURCE, 'utf8')
  const lines = sql.split('\n')

  const rows = []
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.startsWith('(')) continue
    // Strip the row terminator (',' or ';') after the closing paren.
    const body = line.replace(/[,;]\s*$/, '')
    const fields = parseTuple(body)
    if (fields.length < 12) continue

    const postDate = fields[COL.postDate]
    const content = fields[COL.postContent]
    const title = fields[COL.postTitle]
    const slug = fields[COL.postName]

    rows.push({
      title: fixMojibake(decodeEntities(stripTags(title))).replace(/\s+/g, ' ').trim(),
      author: AUTHOR,
      published_date: (postDate || '').slice(0, 10),
      url: slug.trim(),
      image: '',
      // These were live on the old site, so they seed as published. Flip a
      // row to 'draft' here (or in the spreadsheet) to keep it off the site.
      status: 'published',
      content: htmlToMarkdown(fixMojibake(content)),
    })
  }

  // Newest first.
  rows.sort((a, b) => (a.published_date < b.published_date ? 1 : a.published_date > b.published_date ? -1 : 0))

  const header = ['title', 'author', 'published_date', 'url', 'image', 'status', 'content']
  const csv = [
    header.map(csvField).join(','),
    ...rows.map((r) => header.map((h) => csvField(r[h])).join(',')),
  ].join('\r\n')

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, csv + '\r\n', 'utf8')

  process.stdout.write(`Wrote ${rows.length} posts to ${OUTPUT}\n`)
}

main()
