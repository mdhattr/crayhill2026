import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { NewsListItem } from '@/api/types/news'
import { CtaChevron } from '@/components/CtaChevron'
import { formatDate } from '@/lib/format-date'

/**
 * The "Crayhill in the News" list: every published post beyond the three
 * featured cards, as a compact text list on the light-gray module. Designer
 * spec (News & Insights mockup):
 *   - Module background: --color-paper-alt (#F3F3F3), 120px top/bottom.
 *   - Section heading "Crayhill in the News": H3, ink. 40px below it the list.
 *   - Row title: H4, ink, single line + ellipsis; hover --color-accent-strong.
 *   - Date: Body 3, ink, right-aligned.
 *   - Rows divided by --color-accent-cyan rules, 25px vertical padding.
 *   - "View All" reveals the remaining rows in place; "View Less" collapses
 *     back to the initial count.
 * Each row is a single click target (the card-link pattern) linking to the
 * article.
 */

const INITIAL_VISIBLE = 5

const toggleButtonClass =
  'mt-10 inline-flex items-center gap-1.5 ' +
  'text-body-1 font-semibold text-accent ' +
  'transition-colors duration-150 ' +
  'hover:text-accent-green ' +
  'focus-visible:text-accent-green focus-visible:underline ' +
  'focus-visible:outline-none'

type Props = {
  articles: ReadonlyArray<NewsListItem>
}

export function CrayhillInTheNews({ articles }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (articles.length === 0) {
    return null
  }

  const visible = expanded ? articles : articles.slice(0, INITIAL_VISIBLE)
  const hasMore = articles.length > INITIAL_VISIBLE

  return (
    <section className="bg-paper-alt px-6 py-module sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="text-ink">Crayhill in the News</h3>

        <ul className="mt-10 border-t border-accent-cyan">
          {visible.map((article) => (
            <li
              key={article.slug}
              className="group relative border-b border-accent-cyan"
            >
              <div
                className={
                  'flex flex-col gap-1 py-[25px] ' +
                  'sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'
                }
              >
                <h4
                  className={
                    'line-clamp-1 text-ink ' +
                    'transition-colors duration-150 ' +
                    'group-hover:text-accent-strong'
                  }
                >
                  <NavLink
                    to={`/news-and-insights/${article.slug}`}
                    className={
                      'text-inherit ' +
                      'after:absolute after:inset-0 after:content-[""] ' +
                      'focus-visible:outline-none'
                    }
                  >
                    {article.title}
                  </NavLink>
                </h4>

                <p className="shrink-0 text-body-3 text-ink sm:text-right">
                  {formatDate(article.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {hasMore && !expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={toggleButtonClass}
          >
            <CtaChevron />
            View All
          </button>
        ) : null}

        {hasMore && expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className={toggleButtonClass}
          >
            <CtaChevron direction="left" />
            View Less
          </button>
        ) : null}
      </div>
    </section>
  )
}
