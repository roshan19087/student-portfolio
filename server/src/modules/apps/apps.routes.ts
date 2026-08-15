import { Router } from 'express';
import { listApps, getAppBySlug } from './apps.controller.js';
import { validateParams } from '../../middlewares/validate.middleware.js';
import { SlugParamSchema } from '@portfolio/shared';

const router = Router();

router.get('/', listApps);
router.get('/:slug', validateParams(SlugParamSchema), getAppBySlug);

export const appsRoutes = router;
