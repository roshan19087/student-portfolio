import { z } from 'zod';

export const AdminUpdateMessageSchema = z.object({
  isRead: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export type AdminUpdateMessageInput = z.infer<typeof AdminUpdateMessageSchema>;
