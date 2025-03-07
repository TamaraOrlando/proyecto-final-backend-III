import { Router } from 'express';
import { loggerController } from '../controllers/logger.controller.js';
import addLogger from '../utils/logger.js';

const router = Router()

router.get('/', addLogger, loggerController);

export default router;