import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import createTaskController from '../controllers/task/createTask.controller';
import getTaskController from '../controllers/task/getTask.controller';
import getTasksController from '../controllers/task/getTasks.controller';
import updateTaskController from '../controllers/task/updateTask.controller';
import updateTaskStatusController from '../controllers/task/updateTaskStatus.controller';
import deleteTaskController from '../controllers/task/deleteTask.controller';

const router: Router = Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), createTaskController);
router.get('/:taskId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER'), getTaskController);
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER'), getTasksController);
router.patch('/:taskId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER'), updateTaskController);
router.patch('/:taskId/status', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), updateTaskStatusController);
router.delete('/:taskId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), deleteTaskController);

export default router;