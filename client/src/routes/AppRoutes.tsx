import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.js';
import { ProjectDetailPage } from '../pages/ProjectDetailPage.js';
import { AppDetailPage } from '../pages/AppDetailPage.js';
import { BlogListPage } from '../pages/BlogListPage.js';
import { BlogPostPage } from '../pages/BlogPostPage.js';
import { ResumePage } from '../pages/ResumePage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from '../components/admin/ProtectedRoute.js';
import { AdminLayout } from '../components/admin/AdminLayout.js';
import { AdminLoadingState } from '../components/admin/AdminLoadingState.js';
import { Header } from '../components/layout/Header.js';
import { Footer } from '../components/layout/Footer.js';

// Lazy-loaded Admin pages for code splitting & initial bundle optimization
const AdminLoginPage = lazy(() =>
  import('../pages/admin/AdminLoginPage.js').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminOverviewPage = lazy(() =>
  import('../pages/admin/AdminOverviewPage.js').then((m) => ({ default: m.AdminOverviewPage })),
);
const AdminProfilePage = lazy(() =>
  import('../pages/admin/AdminProfilePage.js').then((m) => ({ default: m.AdminProfilePage })),
);
const AdminProjectsPage = lazy(() =>
  import('../pages/admin/AdminProjectsPage.js').then((m) => ({ default: m.AdminProjectsPage })),
);
const AdminAppsPage = lazy(() =>
  import('../pages/admin/AdminAppsPage.js').then((m) => ({ default: m.AdminAppsPage })),
);
const AdminSkillsPage = lazy(() =>
  import('../pages/admin/AdminSkillsPage.js').then((m) => ({ default: m.AdminSkillsPage })),
);
const AdminCredentialsPage = lazy(() =>
  import('../pages/admin/AdminCredentialsPage.js').then((m) => ({
    default: m.AdminCredentialsPage,
  })),
);
const AdminBlogPage = lazy(() =>
  import('../pages/admin/AdminBlogPage.js').then((m) => ({ default: m.AdminBlogPage })),
);
const AdminBlogEditorPage = lazy(() =>
  import('../pages/admin/AdminBlogEditorPage.js').then((m) => ({
    default: m.AdminBlogEditorPage,
  })),
);
const AdminMessagesPage = lazy(() =>
  import('../pages/admin/AdminMessagesPage.js').then((m) => ({ default: m.AdminMessagesPage })),
);
const AdminSettingsPage = lazy(() =>
  import('../pages/admin/AdminSettingsPage.js').then((m) => ({ default: m.AdminSettingsPage })),
);

const AdminSuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
        <AdminLoadingState />
      </div>
    }
  >
    {children}
  </Suspense>
);

const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/apps/:slug" element={<AppDetailPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login Route */}
      <Route
        path="/admin/login"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            }
          >
            <AdminLoginPage />
          </Suspense>
        }
      />

      {/* Protected Admin CMS Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <AdminSuspenseWrapper>
              <AdminOverviewPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="profile"
          element={
            <AdminSuspenseWrapper>
              <AdminProfilePage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="projects"
          element={
            <AdminSuspenseWrapper>
              <AdminProjectsPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="apps"
          element={
            <AdminSuspenseWrapper>
              <AdminAppsPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="skills"
          element={
            <AdminSuspenseWrapper>
              <AdminSkillsPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="credentials"
          element={
            <AdminSuspenseWrapper>
              <AdminCredentialsPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="blog"
          element={
            <AdminSuspenseWrapper>
              <AdminBlogPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="blog/new"
          element={
            <AdminSuspenseWrapper>
              <AdminBlogEditorPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="blog/edit/:id"
          element={
            <AdminSuspenseWrapper>
              <AdminBlogEditorPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="messages"
          element={
            <AdminSuspenseWrapper>
              <AdminMessagesPage />
            </AdminSuspenseWrapper>
          }
        />
        <Route
          path="settings"
          element={
            <AdminSuspenseWrapper>
              <AdminSettingsPage />
            </AdminSuspenseWrapper>
          }
        />
      </Route>
    </Routes>
  );
};
