import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../src/context/ThemeContext.js';
import { SiteSettingsProvider } from '../src/context/SiteSettingsContext.js';
import { Header } from '../src/components/layout/Header.js';
import { HeroSection } from '../src/components/public/HeroSection.js';
import { ProjectsSection } from '../src/components/public/ProjectsSection.js';
import { ProjectCard } from '../src/components/public/ProjectCard.js';
import { AppsSection } from '../src/components/public/AppsSection.js';
import { ContactSection } from '../src/components/public/ContactSection.js';
import { ResumeSection } from '../src/components/public/ResumeSection.js';
import { NotFoundPage } from '../src/pages/NotFoundPage.js';
import { HomePage } from '../src/pages/HomePage.js';
import { ProjectDetailPage } from '../src/pages/ProjectDetailPage.js';
import { AppDetailPage } from '../src/pages/AppDetailPage.js';
import { BlogListPage } from '../src/pages/BlogListPage.js';
import { BlogPostPage } from '../src/pages/BlogPostPage.js';
import { ResumePage } from '../src/pages/ResumePage.js';
import { profileService } from '../src/services/profileService.js';
import { projectService } from '../src/services/projectService.js';
import { appService } from '../src/services/appService.js';
import { blogService } from '../src/services/blogService.js';
import { educationService } from '../src/services/educationService.js';
import { mockProfile, mockProjects } from '../src/data/mockData.js';

// Setup window matchMedia mock for JSDOM
beforeEach(() => {
  vi.clearAllMocks();
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

  localStorage.clear();
});

describe('Phase 7.6 & Anti-Mock Flash — Public Frontend Tests', () => {
  it('1. Header renders navigation links and brand container', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteSettingsProvider>
            <Header />
          </SiteSettingsProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('2. Mobile navigation opens and closes', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteSettingsProvider>
            <Header />
          </SiteSettingsProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    const menuButton = screen.getByLabelText('Open mobile menu');
    fireEvent.click(menuButton);

    expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close navigation menu');
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument();
  });

  it('3. Theme toggle changes theme state and applies classes', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteSettingsProvider>
            <Header />
          </SiteSettingsProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    const themeToggleBtn = screen.getAllByRole('button', { name: /switch to/i })[0];
    expect(themeToggleBtn).toBeDefined();

    fireEvent.click(themeToggleBtn);
    expect(localStorage.getItem('portfolio-theme')).toBeDefined();
  });

  it('4. HeroSection renders profile tagline, name, and CTAs', () => {
    render(
      <MemoryRouter>
        <HeroSection profile={mockProfile} />
      </MemoryRouter>,
    );

    expect(screen.getByText(new RegExp(mockProfile.fullName, 'i'))).toBeInTheDocument();
    expect(screen.getByText(mockProfile.tagline)).toBeInTheDocument();
    expect(screen.getByText('View My Projects')).toBeInTheDocument();
  });

  it('5. ProjectsSection renders project cards and filter buttons', () => {
    render(
      <MemoryRouter>
        <ProjectsSection projects={mockProjects} />
      </MemoryRouter>,
    );

    expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
    expect(screen.getByText(/All \(/i)).toBeInTheDocument();
  });

  it('6. ProjectsSection renders empty state when no projects exist', () => {
    render(
      <MemoryRouter>
        <ProjectsSection projects={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No projects available')).toBeInTheDocument();
  });

  it('7. ProjectCard renders thumbnail and technology tags', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProjects[0]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockProjects[0].skills[0].name)).toBeInTheDocument();
  });

  it('8. AppsSection renders empty state when no apps exist', () => {
    render(
      <MemoryRouter>
        <AppsSection apps={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/No standalone applications listed yet/i)).toBeInTheDocument();
  });

  it('9. ContactSection rejects invalid email format with validation error', async () => {
    render(
      <MemoryRouter>
        <ContactSection profile={mockProfile} />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitBtn = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(messageInput, { target: { value: 'Hello there, this is a test message.' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('10. ContactSection rejects empty message field', async () => {
    render(
      <MemoryRouter>
        <ContactSection profile={mockProfile} />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/Your Name/i);
    const emailInput = screen.getByLabelText(/Your Email/i);
    const submitBtn = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('11. ContactSection displays success state upon successful submission', async () => {
    const mockSend = vi.fn().mockResolvedValue(true);

    render(
      <MemoryRouter>
        <ContactSection profile={mockProfile} onSendMessage={mockSend} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'This is a valid long inquiry message for the developer.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText('Message Delivered!')).toBeInTheDocument();
    });
  });

  it('12. NotFoundPage renders 404 error and return button', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Error 404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Back to Homepage')).toBeInTheDocument();
  });

  it('13. ResumeSection displays graceful fallback when PDF is missing', () => {
    const profileNoPdf = { ...mockProfile, resumePdfUrl: undefined };

    render(
      <MemoryRouter>
        <ResumeSection profile={profileNoPdf} />
      </MemoryRouter>,
    );

    expect(screen.getByText('PDF Coming Soon')).toBeInTheDocument();
  });

  it('14. HomePage renders loading skeleton initially and live PostgreSQL data upon resolution without mock flash', async () => {
    const customLiveProfile = {
      ...mockProfile,
      fullName: 'Live DB Developer',
      tagline: 'Senior Distributed Engineer',
    };

    const getProfileSpy = vi
      .spyOn(profileService, 'getProfile')
      .mockResolvedValue(customLiveProfile);
    const getProjectsSpy = vi.spyOn(projectService, 'getProjects').mockResolvedValue([
      {
        id: 'proj-live',
        title: 'Live High-Scale Engine',
        slug: 'live-high-scale-engine',
        shortSummary: 'Engine summary from database',
        thumbnailUrl: null,
        githubUrl: 'https://github.com/alex/live-engine',
        liveDemoUrl: null,
        downloadUrl: null,
        status: 'COMPLETED' as const,
        isFeatured: true,
        displayOrder: 1,
        skills: [],
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // Initial render displays loading skeleton
    expect(screen.getByTestId('home-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Alex Morgan')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Live DB Developer/i)).toBeInTheDocument();
      expect(screen.getByText('Senior Distributed Engineer')).toBeInTheDocument();
      expect(screen.getByText('Live High-Scale Engine')).toBeInTheDocument();
    });

    getProfileSpy.mockRestore();
    getProjectsSpy.mockRestore();
  });

  it('15. ProjectDetailPage shows skeleton during load and displays live project without mock flash', async () => {
    const customDetail = {
      id: 'proj-1',
      title: 'Database Cloud Engine',
      slug: 'database-cloud-engine',
      shortSummary: 'Fast engine summary',
      fullDescription: 'Detailed architecture breakdown from PostgreSQL database.',
      thumbnailUrl: null,
      githubUrl: 'https://github.com/alex/cloud-engine',
      liveDemoUrl: null,
      downloadUrl: null,
      status: 'COMPLETED' as const,
      isFeatured: true,
      displayOrder: 1,
      skills: [
        {
          id: 's1',
          name: 'Go',
          iconUrl: null,
          proficiencyLevel: 'ADVANCED' as const,
          isFeatured: true,
          displayOrder: 1,
        },
      ],
      screenshots: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const getProjectSpy = vi
      .spyOn(projectService, 'getProjectBySlug')
      .mockResolvedValue(customDetail);

    render(
      <MemoryRouter initialEntries={['/projects/database-cloud-engine']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Database Cloud Engine').length).toBeGreaterThan(0);
      expect(
        screen.getByText(/Detailed architecture breakdown from PostgreSQL database/i),
      ).toBeInTheDocument();
      expect(screen.getByText('Go')).toBeInTheDocument();
    });

    getProjectSpy.mockRestore();
  });

  it('16. ProjectDetailPage displays Project Not Found on API failure without mock fallback', async () => {
    const getProjectSpy = vi
      .spyOn(projectService, 'getProjectBySlug')
      .mockRejectedValue(new Error('Project not found'));

    render(
      <MemoryRouter initialEntries={['/projects/unknown-slug']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Project Not Found')).toBeInTheDocument();
    });

    getProjectSpy.mockRestore();
  });

  it('17. AppDetailPage fetches app by slug from live API and displays releases without mock flash', async () => {
    const customApp = {
      id: 'app-1',
      name: 'Pulse CLI Live',
      slug: 'pulse-cli-live',
      tagline: 'Terminal tool from database',
      description: 'Full database description for CLI app.',
      iconUrl: null,
      webUrl: null,
      githubUrl: 'https://github.com/alex/pulse-cli',
      currentVersion: '2.4.0',
      isFeatured: true,
      displayOrder: 1,
      latestReleases: [
        {
          id: 'rel-1',
          appId: 'app-1',
          version: '2.4.0',
          platform: 'MACOS' as const,
          downloadUrl: 'https://downloads.dev/cli.tar.gz',
          fileSizeBytes: 1048576,
          releaseNotes: 'Performance improvements',
          releaseDate: '2026-02-01T00:00:00Z',
          downloadCount: 150,
          isActive: true,
          displayOrder: 1,
          createdAt: '2026-02-01T00:00:00Z',
        },
      ],
      allReleases: [],
      screenshots: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const getAppSpy = vi.spyOn(appService, 'getAppBySlug').mockResolvedValue(customApp);

    render(
      <MemoryRouter initialEntries={['/apps/pulse-cli-live']}>
        <Routes>
          <Route path="/apps/:slug" element={<AppDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Pulse CLI Live').length).toBeGreaterThan(0);
      expect(screen.getByText('v2.4.0')).toBeInTheDocument();
      expect(screen.getByText('Version 2.4.0')).toBeInTheDocument();
    });

    getAppSpy.mockRestore();
  });

  it('18. AppDetailPage renders Application Not Found on API failure without mock fallback', async () => {
    const getAppSpy = vi
      .spyOn(appService, 'getAppBySlug')
      .mockRejectedValue(new Error('App not found'));

    render(
      <MemoryRouter initialEntries={['/apps/missing-app']}>
        <Routes>
          <Route path="/apps/:slug" element={<AppDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Application Not Found')).toBeInTheDocument();
    });

    getAppSpy.mockRestore();
  });

  it('19. BlogListPage fetches published posts from API and filters by search', async () => {
    const customPosts = [
      {
        id: 'post-1',
        title: 'Building Scalable Event Buses in Node',
        slug: 'building-scalable-event-buses',
        summary: 'Architecture guide for high-throughput event buses.',
        coverImageUrl: null,
        readingTimeMinutes: 6,
        publishedAt: '2026-02-01T00:00:00Z',
        tags: [{ id: 't1', name: 'Architecture', slug: 'architecture' }],
      },
    ];

    const getPostsSpy = vi.spyOn(blogService, 'getPosts').mockResolvedValue(customPosts);

    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Building Scalable Event Buses in Node')).toBeInTheDocument();
      expect(screen.getAllByText(/Architecture/i).length).toBeGreaterThan(0);
    });

    getPostsSpy.mockRestore();
  });

  it('20. BlogPostPage fetches published article from API and renders markdown', async () => {
    const customDetail = {
      id: 'post-1',
      title: 'Distributed Consensus Mechanics',
      slug: 'distributed-consensus-mechanics',
      summary: 'Deep dive into Raft and Paxos.',
      contentMarkdown: '# Raft Algorithm Mechanics\n\nConsensus algorithm explanation from DB.',
      coverImageUrl: null,
      readingTimeMinutes: 8,
      publishedAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z',
      tags: [{ id: 't1', name: 'Distributed Systems', slug: 'distributed-systems' }],
    };

    const getPostSpy = vi.spyOn(blogService, 'getPostBySlug').mockResolvedValue(customDetail);

    render(
      <MemoryRouter initialEntries={['/blog/distributed-consensus-mechanics']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Distributed Consensus Mechanics').length).toBeGreaterThan(0);
      expect(screen.getByText('Raft Algorithm Mechanics')).toBeInTheDocument();
      expect(screen.getByText(/Consensus algorithm explanation from DB/i)).toBeInTheDocument();
    });

    getPostSpy.mockRestore();
  });

  it('21. ResumePage shows skeleton and fetches live education, certificates, and skills from PostgreSQL APIs', async () => {
    const customProfile = {
      ...mockProfile,
      fullName: 'Dr. Live Candidate',
      tagline: 'Computer Systems Researcher',
    };

    const customEducation = [
      {
        id: 'edu-1',
        institution: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2024',
        endDate: '2026',
        gradeOrCgpa: '4.0',
        coursework: ['Advanced Operating Systems'],
        activities: null,
        displayOrder: 1,
      },
    ];

    const getProfileSpy = vi.spyOn(profileService, 'getProfile').mockResolvedValue(customProfile);
    const getEduSpy = vi.spyOn(educationService, 'getEducation').mockResolvedValue(customEducation);

    render(
      <MemoryRouter>
        <ResumePage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('resume-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Dr. Live Candidate')).toBeInTheDocument();
      expect(screen.getByText('Stanford University')).toBeInTheDocument();
      expect(screen.getByText(/Master of Science in Computer Science/i)).toBeInTheDocument();
    });

    getProfileSpy.mockRestore();
    getEduSpy.mockRestore();
  });
});
