import rateLimit from 'express-rate-limit';
import { env } from '../config/env.config.js';

export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 0 : 100, // Unlimited in tests
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
  },
  skip: () => env.NODE_ENV === 'test',
});

export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: env.NODE_ENV === 'test' ? 0 : 5, // 5 submissions per hour
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
  skip: () => env.NODE_ENV === 'test',
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 0 : 5, // 5 failed attempts per 15 minutes
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
    },
  },
  skip: () => env.NODE_ENV === 'test',
});

export const mediaUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 0 : 50, // 50 uploads per 15 minutes per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'MEDIA_UPLOAD_LIMIT_EXCEEDED',
      message: 'Upload rate limit exceeded. Please wait a few minutes before uploading more files.',
    },
  },
  skip: () => env.NODE_ENV === 'test',
});
