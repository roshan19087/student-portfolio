export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', details?: unknown) {
    return new AppError(message, 400, code, details);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND', details?: unknown) {
    return new AppError(message, 404, code, details);
  }

  static validation(message = 'Validation failed', details?: unknown) {
    return new AppError(message, 400, 'VALIDATION_ERROR', details);
  }

  static tooManyRequests(
    message = 'Too many requests, please try again later',
    code = 'TOO_MANY_REQUESTS',
  ) {
    return new AppError(message, 429, code);
  }

  static internal(message = 'An unexpected internal error occurred') {
    return new AppError(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}
