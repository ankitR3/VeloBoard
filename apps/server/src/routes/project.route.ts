import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import createProjectController from '../controllers/project/createProject.controller';
import getProjectController from '../controllers/project/getProject.controller';
import getProjectsController from '../controllers/project/getProjects.controller';
import updateProjectController from '../controllers/project/updateProject.controller';
import deleteProjectController from '../controllers/project/deleteProject.controller';

const router: Router = Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), createProjectController);
router.get('/:projectId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), getProjectController);
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), getProjectsController);
router.patch('/:projectId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), updateProjectController);
router.delete('/:projectId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), deleteProjectController);

export default router;