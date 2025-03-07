import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import addLogger from '../utils/logger.js';

const router = Router();

// Middleware global para el logger
router.use(addLogger);

router.get('/',usersController.getAllUsers);

router.get('/:uid',usersController.getUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);


export default router;