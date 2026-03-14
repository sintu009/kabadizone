import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import ScrapLayout from '../layouts/ScrapLayout';
import AdminLayout from '../layouts/AdminLayout';

// Wrappers
import ProtectedRoute from './ProtectedRoute';

// Lazy loading pages
const HomePage = lazy(() => import('../modules/landing/pages/HomePage'));
const ScrapRatePage = lazy(() => import('../modules/landing/pages/ScrapRatePage'));
const ScrapboyDashboard = lazy(() => import('../modules/scrapboy/pages/DashboardPage'));
const AdminLoginPage = lazy(() => import('../modules/admin/pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('../modules/admin/pages/AdminDashboardPage'));
const AdminUsers = lazy(() => import('../modules/admin/pages/AdminUsersPage'));
const AdminSettings = lazy(() => import('../modules/admin/pages/AdminSettingsPage'));
const AdminScrapPrices = lazy(() => import('../modules/admin/pages/AdminScrapPricesPage'));
const AdminScrapBoys = lazy(() => import('../modules/admin/pages/AdminScrapBoysPage'));
const AdminScrapBoyDetail = lazy(() => import('../modules/admin/pages/AdminScrapBoyDetailPage'));
const AdminWallet = lazy(() => import('../modules/admin/pages/AdminWalletPage'));
const AdminPickupBookings = lazy(() => import('../modules/admin/pages/AdminPickupBookingsPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-emerald-600"></div>
  </div>
);

export const router = createBrowserRouter([
  // Landing
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'rates',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ScrapRatePage />
          </Suspense>
        ),
      },
    ],
  },

  // Scrapboy Portal
  {
    path: '/scrapboy',
    element: <ScrapLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ScrapboyDashboard />
          </Suspense>
        ),
      },
    ],
  },

  // Admin Login
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },

  // Admin Portal (Protected)
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminUsers />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminSettings />
              </Suspense>
            ),
          },
          {
            path: 'scrap-prices',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminScrapPrices />
              </Suspense>
            ),
          },
          {
            path: 'scrapboys',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminScrapBoys />
              </Suspense>
            ),
          },
          {
            path: 'scrapboys/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminScrapBoyDetail />
              </Suspense>
            ),
          },
          {
            path: 'wallet',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminWallet />
              </Suspense>
            ),
          },
          {
            path: 'bookings',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminPickupBookings />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
