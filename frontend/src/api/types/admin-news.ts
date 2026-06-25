/** Admin News & Insights API contract. Mirrors api/v1/admin/news.php. */

export type NewsPostStatus = 'draft' | 'published'

/** Row in the CMS news list. Returned by GET /api/v1/admin/news. */
export type AdminNewsListItem = {
  id: number
  slug: string
  title: string
  author: string
  /** Published date as an ISO YYYY-MM-DD string. */
  date: string
  image: string | null
  status: NewsPostStatus
  /** Last update timestamp from the DB (ISO 8601). */
  updated_at: string
}

/** Full post for editing. Returned by GET /api/v1/admin/news?id=<id>. */
export type AdminNewsArticle = AdminNewsListItem & {
  content: string
}

export type AdminNewsWritePayload = {
  title: string
  slug: string
  author: string
  date: string
  status: NewsPostStatus
  image: string | null
  content: string
}

export type AdminNewsUpdatePayload = Partial<AdminNewsWritePayload> & {
  id: number
}

export type AdminNewsDeleteResult = {
  deleted: true
  id: number
}
