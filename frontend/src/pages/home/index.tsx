import { PageHead } from '@/components/PageHead'
import { AssetFocus } from '@/pages/home/AssetFocus'
import { NewsInsights } from '@/pages/home/NewsInsights'
import { homeMeta } from '@/pages/home/meta'

/**
 * Home page.
 *
 * Top section composition (this file): full-bleed hero photo followed by the
 * dark "core block" intro paragraph. Sections are intentionally rendered
 * outside any width-constrained wrapper so they bleed edge-to-edge across
 * any viewport.
 *
 * Hero parallax: the hero uses CSS `background-attachment: fixed` (Tailwind
 * `bg-fixed`). On desktop browsers the image stays anchored to the viewport
 * while the dark intro block scrolls up over the hero zone — that's the
 * "Core Block Scrolling/Parallax Effect" the designer noted. On iOS Safari
 * and most Android Chromium builds `background-attachment: fixed` falls
 * back to `scroll` (the image scrolls with the page); the page still works,
 * it just loses the parallax. If pixel-perfect parallax across mobile is
 * required later, swap this section to a JS/scroll-driven implementation
 * (IntersectionObserver + translateY, or CSS scroll-driven animations).
 *
 * Hero height: full viewport on md+; ~75vh on mobile (25% shorter than
 * full-screen so the intro block arrives sooner on small screens).
 */
export default function HomePage() {
  return (
    <>
      <PageHead title={homeMeta.title} description={homeMeta.description} />
      <main>
        <section
          aria-hidden="true"
          className="h-[75vh] w-full bg-cover bg-fixed bg-center bg-no-repeat md:h-screen"
          style={{ backgroundImage: "url('/images/homepage-hero.jpg')" }}
        />

        <section className="bg-paper-deep px-6 py-module text-white sm:px-10">
          <h3 className="mx-auto max-w-4xl text-center">
            Founded in 2015, Crayhill Capital Management is an independent
            asset-based finance investment manager specializing in structured
            private credit solutions that drive asset origination,
            acquisitions and growth. The firm utilizes direct origination and
            disciplined structuring to deliver tailored capital solutions
            backed by tangible or contractual cash-flowing assets.
          </h3>
        </section>

        <AssetFocus />

        <NewsInsights />
      </main>
    </>
  )
}
