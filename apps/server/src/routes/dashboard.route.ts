import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import getAdminDashboard from '../controllers/dashboard/getAdminDashboard.controller';
import getManagerDashboard from '../controllers/dashboard/getManagerDashboard.controller';
import getDeveloperDashboard from '../controllers/dashboard/getDeveloperDashboard.controller';

const router: Router = Router();

router.get('/admin', authMiddleware, roleMiddleware('ADMIN'), getAdminDashboard);
router.get('/manager', authMiddleware, roleMiddleware('PROJECT_MANAGER'), getManagerDashboard)
router.get('/developer', authMiddleware, roleMiddleware('DEVELOPER'), getDeveloperDashboard);

export default router;