import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', orderController.createOrder);

router.get('/', requireAuth, requireAdmin, orderController.getOrders);

// FIX: Expose the GET /:id route, protected by Admin middleware
router.get('/:id', requireAuth, requireAdmin, orderController.getOrderById);

router.patch('/:id/status', requireAuth, requireAdmin, orderController.updateStatus);

export default router;