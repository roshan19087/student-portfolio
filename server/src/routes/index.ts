import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { adminMediaRoutes } from '../modules/media/media.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import { profileRoutes } from '../modules/profile/profile.routes.js';
import { skillsRoutes } from '../modules/skills/skills.routes.js';
import { projectsRoutes } from '../modules/projects/projects.routes.js';
import { appsRoutes } from '../modules/apps/apps.routes.js';
import { educationRoutes } from '../modules/education/education.routes.js';
import { certificatesRoutes } from '../modules/certificates/certificates.routes.js';
import { blogRoutes } from '../modules/blog/blog.routes.js';
import { contactRoutes } from '../modules/contact/contact.routes.js';
import { settingsRoutes } from '../modules/settings/settings.routes.js';

const router = Router();

// Authentication Routes
router.use('/auth', authRoutes);

// Admin Media & File Storage Routes
router.use('/admin/media', adminMediaRoutes);

// Admin CMS & Management Routes
router.use('/admin', adminRoutes);

// Public Showcase Routes
router.use('/profile', profileRoutes);
router.use('/skills', skillsRoutes);
router.use('/projects', projectsRoutes);
router.use('/apps', appsRoutes);
router.use('/education', educationRoutes);
router.use('/certificates', certificatesRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);

export const apiV1Router = router;
