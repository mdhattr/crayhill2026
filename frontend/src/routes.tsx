import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom'
import { RootLayout } from '@/components/RootLayout'
import NotFoundPage from '@/pages/not-found'

const HomePage = lazy(() => import('@/pages/home'))
const WhoWeArePage = lazy(() => import('@/pages/who-we-are'))
const ABFCreditOpportunitiesPage = lazy(
  () => import('@/pages/strategies/abf-credit-opportunities'),
)
const InvestmentGradeABFPage = lazy(
  () => import('@/pages/strategies/investment-grade-abf'),
)
const OriginationPlatformsPage = lazy(
  () => import('@/pages/strategies/origination-platforms'),
)
const PowerAndInfrastructurePage = lazy(
  () => import('@/pages/sectors/power-and-infrastructure'),
)
const ResidentialRealEstatePage = lazy(
  () => import('@/pages/sectors/residential-real-estate'),
)
const CommercialRealEstatePage = lazy(
  () => import('@/pages/sectors/commercial-real-estate'),
)
const MediaPage = lazy(() => import('@/pages/sectors/media'))
const SpecialtyFinancePage = lazy(
  () => import('@/pages/sectors/specialty-finance'),
)
const LeadershipPage = lazy(() => import('@/pages/team/leadership'))
const SeniorInvestmentProfessionalsPage = lazy(
  () => import('@/pages/team/senior-investment-professionals'),
)
/*
 * One shared component drives bio detail under every roster prefix.
 * The route patterns below feed it via `:slug`; the component reads
 * TEAM_BIOS to render or 404 as appropriate.
 */
const BioPage = lazy(() => import('@/pages/team/bio'))
const CulturePage = lazy(() => import('@/pages/team/culture'))
const CareersPage = lazy(() => import('@/pages/careers'))
const NewsAndInsightsPage = lazy(() => import('@/pages/news-and-insights'))
const NewsArticlePage = lazy(() => import('@/pages/news-and-insights/detail'))
const LegalNoticeAndDisclosuresPage = lazy(
  () => import('@/pages/legal-notice-and-disclosures'),
)
const PrivacyPolicyPage = lazy(() => import('@/pages/privacy-policy'))

/**
 * Suspense fallback for lazy-loaded pages. Intentionally invisible — a brief
 * blank frame is preferable to a flash of content shifting in. Replace with
 * a real skeleton once page templates take shape.
 */
function RouteFallback() {
  return <div aria-hidden="true" className="min-h-dvh" />
}

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: lazyRoute(<HomePage />) },
      { path: '/who-we-are', element: lazyRoute(<WhoWeArePage />) },
      {
        path: '/strategies/abf-credit-opportunities',
        element: lazyRoute(<ABFCreditOpportunitiesPage />),
      },
      {
        path: '/strategies/investment-grade-abf',
        element: lazyRoute(<InvestmentGradeABFPage />),
      },
      {
        path: '/strategies/origination-platforms',
        element: lazyRoute(<OriginationPlatformsPage />),
      },
      {
        path: '/sectors/power-and-infrastructure',
        element: lazyRoute(<PowerAndInfrastructurePage />),
      },
      {
        path: '/sectors/residential-real-estate',
        element: lazyRoute(<ResidentialRealEstatePage />),
      },
      {
        path: '/sectors/commercial-real-estate',
        element: lazyRoute(<CommercialRealEstatePage />),
      },
      { path: '/sectors/media', element: lazyRoute(<MediaPage />) },
      {
        path: '/sectors/specialty-finance',
        element: lazyRoute(<SpecialtyFinancePage />),
      },
      {
        path: '/team/leadership',
        element: lazyRoute(<LeadershipPage />),
      },
      {
        path: '/team/senior-investment-professionals',
        element: lazyRoute(<SeniorInvestmentProfessionalsPage />),
      },
      {
        path: '/team/leadership/:slug',
        element: lazyRoute(<BioPage />),
      },
      {
        path: '/team/senior-investment-professionals/:slug',
        element: lazyRoute(<BioPage />),
      },
      {
        path: '/team/culture',
        element: lazyRoute(<CulturePage />),
      },
      { path: '/careers', element: lazyRoute(<CareersPage />) },
      {
        path: '/news-and-insights',
        element: lazyRoute(<NewsAndInsightsPage />),
      },
      {
        path: '/news-and-insights/:slug',
        element: lazyRoute(<NewsArticlePage />),
      },
      {
        path: '/legal-notice-and-disclosures',
        element: lazyRoute(<LegalNoticeAndDisclosuresPage />),
      },
      { path: '/privacy-policy', element: lazyRoute(<PrivacyPolicyPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
