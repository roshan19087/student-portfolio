import { Router } from 'express';
import { getProfile } from './profile.controller.js';

const router = Router();

router.get('/', getProfile);

export const profileRoutes = router;
