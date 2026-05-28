import { PageHead } from '@/components/PageHead'
import { TeamGrid, type TeamMember } from '@/components/TeamGrid'
import { leadershipMeta } from '@/pages/team/leadership/meta'

/**
 * Leadership roster, in design-order (top row first, left-to-right).
 * Schema lives on the shared TeamMember type; this array is just the
 * page-local data.
 *
 * Note on the Katherine Taylor entry: the source asset is filed as
 * `headshot-kassie.jpg` (informal first name) but the comp labels
 * her as "Katherine Taylor". The slug uses the display name so the
 * eventual public URL reads naturally; the asset filename is left
 * alone to avoid a rename that would cascade across the asset
 * pipeline.
 */
const LEADERSHIP: ReadonlyArray<TeamMember> = [
  {
    slug: 'josh-eaton',
    name: 'Josh Eaton',
    title: 'Co-Founder',
    imageSrc: '/images/headshot-josh.jpg',
  },
  {
    slug: 'carlos-mendez',
    name: 'Carlos Mendez',
    title: 'Co-Founder',
    imageSrc: '/images/headshot-carlos.jpg',
  },
  {
    slug: 'joe-thomas',
    name: 'Joe Thomas',
    title: 'Chief Financial Officer',
    imageSrc: '/images/headshot-joe.jpg',
  },
  {
    slug: 'scott-beardsley',
    name: 'Scott Beardsley',
    title: 'Chief Operating Officer',
    imageSrc: '/images/headshot-scott.jpg',
  },
  {
    slug: 'katherine-taylor',
    name: 'Katherine Taylor',
    title: 'Head of Marketing and Investor Relations',
    imageSrc: '/images/headshot-kassie.jpg',
  },
  {
    slug: 'daniel-shlomi',
    name: 'Daniel Shlomi',
    title: 'General Counsel',
    imageSrc: '/images/headshot-daniel.jpg',
  },
]

/**
 * Leadership page (/team/leadership). Linked from the TopNav Team
 * dropdown. Renders a single white-background section composed by
 * <TeamGrid />:
 *
 *   - Centered H1 "Leadership" (paper-deep #293A51)
 *   - Body 1 subhead (ink black)
 *   - Three-up card grid: image (hover-zoom) over name (H3) over
 *     title (H5, uppercased by base rule) over "View Bio" CTA
 *     (Body 1 SemiBold, accent → accent-green on hover)
 *
 * See <TeamGrid /> for the full visual + accessibility contract.
 */
export default function LeadershipPage() {
  return (
    <>
      <PageHead
        title={leadershipMeta.title}
        description={leadershipMeta.description}
      />
      <main>
        <TeamGrid
          heading="Leadership"
          subheading="The Crayhill team is led by seasoned industry professionals with extensive expertise in asset-based finance and strong, long-standing market relationships."
          members={LEADERSHIP}
          bioRoutePrefix="/team/leadership"
        />
      </main>
    </>
  )
}
