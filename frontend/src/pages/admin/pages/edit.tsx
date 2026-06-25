import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useAdminSitePage,
  useUpdateAdminSitePage,
} from '@/api/admin-site-page'
import { ApiError } from '@/api/client'
import type {
  AdminSitePageUpdatePayload,
  SitePageStatus,
} from '@/api/types/admin-site-page'
import { MarkdownEditorWithPreview } from '@/components/MarkdownEditorWithPreview'
import { PageHead } from '@/components/PageHead'
import {
  isSitePageSlug,
  SITE_PAGE_LABELS,
} from '@/lib/site-page-slugs'

type PageForm = Omit<AdminSitePageUpdatePayload, 'id'> & {
  title: string
  subtitle: string | null
  meta_description: string
  status: SitePageStatus
  content: string
}

/** CMS editor for a single fixed site page (legal notice, privacy policy, etc.). */
export default function AdminSitePageEditPage() {
  const navigate = useNavigate()
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugParam && isSitePageSlug(slugParam) ? slugParam : null

  const { data: page, isPending, isError, error } = useAdminSitePage(slug)
  const updatePage = useUpdateAdminSitePage()

  const [form, setForm] = useState<PageForm>({
    title: '',
    subtitle: null,
    meta_description: '',
    status: 'draft',
    content: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (page) {
      setForm({
        title: page.title,
        subtitle: page.subtitle,
        meta_description: page.meta_description,
        status: page.status,
        content: page.content,
      })
    }
  }, [page])

  function updateField<K extends keyof PageForm>(key: K, value: PageForm[K]) {
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
    if (!page || !slug) return

    setFormError(null)
    setFieldErrors({})

    const payload: AdminSitePageUpdatePayload = {
      id: page.id,
      title: form.title.trim(),
      subtitle:
        form.subtitle === null || form.subtitle.trim() === ''
          ? null
          : form.subtitle.trim(),
      meta_description: form.meta_description.trim(),
      status: form.status,
      content: form.content,
    }

    try {
      await updatePage.mutateAsync(payload)
      navigate('/admin/pages')
    } catch (cause) {
      if (cause instanceof ApiError) {
        setFormError(cause.message)
        if (cause.fields) {
          setFieldErrors(cause.fields)
        }
        return
      }
      setFormError('Unable to save this page. Try again.')
    }
  }

  const label = slug ? SITE_PAGE_LABELS[slug] : 'Page'

  return (
    <>
      <PageHead title={`Edit ${label}`} description="Edit static page copy." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-body-3 text-muted">
            <Link to="/admin/pages" className="text-paper-deep underline">
              Page copy
            </Link>
          </p>

          <h1 className="mt-4 text-paper-deep">Edit {label}</h1>

          {!slug ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              Unknown page.
            </p>
          ) : null}

          {slug && isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading page…
            </p>
          ) : null}

          {slug && isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load this page.'}
            </p>
          ) : null}

          {slug && page ? (
            <form className="mt-element space-y-8" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p className="text-body-2 text-accent-navy" role="alert">
                  {formError}
                </p>
              ) : null}

              <div>
                <label htmlFor="page-title" className="block text-body-3 text-muted">
                  Headline
                </label>
                <input
                  id="page-title"
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

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="page-subtitle"
                    className="block text-body-3 text-muted"
                  >
                    Subtitle
                  </label>
                  <input
                    id="page-subtitle"
                    type="text"
                    value={form.subtitle ?? ''}
                    onChange={(event) =>
                      updateField(
                        'subtitle',
                        event.target.value === '' ? null : event.target.value,
                      )
                    }
                    placeholder="Optional (e.g. March 2026)"
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.subtitle ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.subtitle}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="page-status" className="block text-body-3 text-muted">
                    Status
                  </label>
                  <select
                    id="page-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField('status', event.target.value as SitePageStatus)
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

              <div>
                <label
                  htmlFor="page-meta-description"
                  className="block text-body-3 text-muted"
                >
                  Meta description
                </label>
                <textarea
                  id="page-meta-description"
                  required
                  rows={3}
                  value={form.meta_description}
                  onChange={(event) =>
                    updateField('meta_description', event.target.value)
                  }
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                />
                {fieldErrors.meta_description ? (
                  <p className="mt-1 text-body-3 text-accent-navy">
                    {fieldErrors.meta_description}
                  </p>
                ) : null}
              </div>

              <MarkdownEditorWithPreview
                id="page-content"
                required
                previewVariant="legal"
                value={form.content}
                onChange={(content) => updateField('content', content)}
                error={fieldErrors.content}
              />

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={updatePage.isPending}
                  className="rounded bg-paper-deep px-5 py-3 text-body-2 text-paper hover:opacity-90 disabled:opacity-60"
                >
                  {updatePage.isPending ? 'Saving…' : 'Save changes'}
                </button>
                <Link
                  to="/admin/pages"
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
