import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import getActivityController from '../controllers/activity/getActivity.controller';
import getProjectActivityController from '../controllers/activity/getProjectActivity.controller';

const router: Router = Router();

router.get('/', authMiddleware, getActivityController);
router.get('/projects/:projectId', authMiddleware, getProjectActivityController);

export default router;