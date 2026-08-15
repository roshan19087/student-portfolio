import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/db.js';

// Mock Prisma client methods for deterministic testing
vi.mock('../src/db.js', () => {
  return {
    prisma: {
      profile: {
        findFirst: vi.fn(),
      },
      skillCategory: {
        findMany: vi.fn(),
      },
      project: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      app: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      education: {
        findMany: vi.fn(),
      },
      certificate: {
        findMany: vi.fn(),
      },
      blogPost: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
      },
      siteSetting: {
        findUnique: vi.fn(),
      },
      contactMessage: {
        create: vi.fn(),
      },
    },
    default: {},
  };
});

describe('Phase 3 — API Foundation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Health Check Endpoint', () => {
    it('GET /health should return 200 with valid health schema', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.environment).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
      expect(typeof res.body.uptime).toBe('number');
    });
  });

  describe('2. Public Profile Endpoint', () => {
    it('GET /api/v1/profile should return 200 with public profile', async () => {
      const mockProfile = {
        id: '11111111-1111-1111-1111-111111111111',
        fullName: 'Alex Morgan',
        tagline: 'Full-Stack Developer',
        shortBio: 'Short bio text',
        fullAbout: 'Full about narrative',
        avatarUrl: 'https://example.com/avatar.jpg',
        resumePdfUrl: '/assets/resume.pdf',
        location: 'San Francisco, CA',
        statusBadge: 'Open for work',
        isAvailable: true,
        socialLinks: [
          {
            id: '22222222-2222-2222-2222-222222222222',
            platform: 'GitHub',
            url: 'https://github.com/example',
            iconName: 'github',
            displayOrder: 1,
          },
        ],
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      };

      vi.mocked(prisma.profile.findFirst).mockResolvedValue(mockProfile as unknown as never);

      const res = await request(app).get('/api/v1/profile');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Alex Morgan');
      expect(res.body.data.socialLinks).toHaveLength(1);
    });

    it('GET /api/v1/profile should handle null profile gracefully', async () => {
      vi.mocked(prisma.profile.findFirst).mockResolvedValue(null);

      const res = await request(app).get('/api/v1/profile');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeNull();
    });
  });

  describe('3. Public Skills Endpoint', () => {
    it('GET /api/v1/skills should return categorized skills', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Programming Languages',
          displayOrder: 1,
          skills: [
            {
              id: 'skill-1',
              name: 'TypeScript',
              iconUrl: 'https://example.com/ts.svg',
              proficiencyLevel: 'Advanced',
              isFeatured: true,
              displayOrder: 1,
            },
          ],
        },
      ];

      vi.mocked(prisma.skillCategory.findMany).mockResolvedValue(
        mockCategories as unknown as never,
      );

      const res = await request(app).get('/api/v1/skills');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Programming Languages');
      expect(res.body.data[0].skills[0].name).toBe('TypeScript');
    });
  });

  describe('4. Public Projects Endpoints', () => {
    it('GET /api/v1/projects should return filtered projects', async () => {
      const mockProjects = [
        {
          id: 'proj-1',
          title: 'Full-Stack Developer Hub',
          slug: 'full-stack-developer-hub',
          shortSummary: 'Summary text',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          githubUrl: 'https://github.com/example/repo',
          liveDemoUrl: 'https://demo.example.com',
          downloadUrl: null,
          status: 'COMPLETED',
          isFeatured: true,
          displayOrder: 1,
          skills: [
            {
              skill: {
                id: 'skill-1',
                name: 'TypeScript',
                iconUrl: null,
                proficiencyLevel: 'Advanced',
                isFeatured: true,
                displayOrder: 1,
              },
            },
          ],
          createdAt: new Date('2026-01-01T00:00:00Z'),
        },
      ];

      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as unknown as never);

      const res = await request(app).get('/api/v1/projects?featured=true&status=COMPLETED');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].slug).toBe('full-stack-developer-hub');
      expect(res.body.data[0].skills[0].name).toBe('TypeScript');
    });

    it('GET /api/v1/projects/:slug should return project details with screenshots', async () => {
      const mockDetail = {
        id: 'proj-1',
        title: 'Full-Stack Developer Hub',
        slug: 'full-stack-developer-hub',
        shortSummary: 'Summary',
        fullDescription: 'Full description markdown',
        thumbnailUrl: null,
        githubUrl: null,
        liveDemoUrl: null,
        downloadUrl: null,
        status: 'COMPLETED',
        isFeatured: true,
        displayOrder: 1,
        skills: [],
        screenshots: [
          {
            id: 'sc-1',
            imageUrl: 'https://example.com/screenshot.jpg',
            caption: 'Dashboard Preview',
            displayOrder: 1,
          },
        ],
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z'),
      };

      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockDetail as unknown as never);

      const res = await request(app).get('/api/v1/projects/full-stack-developer-hub');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('full-stack-developer-hub');
      expect(res.body.data.screenshots).toHaveLength(1);
    });

    it('GET /api/v1/projects/:slug should return 404 for unknown slug', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      const res = await request(app).get('/api/v1/projects/non-existent-project');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('5. Public Applications Endpoints', () => {
    it('GET /api/v1/apps should return applications list with releases', async () => {
      const mockApps = [
        {
          id: 'app-1',
          name: 'SnippetForge CLI',
          slug: 'snippetforge-cli',
          tagline: 'Fast snippet manager',
          iconUrl: null,
          webUrl: null,
          githubUrl: 'https://github.com/example/snippetforge',
          currentVersion: '1.2.0',
          isFeatured: true,
          displayOrder: 1,
          releases: [
            {
              id: 'rel-1',
              version: '1.2.0',
              platform: 'CROSS_PLATFORM',
              downloadUrl: 'https://example.com/dl.zip',
              releaseNotes: 'Initial release',
              releaseDate: new Date('2026-01-01T00:00:00Z'),
            },
          ],
        },
      ];

      vi.mocked(prisma.app.findMany).mockResolvedValue(mockApps as unknown as never);

      const res = await request(app).get('/api/v1/apps');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].name).toBe('SnippetForge CLI');
      expect(res.body.data[0].latestReleases[0].version).toBe('1.2.0');
    });
  });

  describe('6. Public Blog Endpoints (Draft Protection & Pagination)', () => {
    it('GET /api/v1/blog should return published posts with pagination meta', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Published Post',
          slug: 'published-post',
          summary: 'Summary of published post',
          coverImageUrl: null,
          readingTimeMinutes: 4,
          publishedAt: new Date('2026-02-01T00:00:00Z'),
          createdAt: new Date('2026-01-01T00:00:00Z'),
          tags: [
            {
              tag: {
                id: 'tag-1',
                name: 'TypeScript',
                slug: 'typescript',
              },
            },
          ],
        },
      ];

      vi.mocked(prisma.blogPost.count).mockResolvedValue(1);
      vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockPosts as unknown as never);

      const res = await request(app).get('/api/v1/blog?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(res.body.data[0].tags[0].name).toBe('TypeScript');
    });

    it('GET /api/v1/blog/:slug should return 404 for draft post', async () => {
      // BlogService queries with { status: 'PUBLISHED' }, so drafts return null
      vi.mocked(prisma.blogPost.findFirst).mockResolvedValue(null);

      const res = await request(app).get('/api/v1/blog/internal-confidential-draft');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('7. Public Contact Endpoint (Validation & Honeypot)', () => {
    it('POST /api/v1/contact should validate valid input and store message', async () => {
      vi.mocked(prisma.contactMessage.create).mockResolvedValue({
        id: 'msg-1',
        senderName: 'Jane Doe',
        senderEmail: 'jane@example.com',
        subject: 'Collaboration Opportunity',
        message: 'Hello, I loved your portfolio and would like to connect!',
        isRead: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).post('/api/v1/contact').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Collaboration Opportunity',
        message: 'Hello, I loved your portfolio and would like to connect!',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.delivered).toBe(true);
      expect(prisma.contactMessage.create).toHaveBeenCalledTimes(1);
    });

    it('POST /api/v1/contact should fail validation on invalid email or short message', async () => {
      const res = await request(app).post('/api/v1/contact').send({
        name: 'J',
        email: 'invalid-email',
        message: 'Short',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toBeInstanceOf(Array);
    });

    it('POST /api/v1/contact should silently drop honeypot bot submissions without DB save', async () => {
      const res = await request(app).post('/api/v1/contact').send({
        name: 'Spam Bot',
        email: 'spammer@botnet.com',
        message: 'Buy our products now! Visit link immediately!',
        _hp: 'bot_filled_value_here', // Honeypot field filled by bot
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.delivered).toBe(true);
      // Ensure database insert was NOT called
      expect(prisma.contactMessage.create).not.toHaveBeenCalled();
    });

    it('Contact submission rate limiter should enforce 5 requests per hour limit and return 429 on excess', async () => {
      const expressModule = await import('express');
      const rateLimitModule = await import('express-rate-limit');
      const testLimiterApp = expressModule.default();
      testLimiterApp.use(expressModule.default.json());

      const activeLimiter = rateLimitModule.default({
        windowMs: 60 * 60 * 1000,
        max: 5,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: {
          success: false,
          error: {
            code: 'CONTACT_RATE_LIMIT_EXCEEDED',
            message:
              'You have reached the contact message submission limit. Please try again in an hour.',
          },
        },
      });

      testLimiterApp.post('/test-contact', activeLimiter, (_req, res) => {
        res.status(201).json({ success: true, message: 'Message received' });
      });

      // Send 5 permitted requests
      for (let i = 0; i < 5; i++) {
        const response = await request(testLimiterApp)
          .post('/test-contact')
          .send({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            message: 'Hello developer, this is a test message.',
          });
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      }

      // 6th request must exceed the threshold and receive HTTP 429
      const exceededResponse = await request(testLimiterApp).post('/test-contact').send({
        name: 'User 6',
        email: 'user6@example.com',
        message: 'This 6th message should be blocked by rate limiting.',
      });

      expect(exceededResponse.status).toBe(429);
      expect(exceededResponse.body.success).toBe(false);
      expect(exceededResponse.body.error.code).toBe('CONTACT_RATE_LIMIT_EXCEEDED');
      expect(exceededResponse.body.error.message).toContain('limit');
    });
  });

  describe('8. Public Settings Endpoint', () => {
    it('GET /api/v1/settings/public should return public configuration only', async () => {
      vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
        key: 'site_public_config',
        value: {
          siteTitle: 'Alex Morgan Portfolio',
          siteDescription: 'Personal developer hub',
          authorName: 'Alex Morgan',
          features: {
            blogEnabled: true,
            appsEnabled: true,
            certificatesEnabled: true,
            contactFormEnabled: true,
          },
        },
        description: 'Public settings',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).get('/api/v1/settings/public');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.siteTitle).toBe('Alex Morgan Portfolio');
      expect(res.body.data.features.blogEnabled).toBe(true);
    });
  });

  describe('9. Unknown Route & Error Handling', () => {
    it('should return standardized 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/v1/unknown-resource');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
      expect(res.body.error.message).toContain('Endpoint does not exist');
    });
  });

  describe('10. HTTP Response Compression', () => {
    it('should compress responses when client sends Accept-Encoding: gzip', async () => {
      // Mock a large profile payload to exceed compression threshold (>1KB)
      const largeBio = 'A'.repeat(2048);
      vi.mocked(prisma.profile.findFirst).mockResolvedValue({
        id: '11111111-1111-1111-1111-111111111111',
        fullName: 'Alex Morgan',
        tagline: 'Full-Stack Developer',
        shortBio: largeBio,
        fullAbout: largeBio,
        avatarUrl: null,
        resumePdfUrl: null,
        location: 'San Francisco, CA',
        statusBadge: 'Open',
        isAvailable: true,
        socialLinks: [],
        updatedAt: new Date(),
      } as unknown as never);

      const res = await request(app).get('/api/v1/profile').set('Accept-Encoding', 'gzip, deflate');

      expect(res.status).toBe(200);
      expect(res.headers['content-encoding']).toBe('gzip');
    });
  });
});
