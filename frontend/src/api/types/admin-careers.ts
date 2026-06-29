/** Admin Careers API contract. Mirrors api/v1/admin/careers.php. */

export type CareerPostingStatus = 'draft' | 'published'

/** Row in the CMS careers list. Returned by GET /api/v1/admin/careers. */
export type AdminCareersListItem = {
  id: number
  slug: string
  title: string
  location: string | null
  /** Display order on the public Careers page (ascending). */
  sort_order: number
  status: CareerPostingStatus
  /** Last update timestamp from the DB (ISO 8601). */
  updated_at: string
}

/** Full posting for editing. Returned by GET /api/v1/admin/careers?id=<id>. */
export type AdminCareersPosting = AdminCareersListItem & {
  content: string
}

export type AdminCareersWritePayload = {
  title: string
  slug: string
  location: string | null
  sort_order: number
  status: CareerPostingStatus
  content: string
}

export type AdminCareersUpdatePayload = Partial<AdminCareersWritePayload> & {
  id: number
}

export type AdminCareersDeleteResult = {
  deleted: true
  id: number
}

/** Careers page visibility toggle. Mirrors api/v1/admin/careers-page.php. */
export type AdminCareersPageSettings = {
  pageActive: boolean
}
