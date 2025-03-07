import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import addLogger from '../utils/logger.js';

const router = Router();

// Middleware global para el logger
router.use(addLogger);

router.get('/',adoptionsController.getAllAdoptions);
router.get('/:aid',adoptionsController.getAdoption);
router.post('/:uid/:pid',adoptionsController.createAdoption);

export default router;