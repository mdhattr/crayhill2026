import { Link, NavLink, useLocation, useParams } from 'react-router-dom'
import { useTeamBio } from '@/api/team'
import { ApiError } from '@/api/client'
import type { TeamRoster } from '@/api/types/team'
import { CtaChevron } from '@/components/CtaChevron'
import { MaskedIcon } from '@/components/MaskedIcon'
import { PageHead } from '@/components/PageHead'
import { TeamBioMarkdownBody } from '@/components/TeamBioMarkdownBody'

/**
 * Shared bio detail page. Mounted under two route patterns in routes.tsx:
 *
 *   /team/leadership/:slug
 *   /team/senior-investment-professionals/:slug
 *
 * Bio content comes from GET /api/v1/team?roster=<roster>&slug=<slug>.
 * The roster in the URL must match the member's roster or the page shows
 * not found (prevents cross-roster slug typos from rendering wrong back links).
 */

function rosterFromPathname(pathname: string): TeamRoster | null {
  if (pathname.startsWith('/team/senior-investment-professionals/')) {
    return 'senior-investment-professionals'
  }
  if (pathname.startsWith('/team/leadership/')) {
    return 'leadership'
  }
  return null
}

function EmailIcon() {
  return (
    <svg
      width="38"
      height="38"
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

function BioNotFound({
  slug,
  rosterPath,
}: {
  slug: string
  rosterPath: string
}) {
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
              to={rosterPath}
              className="text-body-1 font-semibold text-accent hover:text-accent-green"
            >
              Back to team
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

export default function BioPage() {
  const { pathname } = useLocation()
  const { slug = '' } = useParams<{ slug: string }>()
  const urlRoster = rosterFromPathname(pathname)
  const rosterPath =
    urlRoster === 'senior-investment-professionals'
      ? '/team/senior-investment-professionals'
      : '/team/leadership'

  const { data: bio, isPending, isError, error } = useTeamBio(urlRoster, slug)

  if (urlRoster === null) {
    return <BioNotFound slug={slug} rosterPath="/team/leadership" />
  }

  if (isPending) {
    return (
      <>
        <PageHead title="Loading…" description="Loading team bio." />
        <main className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-body-1 text-muted" role="status">
              Loading bio…
            </p>
          </div>
        </main>
      </>
    )
  }

  if (isError || !bio || bio.roster !== urlRoster) {
    if (error instanceof ApiError && error.code !== 'NOT_FOUND') {
      return (
        <>
          <PageHead title="Unable to load bio" description="Team bio error." />
          <main className="bg-paper px-6 py-module sm:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-paper-deep">Unable to load bio</h1>
              <p className="mt-6 text-ink" role="alert">
                {error.message}
              </p>
            </div>
          </main>
        </>
      )
    }
    return <BioNotFound slug={slug} rosterPath={rosterPath} />
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

                <div className="mt-10">
                  <TeamBioMarkdownBody content={bio.content} />
                </div>

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
                          className="group inline-flex focus-visible:outline-none"
                        >
                          <MaskedIcon
                            src="/icons/icon-linkedin.svg"
                            className={
                              'h-[45px] w-[45px] bg-muted-soft transition-colors duration-150 ' +
                              'group-hover:bg-accent-green group-focus-visible:bg-accent-green'
                            }
                          />
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
                    <CtaChevron direction="left" />
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
