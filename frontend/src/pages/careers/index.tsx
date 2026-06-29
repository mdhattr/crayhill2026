import { useId, useState } from 'react'
import { useCareersList, useCareersPageStatus } from '@/api/careers'
import type { CareerPosting } from '@/api/types/careers'
import { CareersMarkdownBody } from '@/components/CareersMarkdownBody'
import { PageHead } from '@/components/PageHead'
import NotFoundPage from '@/pages/not-found'
import { careersMeta } from '@/pages/careers/meta'

/**
 * Careers page (/careers).
 *
 * The rebuilt site has NO individual job-posting pages. Instead each open
 * posting is a clickable accordion row: the title toggles its full Markdown
 * body open/closed in place. Data comes from GET /api/v1/careers (published
 * postings, in sort order), which returns the full body inline.
 *
 * Page composition:
 *   - Hero band: centered H1, wide hero image (open-positions-hero.jpg)
 *   - Open positions: accordion list of published postings from the API
 *
 * Designer spec (Careers > When Selected / Expanded):
 *   - Collapsed: down-caret + title in ink (black).
 *   - Expanded: caret rotates and the title + caret turn brand blue
 *     (--color-accent, #57A0DD).
 *   - Expanded body: Body 1, black (the panel sets text-ink; .careers-prose
 *     restores list/spacing affordances without large headings).
 */

/**
 * Disclosure caret. Down when closed; rotates a quarter-turn when open.
 * `currentColor` so it inherits the trigger's ink → accent color change.
 */
function CareerCaret({ open }: { open: boolean }) {
  return (
    <svg
      width="1.1em"
      height="1.1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={
        'inline-block shrink-0 transition-transform duration-200 ease-out ' +
        (open ? '-rotate-90' : 'rotate-0')
      }
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6 13 12 19 18 13" />
    </svg>
  )
}

function PostingRow({ posting }: { posting: CareerPosting }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <li className="border-b border-rule first:border-t">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className={
            'flex w-full items-center gap-3 py-6 text-left ' +
            'bg-transparent border-0 cursor-pointer appearance-none ' +
            'transition-colors duration-150 ' +
            'hover:text-accent focus-visible:text-accent focus-visible:outline-none ' +
            (open ? 'text-accent' : 'text-ink')
          }
        >
          <CareerCaret open={open} />
          <span>{posting.title}</span>
        </button>
      </h4>

      {open && (
        <div id={panelId} className="pb-10">
          <CareersMarkdownBody content={posting.content} />
        </div>
      )}
    </li>
  )
}

export default function CareersPage() {
  const { data: pageStatus, isPending: statusPending } = useCareersPageStatus()
  const pageActive = pageStatus?.active ?? true
  const { data: postings, isPending, isError } = useCareersList({
    enabled: pageActive,
  })

  if (!statusPending && !pageActive) {
    return <NotFoundPage />
  }

  return (
    <>
      <PageHead title={careersMeta.title} description={careersMeta.description} />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-paper-deep">Careers</h1>

            <div className="group mt-element overflow-hidden rounded-image">
              <img
                src="/images/open-positions-hero.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={
                  'block w-full ease-out ' +
                  'transition-transform duration-700 ' +
                  'group-hover:scale-105 ' +
                  'motion-reduce:!transition-none ' +
                  'motion-reduce:group-hover:!scale-100'
                }
              />
            </div>
          </div>

          <div className="mx-auto mt-element max-w-4xl">
            <h2 className="text-ink">Open positions</h2>

            <div className="mt-10">
              {isPending ? (
                <p role="status" className="text-muted">
                  Loading&hellip;
                </p>
              ) : isError ? (
                <p className="text-muted">
                  We&rsquo;re unable to load open positions right now. Please
                  try again later, or email{' '}
                  <a
                    href="mailto:recruiting@crayhill.com"
                    className="text-accent underline hover:text-accent-green"
                  >
                    recruiting@crayhill.com
                  </a>
                  .
                </p>
              ) : !postings || postings.length === 0 ? (
                <p className="text-muted">
                  For more information about joining the Crayhill team, please
                  contact{' '}
                  <a
                    href="mailto:recruiting@crayhill.com"
                    className="text-accent underline hover:text-accent-green"
                  >
                    recruiting@crayhill.com
                  </a>{' '}
                  for more information.
                </p>
              ) : (
                <ul>
                  {postings.map((posting) => (
                    <PostingRow key={posting.slug} posting={posting} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
