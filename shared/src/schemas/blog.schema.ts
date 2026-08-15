import { z } from 'zod';

export const BlogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  tag: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type BlogQueryInput = z.infer<typeof BlogQuerySchema>;

export const CreateBlogPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  summary: z.string().trim().min(1, 'Summary is required'),
  contentMarkdown: z.string().trim().min(1, 'Content is required'),
  coverImageUrl: z.string().trim().nullable().optional(),
  readingTimeMinutes: z.number().int().min(1).default(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostSchema>;

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial();
export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostSchema>;
