import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', orderController.createOrder);

router.get('/', requireAuth, requireAdmin, orderController.getOrders);

export default router;