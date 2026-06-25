import { useCallback, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  useAdminTeamList,
  useDeleteAdminTeamMember,
  useUpdateAdminTeamMember,
} from '@/api/admin-team'
import { ApiError } from '@/api/client'
import type {
  AdminTeamListItem,
  TeamMemberStatus,
} from '@/api/types/admin-team'
import { AdminDragHandle } from '@/components/admin/AdminDragHandle'
import { useAdminSortableRows } from '@/components/admin/useAdminSortableRows'
import { PageHead } from '@/components/PageHead'
import {
  isTeamRoster,
  ROSTER_LABELS,
  ROSTER_PUBLIC_PREFIX,
  rosterAdminPath,
} from '@/pages/admin/team/roster'

function StatusSelect({
  member,
  roster,
}: {
  member: AdminTeamListItem
  roster: Parameters<typeof useUpdateAdminTeamMember>[0]
}) {
  const updateMember = useUpdateAdminTeamMember(roster)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(nextStatus: TeamMemberStatus) {
    if (nextStatus === member.status) return
    setError(null)
    try {
      await updateMember.mutateAsync({ id: member.id, status: nextStatus })
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
      <label htmlFor={`status-${member.id}`} className="sr-only">
        Status for {member.name}
      </label>
      <select
        id={`status-${member.id}`}
        value={member.status}
        disabled={updateMember.isPending}
        onChange={(event) =>
          handleChange(event.target.value as TeamMemberStatus)
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

function DeleteButton({
  member,
  roster,
}: {
  member: AdminTeamListItem
  roster: Parameters<typeof useDeleteAdminTeamMember>[0]
}) {
  const deleteMember = useDeleteAdminTeamMember(roster)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    try {
      await deleteMember.mutateAsync(member.id)
      setPending(false)
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to delete this member. Try again.',
      )
    }
  }

  if (pending) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMember.isPending}
          className="rounded border border-accent-navy bg-accent-navy px-3 py-2 text-body-3 text-paper hover:opacity-90 disabled:opacity-60"
        >
          Confirm delete
        </button>
        <button
          type="button"
          onClick={() => {
            setPending(false)
            setError(null)
          }}
          disabled={deleteMember.isPending}
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

/** CMS team roster list — members for Leadership or Senior Investment Professionals. */
export default function AdminTeamListPage() {
  const { roster: rosterParam = '' } = useParams<{ roster: string }>()

  if (!isTeamRoster(rosterParam)) {
    return <Navigate to="/admin" replace />
  }

  const roster = rosterParam
  const label = ROSTER_LABELS[roster]
  const publicPath = ROSTER_PUBLIC_PREFIX[roster]
  const { data: members, isPending, isError, error } = useAdminTeamList(roster)
  const updateMember = useUpdateAdminTeamMember(roster)

  const persistSortOrder = useCallback(
    async (updates: { id: number; sort_order: number }[]) => {
      for (const update of updates) {
        await updateMember.mutateAsync({
          id: update.id,
          sort_order: update.sort_order,
        })
      }
    },
    [updateMember],
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
    items: members,
    onPersistOrder: persistSortOrder,
  })

  return (
    <>
      <PageHead title={label} description={`Manage ${label.toLowerCase()} roster members.`} />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-paper-deep">{label}</h1>
              <p className="mt-4 max-w-2xl text-body-1 text-ink">
                Create, edit, and publish team members for the{' '}
                <Link to={publicPath} className="text-paper-deep underline">
                  public {label.toLowerCase()} page
                </Link>
                . Only published members appear on the site, in position order.
                Drag the handle to reorder.
              </p>
            </div>
            <Link
              to={`${rosterAdminPath(roster)}/new`}
              className="inline-flex items-center rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90"
            >
              Create new
            </Link>
          </div>

          {isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading members…
            </p>
          ) : null}

          {isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load team members.'}
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

          {!isPending && !isError && members?.length === 0 ? (
            <p className="mt-element text-body-1 text-muted">
              No members yet.{' '}
              <Link
                to={`${rosterAdminPath(roster)}/new`}
                className="text-paper-deep underline"
              >
                Create the first member
              </Link>
              .
            </p>
          ) : null}

          {!isPending && !isError && rows.length > 0 ? (
            <div className="mt-element overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse text-left">
                <caption className="sr-only">{label} team members</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="w-14 py-3 pr-4 text-body-3 text-muted">
                      <span className="sr-only">Reorder</span>
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Name
                    </th>
                    <th scope="col" className="py-3 pr-6 text-body-3 text-muted">
                      Card title
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
                  {rows.map((member) => (
                    <tr
                      key={member.id}
                      className={rowClassName(member.id)}
                      onDragOver={(event) => {
                        event.preventDefault()
                        handleDragOver(member.id)
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        void handleDrop(member.id)
                      }}
                    >
                      <td className="py-4 pr-4 align-top">
                        <AdminDragHandle
                          label={`Reorder ${member.name}`}
                          disabled={isSaving}
                          onDragStart={() => handleDragStart(member.id)}
                          onDragEnd={handleDragEnd}
                        />
                      </td>
                      <td className="py-4 pr-6 align-top">
                        <p className="text-body-2 text-ink">{member.name}</p>
                        <p className="mt-1 text-body-3 text-muted">
                          {member.slug}
                        </p>
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 text-ink">
                        {member.card_title}
                      </td>
                      <td className="py-4 pr-6 align-top text-body-2 text-ink">
                        {member.sort_order}
                      </td>
                      <td className="py-4 pr-6 align-top">
                        <StatusSelect member={member} roster={roster} />
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`${rosterAdminPath(roster)}/${member.id}/edit`}
                            className="rounded border border-rule px-3 py-2 text-body-3 text-ink hover:bg-paper"
                          >
                            Edit
                          </Link>
                          <DeleteButton member={member} roster={roster} />
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
