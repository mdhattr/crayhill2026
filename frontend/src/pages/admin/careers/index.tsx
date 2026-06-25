import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminCareersList,
  useDeleteAdminCareersPosting,
  useUpdateAdminCareersPosting,
} from '@/api/admin-careers'
import { ApiError } from '@/api/client'
import type {
  AdminCareersListItem,
  CareerPostingStatus,
} from '@/api/types/admin-careers'
import { PageHead } from '@/components/PageHead'

function StatusSelect({ posting }: { posting: AdminCareersListItem }) {
  const updatePosting = useUpdateAdminCareersPosting()
  const [error, setError] = useState<string | null>(null)

  async function handleChange(nextStatus: CareerPostingStatus) {
    if (nextStatus === posting.status) return
    setError(null)
    try {
      await updatePosting.mutateAsync({ id: posting.id, status: nextStatus })
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
      <label htmlFor={`status-${posting.id}`} className="sr-only">
        Status for {posting.title}
      </label>
      <select
        id={`status-${posting.id}`}
        value={posting.status}
        disabled={updatePosting.isPending}
        onChange={(event) =>
          handleChange(event.target.value as CareerPostingStatus)
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

function DeleteButton({ posting }: { posting: AdminCareersListItem }) {
  const deletePosting = useDeleteAdminCareersPosting()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    try {
      await deletePosting.mutateAsync(posting.id)
      setPending(false)
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to delete this posting. Try again.',
      )
    }
  }

  if (pending) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deletePosting.isPending}
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
          disabled={deletePosting.isPending}
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

/** CMS careers list — all postings with status, edit, and delete controls. */
export default function AdminCareersPage() {
  const { data: postings, isPending, isError, error } = useAdminCareersList()

  return (
    <>
      <PageHead title="Careers" description="Manage job postings." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-paper-deep">Careers</h1>
              <p className="mt-4 max-w-2xl text-body-1 text-ink">
                Create, edit, and publish open positions. Only published postings
                appear on the public Careers page, in display order.
              </p>
            </div>
            <Link
              to="/admin/careers/new"
              className="inline-flex items-center rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90"
            >
              Create new
            </Link>
          </div>

          {isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading postings…
            </p>
          ) : null}

          {isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load postings.'}
            </p>
          ) : null}

          {!isPending && !isError && postings?.length === 0 ? (
            <p className="mt-element text-body-1 text-muted">
              No postings yet.{' '}
              <Link
                to="/admin/careers/new"
                className="text-paper-deep underline"
              >
                Create the first posting
              </Link>
              .
            </p>
          ) : null}

          {!isPending && !isError && postings && postings.length > 0 ? (
            <div className="mt-element overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">Careers job postings</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Title
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Location
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Order
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
                  {postings.map((posting) => (
                    <tr key={posting.id} className="border-b border-rule">
                      <td className="py-4 pr-6 align-top">
                        <p className="text-body-2 text-ink">{posting.title}</p>
                        <p className="mt-1 text-body-3 text-muted">
                          {posting.slug}
                        </p>
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 text-ink">
                        {posting.location ?? '—'}
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 text-ink">
                        {posting.sort_order}
                      </td>
                      <td className="py-4 pr-6 align-top">
                        <StatusSelect posting={posting} />
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/admin/careers/${posting.id}/edit`}
                            className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper"
                          >
                            Edit
                          </Link>
                          <DeleteButton posting={posting} />
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
