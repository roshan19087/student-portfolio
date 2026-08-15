import { z } from 'zod';

export const CreateCertificateSchema = z.object({
  title: z.string().trim().min(1, 'Certificate title is required').max(150),
  issuer: z.string().trim().min(1, 'Issuer is required').max(150),
  issueDate: z.string().trim().min(1, 'Issue date is required'),
  expirationDate: z.string().trim().nullable().optional(),
  credentialId: z.string().trim().nullable().optional(),
  credentialUrl: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().trim().nullable().optional(),
  category: z.string().trim().nullable().optional(),
  displayOrder: z.number().int().default(0),
});

export type CreateCertificateInput = z.infer<typeof CreateCertificateSchema>;

export const UpdateCertificateSchema = CreateCertificateSchema.partial();
export type UpdateCertificateInput = z.infer<typeof UpdateCertificateSchema>;
