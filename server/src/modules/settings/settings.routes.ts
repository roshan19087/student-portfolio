import { Router } from 'express';
import { getPublicSettings } from './settings.controller.js';

const router = Router();

router.get('/public', getPublicSettings);

export const settingsRoutes = router;
