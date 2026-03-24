import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// PUBLIC ROUTES (Used by Next.js Frontend)
// ==========================================
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// ==========================================
// PROTECTED ADMIN ROUTES (CMS / Dashboard)
// ==========================================
// Note: We chain the middlewares: First check if logged in, THEN check if Admin
router.post('/', requireAuth, requireAdmin, productController.createProduct);
router.put('/:id', requireAuth, requireAdmin, productController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

export default router;