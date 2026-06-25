import { NavLink } from 'react-router-dom'

import { CtaChevron } from '@/components/CtaChevron'

/**
 * One person rendered as a card. Shape is intentionally narrow:
 *   slug      Appended to `bioRoutePrefix` to build the bio route.
 *   name      Rendered as H3 (mixed case).
 *   title     Rendered as H5 (uppercased by the global base rule —
 *             authors write mixed case so screen readers don't read
 *             ALL-CAPS source text letter-by-letter).
 *   imageSrc  Headshot path under /images (Vite copies anything in
 *             /assets into the build via `publicDir`).
 */
export type TeamMember = {
  slug: string
  name: string
  title: string
  imageSrc: string
}

export type TeamGridProps = {
  /** Page H1 (centered, paper-deep color). */
  heading: string
  /** Body 1 subhead under the H1 (centered, black, ~65ch measure). */
  subheading: string
  /** Cards rendered in the grid below the subhead. */
  members: ReadonlyArray<TeamMember>
  /**
   * Route prefix for each card's bio link, e.g. `/team/leadership`.
   * The member's slug is appended: `${prefix}/${slug}`. Detail bio
   * pages don't exist yet — TODO(routes) below.
   */
  bioRoutePrefix: string
}

/**
 * Shared layout for team-roster pages (Leadership, Senior Investment
 * Professionals, ...). Renders a single white-background section
 * containing:
 *
 *   1. Centered H1 (paper-deep) + Body 1 subhead (ink), separated
 *      from the cards by `mt-element` (90px desktop) per the designer's
 *      "Padding under intro text" callout — tightened to 30px on mobile
 *      per the mobile mockup (see the grid className below).
 *
 *   2. Three-up responsive card grid (one column on mobile). Each
 *      card uses the card-link pattern from the homepage News &
 *      Insights block: one NavLink wraps the H3 name and stretches
 *      an ::after overlay across the whole <article>, so clicking
 *      anywhere on the card routes to the bio. The image and the
 *      decorative "View Bio" span carry aria-hidden, keeping the
 *      screen-reader output to "name, title, link".
 *
 * Hover state, driven by `group-hover` on each <article>:
 *   - image: 1.05x scale, 700ms ease (motion-reduce disables it).
 *   - "View Bio" + chevron: color flips from accent (#57A0DD) to
 *     accent-green (#92BE4B), with the chevron riding along via
 *     `currentColor`.
 *
 * View Bio CTAs route to `${bioRoutePrefix}/${slug}`, which is
 * handled by the shared <BioPage /> mounted under each roster's
 * `/team/<roster>/:slug` route. Bio content comes from
 * GET /api/v1/team?roster=<roster>&slug=<slug>; if the slug is
 * missing or unpublished, BioPage renders an in-page "bio not found"
 * panel rather than the global 404 so the user stays inside the team
 * section.
 */
export function TeamGrid({
  heading,
  subheading,
  members,
  bioRoutePrefix,
}: TeamGridProps) {
  return (
    <section className="bg-paper px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-paper-deep">{heading}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-center text-ink">
          {subheading}
        </p>

        <div
          /*
           * gap-y-20 (80px) between rows on md+ — visually generous
           * enough that the next row's image doesn't crowd the
           * previous row's "View Bio" CTA. On mobile the columns
           * stack into a single column so a slightly tighter
           * gap-y-16 (64px) keeps the page from feeling sparse.
           */
          /*
           * Gap between the intro paragraph and the card grid: 30px on
           * mobile, 90px (`mt-element`) on desktop. The mobile mockup
           * (Team: Leadership) annotates "Padding under intro text: 30px",
           * which is tighter than the 50px mobile element default — so the
           * mobile value is pinned with an arbitrary `mt-[30px]`.
           */
          className={
            'mt-[30px] grid grid-cols-1 gap-y-16 ' +
            'md:mt-element md:grid-cols-3 md:gap-x-10 md:gap-y-20'
          }
        >
          {members.map((member) => (
            <article
              key={member.slug}
              /*
               * `relative` anchors the H3 link's ::after overlay so
               * it fills the card. `group` exposes hover/focus-
               * within to descendants (image and CTA span both
               * react).
               */
              className="group relative"
            >
              <div className="overflow-hidden rounded-image">
                <img
                  src={member.imageSrc}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  /*
                   * aspect-[4/5] gives every card the same image
                   * height regardless of the source JPG's native
                   * ratio. object-cover + object-top preserves the
                   * face area when cropping (faces sit in the upper
                   * portion of a portrait headshot).
                   */
                  className={
                    'block aspect-[4/5] w-full object-cover object-top ' +
                    'ease-out transition-transform duration-700 ' +
                    'group-hover:scale-105 ' +
                    'motion-reduce:!transition-none ' +
                    'motion-reduce:group-hover:!scale-100'
                  }
                />
              </div>

              <h3 className="mt-6 text-left text-ink">
                <NavLink
                  to={`${bioRoutePrefix}/${member.slug}`}
                  /*
                   * text-inherit so the H3's ink color survives the
                   * global `a { color: var(--color-link) }` rule.
                   * The after:* utilities stretch a transparent
                   * overlay across the (relative) <article>, making
                   * the whole card the click target without nesting
                   * links.
                   */
                  className={
                    'text-inherit ' +
                    'after:absolute after:inset-0 after:content-[""] ' +
                    'focus-visible:outline-none'
                  }
                >
                  {member.name}
                </NavLink>
              </h3>

              <h5 className="mt-1 text-left text-ink">{member.title}</h5>

              {/*
               * Decorative CTA — the real link is the H3 above.
               * Body 1 SemiBold + accent-blue → accent-green on
               * hover, with the chevron riding along via
               * `currentColor`. aria-hidden so screen readers don't
               * announce it as separate content (they already heard
               * the H3 link).
               */}
              <span
                aria-hidden="true"
                className={
                  'mt-4 inline-flex items-center gap-1.5 ' +
                  'text-body-1 font-semibold text-accent ' +
                  'transition-colors duration-150 ' +
                  'group-hover:text-accent-green ' +
                  'group-focus-within:text-accent-green'
                }
              >
                <CtaChevron />
                View Bio
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
