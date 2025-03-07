import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';
import addLogger from '../utils/logger.js';

const router = Router();

// Middleware global para el logger
router.use(addLogger);


router.get('/mockingpets', mocksController.getMockingPets);
router.get('/mockingusers', mocksController.getMockingUsers);
router.post('/generateData', mocksController.generateData);

export default router;
