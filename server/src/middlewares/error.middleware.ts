import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.config.js';
import { ApiErrorResponse } from '@portfolio/shared';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 1. Handled AppError
  if (err instanceof AppError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request input validation failed',
        details: formattedDetails,
      },
    };
    res.status(400).json(errorResponse);
    return;
  }

  // 3. Prisma Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn({ prismaError: err.code, meta: err.meta }, 'Prisma known request error');

    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT_ERROR',
          message: `A record with this ${target} already exists.`,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Requested record was not found.',
        },
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'DATABASE_REQUEST_ERROR',
        message: 'Database query error.',
      },
    });
    return;
  }

  // 4. JSON Syntax Parse Error (Malformed request body)
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Malformed JSON payload in request body.',
      },
    });
    return;
  }

  // 5. Unhandled / Internal Server Error
  logger.error({ err }, 'Unhandled exception encountered');

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred on the server.'
      : err instanceof Error
        ? err.message
        : 'Unknown internal error';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      ...(env.NODE_ENV !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
    },
  });
};
