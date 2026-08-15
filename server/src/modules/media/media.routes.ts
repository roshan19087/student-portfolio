import { Router } from 'express';
import { uploadFile, deleteFile } from './media.controller.js';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import { mediaUploadLimiter } from '../../middlewares/rateLimit.middleware.js';
import { uploadSingleFile } from '../../middlewares/upload.middleware.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Apply admin authentication guards to all admin media endpoints
router.use(requireAuth, requireRole(UserRole.ADMIN));

// POST /api/v1/admin/media/upload
router.post('/upload', mediaUploadLimiter, uploadSingleFile, uploadFile);

// DELETE /api/v1/admin/media/:storageKey (supports subpath like images/abc.jpg via wildcard)
router.delete('/:storageKey(*)', deleteFile);

export const adminMediaRoutes = router;
