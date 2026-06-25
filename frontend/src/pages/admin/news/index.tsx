import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminNewsList,
  useDeleteAdminNewsPost,
  useUpdateAdminNewsPost,
} from '@/api/admin-news'
import { ApiError } from '@/api/client'
import type { AdminNewsListItem, NewsPostStatus } from '@/api/types/admin-news'
import { PageHead } from '@/components/PageHead'

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatusSelect({
  post,
  disabled,
}: {
  post: AdminNewsListItem
  disabled: boolean
}) {
  const updatePost = useUpdateAdminNewsPost()
  const [error, setError] = useState<string | null>(null)

  async function handleChange(nextStatus: NewsPostStatus) {
    if (nextStatus === post.status) return
    setError(null)
    try {
      await updatePost.mutateAsync({ id: post.id, status: nextStatus })
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to update status. Try again.',
      )
    }
  }

  return (
    <div>
      <label htmlFor={`status-${post.id}`} className="sr-only">
        Status for {post.title}
      </label>
      <select
        id={`status-${post.id}`}
        value={post.status}
        disabled={disabled || updatePost.isPending}
        onChange={(event) =>
          handleChange(event.target.value as NewsPostStatus)
        }
        className="min-w-[8.5rem] rounded border border-rule bg-paper px-3 py-2 text-body-2 text-ink disabled:opacity-60"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      {error ? (
        <p className="mt-1 text-body-3 text-accent-navy" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function DeleteButton({ post }: { post: AdminNewsListItem }) {
  const deletePost = useDeleteAdminNewsPost()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    try {
      await deletePost.mutateAsync(post.id)
      setPending(false)
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to delete this post. Try again.',
      )
    }
  }

  if (pending) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deletePost.isPending}
          className="rounded border border-accent-navy bg-accent-navy px-3 py-2 text-body-3 text-paper hover:opacity-90 disabled:opacity-60"
        >
          Confirm permanent delete
        </button>
        <button
          type="button"
          onClick={() => {
            setPending(false)
            setError(null)
          }}
          disabled={deletePost.isPending}
          className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper disabled:opacity-60"
        >
          Cancel
        </button>
        {error ? (
          <p className="w-full text-body-3 text-accent-navy" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPending(true)}
      className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper"
    >
      Delete
    </button>
  )
}

/** CMS news list — all posts with status, edit, and delete controls. */
export default function AdminNewsPage() {
  const { data: posts, isPending, isError, error } = useAdminNewsList()

  return (
    <>
      <PageHead title="News & insights" description="Manage news articles." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-paper-deep">News &amp; insights</h1>
              <p className="mt-4 max-w-2xl text-body-1 text-ink">
                Create, edit, and publish articles. Only published posts appear on
                the public site.
              </p>
            </div>
            <Link
              to="/admin/news/new"
              className="inline-flex items-center rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90"
            >
              Create new
            </Link>
          </div>

          {isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading posts…
            </p>
          ) : null}

          {isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load posts.'}
            </p>
          ) : null}

          {!isPending && !isError && posts?.length === 0 ? (
            <p className="mt-element text-body-1 text-muted">
              No posts yet.{' '}
              <Link to="/admin/news/new" className="text-paper-deep underline">
                Create the first article
              </Link>
              .
            </p>
          ) : null}

          {!isPending && !isError && posts && posts.length > 0 ? (
            <div className="mt-element overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">News and insights posts</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Title
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Published date
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Status
                    </th>
                    <th scope="col" className="py-3 text-body-3 text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-rule">
                      <td className="py-4 pr-6 align-top">
                        <p className="text-body-2 text-ink">{post.title}</p>
                        <p className="mt-1 text-body-3 text-muted">{post.slug}</p>
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 text-ink">
                        {formatDisplayDate(post.date)}
                      </td>
                      <td className="py-4 pr-6 align-top">
                        <StatusSelect post={post} disabled={false} />
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/admin/news/${post.id}/edit`}
                            className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper"
                          >
                            Edit
                          </Link>
                          <DeleteButton post={post} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
