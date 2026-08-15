import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthUtils } from '../modules/auth/auth.utils.js';
import { AppError } from '../utils/AppError.js';

export interface AuthenticatedUserContext {
  userId: string;
  role: UserRole;
}

// Augment Express Request interface to include authenticated user
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserContext;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Middleware that validates the JWT access token and attaches user context to the request
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined = req.cookies?.accessToken;

  // Fallback to Bearer token in Authorization header if present
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7).trim();
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED'));
  }

  try {
    const payload = AuthUtils.verifyAccessToken(token);

    req.user = {
      userId: payload.sub,
      role: payload.role as UserRole,
    };

    next();
  } catch {
    return next(new AppError('Invalid or expired authentication session.', 401, 'INVALID_TOKEN'));
  }
};

/**
 * Middleware that enforces specific user role authorization
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access this resource.', 403, 'FORBIDDEN'),
      );
    }

    next();
  };
};
