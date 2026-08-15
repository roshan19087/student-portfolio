import { z } from 'zod';

export const ProjectQuerySchema = z.object({
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  status: z.enum(['COMPLETED', 'IN_PROGRESS', 'MAINTENANCE', 'ARCHIVED']).optional(),
  skill: z.string().trim().optional(),
});

export type ProjectQueryInput = z.infer<typeof ProjectQuerySchema>;

export const CreateProjectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(150)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  shortSummary: z.string().trim().min(1, 'Short summary is required').max(500),
  fullDescription: z.string().trim().min(1, 'Full description is required'),
  thumbnailUrl: z.string().trim().nullable().optional(),
  githubUrl: z.string().trim().nullable().optional(),
  liveDemoUrl: z.string().trim().nullable().optional(),
  downloadUrl: z.string().trim().nullable().optional(),
  status: z.enum(['COMPLETED', 'IN_PROGRESS', 'MAINTENANCE', 'ARCHIVED']).default('COMPLETED'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  skillIds: z.array(z.string()).optional().default([]),
  screenshots: z
    .array(
      z.object({
        imageUrl: z.string().trim().min(1, 'Screenshot image URL is required'),
        caption: z.string().trim().nullable().optional(),
        displayOrder: z.number().int().default(0),
      }),
    )
    .optional()
    .default([]),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial();
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
