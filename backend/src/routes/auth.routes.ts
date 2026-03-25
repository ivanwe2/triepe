import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', requireAuth, (req, res) => {
  // @ts-ignore
  res.status(200).json({ status: 'success', data: req.user });
});

export default router;