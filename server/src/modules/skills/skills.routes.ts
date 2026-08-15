import { Router } from 'express';
import { getSkills } from './skills.controller.js';

const router = Router();

router.get('/', getSkills);

export const skillsRoutes = router;
