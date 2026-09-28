import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import createUserController from '../controllers/user/createUser.controller';
import getUserController from '../controllers/user/getUser.controller';
import getUsersController from '../controllers/user/getUsers.controller';
import updateUserController from '../controllers/user/updateUser.controller';
import deleteUserController from '../controllers/user/deleteUser.controller';

const router: Router = Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN'), createUserController);
router.get('/:userId', authMiddleware, roleMiddleware('ADMIN'), getUserController);
router.get('/', authMiddleware, roleMiddleware('ADMIN'), getUsersController);
router.patch('/:userId', authMiddleware, roleMiddleware('ADMIN'), updateUserController);
router.delete('/:userId', authMiddleware, roleMiddleware('ADMIN'), deleteUserController);

export default router;