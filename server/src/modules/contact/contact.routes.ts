import { Router } from 'express';
import { submitContactMessage } from './contact.controller.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { contactFormLimiter } from '../../middlewares/rateLimit.middleware.js';
import { ContactSubmissionSchema } from '@portfolio/shared';

const router = Router();

router.post('/', contactFormLimiter, validateBody(ContactSubmissionSchema), submitContactMessage);

export const contactRoutes = router;
