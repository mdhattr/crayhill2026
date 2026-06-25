import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useAdminNewsArticle,
  useCreateAdminNewsPost,
  useUpdateAdminNewsPost,
} from '@/api/admin-news'
import { ApiError } from '@/api/client'
import type {
  AdminNewsWritePayload,
  NewsPostStatus,
} from '@/api/types/admin-news'
import { PageHead } from '@/components/PageHead'
import { MarkdownEditorWithPreview } from '@/components/MarkdownEditorWithPreview'

const DEFAULT_AUTHOR = 'Crayhill Capital Management'

function todayIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function emptyForm(): AdminNewsWritePayload {
  return {
    title: '',
    slug: '',
    author: DEFAULT_AUTHOR,
    date: todayIsoDate(),
    status: 'draft',
    image: null,
    content: '',
  }
}

/** CMS create/edit form for a single news post. */
export default function AdminNewsEditPage() {
  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const isCreate = idParam === undefined
  const articleId = isCreate ? null : Number(idParam)

  const { data: article, isPending, isError, error } = useAdminNewsArticle(
    articleId !== null && Number.isFinite(articleId) ? articleId : null,
  )
  const createPost = useCreateAdminNewsPost()
  const updatePost = useUpdateAdminNewsPost()

  const [form, setForm] = useState<AdminNewsWritePayload>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        slug: article.slug,
        author: article.author,
        date: article.date,
        status: article.status,
        image: article.image,
        content: article.content,
      })
    }
  }, [article])

  const isSaving = createPost.isPending || updatePost.isPending
  const invalidId = !isCreate && (!articleId || !Number.isFinite(articleId))

  function updateField<K extends keyof AdminNewsWritePayload>(
    key: K,
    value: AdminNewsWritePayload[K],
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

    const payload: AdminNewsWritePayload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      author: form.author.trim() || DEFAULT_AUTHOR,
      date: form.date.trim(),
      image:
        form.image === null || form.image.trim() === ''
          ? null
          : form.image.trim(),
    }

    try {
      if (isCreate) {
        const created = await createPost.mutateAsync(payload)
        navigate(`/admin/news/${created.id}/edit`, { replace: true })
        return
      }

      await updatePost.mutateAsync({
        id: articleId as number,
        ...payload,
      })
      navigate('/admin/news')
    } catch (cause) {
      if (cause instanceof ApiError) {
        setFormError(cause.message)
        if (cause.fields) {
          setFieldErrors(cause.fields)
        }
        return
      }
      setFormError('Unable to save this post. Try again.')
    }
  }

  const pageTitle = isCreate ? 'Create article' : 'Edit article'

  return (
    <>
      <PageHead title={pageTitle} description="Manage a news article." />
      <main className="flex-1 bg-paper-alt px-6 py-module sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-body-3 text-muted">
            <Link to="/admin/news" className="text-paper-deep underline">
              News &amp; insights
            </Link>
          </p>

          <h1 className="mt-4 text-paper-deep">{pageTitle}</h1>

          {invalidId ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              Invalid article id.
            </p>
          ) : null}

          {!isCreate && isPending ? (
            <p className="mt-element text-body-1 text-muted" role="status">
              Loading article…
            </p>
          ) : null}

          {!isCreate && isError ? (
            <p className="mt-element text-body-1 text-accent-navy" role="alert">
              {error instanceof ApiError
                ? error.message
                : 'Unable to load this article.'}
            </p>
          ) : null}

          {(isCreate || article) && !invalidId ? (
            <form className="mt-element space-y-8" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p className="text-body-2 text-accent-navy" role="alert">
                  {formError}
                </p>
              ) : null}

              <div>
                <label htmlFor="news-title" className="block text-body-3 text-muted">
                  Title
                </label>
                <input
                  id="news-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                />
                {fieldErrors.title ? (
                  <p className="mt-1 text-body-3 text-accent-navy">{fieldErrors.title}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="news-slug" className="block text-body-3 text-muted">
                  Slug
                </label>
                <input
                  id="news-slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  aria-describedby="news-slug-help"
                />
                <p id="news-slug-help" className="mt-1 text-body-3 text-muted">
                  Lowercase letters, numbers, and hyphens only. Used in the public
                  URL.
                </p>
                {fieldErrors.slug ? (
                  <p className="mt-1 text-body-3 text-accent-navy">{fieldErrors.slug}</p>
                ) : null}
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="news-author" className="block text-body-3 text-muted">
                    Author
                  </label>
                  <input
                    id="news-author"
                    type="text"
                    value={form.author}
                    onChange={(event) => updateField('author', event.target.value)}
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.author ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.author}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="news-date" className="block text-body-3 text-muted">
                    Published date
                  </label>
                  <input
                    id="news-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(event) => updateField('date', event.target.value)}
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.date ? (
                    <p className="mt-1 text-body-3 text-accent-navy">{fieldErrors.date}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="news-status" className="block text-body-3 text-muted">
                    Status
                  </label>
                  <select
                    id="news-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField('status', event.target.value as NewsPostStatus)
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

                <div>
                  <label htmlFor="news-image" className="block text-body-3 text-muted">
                    Hero image path
                  </label>
                  <input
                    id="news-image"
                    type="text"
                    value={form.image ?? ''}
                    onChange={(event) =>
                      updateField(
                        'image',
                        event.target.value === '' ? null : event.target.value,
                      )
                    }
                    placeholder="/images/article-2024-01.jpg"
                    className="mt-2 w-full rounded border border-rule bg-paper px-4 py-3 text-body-2 text-ink"
                  />
                  {fieldErrors.image ? (
                    <p className="mt-1 text-body-3 text-accent-navy">
                      {fieldErrors.image}
                    </p>
                  ) : null}
                </div>
              </div>

              <MarkdownEditorWithPreview
                id="news-content"
                required
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
                  {isSaving ? 'Saving…' : isCreate ? 'Create article' : 'Save changes'}
                </button>
                <Link
                  to="/admin/news"
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
