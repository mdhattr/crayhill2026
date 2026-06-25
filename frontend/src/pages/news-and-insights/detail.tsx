import { NavLink, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNewsArticle, useNewsList } from '@/api/news'
import { PageHead } from '@/components/PageHead'
import { CtaChevron } from '@/components/CtaChevron'
import { NewsCard } from '@/pages/news-and-insights/NewsCard'
import { formatDate } from '@/lib/format-date'
import { resolveNewsImage } from '@/lib/news-image'

/**
 * Article detail page.
 *
 * Two columns on desktop (single column on mobile): the article body on the
 * left, a sidebar of the two most recent published posts on the right — the
 * post currently being read is skipped, so the sidebar always points elsewhere.
 *
 * Designer spec (article-template mockup):
 *   - Background white; 120px above the hero image; 40px between content blocks.
 *   - Article title: H3 typography (rendered as <h1> for document semantics —
 *     the page's primary heading, sized at H3 per the mockup; this is the
 *     `text-h*` escape hatch the brand rules allow for genuine size/semantics
 *     divergence).
 *   - Date: Body 3, ink. Body copy: Body 1, ink. In-body hyperlinks use
 *     --color-hyperlink (see .news-prose in global.css).
 *   - Sidebar cards reuse <NewsCard /> (image, H3 title, date, "Read More").
 *
 * Data: GET /api/v1/news?slug=<slug> for the body, GET /api/v1/news for the
 * sidebar list. Drafts and unknown slugs 404 from the API → not-found state.
 *
 * NOTE(content): the designer's "Body Section Title: Body 1 SemiBold" (e.g.
 * "About Crayhill Capital Management") can't be honored yet — those lines are
 * plain paragraphs in the cleaned Markdown, not headings/bold, so they render
 * as regular Body 1. Marking them up requires re-cleaning the source content.
 */
export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isPending, isError } = useNewsArticle(slug)
  const { data: list } = useNewsList()

  // Two most recent published posts, excluding the one being read.
  const recent = (list ?? []).filter((post) => post.slug !== slug).slice(0, 2)

  const backLink = (
    <NavLink
      to="/news-and-insights"
      className={
        'mt-element inline-flex items-center gap-1.5 text-body-1 font-semibold ' +
        'text-accent transition-colors duration-150 hover:text-accent-green ' +
        'focus-visible:text-accent-green'
      }
    >
      <span className="inline-flex rotate-180">
        <CtaChevron />
      </span>
      News &amp; Insights
    </NavLink>
  )

  const heroImage = article
    ? resolveNewsImage(article.image, article.date)
    : null

  return (
    <>
      <PageHead
        title={article ? article.title : 'News & Insights'}
        description={
          article
            ? `${article.title} — Crayhill Capital Management.`
            : 'Crayhill Capital Management news and insights.'
        }
      />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-7xl">
            {isPending ? (
              <p role="status" className="text-muted">
                Loading&hellip;
              </p>
            ) : isError || !article ? (
              <div className="max-w-3xl">
                <h1 className="text-paper-deep">Article not found</h1>
                <p className="mt-6 text-muted">
                  This story may have moved or is no longer available.
                </p>
                {backLink}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-10 gap-y-element lg:grid-cols-3">
                <article className="lg:col-span-2">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt=""
                      className="block aspect-[3/2] w-full object-cover"
                    />
                  ) : null}

                  <h1
                    className={
                      (heroImage ? 'mt-10 ' : '') + 'text-h3 text-ink'
                    }
                  >
                    {article.title}
                  </h1>

                  <p className="mt-3 text-body-3 text-ink">
                    {formatDate(article.date)}
                  </p>

                  <div className="news-prose mt-10 text-body-1 text-ink">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {article.content}
                    </ReactMarkdown>
                  </div>

                  {backLink}
                </article>

                {recent.length > 0 ? (
                  <aside className="lg:col-span-1">
                    <h2 className="sr-only">More from News &amp; Insights</h2>
                    <div className="flex flex-col gap-y-12">
                      {recent.map((post) => (
                        <NewsCard
                          key={post.slug}
                          article={post}
                          variant="secondary"
                          showExcerpt={false}
                        />
                      ))}
                    </div>
                  </aside>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
