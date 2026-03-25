import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Look for token in cookies FIRST, fallback to Authorization header
  const token = 
    req.cookies?.jwt || 
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  // 2. If neither exists, block them
  if (!token) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
    return;
  }

  // 3. Verify the token
  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
    return;
  }
  next();
};