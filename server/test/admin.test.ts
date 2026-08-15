import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/db.js';
import { AuthUtils } from '../src/modules/auth/auth.utils.js';
import { UserRole } from '@prisma/client';

vi.mock('../src/db.js', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
    },
    project: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    projectSkill: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    projectScreenshot: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    app: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    appRelease: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    appScreenshot: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    skillCategory: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    skill: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    education: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    certificate: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blogPost: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      upsert: vi.fn(),
    },
    postTag: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    siteSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    contactMessage: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    profile: {
      findFirst: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    socialLink: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn((fn: unknown) => {
      if (typeof fn === 'function') {
        return fn(mockPrisma);
      }
      return Promise.resolve(fn);
    }),
  };

  return {
    prisma: mockPrisma,
    default: {},
  };
});

describe('Phase 7.5 — Complete Admin CMS CRUD API Tests', () => {
  const adminId = 'admin-uuid-1111';
  const editorId = 'editor-uuid-2222';
  let adminToken: string;
  let editorToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = AuthUtils.signAccessToken(adminId, UserRole.ADMIN);
    editorToken = AuthUtils.signAccessToken(editorId, UserRole.EDITOR);
  });

  describe('1. GET /api/v1/admin/stats', () => {
    it('should return 401 when unauthenticated request is made', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.status).toBe(401);
    });

    it('should return 403 when non-admin user requests stats', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Cookie', [`accessToken=${editorToken}`]);

      expect(res.status).toBe(403);
    });

    it('should return dashboard stats when authorized as ADMIN', async () => {
      vi.mocked(prisma.project.count).mockResolvedValue(12);
      vi.mocked(prisma.app.count).mockResolvedValue(4);
      vi.mocked(prisma.skill.count).mockResolvedValue(30);
      vi.mocked(prisma.blogPost.count).mockResolvedValue(8);
      vi.mocked(prisma.contactMessage.count).mockResolvedValue(3);
      vi.mocked(prisma.project.findMany).mockResolvedValue([
        {
          id: 'proj-1',
          title: 'Cloud Pulse',
          slug: 'cloud-pulse',
          status: 'COMPLETED',
          isFeatured: true,
          createdAt: new Date('2026-01-15T00:00:00Z'),
        },
      ] as never);
      vi.mocked(prisma.contactMessage.findMany).mockResolvedValue([] as never);

      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.counts.totalProjects).toBe(12);
    });
  });

  describe('2. Projects CRUD (/api/v1/admin/projects)', () => {
    const mockProject = {
      id: 'proj-1',
      title: 'Distributed Worker',
      slug: 'distributed-worker',
      shortSummary: 'High throughput worker',
      fullDescription: 'Full markdown description',
      thumbnailUrl: null,
      githubUrl: 'https://github.com/alex/worker',
      liveDemoUrl: null,
      downloadUrl: null,
      status: 'COMPLETED',
      isFeatured: true,
      displayOrder: 1,
      skills: [],
      screenshots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('POST /api/v1/admin/projects should create project for ADMIN', async () => {
      vi.mocked(prisma.project.findUnique)
        .mockResolvedValueOnce(null) // uniqueness check
        .mockResolvedValueOnce(mockProject as never); // getAdminProjectById

      vi.mocked(prisma.project.create).mockResolvedValue(mockProject as never);

      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: 'Distributed Worker',
          slug: 'distributed-worker',
          shortSummary: 'High throughput worker',
          fullDescription: 'Full markdown description',
          githubUrl: 'https://github.com/alex/worker',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Distributed Worker');
    });

    it('PUT /api/v1/admin/projects/:id should update project for ADMIN', async () => {
      vi.mocked(prisma.project.findUnique)
        .mockResolvedValueOnce(mockProject as never)
        .mockResolvedValueOnce({ ...mockProject, title: 'Updated Worker' } as never);

      const res = await request(app)
        .put('/api/v1/admin/projects/proj-1')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: 'Updated Worker',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Worker');
    });

    it('DELETE /api/v1/admin/projects/:id should delete project for ADMIN', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as never);
      vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as never);

      const res = await request(app)
        .delete('/api/v1/admin/projects/proj-1')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('3. Apps CRUD (/api/v1/admin/apps)', () => {
    const mockApp = {
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
      releases: [],
      screenshots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('POST /api/v1/admin/apps should create app for ADMIN', async () => {
      vi.mocked(prisma.app.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockApp as never);
      vi.mocked(prisma.app.create).mockResolvedValue(mockApp as never);

      const res = await request(app)
        .post('/api/v1/admin/apps')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          name: 'GitPulse CLI',
          slug: 'gitpulse-cli',
          tagline: 'Developer tool',
          description: 'Full app description',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('GitPulse CLI');
    });

    it('DELETE /api/v1/admin/apps/:id should delete app for ADMIN', async () => {
      vi.mocked(prisma.app.findUnique).mockResolvedValue(mockApp as never);
      vi.mocked(prisma.app.delete).mockResolvedValue(mockApp as never);

      const res = await request(app)
        .delete('/api/v1/admin/apps/app-1')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Skills & Categories CRUD (/api/v1/admin/skills)', () => {
    it('POST /api/v1/admin/skills/categories creates category', async () => {
      vi.mocked(prisma.skillCategory.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.skillCategory.create).mockResolvedValue({
        id: 'cat-1',
        name: 'Backend Engineering',
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        skills: [],
      } as never);

      const res = await request(app)
        .post('/api/v1/admin/skills/categories')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({ name: 'Backend Engineering' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Backend Engineering');
    });

    it('POST /api/v1/admin/skills creates skill', async () => {
      vi.mocked(prisma.skillCategory.findUnique).mockResolvedValue({ id: 'cat-1' } as never);
      vi.mocked(prisma.skill.create).mockResolvedValue({
        id: 'skill-1',
        categoryId: 'cat-1',
        name: 'Rust',
        iconUrl: null,
        proficiencyLevel: 'ADVANCED',
        isFeatured: true,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const res = await request(app)
        .post('/api/v1/admin/skills')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          categoryId: 'cat-1',
          name: 'Rust',
          proficiencyLevel: 'ADVANCED',
          isFeatured: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Rust');
    });
  });

  describe('5. Education & Certificates CRUD', () => {
    it('POST /api/v1/admin/education creates education record', async () => {
      vi.mocked(prisma.education.create).mockResolvedValue({
        id: 'edu-1',
        institution: 'UC Berkeley',
        degree: 'B.S.',
        fieldOfStudy: 'Computer Science',
        startDate: '2022',
        endDate: '2026',
        gradeOrCgpa: '3.9',
        activities: null,
        coursework: ['Data Structures'],
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const res = await request(app)
        .post('/api/v1/admin/education')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          institution: 'UC Berkeley',
          degree: 'B.S.',
          fieldOfStudy: 'Computer Science',
          startDate: '2022',
          endDate: '2026',
          gradeOrCgpa: '3.9',
          coursework: ['Data Structures'],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.institution).toBe('UC Berkeley');
    });

    it('POST /api/v1/admin/certificates creates certificate', async () => {
      vi.mocked(prisma.certificate.create).mockResolvedValue({
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect',
        issuer: 'AWS',
        issueDate: '2025-06',
        expirationDate: null,
        credentialId: 'AWS-123',
        credentialUrl: 'https://aws.amazon.com/verify',
        imageUrl: null,
        category: 'Cloud',
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const res = await request(app)
        .post('/api/v1/admin/certificates')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: 'AWS Certified Solutions Architect',
          issuer: 'AWS',
          issueDate: '2025-06',
          credentialId: 'AWS-123',
          credentialUrl: 'https://aws.amazon.com/verify',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('AWS Certified Solutions Architect');
    });
  });

  describe('6. Blog Posts CRUD (/api/v1/admin/blog)', () => {
    const mockPost = {
      id: 'post-1',
      title: 'Distributed System Architecture',
      slug: 'distributed-system-architecture',
      summary: 'Architecting for scale',
      contentMarkdown: '# Architecture Breakdown',
      coverImageUrl: null,
      readingTimeMinutes: 5,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('POST /api/v1/admin/blog creates blog post with tags', async () => {
      vi.mocked(prisma.blogPost.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockPost as never);
      vi.mocked(prisma.blogPost.create).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.tag.upsert).mockResolvedValue({
        id: 'tag-1',
        name: 'System Design',
        slug: 'system-design',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const res = await request(app)
        .post('/api/v1/admin/blog')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: 'Distributed System Architecture',
          slug: 'distributed-system-architecture',
          summary: 'Architecting for scale',
          contentMarkdown: '# Architecture Breakdown',
          status: 'PUBLISHED',
          tags: ['System Design'],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Distributed System Architecture');
    });

    it('DELETE /api/v1/admin/blog/:id deletes blog post', async () => {
      vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockPost as never);
      vi.mocked(prisma.blogPost.delete).mockResolvedValue(mockPost as never);

      const res = await request(app)
        .delete('/api/v1/admin/blog/post-1')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('7. Settings Management (/api/v1/admin/settings)', () => {
    it('PUT /api/v1/admin/settings persists settings', async () => {
      vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({
        key: 'site_public_config',
        value: {
          siteTitle: 'Alex Morgan Portfolio',
          siteDescription: 'Full Stack & AI Engineer',
          authorName: 'Alex Morgan',
          seoKeywords: ['engineer', 'portfolio'],
          features: {
            blogEnabled: true,
            appsEnabled: true,
            certificatesEnabled: true,
            contactFormEnabled: true,
          },
        },
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .put('/api/v1/admin/settings')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          siteTitle: 'Alex Morgan Portfolio',
          siteDescription: 'Full Stack & AI Engineer',
          authorName: 'Alex Morgan',
          seoKeywords: ['engineer', 'portfolio'],
          features: {
            blogEnabled: true,
            appsEnabled: true,
            certificatesEnabled: true,
            contactFormEnabled: true,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.siteTitle).toBe('Alex Morgan Portfolio');
      expect(res.body.data.authorName).toBe('Alex Morgan');
    });
  });

  describe('8. Admin Error Boundaries & Edge Cases', () => {
    it('PUT /api/v1/admin/projects/:id returns 404 when project does not exist', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      const res = await request(app)
        .put('/api/v1/admin/projects/non-existent-id')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: 'Updated Project',
          slug: 'updated-project',
          shortSummary: 'Summary',
          fullDescription: 'Full Description',
          status: 'COMPLETED',
          isFeatured: false,
          displayOrder: 1,
          skillIds: [],
          screenshots: [],
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('DELETE /api/v1/admin/projects/:id returns 404 when project does not exist', async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/v1/admin/projects/non-existent-id')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('POST /api/v1/admin/projects fails validation on empty required fields', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send({
          title: '', // Invalid empty title
          slug: 'valid-slug',
          shortSummary: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
