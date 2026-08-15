import { z } from 'zod';

export const MediaCategorySchema = z.enum(['IMAGE', 'PDF', 'RELEASE'], {
  errorMap: () => ({ message: 'Category must be one of: IMAGE, PDF, RELEASE' }),
});

export const MediaUploadBodySchema = z.object({
  category: MediaCategorySchema,
});

export const StorageKeyParamSchema = z.object({
  storageKey: z
    .string({ required_error: 'Storage key is required' })
    .trim()
    .min(1, 'Storage key cannot be empty')
    .max(512, 'Storage key is too long')
    .refine((key) => !key.includes('..') && !key.startsWith('/') && !key.startsWith('\\'), {
      message: 'Invalid storage key path traversal pattern',
    }),
});

export type MediaUploadBodyInput = z.infer<typeof MediaUploadBodySchema>;
export type StorageKeyParamInput = z.infer<typeof StorageKeyParamSchema>;
