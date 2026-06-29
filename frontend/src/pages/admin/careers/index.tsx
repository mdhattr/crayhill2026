import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminCareersList,
  useAdminCareersPageSettings,
  useDeleteAdminCareersPosting,
  useUpdateAdminCareersPageSettings,
  useUpdateAdminCareersPosting,
} from '@/api/admin-careers'
import { ApiError } from '@/api/client'
import type {
  AdminCareersListItem,
  CareerPostingStatus,
} from '@/api/types/admin-careers'
import { AdminDragHandle } from '@/components/admin/AdminDragHandle'
import { useAdminSortableRows } from '@/components/admin/useAdminSortableRows'
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

function CareersPageActiveToggle() {
  const { data: settings, isPending } = useAdminCareersPageSettings()
  const updateSettings = useUpdateAdminCareersPageSettings()
  const [error, setError] = useState<string | null>(null)

  const pageActive = settings?.pageActive ?? true
  const toggleId = 'careers-page-active'

  async function handleToggle() {
    setError(null)
    try {
      await updateSettings.mutateAsync(!pageActive)
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to update Careers page visibility. Try again.',
      )
    }
  }

  return (
    <div className="mt-element rounded border border-rule bg-paper px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-body-1 font-semibold text-paper-deep">
            Careers page on site
          </h2>
          <p className="mt-2 max-w-2xl text-body-2 text-ink">
            When inactive, <code className="text-body-3">/careers</code> returns
            a 404 and Careers is removed from the top and bottom navigation.
            Individual job postings below are unaffected.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label
            htmlFor={toggleId}
            className="text-body-2 text-ink"
          >
            {pageActive ? 'Active' : 'Inactive'}
          </label>
          <button
            id={toggleId}
            type="button"
            role="switch"
            aria-checked={pageActive}
            disabled={isPending || updateSettings.isPending}
            onClick={() => void handleToggle()}
            className={
              'relative h-8 w-14 shrink-0 rounded-full border transition-colors duration-150 ' +
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
              'focus-visible:outline-accent disabled:opacity-60 ' +
              (pageActive
                ? 'border-accent bg-accent'
                : 'border-rule bg-paper-alt')
            }
          >
            <span
              aria-hidden="true"
              className={
                'absolute top-0.5 block h-6 w-6 rounded-full bg-paper shadow transition-transform duration-150 ' +
                (pageActive ? 'translate-x-7' : 'translate-x-1')
              }
            />
          </button>
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-body-3 text-accent-navy" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** CMS careers list — all postings with status, edit, and delete controls. */
export default function AdminCareersPage() {
  const { data: postings, isPending, isError, error } = useAdminCareersList()
  const updatePosting = useUpdateAdminCareersPosting()

  const persistSortOrder = useCallback(
    async (updates: { id: number; sort_order: number }[]) => {
      for (const update of updates) {
        await updatePosting.mutateAsync({
          id: update.id,
          sort_order: update.sort_order,
        })
      }
    },
    [updatePosting],
  )

  const {
    rows,
    isSaving,
    error: reorderError,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    rowClassName,
  } = useAdminSortableRows({
    items: postings,
    onPersistOrder: persistSortOrder,
  })

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
                appear on the public Careers page, in position order. Drag the
                handle to reorder.
              </p>
            </div>
            <Link
              to="/admin/careers/new"
              className="inline-flex items-center rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90"
            >
              Create new
            </Link>
          </div>

          <CareersPageActiveToggle />

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

          {isSaving ? (
            <p className="mt-element text-body-2 text-muted" role="status">
              Saving order…
            </p>
          ) : null}

          {reorderError ? (
            <p className="mt-4 text-body-2 text-accent-navy" role="alert">
              {reorderError}
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

          {!isPending && !isError && rows.length > 0 ? (
            <div className="mt-element overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <caption className="sr-only">Careers job postings</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="w-14 py-3 pr-4 text-body-3 text-muted">
                      <span className="sr-only">Reorder</span>
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Title
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Location
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Position
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
                  {rows.map((posting) => (
                    <tr
                      key={posting.id}
                      className={rowClassName(posting.id)}
                      onDragOver={(event) => {
                        event.preventDefault()
                        handleDragOver(posting.id)
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        void handleDrop(posting.id)
                      }}
                    >
                      <td className="py-4 pr-4 align-top">
                        <AdminDragHandle
                          label={`Reorder ${posting.title}`}
                          disabled={isSaving}
                          onDragStart={() => handleDragStart(posting.id)}
                          onDragEnd={handleDragEnd}
                        />
                      </td>
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
