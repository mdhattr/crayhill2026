import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  useAdminTeamList,
  useAdminTeamMember,
  useCreateAdminTeamMember,
  useUpdateAdminTeamMember,
} from '@/api/admin-team'
import { ApiError } from '@/api/client'
import type {
  AdminTeamWritePayload,
  TeamMemberStatus,
} from '@/api/types/admin-team'
import type { TeamRoster } from '@/api/types/team'
import { MarkdownEditorWithPreview } from '@/components/MarkdownEditorWithPreview'
import { PageHead } from '@/components/PageHead'
import { SORT_ORDER_MIN, nextSortOrder } from '@/lib/sort-order'
import {
  isTeamRoster,
  ROSTER_LABELS,
  rosterAdminPath,
} from '@/pages/admin/team/roster'

function emptyForm(roster: TeamRoster, sortOrder = SORT_ORDER_MIN): AdminTeamWritePayload {
  return {
    slug: '',
    name: '',
    card_title: '',
    full_title: '',
    image_src: '/images/',
    email: null,
    linkedin_url: null,
    roster,
    sort_order: sortOrder,
    status: 'draft',
    content: '',
  }
}

/** CMS create/edit form for a single team roster member. */
export default function AdminTeamEditPage() {
  const navigate = useNavigate()
  const { roster: rosterParam = '', id: idParam } = useParams<{
    roster: string
    id: string
  }>()

  if (!isTeamRoster(rosterParam)) {
    return <Navigate to="/admin" replace />
  }

  const roster = rosterParam
  const label = ROSTER_LABELS[roster]
  const isCreate = idParam === undefined
  const memberId = isCreate ? null : Number(idParam)

  const { data: list } = useAdminTeamList(roster)
  const { data: member, isPending, isError, error } = useAdminTeamMember(
    memberId !== null && Number.isFinite(memberId) ? memberId : null,
  )
  const createMember = useCreateAdminTeamMember(roster)
  const updateMember = useUpdateAdminTeamMember(roster)

  const [form, setForm] = useState<AdminTeamWritePayload>(emptyForm(roster))
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sortOrderSeeded, setSortOrderSeeded] = useState(false)

  useEffect(() => {
    if (member) {
      setForm({
        slug: member.slug,
        name: member.name,
        card_title: member.card_title,
        full_title: member.full_title,
        image_src: member.image_src,
        email: member.email,
        linkedin_url: member.linkedin_url,
        roster: member.roster,
        sort_order: member.sort_order,
        status: member.status,
        content: member.content,
      })
    }
  }, [member])

  useEffect(() => {
    if (!isCreate || !list || sortOrderSeeded) return
    const nextOrder =
      list.reduce((max, item) => Math.max(max, item.sort_order), -1) + 1
    setForm((current) => ({ ...current, sort_order: nextOrder }))
    setSortOrderSeeded(true)
  }, [isCreate, list, sortOrderSeeded])

  const isSaving = createMember.isPending || updateMember.isPending
  const invalidId = !isCreate && (!memberId || !Number.isFinite(memberId))

  function updateField<K extends keyof AdminTeamWritePayload>(
    key: K,
    value: AdminTeamWritePayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!(key in current)) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const payload: AdminTeamWritePayload = {
      ...form,
      slug: form.slug.trim(),
      name: form.name.trim(),
      card_title: form.card_title.trim(),
      full_title: form.full_title.trim(),
      image_src: form.image_src.trim(),
      email:
        form.email === null || form.email.trim() === ''
          ? null
          : form.email.trim(),
      linkedin_url:
        form.linkedin_url === null || form.linkedin_url.trim() === ''
          ? null
          : form.linkedin_url.trim(),
      sort_order: Number(form.sort_order),
      roster,
    }

    try {
      if (isCreate) {
        const created = await createMember.mutateAsync(payload)
        navigate(`${rosterAdminPath(roster)}/${created.id}/edit`, {
          replace: true,
        })
        return
      }

      await updateMember.mutateAsync({
        id: memberId as number,
        ...payload,
      })
      navigate(rosterAdminPath(roster))
    } catch (cause) {
      if (cause instanceof ApiError) {
        setFormError(cause.message)
        if (cause.fields) {
          setFieldErrors(cause.fields)
        }
        return
      }
      setFormError('Unable to save this member. Try again.')
    }
  }

  const pageTitle = isCreate ? `Create ${label.toLowerCase()} member` : 'Edit member'

  return (
    <>
      <PageHead title={pageTitle} description={`Manage a ${label.toLowerCase()} roster member.`} />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-body-3 text-muted">
            <Link
              to={rosterAdminPath(roster)}
              className="text-paper-deep underline"
            >
              {label}
            </Link>
          </p>

          <h1 className="mt-4 text-paper-deep">{pageTitle}</h1>

          {invalidId ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              Invalid member id.
            </p>
          ) : null}

          {!isCreate && isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading member…
            </p>
          ) : null}

          {!isCreate && isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load this member.'}
            </p>
          ) : null}

          {(isCreate || member) && !invalidId ? (
            <form className="mt-element space-y-8" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p className="text-body-2 text-accent-navy" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="team-name" className="block text-body-3 text-muted">
                    Name
                  </label>
                  <input
                    id="team-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.name ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="team-slug" className="block text-body-3 text-muted">
                    Slug
                  </label>
                  <input
                    id="team-slug"
                    type="text"
                    required
                    value={form.slug}
                    onChange={(event) => updateField('slug', event.target.value)}
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                    aria-describedby="team-slug-help"
                  />
                  <p id="team-slug-help" className="mt-1 text-body-3 text-muted">
                    Lowercase letters, numbers, and hyphens only. Used in the
                    public bio URL.
                  </p>
                  {fieldErrors.slug ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.slug}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="team-card-title"
                    className="block text-body-3 text-muted"
                  >
                    Card title
                  </label>
                  <input
                    id="team-card-title"
                    type="text"
                    required
                    value={form.card_title}
                    onChange={(event) =>
                      updateField('card_title', event.target.value)
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                    aria-describedby="team-card-title-help"
                  />
                  <p id="team-card-title-help" className="mt-1 text-body-3 text-muted">
                    Short title on the roster grid card.
                  </p>
                  {fieldErrors.card_title ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.card_title}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="team-full-title"
                    className="block text-body-3 text-muted"
                  >
                    Full title
                  </label>
                  <input
                    id="team-full-title"
                    type="text"
                    required
                    value={form.full_title}
                    onChange={(event) =>
                      updateField('full_title', event.target.value)
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                    aria-describedby="team-full-title-help"
                  />
                  <p id="team-full-title-help" className="mt-1 text-body-3 text-muted">
                    Longer title on the bio detail page.
                  </p>
                  {fieldErrors.full_title ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.full_title}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-image-src"
                  className="block text-body-3 text-muted"
                >
                  Headshot path
                </label>
                <input
                  id="team-image-src"
                  type="text"
                  required
                  value={form.image_src}
                  onChange={(event) =>
                    updateField('image_src', event.target.value)
                  }
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  aria-describedby="team-image-src-help"
                />
                <p id="team-image-src-help" className="mt-1 text-body-3 text-muted">
                  Root-relative path under /images/, e.g. /images/headshot-josh.jpg
                </p>
                {fieldErrors.image_src ? (
                  <p className="mt-1 text-body-3 text-accent-navy">
                    {fieldErrors.image_src}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="team-email" className="block text-body-3 text-muted">
                    Email
                  </label>
                  <input
                    id="team-email"
                    type="email"
                    value={form.email ?? ''}
                    onChange={(event) =>
                      updateField(
                        'email',
                        event.target.value === '' ? null : event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.email ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="team-linkedin"
                    className="block text-body-3 text-muted"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    id="team-linkedin"
                    type="url"
                    value={form.linkedin_url ?? ''}
                    onChange={(event) =>
                      updateField(
                        'linkedin_url',
                        event.target.value === '' ? null : event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.linkedin_url ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.linkedin_url}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="team-sort-order"
                    className="block text-body-3 text-muted"
                  >
                    Display order
                  </label>
                  <input
                    id="team-sort-order"
                    type="number"
                    required
                    step={1}
                    value={form.sort_order}
                    onChange={(event) =>
                      updateField('sort_order', Number(event.target.value))
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                    aria-describedby="team-sort-order-help"
                  />
                  <p id="team-sort-order-help" className="mt-1 text-body-3 text-muted">
                    Lower numbers appear first on the roster page.
                  </p>
                  {fieldErrors.sort_order ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.sort_order}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="team-status" className="block text-body-3 text-muted">
                    Status
                  </label>
                  <select
                    id="team-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField('status', event.target.value as TeamMemberStatus)
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  {fieldErrors.status ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.status}
                    </p>
                  ) : null}
                </div>
              </div>

              <MarkdownEditorWithPreview
                id="team-content"
                required
                previewVariant="team-bio"
                value={form.content}
                onChange={(content) => updateField('content', content)}
                error={fieldErrors.content}
              />

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90 disabled:opacity-60"
                >
                  {isSaving
                    ? 'Saving…'
                    : isCreate
                      ? 'Create member'
                      : 'Save changes'}
                </button>
                <Link
                  to={rosterAdminPath(roster)}
                  className="rounded border border-rule px-5 py-3 text-body-2 text-ink hover:bg-paper"
                >
                  Cancel
                </Link>
              </div>
            </form>
          ) : null}
        </div>
      </main>
    </>
  )
}
