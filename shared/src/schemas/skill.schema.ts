import { z } from 'zod';

export const CreateSkillCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(100),
  displayOrder: z.number().int().default(0),
});

export type CreateSkillCategoryInput = z.infer<typeof CreateSkillCategorySchema>;

export const UpdateSkillCategorySchema = CreateSkillCategorySchema.partial();
export type UpdateSkillCategoryInput = z.infer<typeof UpdateSkillCategorySchema>;

export const CreateSkillSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  name: z.string().trim().min(1, 'Skill name is required').max(100),
  iconUrl: z.string().trim().nullable().optional(),
  proficiencyLevel: z.string().trim().nullable().optional(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;

export const UpdateSkillSchema = CreateSkillSchema.partial();
export type UpdateSkillInput = z.infer<typeof UpdateSkillSchema>;
