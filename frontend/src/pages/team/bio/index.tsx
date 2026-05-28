import { Link, NavLink, useParams } from 'react-router-dom'
import { PageHead } from '@/components/PageHead'
import { TEAM_BIOS } from '@/data/team-bios'

/**
 * Shared bio detail page. This file is intentionally NOT mounted at
 * its own URL — instead, two route patterns in routes.tsx point at
 * this component:
 *
 *   /team/leadership/:slug
 *   /team/senior-investment-professionals/:slug
 *
 * The component looks the slug up in TEAM_BIOS (the single source of
 * truth for bio content) and either renders the bio or a friendly
 * "not found" panel. Cross-roster typos (e.g. visiting an SIP slug
 * under the leadership prefix) intentionally show the not-found
 * panel rather than rendering the wrong back link, because the
 * roster path lives on the bio entry itself.
 *
 * Page composition (single white section, py-module = 120px):
 *
 *   1. Two-column grid on md+ (1fr image, 3fr content). Image is a
 *      4:5 portrait, matching the team grid card crop so card → bio
 *      transitions don't shift the face.
 *
 *   2. Content column header:
 *        H2 "<Name>" (paper-deep / ink — designer spec is H2 Black).
 *        H5 "<Full Title>" (uppercased by base rule; pipe-separated
 *        for multi-role people like Josh).
 *
 *   3. Bio body — paragraphs in a CSS multi-column flow
 *      (columns-1 / md:columns-2 with a 40px column-gap), letting
 *      long paragraphs break across columns the way the comp shows.
 *
 *   4. Footer block (right-aligned within the content column):
 *        - Optional envelope + LinkedIn icons (rendered only when
 *          the bio entry supplies the URLs). Muted by default,
 *          accent-green on hover — same hover language as the
 *          page's primary CTAs.
 *        - "< Team" back link, accent-blue → accent-green on hover.
 *          Points at bio.rosterPath so each roster gets its own
 *          round-trip.
 */

function EmailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
      <polyline points="3 6 12 13 21 6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      {/*
       * LinkedIn "in" mark — single-path glyph composed of the
       * rounded square frame plus the lowercase 'in' shape, drawn
       * with the even-odd fill rule so the bowls of the letters
       * read as cut-outs.
       */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 2h17A1.5 1.5 0 0122 3.5v17a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 20.5v-17A1.5 1.5 0 013.5 2zM8 19V10H5v9h3zM6.5 8.25A1.75 1.75 0 108.3 6.5a1.78 1.78 0 00-1.8 1.75zM19 19v-4.74c0-2.8-1.81-3.66-3.36-3.66a3.11 3.11 0 00-2.7 1.4V10H10v9h3v-4.67a1.74 1.74 0 011.62-1.86c.78 0 1.38.51 1.38 1.93V19h3z"
      />
    </svg>
  )
}

/**
 * Left-pointing chevron prefix for the "Team" back link. Mirror of
 * the right-chevron used by the team grid card CTAs — same stroke
 * weight + same currentColor so the icon picks up the link's
 * accent → accent-green hover transition.
 */
function BackChevron() {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <polyline points="15 6 9 12 15 18" />
    </svg>
  )
}

/**
 * Rendered when the URL slug isn't in TEAM_BIOS. Lighter weight than
 * a full 404 — keeps the user inside the team section and offers a
 * one-click recovery to the (more useful) Leadership roster.
 */
function BioNotFound({ slug }: { slug: string }) {
  return (
    <>
      <PageHead
        title="Bio not found"
        description="The team member you requested could not be found."
      />
      <main className="bg-paper px-6 py-module sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-paper-deep">Bio not found</h1>
          <p className="mt-6 text-ink">
            We couldn{'\u2019'}t find a team member at{' '}
            <code className="text-muted">{slug}</code>.
          </p>
          <p className="mt-6">
            <Link
              to="/team/leadership"
              className="text-body-1 font-semibold text-accent hover:text-accent-green"
            >
              Back to Leadership
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

export default function BioPage() {
  /*
   * Default to empty string so the TypeScript narrowing below works
   * cleanly. React Router types `useParams` returns as Partial
   * (params may be undefined). An empty-string slug is guaranteed
   * to miss the TEAM_BIOS lookup, which falls through to BioNotFound
   * — matches the desired behavior for malformed URLs.
   */
  const { slug = '' } = useParams<{ slug: string }>()
  const bio = TEAM_BIOS[slug]

  if (!bio) {
    return <BioNotFound slug={slug} />
  }

  return (
    <>
      <PageHead
        title={`${bio.name} | Crayhill Capital Management`}
        description={`${bio.name}, ${bio.fullTitle} at Crayhill Capital Management.`}
      />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <div
              /*
               * 1fr image / 3fr content keeps the headshot close to
               * the 280–310px column seen in the comp at 1280px
               * content width. items-start so the (variable-height)
               * content column top-aligns with the image rather
               * than vertically centering on it.
               */
              className={
                'grid grid-cols-1 items-start gap-y-10 ' +
                'md:grid-cols-[1fr_3fr] md:gap-x-10 md:gap-y-0'
              }
            >
              <div>
                <img
                  src={bio.imageSrc}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="block aspect-[4/5] w-full object-cover object-top"
                />
              </div>

              <div>
                <h2 className="text-ink">{bio.name}</h2>
                <h5 className="mt-2 text-ink">{bio.fullTitle}</h5>

                <div
                  /*
                   * mt-10 (40px) — tighter than the brand
                   * `--spacing-element` (90px) because the designer
                   * comp shows a deliberately small gap between the
                   * title block and the bio body. Treated as a
                   * per-section override of the standard rhythm,
                   * documented inline.
                   *
                   * The columns utilities turn the child <p>s into
                   * a multi-column flow. mb-6 on each paragraph
                   * supplies the inter-paragraph rhythm Tailwind
                   * preflight otherwise strips.
                   */
                  className="mt-10 columns-1 gap-x-10 md:columns-2"
                >
                  {bio.paragraphs.map((para, i) => (
                    <p key={i} className="mb-6 text-ink">
                      {para}
                    </p>
                  ))}
                </div>

                {/*
                 * Footer block — icons + Team link. Right-aligned
                 * inside the content column so it sits beneath the
                 * second bio column, matching the comp. Lives
                 * OUTSIDE the columns wrapper so the CSS column
                 * algorithm doesn't try to flow it as another text
                 * block.
                 */}
                <div className="mt-8 flex flex-col items-end gap-4">
                  {(bio.email || bio.linkedinUrl) && (
                    <div className="flex items-center gap-4 text-muted-soft">
                      {bio.email && (
                        <a
                          href={`mailto:${bio.email}`}
                          aria-label={`Email ${bio.name}`}
                          className={
                            'text-inherit transition-colors duration-150 ' +
                            'hover:text-accent-green ' +
                            'focus-visible:text-accent-green focus-visible:outline-none'
                          }
                        >
                          <EmailIcon />
                        </a>
                      )}
                      {bio.linkedinUrl && (
                        <a
                          href={bio.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${bio.name} on LinkedIn`}
                          className={
                            'text-inherit transition-colors duration-150 ' +
                            'hover:text-accent-green ' +
                            'focus-visible:text-accent-green focus-visible:outline-none'
                          }
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                    </div>
                  )}

                  <NavLink
                    to={bio.rosterPath}
                    className={
                      'inline-flex items-center gap-1.5 ' +
                      'text-body-1 font-semibold text-accent ' +
                      'transition-colors duration-150 ' +
                      'hover:text-accent-green ' +
                      'focus-visible:text-accent-green focus-visible:outline-none'
                    }
                  >
                    <BackChevron />
                    Team
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
