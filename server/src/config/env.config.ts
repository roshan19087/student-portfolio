import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    DATABASE_URL: z
      .string()
      .default('postgresql://postgres:postgres@localhost:5432/student_portfolio?schema=public'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
    API_URL: z.string().default('http://localhost:5000'),

    // Authentication Configuration
    JWT_SECRET: z
      .string()
      .min(32, 'JWT_SECRET must be at least 32 characters long for cryptographic security')
      .default('development-jwt-secret-key-must-be-very-long-and-secure-32-chars'),
    JWT_ISSUER: z.string().default('student-portfolio-api'),
    JWT_AUDIENCE: z.string().default('student-portfolio-client'),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'),
    JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().int().positive().default(7),

    // Storage Configuration (Phase 6)
    STORAGE_PROVIDER: z.enum(['local', 'cloudinary']).default('local'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.STORAGE_PROVIDER === 'cloudinary' && data.NODE_ENV === 'production') {
        return !!(
          data.CLOUDINARY_CLOUD_NAME &&
          data.CLOUDINARY_API_KEY &&
          data.CLOUDINARY_API_SECRET
        );
      }
      return true;
    },
    {
      message:
        'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are required when STORAGE_PROVIDER=cloudinary in production.',
      path: ['STORAGE_PROVIDER'],
    },
  );

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
