import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../src/context/ThemeContext.js';
import { AuthContext, AuthContextType } from '../src/context/AuthContext.js';
import { ProtectedRoute } from '../src/components/admin/ProtectedRoute.js';
import { AdminLoginPage } from '../src/pages/admin/AdminLoginPage.js';
import { AdminSidebar } from '../src/components/admin/AdminSidebar.js';
import { AdminHeader } from '../src/components/admin/AdminHeader.js';
import { OverviewStatsCard } from '../src/components/admin/OverviewStatsCard.js';
import { ConfirmDialog } from '../src/components/admin/ConfirmDialog.js';
import { AdminMobileNav } from '../src/components/admin/AdminMobileNav.js';
import { AdminProfilePage } from '../src/pages/admin/AdminProfilePage.js';
import { AdminProjectsPage } from '../src/pages/admin/AdminProjectsPage.js';
import { AdminAppsPage } from '../src/pages/admin/AdminAppsPage.js';
import { AdminSkillsPage } from '../src/pages/admin/AdminSkillsPage.js';
import { AdminCredentialsPage } from '../src/pages/admin/AdminCredentialsPage.js';
import { AdminBlogPage } from '../src/pages/admin/AdminBlogPage.js';
import { AdminSettingsPage } from '../src/pages/admin/AdminSettingsPage.js';
import { profileService } from '../src/services/profileService.js';
import { projectService } from '../src/services/projectService.js';
import { appService } from '../src/services/appService.js';
import { skillService } from '../src/services/skillService.js';
import { settingsService } from '../src/services/settingsService.js';
import { Layers } from 'lucide-react';

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockAuthContextValue = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  user: {
    id: 'admin-1',
    email: 'admin@portfolio.dev',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  isLoading: false,
  isAuthenticated: true,
  login: vi.fn().mockResolvedValue({
    id: 'admin-1',
    email: 'admin@portfolio.dev',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  logout: vi.fn().mockResolvedValue(undefined),
  checkAuth: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('Phase 7.5 — Admin Dashboard / CMS Frontend Tests', () => {
  it('1. ProtectedRoute redirects unauthenticated visitor to /admin/login', async () => {
    const unauthenticatedAuth = mockAuthContextValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={unauthenticatedAuth}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div>Secret Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<div>Admin Login Form</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Admin Login Form')).toBeInTheDocument();
    expect(screen.queryByText('Secret Admin Dashboard')).not.toBeInTheDocument();
  });

  it('2. ProtectedRoute allows authenticated admin to view dashboard', () => {
    const authenticatedAuth = mockAuthContextValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={authenticatedAuth}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div>Secret Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Secret Admin Dashboard')).toBeInTheDocument();
  });

  it('3. AdminLoginPage validates invalid email and displays error', async () => {
    const unauthenticatedAuth = mockAuthContextValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={unauthenticatedAuth}>
        <MemoryRouter initialEntries={['/admin/login']}>
          <AdminLoginPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('4. AdminLoginPage redirects already authenticated admin to /admin', () => {
    const authenticatedAuth = mockAuthContextValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={authenticatedAuth}>
        <MemoryRouter initialEntries={['/admin/login']}>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard Home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Admin Dashboard Home')).toBeInTheDocument();
  });

  it('5. AdminSidebar renders navigation links and user identity', () => {
    const auth = mockAuthContextValue();

    render(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <AdminSidebar unreadCount={4} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Admin CMS')).toBeInTheDocument();
    expect(screen.getByText('admin@portfolio.dev')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Apps')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Credentials')).toBeInTheDocument();
    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('6. AdminHeader renders brand identity and logout action', () => {
    const mockLogout = vi.fn();
    const auth = mockAuthContextValue({ logout: mockLogout });

    render(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <ThemeProvider>
            <AdminHeader onOpenMobileNav={vi.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Portfolio Control Center')).toBeInTheDocument();
    const logoutBtn = screen.getByTitle('Log Out');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('7. OverviewStatsCard renders label and numeric value', () => {
    render(
      <OverviewStatsCard
        label="Total Projects"
        value={15}
        icon={<Layers className="h-5 w-5" />}
        subtitle="Live showcase items"
      />,
    );

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Live showcase items')).toBeInTheDocument();
  });

  it('8. ConfirmDialog triggers onConfirm callback', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmLabel="Confirm Delete"
      />,
    );

    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Confirm Delete' });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('9. AdminMobileNav opens and closes properly', () => {
    const handleClose = vi.fn();
    const auth = mockAuthContextValue();

    render(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <AdminMobileNav isOpen={true} onClose={handleClose} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole('dialog', { name: /admin navigation menu/i })).toBeInTheDocument();
    const closeBtn = screen.getByLabelText('Close admin menu');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('10. AdminProfilePage renders loaded profile, edits fields, and saves successfully', async () => {
    const mockProfileData = {
      id: 'profile-1',
      fullName: 'Alex Morgan',
      tagline: 'Full-Stack Developer',
      shortBio: 'Short bio text here.',
      fullAbout: 'Full about text description.',
      location: 'San Francisco, CA',
      statusBadge: 'Open for Summer 2026',
      isAvailable: true,
      avatarUrl: 'https://example.com/photo.jpg',
      resumePdfUrl: '/assets/resume.pdf',
      socialLinks: [
        {
          id: 'link-1',
          platform: 'GitHub',
          url: 'https://github.com/alexmorgan',
          iconName: 'github',
          displayOrder: 1,
        },
      ],
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const getProfileSpy = vi
      .spyOn(profileService, 'getAdminProfile')
      .mockResolvedValue(mockProfileData);

    const updateProfileSpy = vi.spyOn(profileService, 'updateAdminProfile').mockResolvedValue({
      ...mockProfileData,
      fullName: 'Jordan Lee',
    });

    render(
      <MemoryRouter>
        <AdminProfilePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name \*/i)).toHaveValue('Alex Morgan');
    });

    const nameInput = screen.getByLabelText(/Full Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Jordan Lee' } });

    const saveButtons = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(updateProfileSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Profile changes saved successfully!')).toBeInTheDocument();
    });

    getProfileSpy.mockRestore();
    updateProfileSpy.mockRestore();
  });

  it('11. AdminProjectsPage renders projects, opens Add modal, and creates project', async () => {
    const mockProjList = [
      {
        id: 'proj-1',
        title: 'Distributed Worker',
        slug: 'distributed-worker',
        shortSummary: 'High throughput worker',
        fullDescription: 'Full markdown description',
        thumbnailUrl: null,
        githubUrl: 'https://github.com/alex/worker',
        liveDemoUrl: null,
        downloadUrl: null,
        status: 'COMPLETED' as const,
        isFeatured: true,
        displayOrder: 1,
        skills: [],
        screenshots: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    vi.spyOn(projectService, 'getAdminProjects').mockResolvedValue(mockProjList);
    const createProjectSpy = vi.spyOn(projectService, 'createProject').mockResolvedValue({
      ...mockProjList[0],
      id: 'proj-2',
      title: 'New AI System',
      slug: 'new-ai-system',
    });

    render(
      <MemoryRouter>
        <AdminProjectsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Distributed Worker')).toBeInTheDocument();
    });

    const addBtn = screen.getByRole('button', { name: /Add Project/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('New Project Showcase')).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Distributed Task Queue/i);
    const summaryInput = screen.getByPlaceholderText(/High-level overview/i);
    const descInput = screen.getByPlaceholderText(/Detailed project architecture/i);

    fireEvent.change(titleInput, { target: { value: 'New AI System' } });
    fireEvent.change(summaryInput, { target: { value: 'Summary of AI' } });
    fireEvent.change(descInput, { target: { value: 'Detailed description of AI' } });

    const submitBtn = screen.getByRole('button', { name: /Create Project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createProjectSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('12. AdminSettingsPage loads and saves settings', async () => {
    const mockSettings = {
      siteTitle: 'Dev Portfolio',
      siteDescription: 'Full Stack & AI',
      authorName: 'Alex Morgan',
      seoKeywords: ['full-stack', 'developer'],
      features: {
        blogEnabled: true,
        appsEnabled: true,
        certificatesEnabled: true,
        contactFormEnabled: true,
      },
    };

    vi.spyOn(settingsService, 'getSettings').mockResolvedValue(mockSettings);
    const updateSettingsSpy = vi
      .spyOn(settingsService, 'updateSettings')
      .mockResolvedValue(mockSettings);

    render(
      <MemoryRouter>
        <AdminSettingsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Site Title \*/i)).toHaveValue('Dev Portfolio');
    });

    const titleInput = screen.getByLabelText(/Site Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('13. AdminAppsPage renders app list', async () => {
    const mockAppList = [
      {
        id: 'app-1',
        name: 'GitPulse CLI',
        slug: 'gitpulse-cli',
        tagline: 'Developer tool',
        description: 'Full app description',
        iconUrl: null,
        webUrl: null,
        githubUrl: 'https://github.com/alex/gitpulse',
        currentVersion: '1.0.0',
        isFeatured: true,
        displayOrder: 1,
        latestReleases: [],
        allReleases: [],
        screenshots: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    vi.spyOn(appService, 'getAdminApps').mockResolvedValue(mockAppList);

    render(
      <MemoryRouter>
        <AdminAppsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('GitPulse CLI')).toBeInTheDocument();
    });
  });

  it('14. AdminSkillsPage renders categories and skills', async () => {
    const mockCategories = [
      {
        id: 'cat-1',
        name: 'Languages & Runtimes',
        displayOrder: 1,
        skills: [
          {
            id: 'skill-1',
            name: 'TypeScript',
            iconUrl: null,
            proficiencyLevel: 'ADVANCED',
            isFeatured: true,
            displayOrder: 1,
          },
        ],
      },
    ];

    vi.spyOn(skillService, 'getSkillCategories').mockResolvedValue(mockCategories);

    render(
      <MemoryRouter>
        <AdminSkillsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Languages & Runtimes')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('15. AdminCredentialsPage switches between education and certificate tabs', async () => {
    render(
      <MemoryRouter>
        <AdminCredentialsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Education \(/i)).toBeInTheDocument();
      expect(screen.getByText(/Certifications \(/i)).toBeInTheDocument();
    });

    const certTabBtn = screen.getByText(/Certifications \(/i);
    fireEvent.click(certTabBtn);

    expect(screen.getByRole('button', { name: /Add Certificate/i })).toBeInTheDocument();
  });

  it('16. AdminBlogPage renders article list with new article button', async () => {
    render(
      <MemoryRouter>
        <AdminBlogPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /New Article/i }).length).toBeGreaterThan(0);
    });
  });

  it('17. AdminProjectsPage Add modal can be cancelled and closed', async () => {
    vi.spyOn(projectService, 'getAdminProjects').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AdminProjectsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Add Project/i })[0]).toBeInTheDocument();
    });

    // Open Add modal
    fireEvent.click(screen.getAllByRole('button', { name: /Add Project/i })[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Cancel modal
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
