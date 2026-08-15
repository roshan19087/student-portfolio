import { z } from 'zod';

export const CreateAppReleaseSchema = z.object({
  id: z.string().optional(),
  version: z.string().trim().min(1, 'Version is required'),
  platform: z
    .enum(['WEB', 'IOS', 'ANDROID', 'WINDOWS', 'MACOS', 'LINUX', 'CROSS_PLATFORM'])
    .default('CROSS_PLATFORM'),
  downloadUrl: z.string().trim().min(1, 'Download URL is required'),
  releaseNotes: z.string().trim().min(1, 'Release notes are required'),
  releaseDate: z.string().optional(),
});

export type CreateAppReleaseInput = z.infer<typeof CreateAppReleaseSchema>;

export const CreateAppSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  tagline: z.string().trim().min(1, 'Tagline is required').max(200),
  description: z.string().trim().min(1, 'Description is required'),
  iconUrl: z.string().trim().nullable().optional(),
  webUrl: z.string().trim().nullable().optional(),
  githubUrl: z.string().trim().nullable().optional(),
  currentVersion: z.string().trim().default('1.0.0'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  releases: z.array(CreateAppReleaseSchema).optional().default([]),
  screenshots: z
    .array(
      z.object({
        imageUrl: z.string().trim().min(1, 'Screenshot URL is required'),
        caption: z.string().trim().nullable().optional(),
        displayOrder: z.number().int().default(0),
      }),
    )
    .optional()
    .default([]),
});

export type CreateAppInput = z.infer<typeof CreateAppSchema>;

export const UpdateAppSchema = CreateAppSchema.partial();
export type UpdateAppInput = z.infer<typeof UpdateAppSchema>;
