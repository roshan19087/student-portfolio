import { z } from 'zod';

export const ContactSubmissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  subject: z
    .string()
    .trim()
    .max(200, 'Subject must be 200 characters or less')
    .optional()
    .default('New Contact Form Submission'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or less'),
  _hp: z.string().optional(), // Honeypot anti-spam dummy field
});

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;
