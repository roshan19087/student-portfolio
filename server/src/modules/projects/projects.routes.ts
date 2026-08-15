import { Router } from 'express';
import { listProjects, getProjectBySlug } from './projects.controller.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { ProjectQuerySchema, SlugParamSchema } from '@portfolio/shared';

const router = Router();

router.get('/', validateQuery(ProjectQuerySchema), listProjects);
router.get('/:slug', validateParams(SlugParamSchema), getProjectBySlug);

export const projectsRoutes = router;
