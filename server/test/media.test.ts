import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { app } from '../src/app.js';
import { AuthUtils } from '../src/modules/auth/auth.utils.js';
import { UserRole } from '@prisma/client';
import { LocalStorageProvider } from '../src/services/storage/LocalStorageProvider.js';
import { CloudinaryStorageProvider } from '../src/services/storage/CloudinaryStorageProvider.js';

describe('Phase 6 — Media / File Storage & App Distribution Tests', () => {
  const adminUserId = 'admin-user-uuid-1111';
  const editorUserId = 'editor-user-uuid-2222';
  let adminToken: string;
  let editorToken: string;

  const testUploadDir = path.resolve(process.cwd(), 'uploads_test');

  // Binary test fixtures
  const validJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60,
    0x00, 0x60, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0xff, 0xd9,
  ]);

  const validPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82,
  ]);

  const validWebp = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x4c,
    0x0d, 0x00, 0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0xff, 0x03, 0x88, 0x88,
    0xfe, 0x07, 0x00,
  ]);

  const validPdf = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF\n',
  );

  const validZip = Buffer.from([
    0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  const fakeExe = Buffer.from([
    0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff,
  ]);

  const svgContent = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
  );

  beforeAll(() => {
    adminToken = AuthUtils.signAccessToken(adminUserId, UserRole.ADMIN);
    editorToken = AuthUtils.signAccessToken(editorUserId, UserRole.EDITOR);
  });

  afterAll(async () => {
    if (fs.existsSync(testUploadDir)) {
      await fs.promises.rm(testUploadDir, { recursive: true, force: true });
    }
  });

  describe('1. Authentication & Role Authorization Guards', () => {
    it('POST /api/v1/admin/media/upload should reject unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .attach('file', validJpeg, 'photo.jpg')
        .field('category', 'IMAGE');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/v1/admin/media/upload should reject non-admin users with 403', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${editorToken}`])
        .attach('file', validJpeg, 'photo.jpg')
        .field('category', 'IMAGE');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('2. Valid File Category Uploads (Admin)', () => {
    it('should successfully upload a valid JPEG image', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validJpeg, 'avatar.jpg')
        .field('category', 'IMAGE');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category).toBe('IMAGE');
      expect(res.body.data.mimeType).toBe('image/jpeg');
      expect(res.body.data.url).toContain('/uploads/images/');
    });

    it('should successfully upload a valid PNG image', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validPng, 'icon.png')
        .field('category', 'IMAGE');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mimeType).toBe('image/png');
    });

    it('should successfully upload a valid WebP image', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validWebp, 'banner.webp')
        .field('category', 'IMAGE');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mimeType).toBe('image/webp');
    });

    it('should successfully upload a valid PDF document', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validPdf, 'resume.pdf')
        .field('category', 'PDF');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category).toBe('PDF');
      expect(res.body.data.mimeType).toBe('application/pdf');
      expect(res.body.data.url).toContain('/uploads/documents/');
    });

    it('should successfully upload a valid ZIP application release binary', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validZip, 'app-v1.0.0.zip')
        .field('category', 'RELEASE');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category).toBe('RELEASE');
      expect(res.body.data.url).toContain('/uploads/releases/');
    });
  });

  describe('3. Validation Pipeline & Security Enforcements', () => {
    it('should reject SVG uploads (XSS prevention)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', svgContent, 'vector.svg')
        .field('category', 'IMAGE');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('SVG uploads are strictly prohibited');
    });

    it('should reject a disguised executable renamed to .png (Magic-byte detection)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', fakeExe, 'trojan.png')
        .field('category', 'IMAGE');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject a corrupt/fake PDF document', async () => {
      const corruptPdf = Buffer.from('This is not a PDF header at all.');
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', corruptPdf, 'fake.pdf')
        .field('category', 'PDF');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject unsupported file extensions (.txt, .html, .sh)', async () => {
      const textBuffer = Buffer.from('Hello world');
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', textBuffer, 'script.sh')
        .field('category', 'IMAGE');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_EXTENSION');
    });

    it('should reject invalid media categories', async () => {
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validJpeg, 'photo.jpg')
        .field('category', 'UNKNOWN_CATEGORY');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject 0-byte empty file uploads', async () => {
      const emptyBuffer = Buffer.alloc(0);
      const res = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', emptyBuffer, 'empty.jpg')
        .field('category', 'IMAGE');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. Deletion & Path Traversal Protections', () => {
    it('should delete an existing uploaded file safely', async () => {
      // First upload
      const uploadRes = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validPng, 'delete-me.png')
        .field('category', 'IMAGE');

      expect(uploadRes.status).toBe(201);
      const storageKey = uploadRes.body.data.storageKey;

      // Now delete
      const deleteRes = await request(app)
        .delete(`/api/v1/admin/media/${storageKey}`)
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.deleted).toBe(true);
    });

    it('should reject path traversal attempts during deletion', async () => {
      const res = await request(app)
        .delete('/api/v1/admin/media/..%2F..%2Fetc%2Fpasswd')
        .set('Cookie', [`accessToken=${adminToken}`]);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('5. Storage Providers Unit Tests', () => {
    it('LocalStorageProvider should safely isolate and delete files', async () => {
      const localProvider = new LocalStorageProvider(testUploadDir);

      const result = await localProvider.upload({
        buffer: validJpeg,
        originalFilename: 'test.jpg',
        mimeType: 'image/jpeg',
        category: 'IMAGE',
        size: validJpeg.length,
      });

      expect(result.storageKey).toContain('images/');
      expect(result.provider).toBe('local');

      // Test safe deletion
      const deleted = await localProvider.delete(result.storageKey);
      expect(deleted).toBe(true);
    });

    it('LocalStorageProvider should reject path traversal queries', async () => {
      const localProvider = new LocalStorageProvider(testUploadDir);
      await expect(localProvider.delete('../../secret.txt')).rejects.toThrow();
    });

    it('CloudinaryStorageProvider should have providerName="cloudinary"', () => {
      const cloudProvider = new CloudinaryStorageProvider();
      expect(cloudProvider.providerName).toBe('cloudinary');
    });
  });

  describe('6. Static Media HTTP Caching & Avatar Workflow', () => {
    it('should serve uploaded static media with Cache-Control and nosniff headers', async () => {
      // 1. Upload an avatar image
      const uploadRes = await request(app)
        .post('/api/v1/admin/media/upload')
        .set('Cookie', [`accessToken=${adminToken}`])
        .attach('file', validJpeg, 'test-avatar.jpg')
        .field('category', 'IMAGE');

      expect(uploadRes.status).toBe(201);
      expect(uploadRes.body.success).toBe(true);

      const avatarUrl = uploadRes.body.data.url;
      expect(avatarUrl).toContain('/uploads/');

      // 2. Request the uploaded file from the static endpoint using relative pathname
      const requestPath = avatarUrl.startsWith('http') ? new URL(avatarUrl).pathname : avatarUrl;
      const staticRes = await request(app).get(requestPath);

      expect(staticRes.status).toBe(200);
      expect(staticRes.headers['cache-control']).toBe(
        'public, max-age=2592000, stale-while-revalidate=86400',
      );
      expect(staticRes.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
