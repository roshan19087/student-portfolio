import { prisma } from '../../db.js';
import { AuthUtils } from './auth.utils.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/env.config.js';
import { LoginInput, AuthUserDto } from '@portfolio/shared';
import { UserRole } from '@prisma/client';

export interface SessionContextMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  /**
   * Authenticate admin user with Argon2id and issue access + refresh tokens
   */
  static async login(
    input: LoginInput,
    metadata: SessionContextMetadata,
  ): Promise<{ user: AuthUserDto; accessToken: string; refreshToken: string }> {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return generic error to prevent account enumeration
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await AuthUtils.verifyPassword(user.passwordHash, input.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Generate cryptographic tokens
    const rawRefreshToken = AuthUtils.generateRefreshToken();
    const tokenHash = AuthUtils.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    const accessToken = AuthUtils.signAccessToken(user.id, user.role);

    logger.info({ userId: user.id, email: user.email }, 'Admin login successful');

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  /**
   * Rotate refresh token and issue new token pair with reuse detection
   */
  static async refreshToken(
    rawRefreshToken: string,
    metadata: SessionContextMetadata,
  ): Promise<{ user: AuthUserDto; accessToken: string; refreshToken: string }> {
    if (!rawRefreshToken) {
      throw new AppError('Refresh token required.', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const tokenHash = AuthUtils.hashToken(rawRefreshToken);

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AppError('Invalid refresh token session.', 401, 'INVALID_REFRESH_TOKEN');
    }

    // 1. REUSE DETECTION: If token is already revoked, an attacker or compromised client is reusing it
    if (tokenRecord.revokedAt !== null) {
      logger.warn(
        { userId: tokenRecord.userId },
        'SECURITY ALERT: Revoked refresh token reuse attempt detected! Revoking all active user sessions.',
      );

      // Invalidate ALL active refresh tokens for that user
      await prisma.refreshToken.updateMany({
        where: {
          userId: tokenRecord.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      throw new AppError(
        'Session security violation detected. All sessions have been revoked. Please log in again.',
        401,
        'TOKEN_REUSE_DETECTED',
      );
    }

    // 2. EXPIRATION CHECK
    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revokedAt: new Date() },
      });

      throw new AppError('Refresh token expired. Please log in again.', 401, 'TOKEN_EXPIRED');
    }

    // 3. ATOMIC TOKEN ROTATION
    const newRawRefreshToken = AuthUtils.generateRefreshToken();
    const newTokenHash = AuthUtils.hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(
      Date.now() + env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.$transaction([
      // Revoke the old refresh token
      prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revokedAt: new Date() },
      }),
      // Issue the new refresh token
      prisma.refreshToken.create({
        data: {
          userId: tokenRecord.userId,
          tokenHash: newTokenHash,
          expiresAt: newExpiresAt,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
    ]);

    const newAccessToken = AuthUtils.signAccessToken(tokenRecord.user.id, tokenRecord.user.role);

    return {
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        role: tokenRecord.user.role as UserRole,
        createdAt: tokenRecord.user.createdAt.toISOString(),
        updatedAt: tokenRecord.user.updatedAt.toISOString(),
      },
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  /**
   * Safely revoke refresh token and terminate session
   */
  static async logout(rawRefreshToken?: string): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = AuthUtils.hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async getCurrentUser(userId: string): Promise<AuthUserDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User record not found.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
