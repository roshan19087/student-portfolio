import { Router } from 'express';
import { listBlogPosts, getBlogPostBySlug } from './blog.controller.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { BlogQuerySchema, SlugParamSchema } from '@portfolio/shared';

const router = Router();

router.get('/', validateQuery(BlogQuerySchema), listBlogPosts);
router.get('/:slug', validateParams(SlugParamSchema), getBlogPostBySlug);

export const blogRoutes = router;
