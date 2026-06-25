/** Admin site page API contract. Mirrors api/v1/admin/pages.php. */

export type SitePageStatus = 'draft' | 'published'

export type AdminSitePageListItem = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  status: SitePageStatus
  updated_at: string
}

export type AdminSitePage = AdminSitePageListItem & {
  meta_description: string
  content: string
}

export type AdminSitePageUpdatePayload = {
  id: number
  title?: string
  subtitle?: string | null
  meta_description?: string
  status?: SitePageStatus
  content?: string
}
