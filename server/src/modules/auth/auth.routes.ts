import { Router } from 'express';
import { login, refresh, logout, getMe } from './auth.controller.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { loginLimiter } from '../../middlewares/rateLimit.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { LoginInputSchema } from '@portfolio/shared';

const router = Router();

router.post('/login', loginLimiter, validateBody(LoginInputSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export const authRoutes = router;
