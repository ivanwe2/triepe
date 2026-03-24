import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Example of a Protected Route (Just for testing your tokens)
router.get('/me', requireAuth, (req, res) => {
  // @ts-ignore - req.user is appended by the middleware
  res.status(200).json({ status: 'success', data: req.user });
});

export default router;