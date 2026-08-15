import { Router } from 'express';
import { getCertificates } from './certificates.controller.js';

const router = Router();

router.get('/', getCertificates);

export const certificatesRoutes = router;
