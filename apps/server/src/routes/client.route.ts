import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import createClientController from '../controllers/client/createClient.controller';
import getClientController from '../controllers/client/getClient.controller';
import getClientsController from '../controllers/client/getClients.controller';
import updateClientController from '../controllers/client/updateClient.controller';
import deleteClientController from '../controllers/client/deleteClient.controller';

const router: Router = Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), createClientController);
router.get('/:clientId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), getClientController);
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), getClientsController);
router.patch('/:clientId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), updateClientController);
router.delete('/:clientId', authMiddleware, roleMiddleware('ADMIN', 'PROJECT_MANAGER'), deleteClientController);

export default router;