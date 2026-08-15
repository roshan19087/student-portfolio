import { z } from 'zod';

export const SlugParamSchema = z.object({
  slug: z
    .string({ required_error: 'Slug parameter is required' })
    .trim()
    .min(1, 'Slug cannot be empty')
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
});

export type SlugParamInput = z.infer<typeof SlugParamSchema>;
