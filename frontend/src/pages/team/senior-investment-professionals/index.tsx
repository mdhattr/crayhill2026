import { PageHead } from '@/components/PageHead'
import { TeamGrid } from '@/components/TeamGrid'
import { useTeamList } from '@/api/team'
import { ApiError } from '@/api/client'
import { seniorInvestmentProfessionalsMeta } from '@/pages/team/senior-investment-professionals/meta'

/**
 * Senior Investment Professionals page
 * (/team/senior-investment-professionals). Linked from the TopNav
 * Team dropdown. Roster data comes from
 * GET /api/v1/team?roster=senior-investment-professionals.
 */
export default function SeniorInvestmentProfessionalsPage() {
  const {
    data: members,
    isPending,
    isError,
    error,
  } = useTeamList('senior-investment-professionals')

  return (
    <>
      <PageHead
        title={seniorInvestmentProfessionalsMeta.title}
        description={seniorInvestmentProfessionalsMeta.description}
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
                  : 'Unable to load the senior investment professionals roster.'}
              </p>
            </div>
          </section>
        ) : null}

        {!isPending && !isError && members ? (
          <TeamGrid
            heading="Senior Investment Professionals"
            subheading="The Crayhill team is led by seasoned industry professionals with extensive expertise in asset-based finance and strong, long-standing market relationships."
            members={members}
            bioRoutePrefix="/team/senior-investment-professionals"
          />
        ) : null}
      </main>
    </>
  )
}
