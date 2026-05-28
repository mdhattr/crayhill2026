import { PageHead } from '@/components/PageHead'
import { cultureMeta } from '@/pages/team/culture/meta'
import { IdeaGenerationTenets } from '@/pages/team/culture/IdeaGenerationTenets'

/**
 * Culture page (/team/culture). Linked from the TopNav Team
 * dropdown.
 *
 * Page composition (top to bottom, three full-width sections):
 *
 *   1. Hero — <section> on --color-paper. Centered H1 "Culture"
 *      in paper-deep over a Body 1 ink subhead, with a wide
 *      rounded-2xl image below. Section uses an asymmetric
 *      `pt-module pb-element` (120/90) because the designer comp
 *      annotates the IMAGE itself as having 90px top/bottom
 *      padding — the 90px below the image is the section's bottom
 *      padding, and `mt-element` (90px) provides the 90px above.
 *
 *   2. Idea Generation Tenets — see IdeaGenerationTenets.tsx for
 *      the full spec (paper-deep band, 3-icon grid with slide-in
 *      animation).
 *
 *   3. Specialized Expertise — <section> on --color-paper. Centered
 *      H5 eyebrow in accent blue over an H3 black headline.
 *      `py-module`; content constrained to `max-w-5xl` so the long
 *      H3 wraps at ~3 lines as in the comp rather than stretching
 *      across the full grid width.
 *
 * Image hover behavior:
 *   The hero image scales 1.05x on hover via `group-hover` on the
 *   wrapping `overflow-hidden` div — same affordance as every
 *   other hero image on the site (sector intros, Who We Are, etc.),
 *   matched here per the comp's "Image Hover: Slight zoom-in" note.
 *   `motion-reduce` disables it.
 */
export default function CulturePage() {
  return (
    <>
      <PageHead
        title={cultureMeta.title}
        description={cultureMeta.description}
      />
      <main>
        <section className="bg-paper px-6 pt-module pb-element sm:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-center text-paper-deep">Culture</h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-ink">
              Our investment team seeks to promote sound reasoning and
              continuous recalibration of our risk-taking initiatives.
            </p>

            {/*
             * group on the wrapper, overflow-hidden so the scaled
             * child doesn't bleed outside the rounded corners.
             * rounded-2xl matches the corner radius visible in the
             * comp (~16px).
             */}
            <div className="group mt-element overflow-hidden rounded-2xl">
              <img
                src="/images/culture-hero.jpg"
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
        </section>

        <IdeaGenerationTenets />

        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-5xl text-center">
            {/*
             * H5 already uppercases via the global base rule;
             * authored mixed-case here so screen readers don't
             * spell ALL-CAPS source text letter-by-letter.
             */}
            <h5 className="text-accent">Specialized Expertise</h5>
            <h3 className="mt-6 text-ink">
              Crayhill has assembled a purpose-built team of investment
              professionals that possess the multi-disciplinary skill sets and
              diversity of experiences and viewpoints required to successfully
              execute its asset-based private credit strategy.
            </h3>
          </div>
        </section>
      </main>
    </>
  )
}
