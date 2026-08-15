import { z } from 'zod';

export const UpdateSettingsSchema = z.object({
  siteTitle: z.string().trim().min(1, 'Site title is required'),
  siteDescription: z.string().trim().min(1, 'Site description is required'),
  authorName: z.string().trim().min(1, 'Author name is required'),
  seoKeywords: z.array(z.string()).optional().default([]),
  ogImageUrl: z.string().trim().nullable().optional(),
  features: z.object({
    blogEnabled: z.boolean().default(true),
    appsEnabled: z.boolean().default(true),
    certificatesEnabled: z.boolean().default(true),
    contactFormEnabled: z.boolean().default(true),
  }),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
