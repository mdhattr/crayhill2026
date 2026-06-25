import { PageHead } from '@/components/PageHead'
import { TeamGrid } from '@/components/TeamGrid'
import { useTeamList } from '@/api/team'
import { ApiError } from '@/api/client'
import { leadershipMeta } from '@/pages/team/leadership/meta'

/**
 * Leadership page (/team/leadership). Linked from the TopNav Team
 * dropdown. Roster data comes from GET /api/v1/team?roster=leadership.
 */
export default function LeadershipPage() {
  const { data: members, isPending, isError, error } = useTeamList('leadership')

  return (
    <>
      <PageHead
        title={leadershipMeta.title}
        description={leadershipMeta.description}
      />
      <main>
        {isPending ? (
          <section className="bg-paper px-6 py-module sm:px-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-body-1 text-muted" role="status">
                Loading team…
              </p>
            </div>
          </section>
        ) : null}

        {isError ? (
          <section className="bg-paper px-6 py-module sm:px-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-body-1 text-accent-navy" role="alert">
                {error instanceof ApiError
                  ? error.message
                  : 'Unable to load the leadership roster.'}
              </p>
            </div>
          </section>
        ) : null}

        {!isPending && !isError && members ? (
          <TeamGrid
            heading="Leadership"
            subheading="The Crayhill team is led by seasoned industry professionals with extensive expertise in asset-based finance and strong, long-standing market relationships."
            members={members}
            bioRoutePrefix="/team/leadership"
          />
        ) : null}
      </main>
    </>
  )
}
