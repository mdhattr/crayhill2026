import { PageHead } from '@/components/PageHead'
import { TeamGrid, type TeamMember } from '@/components/TeamGrid'
import { seniorInvestmentProfessionalsMeta } from '@/pages/team/senior-investment-professionals/meta'

/**
 * Senior Investment Professionals roster.
 *
 * Note on content delta from the original design comp:
 *   The handed-off mockup included five people across two rows
 *   (Sloan Sutta + Shweta Kapadia + Raj Savai, then Stefan Hoefer +
 *   Jihane Hassad). Sloan and Raj were removed during sign-off,
 *   leaving three people in a single row of three. The
 *   `headshot-sloan.jpg` and `headshot-raj.jpg` assets are still
 *   in /assets/images but are intentionally unused; safe to delete
 *   once the redesign is fully in production.
 */
const SENIOR_INVESTMENT_PROFESSIONALS: ReadonlyArray<TeamMember> = [
  {
    slug: 'shweta-kapadia',
    name: 'Shweta Kapadia',
    title: 'Managing Director, Origination and Execution of Investments',
    imageSrc: '/images/headshot-shweta.jpg',
  },
  {
    slug: 'stefan-hoefer',
    name: 'Stefan Hoefer',
    title: 'Managing Director, Origination and Execution of Investments',
    imageSrc: '/images/headshot-stefan.jpg',
  },
  {
    slug: 'jihane-hassad',
    name: 'Jihane Hassad',
    title: 'Director',
    imageSrc: '/images/headshot-jihane.jpg',
  },
]

/**
 * Senior Investment Professionals page
 * (/team/senior-investment-professionals). Linked from the TopNav
 * Team dropdown. Renders the same white-section template as
 * Leadership via the shared <TeamGrid />.
 *
 * Subhead text mirrors the Leadership page verbatim per the
 * designer's comp — both team-roster pages open with the same
 * one-line statement about the team. If that copy ever needs to
 * diverge between pages, edit the `subheading` prop here directly
 * (it intentionally stays at the page level rather than the
 * component level so per-page wording stays explicit).
 */
export default function SeniorInvestmentProfessionalsPage() {
  return (
    <>
      <PageHead
        title={seniorInvestmentProfessionalsMeta.title}
        description={seniorInvestmentProfessionalsMeta.description}
      />
      <main>
        <TeamGrid
          heading="Senior Investment Professionals"
          subheading="The Crayhill team is led by seasoned industry professionals with extensive expertise in asset-based finance and strong, long-standing market relationships."
          members={SENIOR_INVESTMENT_PROFESSIONALS}
          bioRoutePrefix="/team/senior-investment-professionals"
        />
      </main>
    </>
  )
}
