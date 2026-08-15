import { Router } from 'express';
import {
  getDashboardStatsHandler,
  getMessagesHandler,
  getMessageByIdHandler,
  markMessageReadHandler,
  archiveMessageHandler,
  deleteMessageHandler,
} from './admin.controller.js';
import { getAdminProfileHandler, updateProfileHandler } from '../profile/profile.controller.js';
import {
  getAdminProjectsHandler,
  getAdminProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../projects/projects.controller.js';
import {
  getAdminAppsHandler,
  getAdminAppByIdHandler,
  createAppHandler,
  updateAppHandler,
  deleteAppHandler,
} from '../apps/apps.controller.js';
import {
  getSkills,
  getSkillCategoriesHandler,
  createSkillCategoryHandler,
  updateSkillCategoryHandler,
  deleteSkillCategoryHandler,
  createSkillHandler,
  updateSkillHandler,
  deleteSkillHandler,
} from '../skills/skills.controller.js';
import {
  getEducation,
  getAdminEducationByIdHandler,
  createEducationHandler,
  updateEducationHandler,
  deleteEducationHandler,
} from '../education/education.controller.js';
import {
  getCertificates,
  getAdminCertificateByIdHandler,
  createCertificateHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
} from '../certificates/certificates.controller.js';
import {
  getAdminBlogPostsHandler,
  getAdminBlogPostByIdHandler,
  createBlogPostHandler,
  updateBlogPostHandler,
  deleteBlogPostHandler,
} from '../blog/blog.controller.js';
import { getPublicSettings, updateSettingsHandler } from '../settings/settings.controller.js';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import {
  UpdateProfileSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateAppSchema,
  UpdateAppSchema,
  CreateSkillCategorySchema,
  UpdateSkillCategorySchema,
  CreateSkillSchema,
  UpdateSkillSchema,
  CreateEducationSchema,
  UpdateEducationSchema,
  CreateCertificateSchema,
  UpdateCertificateSchema,
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  UpdateSettingsSchema,
} from '@portfolio/shared';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect ALL admin routes with Auth + ADMIN role
router.use(requireAuth);
router.use(requireRole(UserRole.ADMIN));

// 1. Dashboard Stats
router.get('/stats', getDashboardStatsHandler);

// 2. Profile Management
router.get('/profile', getAdminProfileHandler);
router.put('/profile', validateBody(UpdateProfileSchema), updateProfileHandler);

// 3. Projects CRUD
router.get('/projects', getAdminProjectsHandler);
router.get('/projects/:id', getAdminProjectByIdHandler);
router.post('/projects', validateBody(CreateProjectSchema), createProjectHandler);
router.put('/projects/:id', validateBody(UpdateProjectSchema), updateProjectHandler);
router.delete('/projects/:id', deleteProjectHandler);

// 4. Applications CRUD
router.get('/apps', getAdminAppsHandler);
router.get('/apps/:id', getAdminAppByIdHandler);
router.post('/apps', validateBody(CreateAppSchema), createAppHandler);
router.put('/apps/:id', validateBody(UpdateAppSchema), updateAppHandler);
router.delete('/apps/:id', deleteAppHandler);

// 5. Skills & Categories CRUD
router.get('/skills/categories', getSkillCategoriesHandler);
router.post(
  '/skills/categories',
  validateBody(CreateSkillCategorySchema),
  createSkillCategoryHandler,
);
router.put(
  '/skills/categories/:id',
  validateBody(UpdateSkillCategorySchema),
  updateSkillCategoryHandler,
);
router.delete('/skills/categories/:id', deleteSkillCategoryHandler);

router.get('/skills', getSkills);
router.post('/skills', validateBody(CreateSkillSchema), createSkillHandler);
router.put('/skills/:id', validateBody(UpdateSkillSchema), updateSkillHandler);
router.delete('/skills/:id', deleteSkillHandler);

// 6. Education CRUD
router.get('/education', getEducation);
router.get('/education/:id', getAdminEducationByIdHandler);
router.post('/education', validateBody(CreateEducationSchema), createEducationHandler);
router.put('/education/:id', validateBody(UpdateEducationSchema), updateEducationHandler);
router.delete('/education/:id', deleteEducationHandler);

// 7. Certificates CRUD
router.get('/certificates', getCertificates);
router.get('/certificates/:id', getAdminCertificateByIdHandler);
router.post('/certificates', validateBody(CreateCertificateSchema), createCertificateHandler);
router.put('/certificates/:id', validateBody(UpdateCertificateSchema), updateCertificateHandler);
router.delete('/certificates/:id', deleteCertificateHandler);

// 8. Blog Posts CRUD
router.get('/blog', getAdminBlogPostsHandler);
router.get('/blog/:id', getAdminBlogPostByIdHandler);
router.post('/blog', validateBody(CreateBlogPostSchema), createBlogPostHandler);
router.put('/blog/:id', validateBody(UpdateBlogPostSchema), updateBlogPostHandler);
router.delete('/blog/:id', deleteBlogPostHandler);

// 9. Site Settings Management
router.get('/settings', getPublicSettings);
router.put('/settings', validateBody(UpdateSettingsSchema), updateSettingsHandler);

// 10. Contact Messages Inbox Management
router.get('/messages', getMessagesHandler);
router.get('/messages/:id', getMessageByIdHandler);
router.patch('/messages/:id/read', markMessageReadHandler);
router.patch('/messages/:id/archive', archiveMessageHandler);
router.delete('/messages/:id', deleteMessageHandler);

export const adminRoutes = router;
