import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import addLogger from '../utils/logger.js';

const router = Router();

// Middleware global para el logger
router.use(addLogger);

router.post('/register',sessionsController.register);
router.post('/login',sessionsController.login);
router.get('/current',sessionsController.current);
router.get('/unprotectedLogin',sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);

export default router;