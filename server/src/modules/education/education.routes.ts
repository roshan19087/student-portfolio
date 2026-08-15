import { Router } from 'express';
import { getEducation } from './education.controller.js';

const router = Router();

router.get('/', getEducation);

export const educationRoutes = router;
