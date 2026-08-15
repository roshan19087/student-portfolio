import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/db.js';
import { AuthUtils } from '../src/modules/auth/auth.utils.js';
import { requireRole } from '../src/middlewares/auth.middleware.js';
import { UserRole } from '@prisma/client';
import express, { Request, Response } from 'express';

// Mock Prisma client methods for deterministic testing
vi.mock('../src/db.js', () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
      refreshToken: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    default: {},
  };
});

describe('Phase 4 — Authentication & Authorization Tests', () => {
  const mockUserId = '11111111-2222-3333-4444-555555555555';
  const mockEmail = 'admin@example.com';
  const mockPassword = 'SecretPassword123!';
  let validPasswordHash: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    if (!validPasswordHash) {
      validPasswordHash = await AuthUtils.hashPassword(mockPassword);
    }
  });

  describe('1. Password Hashing & Verification (Argon2id)', () => {
    it('should correctly hash and verify password with Argon2id', async () => {
      const hash = await AuthUtils.hashPassword(mockPassword);
      expect(hash).toContain('$argon2id$');

      const isValid = await AuthUtils.verifyPassword(hash, mockPassword);
      expect(isValid).toBe(true);

      const isInvalid = await AuthUtils.verifyPassword(hash, 'WrongPassword!');
      expect(isInvalid).toBe(false);
    });
  });

  describe('2. JWT Access Token Signing & Verification (HS256)', () => {
    it('should generate a valid JWT access token with expected claims', () => {
      const token = AuthUtils.signAccessToken(mockUserId, UserRole.ADMIN);
      expect(token).toBeDefined();

      const decoded = AuthUtils.verifyAccessToken(token);
      expect(decoded.sub).toBe(mockUserId);
      expect(decoded.role).toBe('ADMIN');
      expect(decoded.iss).toBe('student-portfolio-api');
      expect(decoded.aud).toBe('student-portfolio-client');
    });

    it('should reject malformed or tampered token', () => {
      expect(() => {
        AuthUtils.verifyAccessToken('invalid.token.here');
      }).toThrow();
    });
  });

  describe('3. POST /api/v1/auth/login Endpoint', () => {
    it('should authenticate admin and issue HttpOnly access and refresh cookies', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        passwordHash: validPasswordHash,
        role: UserRole.ADMIN,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      } as unknown as never);

      vi.mocked(prisma.refreshToken.create).mockResolvedValue({
        id: 'token-uuid',
        userId: mockUserId,
        tokenHash: 'hashed_token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      } as unknown as never);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: mockEmail,
        password: mockPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(mockEmail);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Never leak hash

      // Check cookies
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(
        cookies.some((c: string) => c.includes('accessToken=') && c.includes('HttpOnly')),
      ).toBe(true);
      expect(
        cookies.some((c: string) => c.includes('refreshToken=') && c.includes('HttpOnly')),
      ).toBe(true);
    });

    it('should return generic 401 on incorrect password without leaking existence', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        passwordHash: validPasswordHash,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as never);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: mockEmail,
        password: 'IncorrectPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('should return generic 401 on unknown email without leaking non-existence', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'unknown@example.com',
        password: mockPassword,
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('should reject invalid email format with 400 validation error', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'not-an-email',
        password: mockPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('4. GET /api/v1/auth/me Endpoint & Middleware Guard', () => {
    it('GET /api/v1/auth/me should return 401 when no access token cookie provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /api/v1/auth/me should return user info when valid access token cookie is sent', async () => {
      const token = AuthUtils.signAccessToken(mockUserId, UserRole.ADMIN);

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        role: UserRole.ADMIN,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      } as unknown as never);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`accessToken=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(mockUserId);
      expect(res.body.data.user.email).toBe(mockEmail);
    });

    it('GET /api/v1/auth/me should accept Bearer token in Authorization header', async () => {
      const token = AuthUtils.signAccessToken(mockUserId, UserRole.ADMIN);

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as never);

      const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(mockUserId);
    });
  });

  describe('5. POST /api/v1/auth/refresh (Rotation & Reuse Detection)', () => {
    it('POST /api/v1/auth/refresh should atomically rotate valid refresh token', async () => {
      const rawRefreshToken = 'initial_valid_refresh_token_123456789';
      const tokenHash = AuthUtils.hashToken(rawRefreshToken);

      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'token-rec-1',
        userId: mockUserId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null, // Active
        user: {
          id: mockUserId,
          email: mockEmail,
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as unknown as never);

      vi.mocked(prisma.$transaction).mockResolvedValue([] as unknown as never);

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${rawRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);

      // Verify new cookies were set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.includes('accessToken='))).toBe(true);
      expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
    });

    it('POST /api/v1/auth/refresh should detect token reuse, revoke all user sessions, and return 401', async () => {
      const reusedToken = 'compromised_already_revoked_token';
      const tokenHash = AuthUtils.hashToken(reusedToken);

      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'revoked-token-id',
        userId: mockUserId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: new Date(Date.now() - 3600000), // ALREADY REVOKED!
        user: {
          id: mockUserId,
          email: mockEmail,
          role: UserRole.ADMIN,
        },
      } as unknown as never);

      vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 5 });

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${reusedToken}`]);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('TOKEN_REUSE_DETECTED');

      // Ensure all active tokens for that user were invalidated
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });
    });
  });

  describe('6. POST /api/v1/auth/logout Endpoint', () => {
    it('POST /api/v1/auth/logout should revoke active refresh token and clear cookies', async () => {
      const rawRefreshToken = 'token_to_logout';
      const tokenHash = AuthUtils.hashToken(rawRefreshToken);

      vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 });

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', [`refreshToken=${rawRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });

      // Confirm cookies cleared
      const cookies = res.headers['set-cookie'];
      expect(cookies.some((c: string) => c.includes('accessToken=;'))).toBe(true);
      expect(cookies.some((c: string) => c.includes('refreshToken=;'))).toBe(true);
    });
  });

  describe('7. requireRole Middleware Authorization', () => {
    const testApp = express();
    testApp.use(express.json());

    // Test route requiring ADMIN role
    testApp.get(
      '/admin-only',
      (req, _res, next) => {
        req.user = { userId: mockUserId, role: UserRole.EDITOR }; // Non-admin
        next();
      },
      requireRole(UserRole.ADMIN),
      (_req: Request, res: Response) => {
        res.status(200).json({ success: true });
      },
    );

    // Test route allowing EDITOR role
    testApp.get(
      '/editor-allowed',
      (req, _res, next) => {
        req.user = { userId: mockUserId, role: UserRole.EDITOR };
        next();
      },
      requireRole(UserRole.EDITOR, UserRole.ADMIN),
      (_req: Request, res: Response) => {
        res.status(200).json({ success: true, authorized: true });
      },
    );

    // Error handler for testApp
    testApp.use((err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
      const errorObj = err as { statusCode?: number; code?: string };
      res
        .status(errorObj.statusCode || 500)
        .json({ success: false, error: { code: errorObj.code } });
    });

    it('should return 403 when user does not have required role', async () => {
      const res = await request(testApp).get('/admin-only');
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should grant access when user matches one of allowed roles', async () => {
      const res = await request(testApp).get('/editor-allowed');
      expect(res.status).toBe(200);
      expect(res.body.authorized).toBe(true);
    });
  });

  describe('8. Auth Security Boundaries & Token Expiry', () => {
    it('should reject expired JWT access tokens with 401', async () => {
      const jwtModule = await import('jsonwebtoken');
      const { env } = await import('../src/config/env.config.js');
      const expiredToken = jwtModule.default.sign(
        {
          sub: mockUserId,
          role: 'ADMIN',
          iss: 'student-portfolio-api',
          aud: 'student-portfolio-client',
        },
        env.JWT_SECRET,
        { expiresIn: '-1s' }, // Expired 1 second ago
      );

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject malformed Authorization headers with 401', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'InvalidBearerScheme token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
