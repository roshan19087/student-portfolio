import argon2 from 'argon2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { env } from '../../config/env.config.js';

export interface JwtUserPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export class AuthUtils {
  /**
   * Hash a plaintext password using Argon2id with OWASP-recommended parameters
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Verify a plaintext password against an Argon2id hash
   */
  static async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  /**
   * Generate a cryptographically secure random refresh token string
   */
  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Compute a SHA-256 hash of a raw refresh token for safe database persistence
   */
  static hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /**
   * Sign a short-lived JWT access token with explicit HS256 algorithm and claims
   */
  static signAccessToken(userId: string, role: string): string {
    return jwt.sign(
      {
        sub: userId,
        role,
      },
      env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: env.JWT_ACCESS_EXPIRATION as `${number}m`,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
    );
  }

  /**
   * Verify and decode a JWT access token, enforcing algorithm, issuer, and audience
   */
  static verifyAccessToken(token: string): JwtUserPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    return decoded as JwtUserPayload;
  }

  /**
   * Standard cookie options for the 15-minute access token
   */
  static getAccessTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    };
  }

  /**
   * Standard cookie options for the long-lived refresh token
   */
  static getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  /**
   * Options for safely clearing authentication cookies
   */
  static getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    };
  }
}
