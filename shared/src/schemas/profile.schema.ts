import { z } from 'zod';

export const SocialLinkInputSchema = z.object({
  id: z.string().optional(),
  platform: z.string().trim().min(1, 'Platform name is required').max(50),
  url: z.string().trim().url('Must be a valid URL (e.g. https://github.com/username)'),
  iconName: z.string().trim().max(50).nullable().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export const UpdateProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  tagline: z.string().trim().min(1, 'Tagline is required').max(200),
  shortBio: z.string().trim().min(1, 'Short bio is required'),
  fullAbout: z.string().trim().min(1, 'Full about description is required'),
  avatarUrl: z.string().trim().nullable().optional(),
  resumePdfUrl: z.string().trim().nullable().optional(),
  location: z.string().trim().max(100).nullable().optional(),
  statusBadge: z.string().trim().max(100).nullable().optional(),
  isAvailable: z.boolean().default(true),
  socialLinks: z.array(SocialLinkInputSchema).optional().default([]),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type SocialLinkInput = z.infer<typeof SocialLinkInputSchema>;
