import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useAdminCareersList,
  useAdminCareersPosting,
  useCreateAdminCareersPosting,
  useUpdateAdminCareersPosting,
} from '@/api/admin-careers'
import { ApiError } from '@/api/client'
import type {
  AdminCareersWritePayload,
  CareerPostingStatus,
} from '@/api/types/admin-careers'
import { MarkdownEditorWithPreview } from '@/components/MarkdownEditorWithPreview'
import { PageHead } from '@/components/PageHead'

function emptyForm(sortOrder = 0): AdminCareersWritePayload {
  return {
    title: '',
    slug: '',
    location: null,
    sort_order: sortOrder,
    status: 'draft',
    content: '',
  }
}

/** CMS create/edit form for a single careers posting. */
export default function AdminCareersEditPage() {
  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const isCreate = idParam === undefined
  const postingId = isCreate ? null : Number(idParam)

  const { data: list } = useAdminCareersList()
  const { data: posting, isPending, isError, error } = useAdminCareersPosting(
    postingId !== null && Number.isFinite(postingId) ? postingId : null,
  )
  const createPosting = useCreateAdminCareersPosting()
  const updatePosting = useUpdateAdminCareersPosting()

  const [form, setForm] = useState<AdminCareersWritePayload>(emptyForm())
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sortOrderSeeded, setSortOrderSeeded] = useState(false)

  useEffect(() => {
    if (posting) {
      setForm({
        title: posting.title,
        slug: posting.slug,
        location: posting.location,
        sort_order: posting.sort_order,
        status: posting.status,
        content: posting.content,
      })
    }
  }, [posting])

  useEffect(() => {
    if (!isCreate || !list || sortOrderSeeded) return
    const nextOrder =
      list.reduce((max, item) => Math.max(max, item.sort_order), -1) + 1
    setForm((current) => ({ ...current, sort_order: nextOrder }))
    setSortOrderSeeded(true)
  }, [isCreate, list, sortOrderSeeded])

  const isSaving = createPosting.isPending || updatePosting.isPending
  const invalidId = !isCreate && (!postingId || !Number.isFinite(postingId))

  function updateField<K extends keyof AdminCareersWritePayload>(
    key: K,
    value: AdminCareersWritePayload[K],
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

    const payload: AdminCareersWritePayload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      location:
        form.location === null || form.location.trim() === ''
          ? null
          : form.location.trim(),
      sort_order: Number(form.sort_order),
    }

    try {
      if (isCreate) {
        const created = await createPosting.mutateAsync(payload)
        navigate(`/admin/careers/${created.id}/edit`, { replace: true })
        return
      }

      await updatePosting.mutateAsync({
        id: postingId as number,
        ...payload,
      })
      navigate('/admin/careers')
    } catch (cause) {
      if (cause instanceof ApiError) {
        setFormError(cause.message)
        if (cause.fields) {
          setFieldErrors(cause.fields)
        }
        return
      }
      setFormError('Unable to save this posting. Try again.')
    }
  }

  const pageTitle = isCreate ? 'Create posting' : 'Edit posting'

  return (
    <>
      <PageHead title={pageTitle} description="Manage a job posting." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-body-3 text-muted">
            <Link to="/admin/careers" className="text-paper-deep underline">
              Careers
            </Link>
          </p>

          <h1 className="mt-4 text-paper-deep">{pageTitle}</h1>

          {invalidId ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              Invalid posting id.
            </p>
          ) : null}

          {!isCreate && isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading posting…
            </p>
          ) : null}

          {!isCreate && isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load this posting.'}
            </p>
          ) : null}

          {(isCreate || posting) && !invalidId ? (
            <form className="mt-element space-y-8" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p className="text-body-2 text-accent-navy" role="alert">
                  {formError}
                </p>
              ) : null}

              <div>
                <label htmlFor="careers-title" className="block text-body-3 text-muted">
                  Title
                </label>
                <input
                  id="careers-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                />
                {fieldErrors.title ? (
                  <p className="mt-1 text-body-3 text-accent-navy">
                    {fieldErrors.title}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="careers-slug" className="block text-body-3 text-muted">
                  Slug
                </label>
                <input
                  id="careers-slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  aria-describedby="careers-slug-help"
                />
                <p id="careers-slug-help" className="mt-1 text-body-3 text-muted">
                  Lowercase letters, numbers, and hyphens only. Stable identifier
                  for this posting.
                </p>
                {fieldErrors.slug ? (
                  <p className="mt-1 text-body-3 text-accent-navy">
                    {fieldErrors.slug}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="careers-location"
                    className="block text-body-3 text-muted"
                  >
                    Location
                  </label>
                  <input
                    id="careers-location"
                    type="text"
                    value={form.location ?? ''}
                    onChange={(event) =>
                      updateField(
                        'location',
                        event.target.value === '' ? null : event.target.value,
                      )
                    }
                    placeholder="New York, NY"
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.location ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.location}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="careers-sort-order"
                    className="block text-body-3 text-muted"
                  >
                    Display order
                  </label>
                  <input
                    id="careers-sort-order"
                    type="number"
                    required
                    step={1}
                    value={form.sort_order}
                    onChange={(event) =>
                      updateField('sort_order', Number(event.target.value))
                    }
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                    aria-describedby="careers-sort-order-help"
                  />
                  <p id="careers-sort-order-help" className="mt-1 text-body-3 text-muted">
                    Lower numbers appear first on the Careers page.
                  </p>
                  {fieldErrors.sort_order ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.sort_order}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="careers-status" className="block text-body-3 text-muted">
                    Status
                  </label>
                  <select
                    id="careers-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField('status', event.target.value as CareerPostingStatus)
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
                id="careers-content"
                required
                previewVariant="careers"
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
                      ? 'Create posting'
                      : 'Save changes'}
                </button>
                <Link
                  to="/admin/careers"
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
