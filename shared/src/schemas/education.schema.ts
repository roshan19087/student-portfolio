import { z } from 'zod';

export const CreateEducationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required').max(150),
  degree: z.string().trim().min(1, 'Degree is required').max(150),
  fieldOfStudy: z.string().trim().min(1, 'Field of study is required').max(150),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim().nullable().optional(),
  gradeOrCgpa: z.string().trim().nullable().optional(),
  activities: z.string().trim().nullable().optional(),
  coursework: z.array(z.string()).optional().default([]),
  displayOrder: z.number().int().default(0),
});

export type CreateEducationInput = z.infer<typeof CreateEducationSchema>;

export const UpdateEducationSchema = CreateEducationSchema.partial();
export type UpdateEducationInput = z.infer<typeof UpdateEducationSchema>;
